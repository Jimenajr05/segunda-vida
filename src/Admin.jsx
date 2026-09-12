import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  LogOut,
  Check,
  Loader2,
  Wallet,
  TrendingUp,
  Clock3,
  Tag,
  LayoutDashboard,
  ShoppingBag,
  Store,
  X,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { supabase } from './utils/supabaseClient';
import { withBase } from './utils/withBase';
import { formatCurrency } from './utils/currency';
import { CATEGORIES, SIZES } from './data/categories';
import Toast from './components/Toast';
import './admin.css';

function statusOf(product) {
  return product.available ? 'disponible' : (product.status || 'vendido');
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'dashboard' | 'inventory'
  const [toast, setToast] = useState(null);

  // Filtro que puede ser enviado desde el Dashboard al Inventario
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState('todos');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('Todos');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const goToInventoryWithFilter = (status = 'todos', category = 'Todos') => {
    setInventoryStatusFilter(status);
    setInventoryCategoryFilter(category);
    setActiveTab('inventory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="admin-page">
      <Toast message={toast?.message} type={toast?.type} />

      {/* Encabezado Principal con Estética de Tienda */}
      <header className="header-wrapper admin-header-wrapper">
        <div className="container">
          <div className="header-inner admin-header-inner">
            {/* Logo / Brand Name */}
            <a href="/" className="header-brand" title="Ir al catálogo principal">
              <span className="brand-title">SEGUNDA VIDA</span>
              <span className="brand-subtitle">Panel de Control</span>
            </a>

            {/* Selector de Pestañas (Solo si está autenticado) */}
            {session && (
              <nav className="admin-nav-tabs" aria-label="Navegación del panel">
                <button
                  className={`admin-nav-tab ${activeTab === 'dashboard' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <LayoutDashboard size={17} />
                  <span>Dashboard</span>
                </button>
                <button
                  className={`admin-nav-tab ${activeTab === 'inventory' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('inventory')}
                >
                  <ShoppingBag size={17} />
                  <span>Inventario</span>
                </button>
              </nav>
            )}

            {/* Acciones del Encabezado */}
            <div className="admin-header-actions">
              <a
                href="/"
                className="admin-action-btn admin-store-btn"
                title="Ver tienda pública"
              >
                <Store size={17} />
                <span className="admin-btn-text">Ver Tienda</span>
              </a>

              {session && (
                <button
                  className="admin-action-btn admin-logout-btn"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    showToast('Sesión cerrada');
                  }}
                  aria-label="Cerrar sesión"
                  title="Cerrar sesión"
                >
                  <LogOut size={17} />
                  <span className="admin-btn-text">Salir</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sub-barra de pestañas en Móvil */}
        {session && (
          <div className="admin-mobile-tabs-container">
            <div className="container">
              <div className="admin-mobile-tabs">
                <button
                  className={`admin-mobile-tab ${activeTab === 'dashboard' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </button>
                <button
                  className={`admin-mobile-tab ${activeTab === 'inventory' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('inventory')}
                >
                  <ShoppingBag size={16} />
                  <span>Inventario</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Contenido Principal */}
      <main className="container admin-main-container">
        {checkingSession ? (
          <div className="admin-loading-state">
            <Loader2 size={32} className="admin-spin admin-loading-icon" />
            <p className="admin-loading-text">Cargando panel administrativo...</p>
          </div>
        ) : session ? (
          activeTab === 'dashboard' ? (
            <DashboardView onNavigateToInventory={goToInventoryWithFilter} />
          ) : (
            <InventoryView
              initialStatusFilter={inventoryStatusFilter}
              initialCategoryFilter={inventoryCategoryFilter}
              onStatusFilterChange={setInventoryStatusFilter}
              onCategoryFilterChange={setInventoryCategoryFilter}
              showToast={showToast}
            />
          )
        ) : (
          <LoginForm onLoginSuccess={() => showToast('¡Bienvenida al panel!')} />
        )}
      </main>
    </div>
  );
}

/* ==========================================================================
   VISTA: FORMULARIO DE INICIO DE SESIÓN
   ========================================================================== */
function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError('Correo o contraseña incorrectos.');
    } else if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <Sparkles size={22} />
          </div>
          <h2 className="admin-login-title">Acceso Administrativo</h2>
          <p className="admin-login-subtitle">Ingresa tus credenciales para gestionar el catálogo</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label className="admin-field-label">Correo Electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              autoComplete="username"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-field-label">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="admin-error-box">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="admin-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <span>Entrar al Panel</span>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/" className="admin-back-link">
            <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} />
            <span>Volver a la tienda pública</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   VISTA: DASHBOARD / RESUMEN DE VENTAS Y MÉTRICAS
   ========================================================================== */
function DashboardView({ onNavigateToInventory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('code', { ascending: true });
      if (!error) setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const stats = useMemo(() => {
    const result = {
      disponible: { count: 0, total: 0 },
      apartado: { count: 0, total: 0 },
      vendido: { count: 0, total: 0 },
    };
    const categoryBreakdown = {};

    for (const p of products) {
      const s = statusOf(p);
      const price = Number(p.price) || 0;
      result[s].count += 1;
      result[s].total += price;

      const cat = p.category || 'Sin categoría';
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { total: 0, disponible: 0, apartado: 0, vendido: 0, revenue: 0 };
      }
      categoryBreakdown[cat].total += 1;
      categoryBreakdown[cat][s] += 1;
      if (s === 'vendido') {
        categoryBreakdown[cat].revenue += price;
      }
    }

    const totalCount = products.length;
    const totalInventoryValue = result.disponible.total + result.apartado.total + result.vendido.total;
    const porCobrar = result.disponible.total + result.apartado.total;
    const conversionRate = totalCount > 0 ? Math.round((result.vendido.count / totalCount) * 100) : 0;
    const pctDisponible = totalCount > 0 ? Math.round((result.disponible.count / totalCount) * 100) : 0;
    const pctApartado = totalCount > 0 ? Math.round((result.apartado.count / totalCount) * 100) : 0;
    const pctVendido = totalCount > 0 ? Math.round((result.vendido.count / totalCount) * 100) : 0;

    return {
      ...result,
      totalCount,
      totalInventoryValue,
      porCobrar,
      conversionRate,
      pctDisponible,
      pctApartado,
      pctVendido,
      categories: Object.entries(categoryBreakdown).sort((a, b) => b[1].total - a[1].total),
    };
  }, [products]);

  if (loading) {
    return (
      <div className="admin-loading-state">
        <Loader2 size={32} className="admin-spin admin-loading-icon" />
        <p className="admin-loading-text">Calculando métricas del negocio...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Banner Superior del Dashboard */}
      <div className="admin-dash-hero">
        <div className="admin-dash-hero-info">
          <span className="admin-pill-badge">Resumen Financiero y Métricas</span>
          <h1 className="admin-dash-title">Rendimiento del Catálogo</h1>
          <p className="admin-dash-subtitle">
            Monitoreo en tiempo real de prendas vendidas, apartados y flujo de caja proyectado.
          </p>
        </div>
        <button
          className="admin-btn-secondary"
          onClick={() => onNavigateToInventory('todos', 'Todos')}
        >
          <span>Gestionar Prendas</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Tarjetas Principales de Dinero */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card admin-kpi-sales">
          <div className="admin-kpi-top">
            <span className="admin-kpi-label">Total Recaudado / Vendido</span>
            <div className="admin-kpi-icon icon-sales">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">{formatCurrency(stats.vendido.total)}</div>
          <div className="admin-kpi-footer">
            <span className="admin-kpi-highlight">{stats.vendido.count} prendas vendidas</span>
            <span className="admin-kpi-sub">({stats.conversionRate}% del inventario)</span>
          </div>
        </div>

        <div className="admin-kpi-card admin-kpi-pending">
          <div className="admin-kpi-top">
            <span className="admin-kpi-label">Potencial por Cobrar</span>
            <div className="admin-kpi-icon icon-pending">
              <Wallet size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">{formatCurrency(stats.porCobrar)}</div>
          <div className="admin-kpi-footer">
            <span className="admin-kpi-sub">
              {stats.disponible.count} disponibles + {stats.apartado.count} apartadas
            </span>
          </div>
        </div>

        <div className="admin-kpi-card admin-kpi-total">
          <div className="admin-kpi-top">
            <span className="admin-kpi-label">Valor Total del Inventario</span>
            <div className="admin-kpi-icon icon-total">
              <Layers size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">{formatCurrency(stats.totalInventoryValue)}</div>
          <div className="admin-kpi-footer">
            <span className="admin-kpi-sub">{stats.totalCount} prendas registradas en total</span>
          </div>
        </div>
      </div>

      {/* Sección de Estados del Inventario con Acceso Rápido */}
      <div className="admin-dash-section">
        <div className="admin-section-header">
          <div>
            <h2 className="admin-section-title">Distribución de Inventario</h2>
            <p className="admin-section-subtitle">Haz clic en una tarjeta para filtrar directamente el catálogo</p>
          </div>
        </div>

        {/* Barra de Distribución Visual */}
        <div className="admin-progress-container">
          <div className="admin-progress-bar">
            <div
              className="admin-progress-seg seg-disponible"
              style={{ width: `${stats.pctDisponible}%` }}
              title={`Disponibles: ${stats.pctDisponible}%`}
            />
            <div
              className="admin-progress-seg seg-apartado"
              style={{ width: `${stats.pctApartado}%` }}
              title={`Apartados: ${stats.pctApartado}%`}
            />
            <div
              className="admin-progress-seg seg-vendido"
              style={{ width: `${stats.pctVendido}%` }}
              title={`Vendidos: ${stats.pctVendido}%`}
            />
          </div>
          <div className="admin-progress-labels">
            <div className="admin-progress-legend">
              <span className="dot dot-disponible" />
              <span>Disponible ({stats.pctDisponible}%)</span>
            </div>
            <div className="admin-progress-legend">
              <span className="dot dot-apartado" />
              <span>Apartado ({stats.pctApartado}%)</span>
            </div>
            <div className="admin-progress-legend">
              <span className="dot dot-vendido" />
              <span>Vendido ({stats.pctVendido}%)</span>
            </div>
          </div>
        </div>

        {/* Tarjetas Interactivas de Estado */}
        <div className="admin-status-grid">
          <button
            className="admin-status-box box-disponible"
            onClick={() => onNavigateToInventory('disponible', 'Todos')}
          >
            <div className="admin-status-box-header">
              <div className="admin-status-box-icon">
                <Tag size={18} />
              </div>
              <ArrowUpRight size={16} className="admin-status-box-arrow" />
            </div>
            <div className="admin-status-box-count">{stats.disponible.count}</div>
            <div className="admin-status-box-title">Prendas Disponibles</div>
            <div className="admin-status-box-money">{formatCurrency(stats.disponible.total)}</div>
            <span className="admin-status-box-cta">Ver en inventario →</span>
          </button>

          <button
            className="admin-status-box box-apartado"
            onClick={() => onNavigateToInventory('apartado', 'Todos')}
          >
            <div className="admin-status-box-header">
              <div className="admin-status-box-icon">
                <Clock3 size={18} />
              </div>
              <ArrowUpRight size={16} className="admin-status-box-arrow" />
            </div>
            <div className="admin-status-box-count">{stats.apartado.count}</div>
            <div className="admin-status-box-title">Prendas Apartadas</div>
            <div className="admin-status-box-money">{formatCurrency(stats.apartado.total)}</div>
            <span className="admin-status-box-cta">Ver en inventario →</span>
          </button>

          <button
            className="admin-status-box box-vendido"
            onClick={() => onNavigateToInventory('vendido', 'Todos')}
          >
            <div className="admin-status-box-header">
              <div className="admin-status-box-icon">
                <CheckCircle2 size={18} />
              </div>
              <ArrowUpRight size={16} className="admin-status-box-arrow" />
            </div>
            <div className="admin-status-box-count">{stats.vendido.count}</div>
            <div className="admin-status-box-title">Prendas Vendidas</div>
            <div className="admin-status-box-money">{formatCurrency(stats.vendido.total)}</div>
            <span className="admin-status-box-cta">Ver en inventario →</span>
          </button>
        </div>
      </div>

      {/* Desglose por Categoría */}
      <div className="admin-dash-section">
        <div className="admin-section-header">
          <div>
            <h2 className="admin-section-title">Desglose por Categoría</h2>
            <p className="admin-section-subtitle">Volumen de prendas y recaudación por tipo de prenda</p>
          </div>
        </div>

        <div className="admin-card admin-category-table-card">
          <div className="admin-category-table-wrapper">
            <table className="admin-category-table">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">Disponibles</th>
                  <th className="text-center">Apartadas</th>
                  <th className="text-center">Vendidas</th>
                  <th className="text-right">Vendido (₡)</th>
                  <th className="text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {stats.categories.map(([categoryName, catData]) => (
                  <tr key={categoryName}>
                    <td className="admin-cat-name-cell">
                      <span className="admin-cat-badge">{categoryName}</span>
                    </td>
                    <td className="text-center font-medium">{catData.total}</td>
                    <td className="text-center">
                      <span className="admin-mini-badge badge-disp">{catData.disponible}</span>
                    </td>
                    <td className="text-center">
                      <span className="admin-mini-badge badge-apart">{catData.apartado}</span>
                    </td>
                    <td className="text-center">
                      <span className="admin-mini-badge badge-vend">{catData.vendido}</span>
                    </td>
                    <td className="text-right font-medium">{formatCurrency(catData.revenue)}</td>
                    <td className="text-right">
                      <button
                        className="admin-table-action-btn"
                        onClick={() => onNavigateToInventory('todos', categoryName)}
                        title={`Filtrar inventario por ${categoryName}`}
                      >
                        Filtrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   VISTA: INVENTARIO / GESTIÓN DE PRENDAS
   ========================================================================== */
function InventoryView({
  initialStatusFilter,
  initialCategoryFilter,
  onStatusFilterChange,
  onCategoryFilterChange,
  showToast,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter || 'todos');
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryFilter || 'Todos');
  const [selectedSize, setSelectedSize] = useState('all');
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('code', { ascending: true });
    if (!error) setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Actualizar filtros si cambian externamente desde el Dashboard
  useEffect(() => {
    if (initialStatusFilter) setStatusFilter(initialStatusFilter);
    if (initialCategoryFilter) setSelectedCategory(initialCategoryFilter);
  }, [initialStatusFilter, initialCategoryFilter]);

  // Reset de página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, selectedCategory, selectedSize]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    if (onStatusFilterChange) onStatusFilterChange(status);
  };

  const handleCategoryFilterChange = (cat) => {
    setSelectedCategory(cat);
    if (onCategoryFilterChange) onCategoryFilterChange(cat);
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('todos');
    setSelectedCategory('Todos');
    setSelectedSize('all');
    if (onStatusFilterChange) onStatusFilterChange('todos');
    if (onCategoryFilterChange) onCategoryFilterChange('Todos');
  };

  const hasActiveFilters = Boolean(
    search.trim() !== '' ||
    statusFilter !== 'todos' ||
    selectedCategory !== 'Todos' ||
    selectedSize !== 'all'
  );

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((p) => {
      // Filtro por Estado
      if (statusFilter !== 'todos' && statusOf(p) !== statusFilter) return false;

      // Filtro por Categoría
      if (selectedCategory !== 'Todos' && p.category !== selectedCategory) return false;

      // Filtro por Talla
      if (selectedSize !== 'all' && p.size !== selectedSize) return false;

      // Búsqueda por texto (código, nombre, descripción o talla)
      if (q) {
        const matchCode = p.code?.toLowerCase().includes(q);
        const matchName = p.name?.toLowerCase().includes(q);
        const matchSize = p.size?.toLowerCase() === q;
        const matchCat = p.category?.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchSize && !matchCat) return false;
      }

      return true;
    });
  }, [products, search, statusFilter, selectedCategory, selectedSize]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const updateLocalProduct = (id, field, value) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const saveProduct = async (product) => {
    setSavingId(product.id);
    const { error } = await supabase
      .from('products')
      .update({
        price: Number(product.price),
        size: product.size,
        available: product.available,
        status: product.available ? null : product.status,
      })
      .eq('id', product.id);
    setSavingId(null);
    if (!error) {
      setSavedId(product.id);
      showToast(`Prenda ${product.code} actualizada correctamente`, 'success');
      setTimeout(() => setSavedId(null), 1800);
    } else {
      showToast(`Error al guardar prenda ${product.code}`, 'error');
    }
  };

  return (
    <div className="admin-inventory-layout">
      {/* Barra Superior con Título y Conteo */}
      <div className="admin-inventory-header">
        <div>
          <h1 className="admin-dash-title">Inventario de Prendas</h1>
          <p className="admin-dash-subtitle">
            Edita precios, tallas y estados de disponibilidad en tiempo real.
          </p>
        </div>

        <button
          className="admin-refresh-btn"
          onClick={loadProducts}
          title="Recargar catálogo desde la base de datos"
        >
          <Loader2 size={16} className={loading ? 'admin-spin' : ''} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Barra de Búsqueda y Filtros Rápidos */}
      <div className="admin-filter-container">
        {/* Buscador */}
        <div className="admin-search-box">
          <Search size={18} className="admin-search-box-icon" />
          <input
            type="text"
            placeholder="Buscar por código (#042), nombre, talla..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
          {search && (
            <button
              className="admin-search-clear"
              onClick={() => setSearch('')}
              aria-label="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filtros de Estado tipo Pills */}
        <div className="admin-status-filter-pills">
          <button
            className={`admin-filter-pill ${statusFilter === 'todos' ? 'is-active' : ''}`}
            onClick={() => handleStatusFilterChange('todos')}
          >
            Todos
          </button>
          <button
            className={`admin-filter-pill pill-disponible ${statusFilter === 'disponible' ? 'is-active' : ''}`}
            onClick={() => handleStatusFilterChange('disponible')}
          >
            <span className="dot dot-disponible" />
            Disponibles
          </button>
          <button
            className={`admin-filter-pill pill-apartado ${statusFilter === 'apartado' ? 'is-active' : ''}`}
            onClick={() => handleStatusFilterChange('apartado')}
          >
            <span className="dot dot-apartado" />
            Apartados
          </button>
          <button
            className={`admin-filter-pill pill-vendido ${statusFilter === 'vendido' ? 'is-active' : ''}`}
            onClick={() => handleStatusFilterChange('vendido')}
          >
            <span className="dot dot-vendido" />
            Vendidos
          </button>
        </div>
      </div>

      {/* Chips Deslizables de Categorías */}
      <div className="admin-category-chips-wrapper">
        <div className="categories-scroll">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryFilterChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Barra de Filtros Activos & Resumen */}
      <div className="admin-results-bar">
        <div className="admin-results-count">
          Mostrando <strong>{filteredProducts.length}</strong> de {products.length} prendas
        </div>

        {hasActiveFilters && (
          <button className="admin-clear-filters-btn" onClick={clearFilters}>
            <X size={14} />
            <span>Limpiar todos los filtros</span>
          </button>
        )}
      </div>

      {/* Grid de Productos */}
      {loading ? (
        <div className="admin-loading-state">
          <Loader2 size={32} className="admin-spin admin-loading-icon" />
          <p className="admin-loading-text">Cargando inventario...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="admin-empty-state">
          <Package size={40} className="admin-empty-icon" />
          <h3 className="admin-empty-title">No se encontraron prendas</h3>
          <p className="admin-empty-subtitle">
            Prueba ajustando los filtros de búsqueda o categoría.
          </p>
          <button className="admin-btn-secondary" onClick={clearFilters}>
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="admin-products-grid">
          {paginatedProducts.map((product) => (
            <AdminProductCard
              key={product.id}
              product={product}
              saving={savingId === product.id}
              saved={savedId === product.id}
              onChange={(field, value) => updateLocalProduct(product.id, field, value)}
              onSave={() => saveProduct(product)}
            />
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="admin-pagination-wrapper">
          <button
            className="admin-page-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <div className="admin-page-info">
            Página <strong>{currentPage}</strong> de {totalPages}
          </div>
          <button
            className="admin-page-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   COMPONENTE: TARJETA DE EDICIÓN DE PRENDA
   ========================================================================== */
function AdminProductCard({ product, saving, saved, onChange, onSave }) {
  const statusValue = statusOf(product);

  const handleStatusChange = (newStatus) => {
    if (newStatus === 'disponible') {
      onChange('available', true);
      onChange('status', null);
    } else if (newStatus === 'apartado') {
      onChange('available', false);
      onChange('status', 'apartado');
    } else {
      onChange('available', false);
      onChange('status', 'vendido');
    }
  };

  return (
    <div className={`admin-product-card status-border-${statusValue}`}>
      {/* Cabecera con Imagen y Datos Clave */}
      <div className="admin-card-head">
        <div className="admin-card-thumb-container">
          <img
            src={withBase(product.image)}
            alt={product.name}
            className="admin-card-thumb"
            loading="lazy"
          />
          <span className="admin-card-code-badge">{product.code}</span>
        </div>

        <div className="admin-card-meta">
          <span className="admin-card-category">{product.category}</span>
          <h3 className="admin-card-name" title={product.name}>
            {product.name}
          </h3>

          <div className="admin-card-status-pill-wrap">
            <span className={`admin-status-pill admin-status-${statusValue}`}>
              {statusValue === 'disponible' ? 'Disponible' : statusValue === 'apartado' ? 'Apartado' : 'Vendido'}
            </span>
          </div>
        </div>
      </div>

      {/* Formulario de Edición */}
      <div className="admin-card-body">
        <div className="admin-field-row">
          <div className="admin-field-item">
            <label className="admin-field-label">Precio (₡)</label>
            <input
              type="number"
              value={product.price}
              onChange={(e) => onChange('price', e.target.value)}
              className="admin-input"
              inputMode="numeric"
            />
          </div>

          <div className="admin-field-item">
            <label className="admin-field-label">Talla</label>
            <input
              type="text"
              value={product.size}
              onChange={(e) => onChange('size', e.target.value)}
              className="admin-input"
              placeholder="S, M, L..."
            />
          </div>
        </div>

        <div className="admin-field-item">
          <label className="admin-field-label">Estado de la Prenda</label>
          <select
            value={statusValue}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="admin-input admin-select"
          >
            <option value="disponible">🟢 Disponible</option>
            <option value="apartado">🟠 Apartado</option>
            <option value="vendido">⚪ Vendido</option>
          </select>
        </div>
      </div>

      {/* Botón de Guardar */}
      <div className="admin-card-footer">
        <button
          onClick={onSave}
          className={`admin-btn-save ${saved ? 'admin-btn-saved' : ''}`}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 size={16} className="admin-spin" />
              <span>Guardando...</span>
            </>
          ) : saved ? (
            <>
              <Check size={16} strokeWidth={2.5} />
              <span>Guardado</span>
            </>
          ) : (
            <span>Guardar cambios</span>
          )}
        </button>
      </div>
    </div>
  );
}
