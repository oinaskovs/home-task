import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { productsState, dispatch } = useProductContext();
  const { products, selectedProduct, loading, error } = productsState;

  useEffect(() => {
    if (id && products.length > 0) {
      const product = products.find((product) => product.id === id);
      if (product) {
        dispatch({ type: 'SELECT_PRODUCT', payload: product });
      } else {
        navigate('/products');
      }
    }
  }, [id, products, dispatch, navigate]);

  if (loading) {
    return <div className={styles.loading}>Loading product details...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!selectedProduct) {
    return <div className={styles.loading}>Product not found</div>;
  }

  return (
    <div className={styles.productDetailPage}>
      <h1 className={styles.pageTitle}>Product Details</h1>

      <div className={styles.productContent}>
        <div className={styles.productImage}>
          <img src="/placeholder.jpg" alt={selectedProduct.name} />
        </div>

        <div className={styles.productInfo}>
          <div className={styles.infoItem}>
            <span className={styles.idLabel}>ID: </span>
            <span className={styles.idLabel}>{selectedProduct.id}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Name: </span>
            <span className={styles.infoValue}>{selectedProduct.name}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Category: </span>
            <span className={styles.infoValue}>{selectedProduct.category}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Price: </span>
            <span className={styles.infoValue}>${selectedProduct.price.toFixed(2)}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>In Stock: </span>
            <span className={styles.infoValue}>{selectedProduct.inStock ? 'Yes' : 'No'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Stock Quantity: </span>
            <span className={styles.infoValue}>{selectedProduct.stockQuantity}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Rating: </span>
            <span className={styles.infoValue}>{selectedProduct.ratings.average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
