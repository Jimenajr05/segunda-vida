import { createClient } from '@supabase/supabase-js';

// Estas claves son "públicas" a propósito: están hechas para vivir en el
// navegador. La seguridad real la dan las políticas de RLS en Supabase
// (cualquiera puede leer productos, pero solo un usuario logueado puede
// editarlos) y el login de /admin.
const SUPABASE_URL = 'https://dszqjxuohonriqpydsxx.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_3Ct0V1gkhQiU6IlsuxMP3w_6EV0-q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
