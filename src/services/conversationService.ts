
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];

export const getConversations = async (userId: string): Promise<Conversation[]> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const getConversationById = async (
  conversationId: string, 
  userId: string
): Promise<Conversation | null> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const createConversation = async (
  conversation: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>
): Promise<Conversation> => {
  const now = new Date().toISOString();
  const newConversation = {
    ...conversation,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from('conversations')
    .insert(newConversation)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateConversation = async (
  conversationId: string,
  updates: Partial<Omit<Conversation, 'id' | 'created_at' | 'user_id'>>
): Promise<Conversation> => {
  const updatedData = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('conversations')
    .update(updatedData)
    .eq('id', conversationId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteConversation = async (conversationId: string): Promise<void> => {
  // First delete all messages in the conversation
  const { error: messagesError } = await supabase
    .from('messages')
    .delete()
    .eq('conversation_id', conversationId);

  if (messagesError) {
    throw messagesError;
  }

  // Then delete the conversation
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId);

  if (error) {
    throw error;
  }
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('timestamp', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
};

export const createMessage = async (message: Omit<Message, 'id'>): Promise<Message> => {
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Update the conversation's updated_at timestamp
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', message.conversation_id);

  return data;
};
