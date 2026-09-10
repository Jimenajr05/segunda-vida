import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryChips from './components/CategoryChips';
import FilterBar from './components/FilterBar';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import Pagination from './components/Pagination';
import Toast from './components/Toast';
import { products as initialProducts } from './data/products';
import { PRICE_RANGES } from './data/categories';

const getItemsPerPage = () =>
  (typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches) ? 12 : 10;
const CART_STORAGE_KEY = 'segunda_vida_cart_v1';

export default function App() {
  // Estado del Carrito (con persistencia en localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Error al cargar carrito desde localStorage:", e);
      return [];
    }
  });

  // Estado de Búsqueda y Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  // Estado de Paginación (Exactamente 10 items por página)
  const [currentPage, setCurrentPage] = useState(1);

  // Modales y Vistas
  const [selectedProductForDetail, setSelectedProductForDetail] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);

  // Ajustar cantidad por página según el ancho de pantalla (12 en compu, 10 en móvil)
  useEffect(() => {
    const onResize = () => setItemsPerPage(getItemsPerPage());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Error al guardar carrito en localStorage:", e);
    }
  }, [cart]);

  // Mostrar mensaje toast temporal
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Resetear página a 1 cuando cambien filtros o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSize, selectedPriceRange]);

  // Manejo de Carrito
  const handleAddToCart = (product) => {
    if (product.available === false) {
      showToast("Esta prenda ya fue vendida", "error");
      return;
    }

    const alreadyInCart = cart.some(item => item.id === product.id || item.code === product.code);
    if (alreadyInCart) {
      showToast("Esta prenda única ya está en tu carrito", "warning");
      return;
    }

    setCart(prev => [...prev, product]);
    showToast(`"${product.name}" agregada al carrito`);
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    showToast("Prenda eliminada del carrito");
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setSelectedCategory('Todos');
    setSelectedSize(null);
    setSelectedPriceRange('all');
    setSearchQuery('');
  };

  const hasActiveFilters = Boolean(
    selectedCategory !== 'Todos' ||
    selectedSize !== null ||
    selectedPriceRange !== 'all' ||
    searchQuery.trim() !== ''
  );

  // Conjunto de IDs en el carrito para búsqueda O(1)
  const cartItemIds = useMemo(() => {
    return new Set(cart.map(item => item.id));
  }, [cart]);

  // Filtrado reactivo de productos
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const priceObj = PRICE_RANGES.find(p => p.id === selectedPriceRange) || PRICE_RANGES[0];

    return initialProducts.filter(product => {
      // 1. Filtro por Categoría
      if (selectedCategory !== 'Todos' && product.category !== selectedCategory) {
        return false;
      }

      // 2. Filtro por Talla
      if (selectedSize && product.size !== selectedSize) {
        return false;
      }

      // 3. Filtro por Rango de Precio
      if (product.price < priceObj.min || product.price > priceObj.max) {
        return false;
      }

      // 4. Búsqueda por texto (Nombre, Código único, Categoría o Talla)
      if (q) {
        const matchName = product.name.toLowerCase().includes(q);
        const matchCode = product.code.toLowerCase().includes(q);
        const matchCat = product.category.toLowerCase().includes(q);
        const matchSize = product.size.toLowerCase() === q;
        const matchDesc = product.description ? product.description.toLowerCase().includes(q) : false;

        if (!matchName && !matchCode && !matchCat && !matchSize && !matchDesc) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedSize, selectedPriceRange]);

  // Cálculo de Paginación (Máximo 10 productos por página)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      <Toast message={toast?.message} type={toast?.type} />

      {/* Header Sticky */}
      <Header
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        onSelectCategory={setSelectedCategory}
      />

      <main>
        {/* Hero Section */}
        <Hero onExploreClick={scrollToCatalog} />

        {/* Categorías Deslizables Horizontalmente */}
        <CategoryChips
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Barra de Filtros y Conteo */}
        <FilterBar
          totalResults={filteredProducts.length}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          selectedPriceRange={selectedPriceRange}
          onSelectPriceRange={setSelectedPriceRange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Catálogo de Productos (2 columnas mobile first) */}
        <ProductGrid
          products={paginatedProducts}
          onProductClick={(product) => setSelectedProductForDetail(product)}
          onAddToCart={handleAddToCart}
          cartItemIds={cartItemIds}
          onResetFilters={handleClearFilters}
        />

        {/* Paginación (Máximo 10 productos por página) */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      {/* Modal Detalle de Prenda */}
      {selectedProductForDetail && (
        <ProductDetailModal
          product={selectedProductForDetail}
          onClose={() => setSelectedProductForDetail(null)}
          onAddToCart={handleAddToCart}
          isInCart={cartItemIds.has(selectedProductForDetail.id)}
        />
      )}

      {/* Drawer Carrito */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
