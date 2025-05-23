import React, { useState } from 'react';
import { Product } from '../../types/Product';
import ProductDescription from './tabs/ProductDescription';
import ProductSpecifications from './tabs/ProductSpecifications';
import ProductReviews from './tabs/ProductReviews';
import ProductShipping from './tabs/ProductShipping';
import styles from './ProductTabs.module.css';

interface ProductTabsProps {
  product: Product;
}

type TabType = 'description' | 'specifications' | 'reviews' | 'shipping';

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<TabType>('description');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);

    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({ tab }, '', url.toString());
  };

  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      }
    };

    window.addEventListener('popstate', handlePopState);

    const url = new URL(window.location.href);
    const tabParam = url.searchParams.get('tab') as TabType;
    if (tabParam && ['description', 'specifications', 'reviews', 'shipping'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className={styles.productTabs}>
      <div className={styles.tabsHeader}>
        <button
          className={`${styles.tabButton} ${activeTab === 'description' ? styles.tabButtonActive : ''}`}
          onClick={() => handleTabChange('description')}
        >
          Description
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'specifications' ? styles.tabButtonActive : ''}`}
          onClick={() => handleTabChange('specifications')}
        >
          Specifications
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.tabButtonActive : ''}`}
          onClick={() => handleTabChange('reviews')}
        >
          Reviews ({product.reviews.length})
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'shipping' ? styles.tabButtonActive : ''}`}
          onClick={() => handleTabChange('shipping')}
        >
          Shipping
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'description' && <ProductDescription product={product} />}
        {activeTab === 'specifications' && <ProductSpecifications product={product} />}
        {activeTab === 'reviews' && <ProductReviews product={product} />}
        {activeTab === 'shipping' && <ProductShipping product={product} />}
      </div>
    </div>
  );
};

export default ProductTabs;
