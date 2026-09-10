import React from 'react';
import { Phone, Heart, ShieldCheck, RefreshCw } from 'lucide-react';
import { STORE_PHONE_RAW, STORE_PHONE_DISPLAY } from '../utils/whatsapp';
import { CATEGORIES } from '../data/categories';

export default function Footer({ onSelectCategory }) {
  const popularCategories = CATEGORIES.filter(c => c !== "Todos").slice(0, 6);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <h3 className="footer-brand-title">SEGUNDA VIDA</h3>
            <p className="footer-desc">
              Ropa de segunda mano seleccionada con cariño. Prendas únicas, bonitas y a los mejores precios de Costa Rica.
            </p>

            <a
              href={`https://wa.me/${STORE_PHONE_RAW}?text=Hola,%20tengo%20una%20consulta%20para%20Segunda%20Vida`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-wa-link"
            >
              <Phone size={15} />
              <span>WhatsApp: {STORE_PHONE_DISPLAY}</span>
            </a>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="footer-col-title">Categorías</h4>
            <ul className="footer-links-list">
              {popularCategories.map(cat => (
                <li key={cat}>
                  <a
                    href="#catalogo"
                    className="footer-link"
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectCategory(cat);
                      const catEl = document.getElementById('catalogo');
                      if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Info */}
          <div>
            <h4 className="footer-col-title">Compras y Envíos</h4>
            <ul className="footer-links-list">
              <li className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#C49774" />
                <span>Prendas revisadas y limpias</span>
              </li>
              <li className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={14} color="#C49774" />
                <span>Prendas seleccionadas una por una</span>
              </li>
              <li className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={14} color="#C49774" />
                <span>Atención personalizada</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SEGUNDA VIDA. Todos los derechos reservados. San José, Costa Rica.</p>
        </div>
      </div>
    </footer>
  );
}
