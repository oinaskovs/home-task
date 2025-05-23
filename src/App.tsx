import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import Layout from './components/Layout/Layout';
import ProductList from './components/ProductList/ProductList';
import ProductDetailPage from './components/ProductDetail/ProductDetailPage';
import './App.css';

const App: React.FC = () => {
  return (
    <ProductProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </Layout>
      </Router>
    </ProductProvider>
  );
};

export default App;
