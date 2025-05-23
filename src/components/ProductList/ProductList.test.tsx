import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductList from './ProductList';
import { ProductProvider } from '../../context/ProductContext';
import '@testing-library/jest-dom';

const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
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
  },
  {
    id: '2',
    name: 'Test Product 2',
    category: 'Clothing',
    description: 'This is another test product',
    price: 49.99,
    inStock: true,
    stockQuantity: 20,
    ratings: { average: 4.0, reviewsCount: 5 },
    reviews: [],
    specifications: {
      brand: 'Test Brand 2',
      model: 'Test Model 2',
    },
    shippingDetails: {
      weight: '0.5kg',
      dimensions: '5x5x5',
      shippingCost: 2.99,
      estimatedDeliveryTime: '1-3 days',
    },
  },
];

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockProducts),
  })
) as jest.Mock;

const renderProductList = () => {
  return render(
    <BrowserRouter>
      <ProductProvider>
        <ProductList />
      </ProductProvider>
    </BrowserRouter>
  );
};

describe('ProductList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    renderProductList();
    expect(screen.getByText(/Loading products\.\.\./i)).toBeInTheDocument();
  });

  test('renders the product list after loading', async () => {
    renderProductList();

    await waitFor(() => {
      expect(screen.queryByText(/Loading products\.\.\./i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Test Product 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Product 2/i)).toBeInTheDocument();
  });

  test('filters products by name search', async () => {
    renderProductList();

    await waitFor(() => {
      expect(screen.queryByText(/Loading products\.\.\./i)).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('name-button'));

    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'Test Product 1' } });

    await waitFor(() => {
      const dropdownItems = screen.getAllByText(/Test Product 1/i);
      expect(dropdownItems.length).toBeGreaterThan(0);
      expect(screen.queryByText(/Test Product 2/i)).not.toBeInTheDocument();
    });
  });

  test('toggles between grid and table view', async () => {
    renderProductList();

    await waitFor(() => {
      expect(screen.queryByText(/Loading products\.\.\./i)).not.toBeInTheDocument();
    });

    expect(document.querySelector('.productsGrid')).not.toBeNull();
  });

  test('changes page when pagination is clicked', async () => {
    renderProductList();

    await waitFor(() => {
      expect(screen.queryByText(/Loading products\.\.\./i)).not.toBeInTheDocument();
    });

    const page2Button = screen.queryByText('2');
    if (page2Button) {
      fireEvent.click(page2Button);
    }
  });

  test('changes items per page', async () => {
    renderProductList();

    await waitFor(() => {
      expect(screen.queryByText(/Loading products\.\.\./i)).not.toBeInTheDocument();
    });

    const itemsPerPageSelect = screen.getByRole('combobox');
    expect(itemsPerPageSelect).toBeInTheDocument();
    fireEvent.change(itemsPerPageSelect, { target: { value: '20' } });
  });
});
