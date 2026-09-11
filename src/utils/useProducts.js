import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { products as fallbackProducts } from '../data/products';

/**
 * Trae el catálogo desde Supabase (para que los cambios hechos en /admin
 * se vean al instante en la web pública). Si por algún motivo Supabase no
 * responde, usa los datos del archivo local como respaldo para que el
 * catálogo nunca se quede vacío.
 */
export function useProducts() {
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error al cargar productos de Supabase, uso datos locales:', error);
      setProducts(fallbackProducts);
    } else if (data && data.length > 0) {
      setProducts(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { products, loading, reload };
}
