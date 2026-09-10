import React from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import ProductImage from './ProductImage';

export default function ProductCard({
  product,
  onProductClick,
  onAddToCart,
  isInCart,
  priority = false
}) {
  const isAvailable = product.available !== false;

  const handleCartClick = (e) => {
    e.stopPropagation();
    if (!isAvailable) return;
    onAddToCart(product);
  };

  return (
    <div
      className="product-card"
      onClick={() => onProductClick(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onProductClick(product); }}
    >
      {/* Image Container with 3:4 aspect ratio */}
      <div className="product-image-container">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="product-img"
          priority={priority}
        />

        {/* Unique Code Badge */}
        <span className="card-badge-code" title="Código único de la prenda">
          {product.code}
        </span>

        {/* Size Badge */}
        <span className="card-badge-size" title={`Talla ${product.size}`}>
          {product.size}
        </span>

        {/* Sold Badge */}
        {!isAvailable && (
          <div className="card-badge-sold">
            VENDIDO
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="product-info">
        <span className="product-meta-sub">{product.category}</span>
        
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>

        <div className="product-price-row">
          <span className="product-price">
            {formatCurrency(product.price)}
          </span>
        </div>

        {/* Add to Cart Button */}
        {isAvailable ? (
          <button
            className={`btn-add-cart ${isInCart ? 'in-cart' : ''}`}
            onClick={handleCartClick}
            disabled={isInCart}
            aria-label={isInCart ? "En el carrito" : `Agregar ${product.name} al carrito`}
          >
            {isInCart ? (
              <>
                <Check size={14} />
                <span>En el carrito</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Agregar</span>
              </>
            )}
          </button>
        ) : (
          <button
            className="btn-add-cart"
            disabled
            aria-label="Prenda vendida"
          >
            <span>Vendido</span>
          </button>
        )}
      </div>
    </div>
  );
}
