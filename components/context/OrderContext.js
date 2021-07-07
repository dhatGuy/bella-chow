import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../api";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";

const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const { clearCart, cart } = useCart();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      const { data, error } = await supabase
        .from("order")
        .select(`*, orderDetails(*)`)
        .filter("user_id", "eq", user?.id);
      setOrders(data);
    };
    user ? getOrders() : setOrders([]);
  }, [user]);

  const createOrder = async (amount, ref) => {
    const { data: order, error: orderError } = await supabase
      .from("order")
      .insert({
        amount,
        user_id: user.id,
        payment_ref: ref,
      })
      .single();
    const orderItems = cart.cartDetails.map((item) => {
      return {
        order_id: order.id,
        total_price: item.total_price,
        menu_id: item.menu_id,
        qty: item.qty,
      };
    });
    const { data, error } = await supabase
      .from("orderDetails")
      .insert(orderItems);
    !error && (await clearCart());
  };
  const value = {
    orders,
    createOrder,
  };
  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

const useOrder = () => {
  const context = useContext(OrderContext);

  if (context === undefined) {
    throw new Error("useOrder must be used within UserProvider");
  }
  return context;
};

export { OrderProvider, useOrder };
