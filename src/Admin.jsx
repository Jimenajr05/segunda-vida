import React, { useEffect, useMemo, useState } from 'react';
import { Search, LogOut, Check, Loader2, Wallet, TrendingUp, Clock3, Tag } from 'lucide-react';
import { supabase } from './utils/supabaseClient';
import { withBase } from './utils/withBase';
import { formatCurrency } from './utils/currency';
import './admin.css';

/**
 * Panel privado para editar precio, talla y disponibilidad de cada prenda
 * desde el celular. Requiere login (creado a mano en Supabase Auth).
 * Usa el mismo encabezado y estilo visual que la tienda pública, para que
 * se sienta parte del mismo sitio. Ruta: /admin
 */
export default function Admin() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

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

  return (
    <div className="admin-page">
      {/* Encabezado idéntico al de la tienda, para ubicarse al instante */}
      <header className="header-wrapper">
        <div className="container">
          <div className="header-inner">
            <div className="header-spacer" />
            <div className="header-brand">
              <span className="brand-title">SEGUNDA VIDA</span>
              <span className="brand-subtitle">Panel privado</span>
            </div>
            {session && (
              <div className="header-actions">
                <button
                  className="icon-btn"
                  onClick={() => supabase.auth.signOut()}
                  aria-label="Cerrar sesión"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container admin-container">
        {checkingSession ? (
          <p className="admin-loading">Cargando...</p>
        ) : session ? (
          <ProductManager />
        ) : (
          <LoginForm />
        )}
      </main>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError('Correo o contraseña incorrectos.');
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card admin-login-card">
      <p className="admin-field-label">Correo</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="admin-input"
        autoComplete="username"
        required
      />
      <p className="admin-field-label">Contraseña</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="admin-input"
        autoComplete="current-password"
        required
      />
      {error && <p className="admin-error">{error}</p>}
      <button type="submit" className="admin-btn-primary" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}

function statusOf(product) {
  return product.available ? 'disponible' : (product.status || 'vendido');
}

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('code', { ascending: true });
    if (!error) setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Estadísticas para el dashboard de control
  const stats = useMemo(() => {
    const result = {
      disponible: { count: 0, total: 0 },
      apartado: { count: 0, total: 0 },
      vendido: { count: 0, total: 0 },
    };
    for (const p of products) {
      const s = statusOf(p);
      result[s].count += 1;
      result[s].total += Number(p.price) || 0;
    }
    const porCobrar = result.disponible.total + result.apartado.total;
    return { ...result, total: products.length, porCobrar };
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((p) => {
      if (statusFilter !== 'todos' && statusOf(p) !== statusFilter) return false;
      if (!q) return true;
      return p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
    });
  }, [products, search, statusFilter]);

  const updateLocal = (id, field, value) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
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
      setTimeout(() => setSavedId(null), 1800);
    }
  };

  return (
    <div>
      {!loading && (
        <Dashboard
          stats={stats}
          activeFilter={statusFilter}
          onFilter={setStatusFilter}
        />
      )}

      <div className="admin-search-wrapper">
        <Search size={17} className="admin-search-icon" strokeWidth={2} />
        <input
          type="text"
          placeholder="Buscar por código o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
      </div>

      {!loading && (
        <p className="admin-count">{filtered.length} prenda{filtered.length !== 1 ? 's' : ''}</p>
      )}
      {loading && <p className="admin-loading">Cargando productos...</p>}

      <div className="admin-list">
        {filtered.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            saving={savingId === product.id}
            saved={savedId === product.id}
            onChange={(field, value) => updateLocal(product.id, field, value)}
            onSave={() => saveProduct(product)}
          />
        ))}
      </div>
    </div>
  );
}

