import { useToast } from "@chakra-ui/react";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    console.log("change detected");
    const getCart = async () => {
      const { data, error } = await supabase
        .from("cart")
        .select(
          `
        id,
        cartDetails(*, menu(*))
      `,
          { count: "exact" }
        )
        .filter("user_id", "eq", user?.id)
        .single();
      setCart(data);
    };
    user ? getCart() : setCart(null);
  }, [user]);

  const addItem = async (menu, qty = 1) => {
    try {
      const { data: item, error } = await supabase
        .from("cartDetails")
        .select(`*, menu(*)`)
        .filter("menu_id", "eq", menu.id)
        .filter("cart_id", "eq", cart.id)
        .single();

      if (item) {
        const { menu, ...updateItem } = {
          ...item,
          total_price: item.total_price + item.menu.price,
          qty: item.qty + qty,
        };

        const { data, error } = await supabase
          .from("cartDetails")
          .update(updateItem)
          .match({ id: updateItem.id })
          .select(`*, menu(*)`)
          .filter("menu_id", "eq", menu.id)
          .filter("cart_id", "eq", cart.id)
          .single();

        const newCart = cart.cartDetails.map((item) =>
          item.id === data.id ? data : item
        );

        setCart({ ...cart, cartDetails: newCart });
      } else {
        const { data, error } = await supabase
          .from("cartDetails")
          .insert([
            {
              menu_id: menu.id,
              cart_id: cart.id,
              total_price: menu.price,
              qty,
            },
          ])
          .select(`*, menu(*)`)
          .filter("menu_id", "eq", menu.id)
          .filter("cart_id", "eq", cart.id)
          .single();
        console.log(data);

        !error &&
          setCart({ ...cart, cartDetails: [...cart.cartDetails, data] });
      }

      toast({
        title: "Add menu",
        description: `${menu.name} added to cart`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Add menu",
        description: `An error occurred`,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const removeItem = async (id) => {
    const { data, error } = await supabase
      .from("cartDetails")
      .delete()
      .eq("id", id);
  };

  const increaseQty = async (menuToIncrease, qty = 1) => {
    const { data, error } = await supabase
      .from("cartDetails")
      .select(`*, menu(*)`)
      .filter("menu_id", "eq", menuToIncrease.id)
      .filter("cart_id", "eq", cart.id)
      .single();

    const { menu, ...updateItem } = {
      ...data,
      total_price: data.total_price + data.menu.price,
      qty: data.qty + qty,
    };

    const { data: updateData, updateError } = await supabase
      .from("cartDetails")
      .update(updateItem)
      .match({ id: updateItem.id })
      .select(`*, menu(*)`)
      .filter("menu_id", "eq", menu.id)
      .filter("cart_id", "eq", cart.id)
      .single();

    console.log(updateData);
    if (!updateError) {
      const newCart = cart.cartDetails.map((item) =>
        item.id === updateData.id ? updateData : item
      );

      setCart({ ...cart, cartDetails: newCart });
    }
  };

  const decreaseQty = async (menuToIncrease, qty = 1) => {
    const { data, error } = await supabase
      .from("cartDetails")
      .select(`*, menu(*)`)
      .filter("menu_id", "eq", menuToIncrease.id)
      .filter("cart_id", "eq", cart.id)
      .single();

    const { menu, ...updateItem } = {
      ...data,
      total_price: data.total_price - data.menu.price,
      qty: data.qty - qty,
    };

    const { data: updateData, updateError } = await supabase
      .from("cartDetails")
      .update(updateItem)
      .match({ id: updateItem.id })
      .select(`*, menu(*)`)
      .filter("menu_id", "eq", menu.id)
      .filter("cart_id", "eq", cart.id)
      .single();

    console.log(updateData);
    if (!updateError) {
      const newCart = cart.cartDetails.map((item) =>
        item.id === updateData.id ? updateData : item
      );

      setCart({ ...cart, cartDetails: newCart });
    }
  };

  const clearCart = async () => {
    await supabase.from("cartDetails").delete().match({ cart_id: cart?.id });
    setCart({ ...cart, cartDetails: [] });
  };

  // Will be passed down to Signup, Login and Dashboard components
  const value = {
    cart,
    addItem,
    removeItem,
    increaseQty,
    decreaseQty,
    clearCart,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCart = () => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within UserProvider");
  }
  return context;
};

export { CartProvider, useCart };
