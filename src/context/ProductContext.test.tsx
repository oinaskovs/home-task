import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ProductProvider, useProductContext } from './ProductContext';
import '@testing-library/jest-dom';

const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    category: 'Electronics',
    description: 'Test description',
    price: 99.99,
    inStock: true,
    stockQuantity: 10,
    ratings: { average: 4.5, reviewsCount: 10 },
    reviews: [],
    specifications: { brand: 'Test' },
    shippingDetails: {
      weight: '1kg',
      dimensions: '10x10x10',
      shippingCost: 5.0,
      estimatedDeliveryTime: '3-5 days',
    },
  },
];

// Mock the fetch function
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockProducts),
  })
) as jest.Mock;

// Test component that uses the context
const TestComponent = () => {
  const {
    productsState,
    viewMode,
    filterOptions,
    currentPage,
    itemsPerPage,
    dispatch,
    setPage,
    setItemsPerPage,
  } = useProductContext();

  return (
    <div>
      <div data-testid="loading">{productsState.loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="error">{productsState.error || 'No Error'}</div>
      <div data-testid="products-count">{productsState.products.length}</div>
      <div data-testid="view-mode">{viewMode}</div>
      <div data-testid="current-page">{currentPage}</div>
      <div data-testid="items-per-page">{itemsPerPage}</div>

      <button onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'table' })}>
        Set Table View
      </button>

      <button onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'grid' })}>
        Set Grid View
      </button>

      <button onClick={() => setPage(2)}>Go to Page 2</button>

      <button onClick={() => setItemsPerPage(20)}>Set 20 Items</button>

      <button
        onClick={() =>
          dispatch({
            type: 'SET_FILTER_OPTIONS',
            payload: { searchQuery: 'test' },
          })
        }
      >
        Search Test
      </button>
    </div>
  );
};

describe('ProductContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('provides initial state and loading products', async () => {
    render(
      <ProductProvider>
        <TestComponent />
      </ProductProvider>
    );

    // Initially loading
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

    // After loading completes
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    expect(screen.getByTestId('products-count')).toHaveTextContent('1');
    expect(screen.getByTestId('view-mode')).toHaveTextContent('grid');
    expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    expect(screen.getByTestId('items-per-page')).toHaveTextContent('10');
  });

  test('changes view mode when dispatching SET_VIEW_MODE', async () => {
    render(
      <ProductProvider>
        <TestComponent />
      </ProductProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Click to change to table view
    fireEvent.click(screen.getByText('Set Table View'));

    expect(screen.getByTestId('view-mode')).toHaveTextContent('table');

    // Change back to grid view
    fireEvent.click(screen.getByText('Set Grid View'));

    expect(screen.getByTestId('view-mode')).toHaveTextContent('grid');
  });

  test('changes page when calling setPage', async () => {
    render(
      <ProductProvider>
        <TestComponent />
      </ProductProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Verify initial page is 1
    expect(screen.getByTestId('current-page')).toHaveTextContent('1');

    // Click to go to page 2
    fireEvent.click(screen.getByText('Go to Page 2'));

    // Verify page changed to 2
    expect(screen.getByTestId('current-page')).toHaveTextContent('2');
  });

  test('changes items per page when calling setItemsPerPage', async () => {
    render(
      <ProductProvider>
        <TestComponent />
      </ProductProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Verify initial items per page is 10
    expect(screen.getByTestId('items-per-page')).toHaveTextContent('10');

    // Click to set 20 items per page
    fireEvent.click(screen.getByText('Set 20 Items'));

    // Verify items per page changed to 20
    expect(screen.getByTestId('items-per-page')).toHaveTextContent('20');
  });

  test('sets filter options when dispatching SET_FILTER_OPTIONS', async () => {
    render(
      <ProductProvider>
        <TestComponent />
      </ProductProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Click to set search filter
    fireEvent.click(screen.getByText('Search Test'));

    // This will trigger a new fetch call
    // We can verify the fetch was called with the correct parameters
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2); // Initial + filter change
    });
  });
});
