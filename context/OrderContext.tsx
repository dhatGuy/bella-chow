import { createContext, useContext, useState } from "react";
import { supabase } from "~lib/api";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";

const OrderContext = createContext(null);

const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const { clearCart, cart } = useCart();
  const [orders, setOrders] = useState([]);
  const [cafeOrders, setCafeOrders] = useState([]);

  const getOrders = async () => {
    const { data, error } = await supabase
      .from("order")
      .select(`*, orderItems(*), cafeterias(*)`)
      .filter("user_id", "eq", user?.id);

    user ? setOrders(data) : setOrders([]);
  };

  const createOrder = async (amount, ref, cafe_id) => {
    const { data: order, error: orderError } = await supabase
      .from("order")
      .insert({
        amount,
        user_id: user.id,
        payment_ref: ref,
        cafe_id,
      })
      .single();
    const orderItems = cart.cartItems.map((item) => {
      return {
        order_id: order.id,
        total_price: item.total_price,
        menu_id: item.menu_id,
        qty: item.qty,
      };
    });
    const { data, error } = await supabase
      .from("orderItems")
      .insert(orderItems);
    !error && (await clearCart());
  };
  const value = {
    orders,
    createOrder,
    getOrders,
    setOrders,
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
