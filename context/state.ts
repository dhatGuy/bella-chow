import { User } from "@supabase/supabase-js";
import { proxy } from "valtio";
import { CartWithCartItems } from "~types";

interface State {
  user: User | null;
  authenticated: boolean;
  cart: CartWithCartItems | null;
}

export const state = proxy<State>({
  user: null,
  authenticated: false,
  cart: null,
});
