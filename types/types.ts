import { definitions } from "./supabase";

export type Users = definitions["user"];
export type Order = definitions["order"];
export type Cafeteria = definitions["cafeteria"];
export type Menu = definitions["menu"];
export type CartItem = definitions["cart_item"];
export type Review = definitions["review"];
export type Cart = definitions["cart"];
export type OrderItem = definitions["order_item"];
export type MenuCategory = definitions["menu_category"];
export type MenuOption = definitions["menu_option"];
export type MenuOptionItem = definitions["menu_option_item"];

export type CafeteriaWithReviews = Cafeteria & {
  reviews: Review[];
};
export type CafeteriaWithMenuAndReviews = Cafeteria & {
  menuCategories: MenuCategoryWithMenu[];
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

export type OrderItemWithMenu = OrderItem & {
  menu: Menu;
};

export type OrderWithOrderItems = Order & {
  orderItems: OrderItem[];
};

export type OrderWithItemsAndMenu = Order & {
  items: OrderItemWithMenu[];
};

export type MenuCategoryWithMenu = MenuCategory & {
  menus: Menu[];
};
