import React from 'react';
import { Product } from '../../types/Product';
import styles from './ProductHeader.module.css';

interface ProductHeaderProps {
  product: Product;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ product }) => {
  const { name, category, price, inStock, stockQuantity, ratings } = product;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={`${styles.star} ${index < Math.round(rating) ? styles.starFilled : styles.starEmpty}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className={styles.productHeader}>
      <div className={styles.productHeaderMain}>
        <div className={styles.productHeaderLeft}>
          <div className={styles.productImage}>
            <img src="/placeholder.jpg" alt={name} />
          </div>
        </div>

        <div className={styles.productHeaderRight}>
          <h1 className={styles.productName}>{name}</h1>
          <div className={styles.productCategory}>{category}</div>

          <div className={styles.productRating}>
            <div className={styles.stars}>{renderStars(ratings.average)}</div>
            <span className={styles.ratingValue}>{ratings.average.toFixed(1)}</span>
            <span className={styles.reviewsCount}>({ratings.reviewsCount} reviews)</span>
          </div>

          <div className={styles.productPrice}>${price.toFixed(2)}</div>

          <div className={styles.productStock}>
            {inStock ? (
              <span className={styles.inStock}>In Stock ({stockQuantity} available)</span>
            ) : (
              <span className={styles.outOfStock}>Out of Stock</span>
            )}
          </div>

          <div className={styles.productActions}>
            <button className={styles.addToCartButton} disabled={!inStock}>
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className={styles.wishlistButton}>Add to Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
