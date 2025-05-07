
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: "user" | "admin";
          last_login: string | null;
          status: "active" | "inactive";
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: "user" | "admin";
          last_login?: string | null;
          status?: "active" | "inactive";
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: "user" | "admin";
          last_login?: string | null;
          status?: "active" | "inactive";
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          model_id: string;
          provider: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          model_id: string;
          provider: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          model_id?: string;
          provider?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          model: string | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          model?: string | null;
          timestamp?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: "user" | "assistant" | "system";
          content?: string;
          model?: string | null;
          timestamp?: string;
        };
      };
      api_keys: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          key_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          key_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: string;
          key_hash?: string;
          created_at?: string;
        };
      };
      user_stats: {
        Row: {
          id: string;
          user_id: string;
          session_count: number;
          total_usage_time: number;
          favorite_model: string | null;
          last_activity: string | null;
          messages_sent: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_count?: number;
          total_usage_time?: number;
          favorite_model?: string | null;
          last_activity?: string | null;
          messages_sent?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_count?: number;
          total_usage_time?: number;
          favorite_model?: string | null;
          last_activity?: string | null;
          messages_sent?: number;
        };
      };
    };
  };
}
