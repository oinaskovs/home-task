import { Product, PaginatedResponse } from '../types/Product';

const API_URL = 'https://armandsosins.github.io/home-assignment/random_products.json';

let productsCache: Product[] | null = null;

const fetchAllProducts = async (): Promise<Product[]> => {
  if (productsCache) {
    return productsCache;
  }

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const products = await response.json();
  productsCache = products;
  return products;
};

export const fetchProducts = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    category?: string;
    inStock?: boolean | null;
    priceRange?: [number, number];
    rating?: number | null;
    searchQuery?: string;
  }
): Promise<PaginatedResponse<Product>> => {
  const allProducts = await fetchAllProducts();
  let filteredProducts = [...allProducts];

  if (filters) {
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      const categories = filters.category.split(',');

      filteredProducts = filteredProducts.filter((product) =>
        categories.includes(product.category)
      );
    }

    if (filters.inStock !== undefined && filters.inStock !== null) {
      filteredProducts = filteredProducts.filter((product) => product.inStock === filters.inStock);
    }

    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }

    if (filters.rating !== null && filters.rating !== undefined) {
      const ratingValue = filters.rating;
      filteredProducts = filteredProducts.filter(
        (product) => Math.round(product.ratings.average) >= ratingValue
      );
    }
  }

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    items: paginatedProducts,
    allItems: filteredProducts,
    pagination: {
      totalItems,
      itemsPerPage: limit,
      currentPage,
      totalPages,
    },
  };
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const allProducts = await fetchAllProducts();
  const product = allProducts.find((product) => product.id === id);

  if (!product) {
    throw new Error(`Product with ID ${id} not found`);
  }

  return product;
};
