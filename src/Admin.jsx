import React, { useEffect, useMemo, useState } from 'react';
import { Search, LogOut, Check, Loader2 } from 'lucide-react';
import { supabase } from './utils/supabaseClient';
import { withBase } from './utils/withBase';
import './admin.css';

/**
 * Panel privado para editar precio, talla y disponibilidad de cada prenda
 * desde el celular. Requiere login (creado a mano en Supabase Auth).
 * Ruta: /admin
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
      <div className="admin-container">
        <header className="admin-header">
          <div className="admin-brand">
            <span className="admin-brand-mark">SV</span>
            <div>
              <h1 className="admin-title">Panel Segunda Vida</h1>
              <p className="admin-subtitle">Precio · talla · disponibilidad</p>
            </div>
          </div>
          {session && (
            <button onClick={() => supabase.auth.signOut()} className="admin-logout">
              <LogOut size={15} strokeWidth={2.2} />
              Salir
            </button>
          )}
        </header>

        {checkingSession ? (
          <p className="admin-loading">Cargando...</p>
        ) : session ? (
          <ProductManager />
        ) : (
          <LoginForm />
        )}
      </div>
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

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (p) => p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
    );
  }, [products, search]);

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

function ProductRow({ product, saving, saved, onChange, onSave }) {
  const statusValue = product.available ? 'disponible' : (product.status || 'vendido');

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
