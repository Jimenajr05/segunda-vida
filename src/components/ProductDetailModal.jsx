import React from 'react';
import { X, ShoppingBag, Phone, Check, Tag } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { generateSingleProductWhatsAppUrl } from '../utils/whatsapp';
import ProductImage from './ProductImage';

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  isInCart
}) {
  if (!product) return null;

  const isAvailable = product.available !== false;
  const whatsAppUrl = generateSingleProductWhatsAppUrl(product);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar detalle">
          <X size={20} />
        </button>

        <div className="detail-modal-body">
          {/* Large Image View */}
          <div className="detail-image-box">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="product-img"
            />
            {!isAvailable && (
              <div className="card-badge-sold" style={{ fontSize: '0.9rem', padding: '8px 0' }}>
                VENDIDO
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="detail-info-box">
            <div>
              <div className="detail-code-badge">
                <Tag size={13} />
                <span>CÓDIGO: {product.code}</span>
              </div>

              <h2 className="detail-title">{product.name}</h2>
              <div className="detail-price">{formatCurrency(product.price)}</div>

              {/* Specs Grid */}
              <div className="detail-spec-grid">
                <div className="spec-item">
                  <span className="spec-label">Talla</span>
                  <span className="spec-value">{product.size}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Categoría</span>
                  <span className="spec-value">{product.category}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Disponibilidad</span>
                  <span className="spec-value" style={{ color: '#1E7E34', fontWeight: 600 }}>
                    Disponible
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Estado</span>
                  <span className="spec-value">Excelente estado</span>
                </div>
              </div>

              {product.description && (
                <p className="detail-desc">{product.description}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="detail-actions">
              {isAvailable ? (
                <button
                  className={`btn-detail-add ${isInCart ? 'in-cart' : ''}`}
                  onClick={() => onAddToCart(product)}
                  disabled={isInCart}
                >
                  {isInCart ? (
                    <>
                      <Check size={18} />
                      <span>Agregada al Carrito</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Agregar al Carrito</span>
                    </>
                  )}
                </button>
              ) : (
                <button className="btn-detail-add" disabled>
                  <span>Prenda Vendida</span>
                </button>
              )}

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-detail-wa"
              >
                <Phone size={17} />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
