# Product Catalog Application

A React-based product catalog with filtering, search, and pagination capabilities.

## Setup

```bash
npm install
npm start
```

## Features

- Product listing with grid/table view toggle
- Search by product name
- Filter by category (multi-select)
- Pagination with configurable items per page
- Product detail pages
- Responsive design

## Tech Stack

- React 19 with TypeScript
- React Router for navigation
- CSS Modules for styling
- Jest & React Testing Library for tests

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (irreversible)

## Project Structure

```
src/
├── components/       # UI components
├── context/         # React context for state management
├── services/        # API service layer
└── types/          # TypeScript type definitions
```

## API

The application fetches product data from a static JSON endpoint. See `API_SPECIFICATION.md` for the expected data format.