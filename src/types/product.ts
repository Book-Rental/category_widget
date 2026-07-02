export interface ProductImage {
  _id: string;
  url: string;
  altText: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  author: string;
  rentalPricePerWeek: number;
  coverImage: string;
  images: ProductImage[];
}
