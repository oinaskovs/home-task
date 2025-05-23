# Product API Specification

## Base URL

```
/api/v1
```

## Data Models

### Product

```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  inStock: boolean;
  stockQuantity: number;
  specifications: {
    brand: string;
    model: string;
    processor: string;
    ram: string;
    storage: string;
    display: string;
    batteryLife: string;
    color: string;
  };
  ratings: {
    average: number;
    reviewsCount: number;
  };
  reviews: Review[];
  shippingDetails: {
    weight: string;
    dimensions: string;
    shippingCost: number;
    estimatedDeliveryTime: string;
  };
}
```

### Review

```typescript
interface Review {
  user: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO 8601 format
}
```

### Response Formats

#### Paginated Response

```typescript
interface Pagination {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}
```

## Endpoints

### GET /products

Retrieves a paginated list of products with filtering and sorting.

**Query Parameters:**

- `page` (integer, default: 1): Page number for pagination
- `limit` (integer, default: 10): Items per page (5, 10, 20, 50)
- `searchQuery` (string, optional): Search by name or description
- `category` (string, optional): Filter by category, comma-separated for multiple categories
- `inStock` (boolean, optional): Filter by stock availability
- `priceRange` (string, optional): Format "min,max" e.g. "100,500"
- `rating` (integer, optional): Minimum rating (1-5)
- `sort` (string, optional): Field to sort by (name, price, ratings.average)
- `direction` (string, optional): Sort direction (asc, desc)

**Example Response:**

```json
{
  "items": [
    {
      "id": "p1",
      "name": "Product Name",
      "category": "Electronics",
      "description": "Product description",
      "price": 999.99,
      "inStock": true,
      "stockQuantity": 42,
      "specifications": {
        "brand": "Brand",
        "model": "Model",
        "processor": "Processor",
        "ram": "RAM",
        "storage": "Storage",
        "display": "Display",
        "batteryLife": "Battery",
        "color": "Color"
      },
      "ratings": {
        "average": 4.5,
        "reviewsCount": 120
      }
    }
  ],
  "pagination": {
    "totalItems": 100,
    "itemsPerPage": 10,
    "currentPage": 1,
    "totalPages": 10
  }
}
```

### GET /products/{id}

Retrieves a single product by ID.

**Path Parameters:**

- `id` (string, required): Product ID

**Example Response:**

```json
{
  "id": "p1",
  "name": "Product Name",
  "category": "Electronics",
  "description": "Product description",
  "price": 999.99,
  "inStock": true,
  "stockQuantity": 42,
  "specifications": {
    "brand": "Brand",
    "model": "Model",
    "processor": "Processor",
    "ram": "RAM",
    "storage": "Storage",
    "display": "Display",
    "batteryLife": "Battery",
    "color": "Color"
  },
  "ratings": {
    "average": 4.5,
    "reviewsCount": 120
  },
  "reviews": [
    {
      "user": "User1",
      "rating": 5,
      "comment": "Great product",
      "date": "2023-05-15T14:30:00Z"
    }
  ],
  "shippingDetails": {
    "weight": "2.5 kg",
    "dimensions": "30x20x10 cm",
    "shippingCost": 15.99,
    "estimatedDeliveryTime": "3-5 days"
  }
}
```

### GET /products/categories

Retrieves all product categories.

**Example Response:**

```json
["Electronics", "Computers", "Smartphones", "Accessories"]
```

## Implementation Notes

1. For simplicity, the API can be implemented with an in-memory data store or a simple database like SQLite.

2. Error handling should return appropriate HTTP status codes:

   - 200: Success
   - 400: Bad request (invalid parameters)
   - 404: Resource not found
   - 500: Server error

3. The API must support all filtering and sorting operations used by the frontend.

4. Key focus areas:

   - Correctly implementing pagination
   - Supporting filtering by multiple criteria
   - Handling the category filter with multiple selections
   - Ensuring proper sorting by various fields

5. Optionally, implement one basic unit test for each endpoint.

## Sample Dataset

Create a sample dataset with at least 50 products across 4-5 different categories to test pagination and filtering. The dataset should include variety in:

- Price ranges
- Stock availability
- Ratings

## Development Environment

Use any mainstream backend framework that you're comfortable with (Node.js/Express, Spring Boot, Django, etc.).
