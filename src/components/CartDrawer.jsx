import React from 'react';
import { X, Trash2, ShoppingBag, Phone, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { generateCartWhatsAppUrl } from '../utils/whatsapp';
import ProductImage from './ProductImage';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onClearCart
}) {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const whatsAppCheckoutUrl = generateCartWhatsAppUrl(cartItems);

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={20} />
            <span>Mi Carrito ({cartItems.length})</span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={48} strokeWidth={1.2} style={{ color: 'var(--text-light)' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Tu carrito está vacío
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '240px' }}>
              Explora nuestras prendas únicas y agrega tus favoritas para consultar por WhatsApp.
            </p>
            <button
              className="btn-add-cart"
              style={{ width: 'auto', padding: '8px 20px', marginTop: '10px' }}
              onClick={onClose}
            >
              Ver catálogo
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id || item.code} className="cart-item-card">
                  <div className="cart-item-thumb">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="product-img"
                    />
                  </div>

                  <div className="cart-item-details">
                    <div>
                      <span className="cart-item-code">{item.code}</span>
                      <h4 className="cart-item-name">{item.name}</h4>
                      <span className="cart-item-size">Talla: <strong>{item.size}</strong></span>
                    </div>
                    <div className="cart-item-price">
                      {formatCurrency(item.price)}
                    </div>
                  </div>

                  <button
                    className="cart-item-remove"
                    onClick={() => onRemoveFromCart(item.id)}
                    aria-label={`Eliminar ${item.name} del carrito`}
                    title="Eliminar prenda"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="cart-footer">
              <div className="cart-total-row">
                <span className="cart-total-label">Total a consultar:</span>
                <span className="cart-total-amount">{formatCurrency(total)}</span>
              </div>

              <a
                href={whatsAppCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-checkout"
              >
                <Phone size={18} />
                <span>Comprar por WhatsApp</span>
                <ArrowRight size={16} />
              </a>

              <button className="btn-continue-shopping" onClick={onClose}>
                Continuar viendo prendas
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
