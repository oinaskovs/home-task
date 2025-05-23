import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Product, ProductsState, ViewMode, FilterOptions, Pagination } from '../types/Product';
import { fetchProducts } from '../services/productService';

type ProductAction =
  | { type: 'FETCH_PRODUCTS_REQUEST' }
  | {
      type: 'FETCH_PRODUCTS_SUCCESS';
      payload: { items: Product[]; allItems: Product[]; pagination: Pagination };
    }
  | { type: 'FETCH_PRODUCTS_FAILURE'; payload: string }
  | { type: 'SELECT_PRODUCT'; payload: Product }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_FILTER_OPTIONS'; payload: Partial<FilterOptions> }
  | { type: 'CHANGE_PAGE'; payload: number };

interface ProductContextState {
  productsState: ProductsState;
  viewMode: ViewMode;
  filterOptions: FilterOptions;
  currentPage: number;
  itemsPerPage: number;
  dispatch: React.Dispatch<ProductAction>;
  setPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  refreshProducts: () => Promise<void>;
}

const initialProductsState: ProductsState = {
  products: [],
  allProducts: [],
  selectedProduct: null,
  loading: false,
  error: null,
  pagination: null,
};

const initialFilterOptions: FilterOptions = {
  category: '',
  inStock: null,
  priceRange: [0, 10000],
  rating: null,
  searchQuery: '',
};

const ProductContext = createContext<ProductContextState | undefined>(undefined);

const productReducer = (state: ProductsState, action: ProductAction): ProductsState => {
  switch (action.type) {
    case 'FETCH_PRODUCTS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_PRODUCTS_SUCCESS':
      return {
        ...state,
        products: action.payload.items,
        allProducts: action.payload.allItems,
        pagination: action.payload.pagination,
        loading: false,
        error: null,
      };
    case 'FETCH_PRODUCTS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'SELECT_PRODUCT':
      return {
        ...state,
        selectedProduct: action.payload,
      };
    default:
      return state;
  }
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productsState, productsDispatch] = useReducer(productReducer, initialProductsState);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(initialFilterOptions);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPageState] = useState<number>(10);

  const fetchProductsWithState = useCallback(async () => {
    productsDispatch({ type: 'FETCH_PRODUCTS_REQUEST' });
    try {
      const result = await fetchProducts(currentPage, itemsPerPage, {
        ...filterOptions,
        searchQuery: filterOptions.searchQuery || undefined,
      });
      productsDispatch({
        type: 'FETCH_PRODUCTS_SUCCESS',
        payload: {
          items: result.items,
          allItems: result.allItems || [],
          pagination: {
            ...result.pagination,
            currentPage,
          },
        },
      });
    } catch {
      productsDispatch({ type: 'FETCH_PRODUCTS_FAILURE', payload: 'Failed to fetch products' });
    }
  }, [currentPage, itemsPerPage, filterOptions]);

  const updateFilterOptions = useCallback((newOptions: Partial<FilterOptions>) => {
    setFilterOptions((prev) => ({ ...prev, ...newOptions }));
  }, []);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const setItemsPerPage = useCallback((count: number) => {
    setItemsPerPageState(count);
  }, []);

  const refreshProducts = useCallback(async () => {
    await fetchProductsWithState();
  }, [fetchProductsWithState]);

  const dispatch = useCallback(
    (action: ProductAction) => {
      switch (action.type) {
        case 'SET_VIEW_MODE':
          setViewMode(action.payload);
          break;
        case 'SET_FILTER_OPTIONS': {
          const newOptions = action.payload;
          if (Object.keys(newOptions).length > 0) {
            setCurrentPage(1);
            setFilterOptions((prev) => ({ ...prev, ...newOptions }));
          } else {
            updateFilterOptions(newOptions);
          }
          break;
        }
        case 'CHANGE_PAGE':
          setCurrentPage(action.payload);
          break;
        default:
          productsDispatch(action);
      }
    },
    [updateFilterOptions, productsDispatch]
  );

  useEffect(() => {
    fetchProductsWithState();
  }, [fetchProductsWithState]);

  return (
    <ProductContext.Provider
      value={{
        productsState,
        viewMode,
        filterOptions,
        currentPage,
        itemsPerPage,
        dispatch,
        setPage,
        setItemsPerPage,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
