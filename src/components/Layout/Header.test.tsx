import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { ProductProvider } from '../../context/ProductContext';
import '@testing-library/jest-dom';

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

const renderHeader = (route = '/') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ProductProvider>
        <Header />
      </ProductProvider>
    </MemoryRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders logo', () => {
    renderHeader();
    const logoImage = screen.getByAltText(/Arvato systems logo/i);
    expect(logoImage).toBeInTheDocument();
  });

  test('renders view mode toggles on home page', () => {
    renderHeader();
    expect(screen.getByText(/Table/i)).toBeInTheDocument();
    expect(screen.getByText(/Grid/i)).toBeInTheDocument();
  });

  test('does not render view mode toggles on product detail page', () => {
    renderHeader('/product/123');
    expect(screen.queryByText(/Table/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Grid/i)).not.toBeInTheDocument();
  });

  test('clicking on Table button changes view mode', () => {
    renderHeader();

    const tableButton = screen.getByText(/Table/i).closest('button');
    fireEvent.click(tableButton!);

    expect(tableButton).toHaveClass('active');

    const gridButton = screen.getByText(/Grid/i).closest('button');
    expect(gridButton).not.toHaveClass('active');
  });

  test('clicking on Grid button changes view mode', () => {
    renderHeader();

    const gridButton = screen.getByText(/Grid/i).closest('button');
    fireEvent.click(gridButton!);

    expect(gridButton).toHaveClass('active');

    const tableButton = screen.getByText(/Table/i).closest('button');
    expect(tableButton).not.toHaveClass('active');
  });

  test('clicking logo navigates to home page', () => {
    renderHeader();

    const logoLink = screen.getByAltText(/Arvato systems logo/i).closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });
});
