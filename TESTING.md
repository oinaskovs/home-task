# Testing Guide

This document provides information about the test suite for this project.

## Running Tests

To run the tests, use one of the following commands:

```bash
# Run tests in watch mode (default)
npm test

# Run tests once without watching
npm test -- --watchAll=false

# Run a specific test file
npm test -- ProductList.test.tsx

# Run tests with coverage report
npm test -- --coverage
```

## Test Structure

The tests are organized following the component structure of the application:

1. **Component Tests** - Located alongside the component files

   - `ProductList.test.tsx` - Tests for the product listing functionality
   - `Header.test.tsx` - Tests for the header and view mode toggle
   - `ProductDetailPage.test.tsx` - Tests for the product detail page

2. **Context Tests**

   - `ProductContext.test.tsx` - Tests for the context provider and state management

3. **Service Tests**
   - `productService.test.tsx` - Tests for the API services

## Test Coverage

The tests cover the following areas:

- Component rendering and UI behavior
- State management through the context
- User interactions (clicking, typing, etc.)
- Routing functionality
- API service behavior

## Adding New Tests

When adding new features, please follow these guidelines for writing tests:

1. Create a test file alongside the component/service file
2. Mock external dependencies appropriately
3. Test both success and failure cases
4. Test user interactions comprehensively

## Mocking

This project uses Jest's mocking capabilities to mock:

- Fetch API for simulating server responses
- External dependencies
- Browser APIs when needed

## Common Testing Patterns

1. **Component Testing**:

   ```jsx
   test('component renders correctly', () => {
     render(<Component />);
     expect(screen.getByText(/expected text/i)).toBeInTheDocument();
   });
   ```

2. **User Interaction**:

   ```jsx
   test('handles user interaction', () => {
     render(<Component />);
     fireEvent.click(screen.getByText('Click me'));
     expect(screen.getByText(/result/i)).toBeInTheDocument();
   });
   ```

3. **Asynchronous Testing**:
   ```jsx
   test('loads data asynchronously', async () => {
     render(<Component />);
     await waitFor(() => {
       expect(screen.getByText(/loaded data/i)).toBeInTheDocument();
     });
   });
   ```
