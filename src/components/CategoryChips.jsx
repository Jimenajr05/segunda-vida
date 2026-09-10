import React, { useRef } from 'react';
import { CATEGORIES } from '../data/categories';

export default function CategoryChips({ selectedCategory, onSelectCategory }) {
  const scrollRef = useRef(null);

  return (
    <div className="categories-container" id="catalogo">
      <div className="container">
        <div className="categories-scroll" ref={scrollRef}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                className={`category-chip ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
