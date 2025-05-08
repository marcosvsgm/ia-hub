
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Database } from '@/types/database';
import { ApiKeys } from '@/types/ai';

type ApiKey = Database['public']['Tables']['api_keys']['Row'];

// Simple hash function (in production, use a more secure approach)
const hashKey = (key: string): string => {
  // This is a placeholder - in a real app, you'd use a proper hashing algorithm
  // Never store API keys in plain text
  return `hashed_${key.substring(0, 3)}...${key.substring(key.length - 3)}`;
};

export const saveApiKey = async (
  userId: string,
  provider: string,
  key: string
): Promise<void> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não está configurado. Chave API não será salva.');
    // Simulamos o salvamento armazenando no localStorage apenas para desenvolvimento
    localStorage.setItem(`apiKey_${provider}`, key);
    return;
  }

  // First check if a key for this provider already exists
  const { data: existingKey } = await supabase
    .from('api_keys')
    .select('id')
    .eq('user_id', userId)
    .eq('provider', provider)
    .single();

  if (existingKey) {
    // Update existing key
    const { error } = await supabase
      .from('api_keys')
      .update({ 
        key_hash: hashKey(key),
        created_at: new Date().toISOString()
      })
      .eq('id', existingKey.id);

    if (error) throw error;
  } else {
    // Insert new key
    const { error } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        provider,
        key_hash: hashKey(key),
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  }
};

export const getApiKeys = async (userId: string): Promise<ApiKeys> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não está configurado. Usando dados locais.');
    // Retornamos baseado no localStorage para desenvolvimento
    const result: ApiKeys = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('apiKey_')) {
        const provider = key.replace('apiKey_', '');
        result[provider] = true;
      }
    }
    return result;
  }

  const { data, error } = await supabase
    .from('api_keys')
    .select('provider')
    .eq('user_id', userId);

  if (error) throw error;

  const result: ApiKeys = {};
  data.forEach((item) => {
    result[item.provider] = true;
  });

  return result;
};

export const deleteApiKey = async (userId: string, provider: string): Promise<void> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não está configurado. Removendo chave localmente.');
    localStorage.removeItem(`apiKey_${provider}`);
    return;
  }

  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('user_id', userId)
    .eq('provider', provider);

  if (error) throw error;
};
