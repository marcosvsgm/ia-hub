
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: { name?: string }) => Promise<{ error: any }>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Unexpected error during getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Update user's last_login in the users table when they sign in
      if (session?.user) {
        const updateLastLogin = async () => {
          const { error } = await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', session.user.id);
          
          if (error) {
            console.error('Error updating last login:', error);
          }
        };
        updateLastLogin();
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'Erro ao entrar',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }

      toast({
        title: 'Bem-vindo de volta!',
        description: 'Login realizado com sucesso.',
      });
      return { error: null };
    } catch (error: any) {
      console.error('Unexpected error during sign in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Sign up with Supabase Auth
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (signUpError) {
        toast({
          title: 'Erro ao criar conta',
          description: signUpError.message,
          variant: 'destructive',
        });
        return { error: signUpError };
      }

      // Create a record in the users table
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            name,
            role: 'user',
            status: 'active',
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return { error: profileError };
        }

        // Initialize user stats
        const { error: statsError } = await supabase
          .from('user_stats')
          .insert({
            user_id: data.user.id,
            session_count: 1,
            total_usage_time: 0,
            messages_sent: 0,
          });

        if (statsError) {
          console.error('Error initializing user stats:', statsError);
        }
      }

      toast({
        title: 'Conta criada com sucesso!',
        description: 'Bem-vindo ao IA Hub.',
      });
      return { error: null };
    } catch (error: any) {
      console.error('Unexpected error during sign up:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Sessão encerrada',
        description: 'Você saiu da sua conta.',
      });
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      toast({
        title: 'Erro ao sair',
        description: 'Não foi possível encerrar a sessão.',
        variant: 'destructive',
      });
    }
  };

  const updateUserProfile = async (data: { name?: string }) => {
    try {
      if (!user) return { error: new Error('Usuário não autenticado') };

      // Update auth metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data,
      });

      if (updateError) {
        return { error: updateError };
      }

      // Update users table
      const { error: profileError } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id);

      if (profileError) {
        return { error: profileError };
      }

      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
      });
      return { error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
