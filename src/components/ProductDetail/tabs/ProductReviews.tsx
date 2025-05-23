import React, { useState, useMemo } from 'react';
import { Product } from '../../../types/Product';
import styles from './TabStyles.module.css';

interface ProductReviewsProps {
  product: Product;
}

type RatingFilter = number | 'all';
type SortBy = 'date' | 'rating-high' | 'rating-low';

const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={`${styles.star} ${index < rating ? styles.filled : styles.empty}`}
      >
        ★
      </span>
    ));
  };

  const filteredReviews = useMemo(() => {
    let filtered = [...product.reviews];

    if (ratingFilter !== 'all') {
      filtered = filtered.filter((review) => review.rating === ratingFilter);
    }

    switch (sortBy) {
      case 'date':
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'rating-high':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'rating-low':
        return filtered.sort((a, b) => a.rating - b.rating);
      default:
        return filtered;
    }
  }, [product.reviews, ratingFilter, sortBy]);

  const ratingStats = useMemo(() => {
    const stats = Array(5).fill(0);
    product.reviews.forEach((review) => {
      stats[review.rating - 1]++;
    });
    return stats.map((count, index) => ({
      rating: index + 1,
      count,
      percentage: (count / product.reviews.length) * 100,
    }));
  }, [product.reviews]);

  return (
    <div className={`${styles.tabSection} ${styles.reviewsTab}`}>
      <div className={styles.tabHeader}>
        <h2>Customer Reviews</h2>
        <div className={styles.ratingSummary}>
          <div className={styles.averageRating}>
            <span className={styles.ratingNumber}>{product.ratings.average.toFixed(1)}</span>
            <div className={styles.starsContainer}>
              {renderStars(Math.round(product.ratings.average))}
              <span className={styles.reviewsCount}>({product.ratings.reviewsCount} reviews)</span>
            </div>
          </div>

          <div className={styles.ratingBars}>
            {ratingStats.map((stat, index) => (
              <div key={index} className={styles.ratingBarRow}>
                <div className={styles.ratingLabel}>
                  <button
                    className={`${styles.ratingFilterButton} ${ratingFilter === stat.rating ? styles.ratingFilterButtonActive : ''}`}
                    onClick={() =>
                      setRatingFilter(ratingFilter === stat.rating ? 'all' : stat.rating)
                    }
                  >
                    {stat.rating} star{stat.rating !== 1 ? 's' : ''}
                  </button>
                </div>
                <div className={styles.ratingBarContainer}>
                  <div
                    className={styles.ratingBarFill}
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
                <div className={styles.ratingCount}>({stat.count})</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.reviewsFilters}>
        <div className={styles.filterGroup}>
          <label htmlFor="sortBy">Sort by:</label>
          <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
            <option value="date">Most Recent</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Filter by:</label>
          <div className={styles.ratingButtons}>
            <button
              className={`${styles.filterButton} ${ratingFilter === 'all' ? styles.filterButtonActive : ''}`}
              onClick={() => setRatingFilter('all')}
            >
              All Ratings
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                className={`${styles.filterButton} ${ratingFilter === rating ? styles.filterButtonActive : ''}`}
                onClick={() => setRatingFilter(ratingFilter === rating ? 'all' : rating)}
              >
                {rating} ★
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.reviewsList}>
        {filteredReviews.length === 0 ? (
          <p className={styles.noReviews}>No reviews match your filter criteria.</p>
        ) : (
          filteredReviews.map((review, index) => (
            <div key={index} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewUser}>{review.user}</div>
                <div className={styles.reviewDate}>{formatDate(review.date)}</div>
              </div>
              <div className={styles.reviewRating}>{renderStars(review.rating)}</div>
              <div className={styles.reviewContent}>{review.comment}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
