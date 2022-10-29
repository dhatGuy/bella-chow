import { Database } from "./supabase";

export type Users = Database["public"]["Tables"]["user"]["Row"];
export type Order = Database["public"]["Tables"]["order"]["Row"];
export type Cafeteria = Database["public"]["Tables"]["cafeteria"]["Row"];
export type Menu = Database["public"]["Tables"]["menu"]["Row"];
export type CartItem = Database["public"]["Tables"]["cart_item"]["Row"];
export type Review = Database["public"]["Tables"]["review"]["Row"];
export type Cart = Database["public"]["Tables"]["cart"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_item"]["Row"];
export type MenuCategory = Database["public"]["Tables"]["menu_category"]["Row"];

export type UserWithCafeteria = Users & {
  cafeteria: Cafeteria;
};

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
