import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange
}) {
  if (totalPages <= 1) return null;

  // Construye la lista de páginas visibles (con elipsis si hay muchas)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  const handlePageClick = (page) => {
    onPageChange(page);
    // Scroll suave hacia arriba de la sección de productos
    const catalogEl = document.getElementById('catalogo');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="container" aria-label="Paginación del catálogo">
      <div className="pagination-wrapper">
        {/* Botón Anterior */}
        <button
          className="pagination-btn"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
          <span style={{ marginLeft: '2px', display: 'none' }}>Anterior</span>
        </button>

        {/* Números de página */}
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                ...
              </span>
            );
          }

          const isActive = p === currentPage;
          return (
            <button
              key={p}
              className={`pagination-btn ${isActive ? 'active' : ''}`}
              onClick={() => handlePageClick(p)}
              aria-current={isActive ? 'page' : undefined}
            >
              {p}
            </button>
          );
        })}

        {/* Botón Siguiente */}
        <button
          className="pagination-btn"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
        >
          <span style={{ marginRight: '2px', display: 'none' }}>Siguiente</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
