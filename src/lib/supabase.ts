
import { createClient } from '@supabase/supabase-js';

// Verificar se as variáveis de ambiente do Supabase estão definidas
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Variáveis de ambiente Supabase não definidas. Usando modo de desenvolvimento local.');
}

// Valores padrão para desenvolvimento local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Criar cliente do Supabase com tratamento condicional para ambiente de produção
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função auxiliar para verificar se as credenciais do Supabase estão configuradas
export const isSupabaseConfigured = (): boolean => {
  return (
    import.meta.env.VITE_SUPABASE_URL !== undefined &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://example.supabase.co' &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== undefined &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your-anon-key'
  );
};
