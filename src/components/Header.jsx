import React, { useState } from 'react';
import { ShoppingBag, Search, X, Info, Phone, Truck, ArrowRight } from 'lucide-react';
import { STORE_PHONE_RAW, STORE_PHONE_DISPLAY } from '../utils/whatsapp';

export default function Header({
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  showSearch,
  setShowSearch,
  onSelectCategory
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header-wrapper">
      <div className="container">
        <div className="header-inner">
          {/* Espaciador para mantener el logo centrado (solo escritorio) */}
          <div className="header-spacer" />

          {/* Logo / Brand Name */}
          <a href="#" className="header-brand" onClick={() => { if (onSelectCategory) onSelectCategory("Todos"); }}>
            <span className="brand-title">SEGUNDA VIDA</span>
            <span className="brand-subtitle">Prendas Únicas</span>
          </a>

          {/* Header Action Buttons */}
          <div className="header-actions">
            <button
              className="icon-btn"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Buscar prendas"
              title="Buscar"
            >
              <Search size={20} />
            </button>

            <button
              className="icon-btn"
              onClick={onOpenCart}
              aria-label="Ver carrito"
              title="Carrito de compras"
            >
              <ShoppingBag size={21} />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>

            <button
              className="icon-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Información y contacto"
              title="Información y contacto"
            >
              {mobileMenuOpen ? <X size={22} /> : <Info size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Search Bar */}
      {showSearch && (
        <div className="header-search-bar">
          <div className="container">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por nombre, talla o categoría..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => onSearchChange('')}
                  aria-label="Limpiar búsqueda"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menú desplegable (lado izquierdo, sin fondo oscuro) */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 45, background: 'transparent' }}
          />
          <div
            className="info-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="info-panel-head">
              <span className="brand-title" style={{ fontSize: '0.95rem' }}>SEGUNDA VIDA</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Prendas seleccionadas con cariño</span>
            </div>

            <a
              href="#catalogo"
              className="info-panel-link"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSelectCategory) onSelectCategory("Todos");
              }}
            >
              Ver todo el catálogo
              <ArrowRight size={15} />
            </a>

            <a
              href={`https://wa.me/${STORE_PHONE_RAW}?text=Hola,%20tengo%20una%20consulta%20sobre%20la%20tienda%20Segunda%20Vida`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-checkout"
              style={{ padding: '11px 14px', fontSize: '0.85rem', width: '100%' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Phone size={16} />
              Escribir por WhatsApp
            </a>

            <div className="info-panel-note">
              <Truck size={15} className="info-panel-note-icon" />
              <div>
                <p><strong>Envío y pago:</strong></p>
                <ul className="info-panel-list">
                  <li>Correos de Costa Rica o mensajería</li>
                  <li>Envío por Uber</li>
                  <li>Recoger en Ciudad Quesada, Cedral, Calle San Lucas</li>
                  <li>Pago con SINPE Móvil o transferencia al coordinar por WhatsApp</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
