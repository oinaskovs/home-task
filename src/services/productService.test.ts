import { fetchProducts, fetchProductById } from './productService';

const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    category: 'Electronics',
    description: 'This is test product 1',
    price: 99.99,
    inStock: true,
    stockQuantity: 10,
    ratings: { average: 4.5, reviewsCount: 10 },
    reviews: [],
    specifications: { brand: 'Test Brand' },
    shippingDetails: {
      weight: '1kg',
      dimensions: '10x10x10',
      shippingCost: 5.99,
      estimatedDeliveryTime: '3-5 days',
    },
  },
  {
    id: '2',
    name: 'Test Product 2',
    category: 'Clothing',
    description: 'This is test product 2',
    price: 49.99,
    inStock: false,
    stockQuantity: 0,
    ratings: { average: 3.5, reviewsCount: 5 },
    reviews: [],
    specifications: { brand: 'Test Brand 2' },
    shippingDetails: {
      weight: '0.5kg',
      dimensions: '5x5x5',
      shippingCost: 2.99,
      estimatedDeliveryTime: '1-3 days',
    },
  },
  {
    id: '3',
    name: 'Premium Item',
    category: 'Electronics',
    description: 'This is a premium item',
    price: 199.99,
    inStock: true,
    stockQuantity: 5,
    ratings: { average: 5.0, reviewsCount: 20 },
    reviews: [],
    specifications: { brand: 'Premium Brand' },
    shippingDetails: {
      weight: '2kg',
      dimensions: '20x20x20',
      shippingCost: 0,
      estimatedDeliveryTime: '1-2 days',
    },
  },
];

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockProducts),
  })
) as jest.Mock;

describe('Product Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProducts', () => {
    test('fetches products with default pagination', async () => {
      const result = await fetchProducts();

      expect(result.items.length).toBe(3);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalItems).toBe(3);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('applies pagination correctly', async () => {
      const result = await fetchProducts(1, 2);

      expect(result.items.length).toBe(2);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalItems).toBe(3);
      expect(result.pagination.totalPages).toBe(2);

      const page2Result = await fetchProducts(2, 2);
      expect(page2Result.items.length).toBe(1);
      expect(page2Result.pagination.currentPage).toBe(2);

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('applies name search filter correctly', async () => {
      const result = await fetchProducts(1, 10, { searchQuery: 'Premium' });

      expect(result.items.length).toBe(1);
      expect(result.items[0].name).toBe('Premium Item');
    });

    test('applies category filter correctly', async () => {
      const result = await fetchProducts(1, 10, { category: 'Electronics' });

      expect(result.items.length).toBe(2);
      expect(result.items[0].category).toBe('Electronics');
      expect(result.items[1].category).toBe('Electronics');
    });

    test('applies inStock filter correctly', async () => {
      const result = await fetchProducts(1, 10, { inStock: true });

      expect(result.items.length).toBe(2);
      expect(result.items[0].inStock).toBe(true);
      expect(result.items[1].inStock).toBe(true);

      const outOfStockResult = await fetchProducts(1, 10, { inStock: false });
      expect(outOfStockResult.items.length).toBe(1);
      expect(outOfStockResult.items[0].inStock).toBe(false);
    });

    test('applies price range filter correctly', async () => {
      const result = await fetchProducts(1, 10, { priceRange: [90, 200] });

      expect(result.items.length).toBe(2);
      expect(result.items.every((item) => item.price >= 90 && item.price <= 200)).toBe(true);
    });

    test('applies rating filter correctly', async () => {
      const result = await fetchProducts(1, 10, { rating: 4 });

      expect(result.items.length).toBe(2);
      expect(result.items.every((item) => Math.round(item.ratings.average) >= 4)).toBe(true);
    });

    test('applies multiple filters correctly', async () => {
      const result = await fetchProducts(1, 10, {
        category: 'Electronics',
        inStock: true,
        priceRange: [0, 100],
      });

      expect(result.items.length).toBe(1);
      expect(result.items[0].name).toBe('Test Product 1');
    });

    test('returns empty array when no products match filters', async () => {
      const result = await fetchProducts(1, 10, {
        category: 'Does Not Exist',
      });

      expect(result.items.length).toBe(0);
    });
  });

  describe('fetchProductById', () => {
    test('fetches product by ID', async () => {
      const result = await fetchProductById('1');

      expect(result.id).toBe('1');
      expect(result.name).toBe('Test Product 1');
    });

    test('throws error when product not found', async () => {
      await expect(fetchProductById('not-found')).rejects.toThrow(
        'Product with ID not-found not found'
      );
    });
  });
});
