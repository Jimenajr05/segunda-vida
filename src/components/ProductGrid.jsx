import React from 'react';
import { SearchX } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products,
  onProductClick,
  onAddToCart,
  cartItemIds,
  onResetFilters
}) {
  if (products.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <SearchX className="empty-icon" />
          <h3 className="empty-title">No encontramos prendas con esa búsqueda</h3>
          <p className="empty-desc">
            Intenta buscando con otra palabra, revisando otra categoría o limpiando los filtros seleccionados.
          </p>
          <button className="empty-btn" onClick={onResetFilters}>
            Ver todas las prendas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="products-grid">
        {products.map((product, i) => (
          <ProductCard
            key={product.id || product.code}
            product={product}
            onProductClick={onProductClick}
            onAddToCart={onAddToCart}
            isInCart={cartItemIds.has(product.id)}
            priority={i < 4}
          />
        ))}
      </div>
    </div>
  );
}
