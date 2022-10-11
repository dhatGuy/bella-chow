import { User } from "@supabase/supabase-js";
import { proxy } from "valtio";

interface State {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
}

export const state = proxy<State>({
  user: null,
  loading: true,
  authenticated: false,
});
