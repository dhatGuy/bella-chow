import { definitions } from "./supabase";

export type Users = definitions["user"];
export type Order = definitions["order"];
export type Cafeteria = definitions["cafeteria"];
export type Menu = definitions["menu"];
export type CartItem = definitions["cart_item"];
export type Review = definitions["review"];
export type Cart = definitions["cart"];

export type CafeteriaWithReviews = Cafeteria & {
  reviews: Review[];
};
export type CafeteriaWithMenuAndReviews = Cafeteria & {
  menus: Menu[];
  reviews: Review[];
};

export type ReviewWithUserAndCafeteria = Review & {
  user: Users;
  cafeteria: Cafeteria;
};

export type CartWithCartItems = Cart & {
  cartItems: CartItemWithMenu[];
};

export type CartItemWithMenu = CartItem & {
  menu: Menu;
};
export type CartWithItemAndMenu = Cart & {
  cartItems: CartItemWithMenu[];
};
