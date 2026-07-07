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
  coverImage: string;
  images: ProductImage[];
  purchasePrice: number;
  rentalPricePerDay: number;
  rentalPricePerWeek: number;
  rentalPricePerMonth: number;
  securityDeposit: number;
}

export interface ProductResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasMore: boolean;
}
