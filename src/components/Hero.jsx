import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-tagline">
            <Sparkles size={14} />
            <span>Prendas Únicas de Segunda Mano</span>
          </div>

          <h1 className="hero-title">
            Ropa que merece una <span className="hero-accent">segunda oportunidad</span>
          </h1>

          <p className="hero-subtitle">
            Prendas seleccionadas una por una, bonitas y a los mejores precios.
          </p>

          <button
            className="hero-btn"
            onClick={onExploreClick}
            aria-label="Ver prendas disponibles"
          >
            <span>Ver prendas</span>
            <ArrowDown size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
