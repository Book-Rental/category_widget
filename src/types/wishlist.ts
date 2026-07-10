export interface Wishlist {
  _id: string;
  name: string;
}

export interface WishlistResponse {
  status: string;
  message: string;
  data: Wishlist[];
}