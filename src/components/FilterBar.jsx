import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { SIZES, PRICE_RANGES, CATEGORIES } from '../data/categories';

export default function FilterBar({
  totalResults,
  selectedCategory,
  onSelectCategory,
  selectedSize,
  onSelectSize,
  selectedPriceRange,
  onSelectPriceRange,
  onClearFilters,
  hasActiveFilters
}) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const currentPriceObj = PRICE_RANGES.find(p => p.id === selectedPriceRange) || PRICE_RANGES[0];

  return (
    <div className="container">
      {/* Toolbar row */}
      <div className="filter-toolbar">
        <div className="results-count">
          <strong>{totalResults}</strong> {totalResults === 1 ? 'prenda encontrada' : 'prendas disponibles'}
        </div>

        <div className="filter-actions">
          <button
            className={`filter-toggle-btn ${hasActiveFilters ? 'has-active' : ''}`}
            onClick={() => setFilterModalOpen(true)}
            aria-label="Abrir filtros"
          >
            <SlidersHorizontal size={15} />
            <span>Filtros</span>
            {hasActiveFilters && <span className="active-filter-badge-dot"></span>}
          </button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="active-filters-row">
          {selectedCategory !== "Todos" && (
            <span className="active-filter-tag">
              Categoría: {selectedCategory}
              <button onClick={() => onSelectCategory("Todos")} aria-label="Quitar filtro de categoría">
                <X size={13} />
              </button>
            </span>
          )}

          {selectedSize && (
            <span className="active-filter-tag">
              Talla: {selectedSize}
              <button onClick={() => onSelectSize(null)} aria-label="Quitar filtro de talla">
                <X size={13} />
              </button>
            </span>
          )}

          {selectedPriceRange !== "all" && (
            <span className="active-filter-tag">
              Precio: {currentPriceObj.label}
              <button onClick={() => onSelectPriceRange("all")} aria-label="Quitar filtro de precio">
                <X size={13} />
              </button>
            </span>
          )}

          <button className="clear-all-link" onClick={onClearFilters}>
            Limpiar todo
          </button>
        </div>
      )}

      {/* Filter Modal / Sheet */}
      {filterModalOpen && (
        <div className="modal-overlay" onClick={() => setFilterModalOpen(false)}>
          <div className="filter-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>
                Filtrar Prendas
              </h3>
              <button className="icon-btn" onClick={() => setFilterModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Category Filter */}
            <div className="filter-section">
              <h4 className="filter-title">Categoría</h4>
              <select
                className="search-input"
                style={{ height: '38px', paddingLeft: '12px', fontSize: '0.85rem' }}
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            <div className="filter-section">
              <h4 className="filter-title">Talla</h4>
              <div className="size-pill-grid">
                {SIZES.map(size => {
                  const isActive = selectedSize === size;
                  return (
                    <button
                      key={size}
                      className={`size-pill-btn ${isActive ? 'active' : ''}`}
                      onClick={() => onSelectSize(isActive ? null : size)}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-section">
              <h4 className="filter-title">Rango de Precio</h4>
              <div className="price-options-list">
                {PRICE_RANGES.map(range => (
                  <label key={range.id} className="price-option-label">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.id}
                      checked={selectedPriceRange === range.id}
                      onChange={() => onSelectPriceRange(range.id)}
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button
                className="btn-add-cart"
                style={{ background: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}
                onClick={() => {
                  onClearFilters();
                  setFilterModalOpen(false);
                }}
              >
                Limpiar
              </button>

              <button
                className="btn-add-cart"
                onClick={() => setFilterModalOpen(false)}
              >
                Ver ({totalResults}) resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
