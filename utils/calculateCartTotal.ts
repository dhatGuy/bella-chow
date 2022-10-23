import { supabase } from "~lib/api";
import { CartItem } from "~types";

const calculateCartTotal = async (cartId: number) => {
  const { data, error } = await supabase
    .from<CartItem>("cart_item")
    .select(`total_price`)
    .eq("cart_id", cartId);

  const totalAmount = data?.reduce(
    (total, item) => total + item.total_price,
    0
  );
  const { error: updateError } = await supabase
    .from("cart")
    .update({ totalAmount })
    .match({ id: cartId });

  if (updateError) throw new Error(updateError.message);

  return totalAmount;
};

export default calculateCartTotal;
