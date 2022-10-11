import { definitions } from "./supabase";

export type Users = definitions["users"];
export type Order = definitions["order"];
export type Cafeteria = definitions["cafeterias"];
export type Menu = definitions["menu"];
export type Review = definitions["reviews"];
export interface CafeteriaWithReviews extends Cafeteria {
  reviews: Review[];
}
