import React from 'react';
import { Product } from '../../../types/Product';
import styles from './TabStyles.module.css';

interface ProductDescriptionProps {
  product: Product;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  return (
    <div className={`${styles.tabSection} ${styles.descriptionTab}`}>
      <h2>Product Description</h2>
      <p>{product.description}</p>

      <div className={styles.descriptionExtended}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget
          ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Nullam
          auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit
          amet nisl.
        </p>
        <p>
          Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl
          nisl sit amet nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl,
          eget aliquam nisl nisl sit amet nisl.
        </p>
      </div>

      <div className={styles.descriptionFeatures}>
        <h3>Key Features</h3>
        <ul>
          <li>High-quality construction</li>
          <li>Durable materials</li>
          <li>Easy to use</li>
          <li>Versatile application</li>
          <li>Modern design</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDescription;
