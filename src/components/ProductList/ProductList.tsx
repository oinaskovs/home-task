import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';
import { Product } from '../../types/Product';
import styles from './ProductList.module.css';

const ProductList: React.FC = () => {
  const [nameDropdownOpen, setNameDropdownOpen] = useState(false);
  const [nameSearchInput, setNameSearchInput] = useState('');
  const [filteredProductNames, setFilteredProductNames] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const nameButtonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { productsState, viewMode, dispatch, currentPage, itemsPerPage, setPage, setItemsPerPage } =
    useProductContext();

  const { products, allProducts, loading, error, pagination } = productsState;
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = Array.from(new Set(products.map((product) => product.category)));
      setCategories(['All Categories', ...uniqueCategories]);

      const productList = allProducts && allProducts.length > 0 ? allProducts : products;

      const uniqueProductNames = Array.from(new Set(productList.map((product) => product.name)));
      const sortedNames = [...uniqueProductNames].sort();
      setFilteredProductNames(sortedNames.slice(0, 20));
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(`.${styles.categoryButton}`) &&
        !target.closest(`.${styles.categoryDropdown}`)
      ) {
        setCategoryDropdownOpen(false);
      }
      if (
        !target.closest(`.${styles.nameButton}`) &&
        !target.closest(`.${styles.nameDropdownList}`)
      ) {
        setNameDropdownOpen(false);

        if (!nameSearchInput) {
          const buttonText = nameButtonRef.current?.querySelector(`.${styles.nameButtonText}`);
          if (buttonText) {
            buttonText.textContent = 'Name';
          }
        }

        setIsTyping(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [products, allProducts, nameSearchInput]);

  useEffect(() => {
    const categoryFilter = selectedCategories.length > 0 ? selectedCategories.join(',') : '';

    dispatch({
      type: 'SET_FILTER_OPTIONS',
      payload: { category: categoryFilter },
    });
  }, [selectedCategories, dispatch]);
  const toggleCategorySelection = (category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setNameSearchInput('');
    const currentSearchQuery = searchQuery;
    dispatch({
      type: 'SET_FILTER_OPTIONS',
      payload: {
        category: '',
        rating: null,
        inStock: null,
        priceRange: [0, 1000],
        searchQuery: '',
      },
    });

    setSearchQuery(currentSearchQuery);
  };

  const handleNameSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }
  ) => {
    const value = e.target.value;
    setNameSearchInput(value);

    const productList = allProducts && allProducts.length > 0 ? allProducts : products;

    if (value.trim()) {
      const searchTerm = value.trim().toLowerCase();

      let filtered: any[];

      filtered = Array.from(
        new Set(
          productList
            .filter((product) => {
              const productName = product.name.toLowerCase();

              return productName.includes(searchTerm);
            })
            .map((product) => product.name)
        )
      );

      setFilteredProductNames(filtered);

      if (isTyping) {
        dispatch({
          type: 'SET_FILTER_OPTIONS',
          payload: { searchQuery: value },
        });
      }
    } else {
      const allNames = Array.from(new Set(productList.map((product) => product.name)));
      const sortedNames = [...allNames].sort();
      setFilteredProductNames(sortedNames.slice(0, 20));

      dispatch({
        type: 'SET_FILTER_OPTIONS',
        payload: { searchQuery: '' },
      });
    }
  };

  const handleNameSelect = (name: string) => {
    setNameSearchInput(name);

    dispatch({
      type: 'SET_FILTER_OPTIONS',
      payload: { searchQuery: name },
    });

    setNameDropdownOpen(false);
    setIsTyping(false);

    if (nameButtonRef.current) {
      const inputElement = nameButtonRef.current.querySelector('input');
      if (inputElement) {
        inputElement.blur();
      }
    }
  };

  const handleProductClick = (product: Product) => {
    dispatch({ type: 'SELECT_PRODUCT', payload: product });
    navigate(`/product/${product.id}`);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
    e.stopPropagation();

    if (e.target.checked) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    dispatch({ type: 'CHANGE_PAGE', payload: newPage });
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);

    setPage(1);

    setItemsPerPage(value);
  };

  const renderPagination = () => {
    if (!pagination) return null;

    const { totalPages } = pagination;

    const pagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    if (endPage - startPage + 1 < pagesToShow) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    const onPageClick = (page: number) => {
      handlePageChange(page);
    };

    return (
      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => onPageClick(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          &lt;
        </button>

        {startPage > 1 && (
          <>
            <button className={styles.paginationButton} onClick={() => onPageClick(1)}>
              1
            </button>
            {startPage > 2 && <span className={styles.paginationEllipsis}>...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`${styles.paginationButton} ${number === currentPage ? styles.paginationButtonActive : ''}`}
            onClick={() => onPageClick(number)}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={styles.paginationEllipsis}>...</span>}
            <button className={styles.paginationButton} onClick={() => onPageClick(totalPages)}>
              {totalPages}
            </button>
          </>
        )}

        <button
          className={styles.paginationButton}
          onClick={() => onPageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          &gt;
        </button>

        <div className={styles.itemsPerPageContainer}>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className={styles.itemsPerPageSelect}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className={styles.loading}>Loading products...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.productListContainer}>
      <div className={styles.filtersContainer}>
        <div className={styles.filtersFrame}>
          <div className={styles.filtersLeft} style={{ position: 'relative' }}>
            <div
              ref={nameButtonRef}
              className={`${styles.nameButton} ${nameDropdownOpen || isTyping ? styles.nameButtonActive : ''}`}
              onClick={(e) => {
                if (!isTyping) {
                  e.stopPropagation();
                  setNameDropdownOpen(!nameDropdownOpen);
                }
              }}
              data-testid="name-button"
            >
              <input
                type="text"
                className={styles.nameButtonText}
                placeholder="Name"
                value={nameSearchInput}
                autoComplete="off"
                onFocus={() => {
                  setIsTyping(true);
                  setNameDropdownOpen(true);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    if (document.activeElement !== nameButtonRef.current?.querySelector('input')) {
                      setIsTyping(false);
                    }
                  }, 200);
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  setNameSearchInput(value);
                  handleNameSearchInputChange(e);
                  setNameDropdownOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredProductNames.length > 0) {
                      handleNameSelect(filteredProductNames[0]);
                    }
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    e.currentTarget.blur();
                    setNameDropdownOpen(false);
                  }
                }}
              />
              <svg className={styles.dropdownArrow} viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>

            {nameDropdownOpen && (
              <div
                className={styles.nameDropdownList}
                onClick={(e) => e.stopPropagation()}
                data-testid="name-dropdown"
              >
                <div className={styles.nameDropdownItems}>
                  {filteredProductNames.length > 0 ? (
                    <>
                      {filteredProductNames.slice(0, 10).map((name, index) => (
                        <div
                          key={index}
                          className={styles.nameDropdownItem}
                          onClick={() => {
                            handleNameSelect(name);
                          }}
                        >
                          <span>{name}</span>
                        </div>
                      ))}
                      {filteredProductNames.length > 10 && (
                        <div className={styles.nameDropdownMoreItems}>
                          {filteredProductNames.length - 10} more items...
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={styles.nameDropdownNoItems}>
                      {nameSearchInput.trim().length > 0
                        ? `No products match "${nameSearchInput}"`
                        : 'Start typing to search products'}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div
              className={styles.categoryButton}
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              data-testid="category-button"
            >
              <span className={styles.categoryButtonText}>Category</span>
              <svg className={styles.categoryButtonArrow} viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </div>

            {categoryDropdownOpen && (
              <div
                className={styles.categoryDropdown}
                onClick={(e) => e.stopPropagation()}
                data-testid="category-dropdown"
              >
                {categories
                  .filter((cat) => cat !== 'All Categories')
                  .map((category, index) => (
                    <div
                      key={index}
                      className={styles.categoryItem}
                      onClick={(e) => toggleCategorySelection(category, e)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => {}}
                      />
                      <span>{category}</span>
                    </div>
                  ))}
              </div>
            )}

            {selectedCategories.map((category, index) => (
              <div key={index} className={styles.selectedCategory}>
                <span className={styles.selectedCategoryText}>{category}</span>
              </div>
            ))}
          </div>

          <div className={styles.filtersRight}>
            <button className={styles.clearFiltersButton} onClick={handleClearFilters}>
              <span className={styles.clearFiltersText}>Clear Filters</span>
            </button>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className={styles.noProducts}>
          No products match your filters. Try changing your search criteria.
        </div>
      ) : viewMode === 'grid' ? (
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div
              key={product.id}
              className={styles.productCard}
              onClick={() => handleProductClick(product)}
            >
              <div className={styles.productCardImage}>
                <img src="/placeholder.jpg" alt={product.name} />
              </div>
              <div className={styles.productCardContent}>
                <div className={styles.productId}>ID: {product.id}</div>
                <div className={styles.productPrice}>
                  <span>Price:</span> ${product.price.toFixed(2)}
                </div>
                <div className={styles.productStock}>
                  <span>Stock Quantity:</span> {product.stockQuantity}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.productsTable}>
          <table>
            <thead>
              <tr>
                <th className={styles.checkboxCell}></th>
                <th className={styles.idHeader}>ID</th>
                <th className={styles.nameHeader}>Name</th>
                <th className={styles.categoryHeader}>Category</th>
                <th className={styles.priceHeader}>Price</th>
                <th className={styles.stockBoolHeader}>In Stock</th>
                <th className={styles.stockQuantityHeader}>Stock Quantity</th>
                <th className={styles.ratingHeader}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className={selectedProducts.includes(product.id) ? styles.selectedRow : ''}
                >
                  <td className={styles.checkboxCell} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => handleCheckboxChange(e, product.id)}
                    />
                  </td>
                  <td className={styles.idCell}>{product.id}</td>
                  <td className={styles.nameCell}>{product.name}</td>
                  <td className={styles.categoryCell}>{product.category}</td>
                  <td className={styles.priceCell}>${product.price.toFixed(2)}</td>
                  <td
                    className={`${styles.stockBoolCell} ${product.inStock ? styles.inStock : styles.outOfStock}`}
                  >
                    {product.inStock ? 'True' : 'False'}
                  </td>
                  <td className={styles.stockQuantityCell}>{product.stockQuantity}</td>
                  <td className={styles.ratingCell}>{product.ratings.average.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {renderPagination()}
    </div>
  );
};

export default ProductList;
