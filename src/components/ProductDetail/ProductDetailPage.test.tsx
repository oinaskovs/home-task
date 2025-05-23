import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductDetailPage from './ProductDetailPage';
import { ProductProvider } from '../../context/ProductContext';
import '@testing-library/jest-dom';

const mockProduct = {
  id: 'test123',
  name: 'Test Product',
  category: 'Electronics',
  description: 'This is a test product',
  price: 99.99,
  inStock: true,
  stockQuantity: 10,
  ratings: { average: 4.5, reviewsCount: 10 },
  reviews: [],
  specifications: {
    brand: 'Test Brand',
    model: 'Test Model',
  },
  shippingDetails: {
    weight: '1kg',
    dimensions: '10x10x10',
    shippingCost: 5.99,
    estimatedDeliveryTime: '3-5 days',
  },
};

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([mockProduct]),
  })
) as jest.Mock;

const renderProductDetailPage = (productId = 'test123') => {
  return render(
    <MemoryRouter initialEntries={[`/product/${productId}`]}>
      <ProductProvider>
        <Routes>
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </ProductProvider>
    </MemoryRouter>
  );
};

describe('ProductDetailPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    renderProductDetailPage();
    expect(screen.getByText(/Loading product details\.\.\./i)).toBeInTheDocument();
  });

  test('renders product details after loading', async () => {
    renderProductDetailPage();

    await waitFor(() => {
      expect(screen.queryByText(/Loading product details\.\.\./i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
    expect(screen.getByText(/Electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/\$99\.99/)).toBeInTheDocument();
  });

  test('renders "Product not found" when product ID is invalid', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    renderProductDetailPage('invalid-id');

    await waitFor(() => {
      expect(screen.queryByText(/Loading product details\.\.\./i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Product not found/i)).toBeInTheDocument();
  });

  test('renders error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })
    );

    renderProductDetailPage();

    await waitFor(() => {
      expect(screen.queryByText(/Loading product details\.\.\./i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Error:/i)).toBeInTheDocument();
  });
});
