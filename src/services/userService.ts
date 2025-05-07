
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type User = Database['public']['Tables']['users']['Row'];
type UserStats = Database['public']['Tables']['user_stats']['Row'];

export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) {
    throw error;
  }
};

export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateUserStats = async (
  userId: string, 
  statsUpdate: Partial<Omit<UserStats, 'id' | 'user_id'>>
): Promise<void> => {
  const { error } = await supabase
    .from('user_stats')
    .update(statsUpdate)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
};

export const getDashboardStats = async () => {
  // Total users
  const { count: totalUsers, error: countError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  if (countError) throw countError;

  // Active users (logged in within last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { count: activeUsers, error: activeError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gt('last_login', sevenDaysAgo.toISOString())
    .eq('status', 'active');

  if (activeError) throw activeError;

  // User growth per day for the last 7 days
  const { data: userGrowth, error: growthError } = await supabase
    .from('users')
    .select('created_at')
    .gt('created_at', sevenDaysAgo.toISOString())
    .order('created_at');

  if (growthError) throw growthError;

  // Process user growth data
  const growthByDay = userGrowth?.reduce((acc: Record<string, number>, user) => {
    const day = new Date(user.created_at).toLocaleDateString('pt-BR', { weekday: 'short' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  // Average session time from user_stats
  const { data: statsData, error: statsError } = await supabase
    .from('user_stats')
    .select('total_usage_time, session_count');

  if (statsError) throw statsError;

  const totalTime = statsData.reduce((sum, stat) => sum + (stat.total_usage_time || 0), 0);
  const totalSessions = statsData.reduce((sum, stat) => sum + (stat.session_count || 0), 0);
  const averageSessionTime = totalSessions > 0 ? (totalTime / totalSessions).toFixed(1) : "0.0";

  // Model usage distribution - using groupby option correctly
  const { data: modelData, error: modelError } = await supabase
    .rpc('count_messages_by_model');

  if (modelError) throw modelError;

  return {
    totalUsers: totalUsers || 0,
    activeUsers: activeUsers || 0,
    userGrowth: growthByDay || {},
    averageSessionTime,
    modelUsage: modelData || [],
  };
};
