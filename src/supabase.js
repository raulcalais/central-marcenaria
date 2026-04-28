import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,       // Renova o token automaticamente
    persistSession: true,          // Mantém sessão no navegador
    detectSessionInUrl: true,
    storage: window.localStorage, // Salva sessão no localStorage
  },
  realtime: {
    timeout: 30000,
  },
})
