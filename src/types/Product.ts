export interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Ratings {
  average: number;
  reviewsCount: number;
}

export interface Specifications {
  brand: string;
  model: string;
  processor: string;
  ram: string;
  storage: string;
  display: string;
  batteryLife: string;
  color: string;
}

export interface ShippingDetails {
  weight: string;
  dimensions: string;
  shippingCost: number;
  estimatedDeliveryTime: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  inStock: boolean;
  stockQuantity: number;
  specifications: Specifications;
  ratings: Ratings;
  reviews: Review[];
  shippingDetails: ShippingDetails;
}

export interface Pagination {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  allItems: any[];
  items: T[];
  pagination: Pagination;
}

export interface ProductsState {
  products: Product[];
  allProducts: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

export type ViewMode = 'table' | 'grid';

export interface FilterOptions {
  category: string;
  inStock: boolean | null;
  priceRange: [number, number];
  rating: number | null;
  searchQuery?: string;
}
