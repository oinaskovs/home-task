import React from 'react';
import { Product } from '../../../types/Product';
import styles from './TabStyles.module.css';

interface ProductShippingProps {
  product: Product;
}

const ProductShipping: React.FC<ProductShippingProps> = ({ product }) => {
  const { shippingDetails } = product;

  return (
    <div className={`${styles.tabSection} ${styles.shippingTab}`}>
      <h2>Shipping Information</h2>

      <div className={styles.shippingDetails}>
        <table className={styles.shippingTable}>
          <tbody>
            <tr>
              <th>Weight</th>
              <td>{shippingDetails.weight}</td>
            </tr>
            <tr>
              <th>Dimensions</th>
              <td>{shippingDetails.dimensions}</td>
            </tr>
            <tr>
              <th>Shipping Cost</th>
              <td>${shippingDetails.shippingCost.toFixed(2)}</td>
            </tr>
            <tr>
              <th>Estimated Delivery</th>
              <td>{shippingDetails.estimatedDeliveryTime}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.shippingPolicy}>
        <h3>Shipping Policy</h3>
        <p>
          All orders are processed within 1-2 business days. Orders are not shipped on weekends or
          holidays. If we are experiencing a high volume of orders, shipments may be delayed by a
          few days.
        </p>

        <h4>Domestic Shipping</h4>
        <ul>
          <li>Standard shipping: 3-5 business days</li>
          <li>Express shipping: 1-3 business days</li>
        </ul>

        <h4>International Shipping</h4>
        <ul>
          <li>Standard shipping: 7-14 business days</li>
          <li>Express shipping: 3-7 business days</li>
        </ul>

        <h4>Returns & Exchanges</h4>
        <p>
          We accept returns up to 30 days after delivery. To be eligible for a return, your item
          must be unused and in the same condition that you received it.
        </p>
      </div>
    </div>
  );
};

export default ProductShipping;