function Dashboard({ stats, activeFilter, onFilter }) {
  const toggle = (value) => onFilter(activeFilter === value ? 'todos' : value);

  return (
    <div className="admin-dashboard">
      <div className="admin-money-cards">
        <div className="admin-money-card">
          <div className="admin-money-icon admin-money-icon-sales">
            <TrendingUp size={17} strokeWidth={2.3} />
          </div>
          <div>
            <p className="admin-money-label">Total vendido</p>
            <p className="admin-money-value">{formatCurrency(stats.vendido.total)}</p>
          </div>
        </div>
        <div className="admin-money-card">
          <div className="admin-money-icon admin-money-icon-pending">
            <Wallet size={17} strokeWidth={2.3} />
          </div>
          <div>
            <p className="admin-money-label">Por cobrar</p>
            <p className="admin-money-value">{formatCurrency(stats.porCobrar)}</p>
          </div>
        </div>
      </div>

      <div className="admin-status-cards">
        <button
          className={`admin-status-card admin-status-card-disponible ${activeFilter === 'disponible' ? 'is-active' : ''}`}
          onClick={() => toggle('disponible')}
        >
          <Tag size={16} strokeWidth={2.3} />
          <span className="admin-status-card-count">{stats.disponible.count}</span>
          <span className="admin-status-card-label">Disponible</span>
        </button>
        <button
          className={`admin-status-card admin-status-card-apartado ${activeFilter === 'apartado' ? 'is-active' : ''}`}
          onClick={() => toggle('apartado')}
        >
          <Clock3 size={16} strokeWidth={2.3} />
          <span className="admin-status-card-count">{stats.apartado.count}</span>
          <span className="admin-status-card-label">Apartado</span>
        </button>
        <button
          className={`admin-status-card admin-status-card-vendido ${activeFilter === 'vendido' ? 'is-active' : ''}`}
          onClick={() => toggle('vendido')}
        >
          <Check size={16} strokeWidth={2.3} />
          <span className="admin-status-card-count">{stats.vendido.count}</span>
          <span className="admin-status-card-label">Vendido</span>
        </button>
      </div>
    </div>
  );
}

function ProductRow({ product, saving, saved, onChange, onSave }) {
  const statusValue = statusOf(product);

  return (
    <div className="admin-row">
      <div className="admin-row-top">
        <img
          src={withBase(product.image)}
          alt={product.name}
          className="admin-row-thumb"
          loading="lazy"
        />
        <div className="admin-row-heading">
          <span className="admin-row-code">{product.code}</span>
          <span className="admin-row-name">{product.name}</span>
        </div>
        <span className={`admin-status-pill admin-status-${statusValue}`}>
          {statusValue === 'disponible' ? 'Disponible' : statusValue === 'apartado' ? 'Apartado' : 'Vendido'}
        </span>
      </div>

      <div className="admin-field-grid">
        <div>
          <p className="admin-field-label">Precio (₡)</p>
          <input
            type="number"
            value={product.price}
            onChange={(e) => onChange('price', e.target.value)}
            className="admin-input"
            inputMode="numeric"
          />
        </div>
        <div>
          <p className="admin-field-label">Talla</p>
          <input
            type="text"
            value={product.size}
            onChange={(e) => onChange('size', e.target.value)}
            className="admin-input"
          />
        </div>
      </div>

      <p className="admin-field-label">Estado</p>
      <select
        value={statusValue}
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'disponible') {
            onChange('available', true);
          } else {
            onChange('available', false);
            onChange('status', value === 'apartado' ? 'apartado' : null);
          }
        }}
        className="admin-input admin-select"
      >
        <option value="disponible">Disponible</option>
        <option value="apartado">Apartado</option>
        <option value="vendido">Vendido</option>
      </select>

      <button
        onClick={onSave}
        className={`admin-btn-save ${saved ? 'admin-btn-saved' : ''}`}
        disabled={saving}
      >
        {saving ? (
          <><Loader2 size={16} className="admin-spin" /> Guardando...</>
        ) : saved ? (
          <><Check size={16} strokeWidth={2.5} /> Guardado</>
        ) : (
          'Guardar cambios'
        )}
      </button>
    </div>
  );
}
