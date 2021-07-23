import { useToast } from "@chakra-ui/react";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const { user } = useAuth();
  const toast = useToast();

  const cartTotal = async () => {
    const { data, error } = await supabase
      .from("cartItems")
      .select()
      .eq("cart_id", cart?.id);
    const totalAmount = data.reduce(
      (total, item) => total + item.total_price,
      0
    );
    const { data: update, error: updateError } = await supabase
      .from("cart")
      .update({ totalAmount })
      .match({ id: cart.id });

    return totalAmount;
  };

  const addItem = async (menu, qty = 1) => {
    if (!user) {
      return toast({
        title: "Add menu",
        description: `You need to login`,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    }
    try {
      const { data: item, error } = await supabase
        .from("cartItems")
        .select(`*, menu(*)`)
        .eq("menu_id", menu.id)
        .eq("cart_id", cart.id)
        .single();

      if (item) {
        const { menu, ...updateItem } = {
          ...item,
          total_price: item.total_price + item.menu.price,
          qty: item.qty + qty,
        };

        const { data, error } = await supabase
          .from("cartItems")
          .update(updateItem)
          .match({ id: updateItem.id })
          .select(`*, menu(*)`)
          .filter("menu_id", "eq", menu.id)
          .filter("cart_id", "eq", cart.id)
          .single();

        const newCart = cart.cartItems.map((item) =>
          item.id === data.id ? data : item
        );

        const totalAmount = await cartTotal();
        setCart({ ...cart, totalAmount, cartItems: newCart });
      } else {
        const { data, error } = await supabase
          .from("cartItems")
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

        const totalAmount = await cartTotal();
        !error &&
          setCart({
            ...cart,
            totalAmount,
            cartItems: [...cart.cartItems, data],
          });
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
      toast({
        title: "Add menu",
        description: user ? `An error occurred` : `You need to login`,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const removeItem = async (id) => {
    const { data, error } = await supabase
      .from("cartItems")
      .delete()
      .eq("id", id);
  };

  const increaseQty = async (menuToIncrease, qty = 1) => {
    const { data, error } = await supabase
      .from("cartItems")
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
      .from("cartItems")
      .update(updateItem)
      .match({ id: updateItem.id })
      .select(`*, menu(*)`)
      .filter("menu_id", "eq", menu.id)
      .filter("cart_id", "eq", cart.id)
      .single();

    if (!updateError) {
      const newCart = cart.cartItems.map((item) =>
        item.id === updateData.id ? updateData : item
      );

      const totalAmount = await cartTotal();
      setCart({ ...cart, totalAmount, cartItems: newCart });
    }
  };

  const decreaseQty = async (menuToIncrease, qty = 1) => {
    const { data, error } = await supabase
      .from("cartItems")
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
      .from("cartItems")
      .update(updateItem)
      .match({ id: updateItem.id })
      .select(`*, menu(*)`)
      .filter("menu_id", "eq", menu.id)
      .filter("cart_id", "eq", cart.id)
      .single();

    if (!updateError) {
      const newCart = cart.cartItems.map((item) =>
        item.id === updateData.id ? updateData : item
      );

      const totalAmount = await cartTotal();
      setCart({ ...cart, totalAmount, cartItems: newCart });
    }
  };

  const clearCart = async () => {
    await supabase.from("cartItems").delete().match({ cart_id: cart?.id });
    const totalAmount = await cartTotal();
    setCart({ ...cart, totalAmount, cartItems: [] });
  };

  const value = {
    cart,
    setCart,
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
