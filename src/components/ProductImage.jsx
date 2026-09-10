import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

/**
 * Componente de imagen con soporte para placeholders automáticos.
 * Si la foto real no existe o falla al cargar, muestra un recuadro limpio con ícono y texto.
 */
export default function ProductImage({ src, alt, className = '', containerClassName = '', priority = false }) {
  const [imageError, setImageError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Si no hay src o falló la carga
  if (!src || imageError) {
    return (
      <div className={`product-placeholder ${className}`}>
        <ImageIcon className="placeholder-icon" strokeWidth={1.5} />
        <span className="placeholder-text">Imagen del producto</span>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className={`product-placeholder ${className}`}>
          <ImageIcon className="placeholder-icon" strokeWidth={1.5} />
          <span className="placeholder-text">Cargando prenda...</span>
        </div>
      )}
      <img
        src={src}
        alt={alt || "Prenda de ropa"}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setImageError(true)}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </>
  );
}
