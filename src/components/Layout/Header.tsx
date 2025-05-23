import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';
import { ViewMode } from '../../types/Product';
import styles from './Header.module.css';

const Logo: React.FC = () => (
  <div className={styles.logo}>
    <Link to="/">
      <img src="/logo.png" alt="Arvato systems logo" />
    </Link>
  </div>
);

const Header: React.FC = () => {
  const { viewMode, dispatch } = useProductContext();
  const location = useLocation();

  const isProductDetailPage = location.pathname.startsWith('/product/');

  const handleViewModeChange = (mode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  };

  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerContainer}>
        <Logo />
        {!isProductDetailPage && (
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewToggleButton} ${viewMode === 'table' ? styles.active : ''}`}
              onClick={() => handleViewModeChange('table')}
              aria-label="Table view"
            >
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 15V13H18V15H6ZM6 9V7H18V9H6ZM6 3V1H18V3H6ZM2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14C0 13.45 0.195833 12.9792 0.5875 12.5875C0.979167 12.1958 1.45 12 2 12C2.55 12 3.02083 12.1958 3.4125 12.5875C3.80417 12.9792 4 13.45 4 14C4 14.55 3.80417 15.0208 3.4125 15.4125C3.02083 15.8042 2.55 16 2 16ZM2 10C1.45 10 0.979167 9.80417 0.5875 9.4125C0.195833 9.02083 0 8.55 0 8C0 7.45 0.195833 6.97917 0.5875 6.5875C0.979167 6.19583 1.45 6 2 6C2.55 6 3.02083 6.19583 3.4125 6.5875C3.80417 6.97917 4 7.45 4 8C4 8.55 3.80417 9.02083 3.4125 9.4125C3.02083 9.80417 2.55 10 2 10ZM2 4C1.45 4 0.979167 3.80417 0.5875 3.4125C0.195833 3.02083 0 2.55 0 2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0C2.55 0 3.02083 0.195833 3.4125 0.5875C3.80417 0.979167 4 1.45 4 2C4 2.55 3.80417 3.02083 3.4125 3.4125C3.02083 3.80417 2.55 4 2 4Z"
                  fill="currentColor"
                />
              </svg>
              <span>Table</span>
            </button>

            <button
              className={`${styles.viewToggleButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => handleViewModeChange('grid')}
              aria-label="Grid view"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 18V0H18V18H0ZM16 16V10H10V16H16ZM16 2H10V8H16V2ZM2 2V8H8V2H2ZM2 16H8V10H2V16Z"
                  fill="currentColor"
                />
              </svg>
              <span>Grid</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
