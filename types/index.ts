import { Database } from "./supabase";

export type Users = Database["public"]["Tables"]["user"]["Row"];
export type Orders = Database["public"]["Tables"]["order"]["Row"];
export type Cafeterias = Database["public"]["Tables"]["cafeteria"]["Row"];
export type Menus = Database["public"]["Tables"]["menu"]["Row"];
export type CartItems = Database["public"]["Tables"]["cart_item"]["Row"];
export type Reviews = Database["public"]["Tables"]["review"]["Row"];
export type Carts = Database["public"]["Tables"]["cart"]["Row"];
export type OrderItems = Database["public"]["Tables"]["order_item"]["Row"];
export type MenuCategories =
  Database["public"]["Tables"]["menu_category"]["Row"];

export type UserWithCafeteria = Users & {
  cafeteria: Cafeterias;
};

export type CafeteriaWithReviews = Cafeterias & {
  reviews: Reviews[];
};

export type CafeteriaWithMenuAndReviews = Cafeterias & {
  menuCategories: MenuCategoryWithMenus[];
  menus: Menus[];
  reviews: Reviews[];
};

export type ReviewWithUserAndCafeteria = Reviews & {
  user: Users;
  cafeteria: Cafeterias;
};

export type CartWithCartItems = Carts & {
  cartItems: CartItemWithMenu[];
};

export type CartItemWithMenu = CartItems & {
  menu: Menus;
};

export type CartWithItemAndMenu = Carts & {
  cartItems: CartItemWithMenu[];
};

export type OrderItemWithMenu = OrderItems & {
  menu: Menus;
};

export type OrderWithOrderItems = Orders & {
  orderItems: OrderItems[];
};

export type OrderWithItemsAndMenu = Orders & {
  items: OrderItemWithMenu[];
};

export type MenuCategoryWithMenus = MenuCategories & {
  menus: Menus[];
};
