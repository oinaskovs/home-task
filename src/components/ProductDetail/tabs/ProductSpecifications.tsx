import React, { useState } from 'react';
import { Product, ViewMode } from '../../../types/Product';
import styles from './TabStyles.module.css';

interface ProductSpecificationsProps {
  product: Product;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ product }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const specificationsItems = Object.entries(product.specifications);

  return (
    <div className={`${styles.tabSection} ${styles.specificationsTab}`}>
      <div className={styles.tabHeader}>
        <h2>Specifications</h2>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewToggleButton} ${viewMode === 'table' ? styles.active : ''}`}
            onClick={() => setViewMode('table')}
          >
            Table View
          </button>
          <button
            className={`${styles.viewToggleButton} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className={styles.specificationsTable}>
          <table>
            <tbody>
              {specificationsItems.map(([key, value]) => (
                <tr key={key}>
                  <th>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.specificationsGrid}>
          {specificationsItems.map(([key, value]) => (
            <div key={key} className={styles.specificationCard}>
              <div className={styles.specificationLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </div>
              <div className={styles.specificationValue}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSpecifications;
