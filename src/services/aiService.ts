
import { supabase } from '@/lib/supabase';
import { Message, AIModel } from "@/types/ai";
import { createMessage } from './conversationService';
import { updateUserStats } from './userService';

// Function to send messages to AI models through Supabase Edge Functions
export const sendMessageToAI = async (
  model: AIModel,
  messages: Message[],
  conversationId: string,
  userId: string
): Promise<string> => {
  try {
    // Format messages for the API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Call Supabase Edge Function based on the model
    const { data, error } = await supabase.functions.invoke(`ai-${model.id}`, {
      body: {
        messages: formattedMessages,
        model: model.id,
        provider: model.provider
      }
    });

    if (error) {
      console.error(`Error calling ${model.id} API:`, error);
      throw new Error(error.message || `Error calling ${model.id} API`);
    }

    // Save the message to the database
    const userMessage = messages[messages.length - 1];
    
    // Save the user message
    await createMessage({
      conversation_id: conversationId,
      role: "user",
      content: userMessage.content,
      timestamp: userMessage.timestamp.toISOString(),
      model: null
    });
    
    // Save the AI response
    await createMessage({
      conversation_id: conversationId,
      role: "assistant",
      content: data.content,
      timestamp: new Date().toISOString(),
      model: model.id
    });

    // Update user stats - Using an RPC function to increment values
    await updateUserStats(userId, {
      messages_sent: 2, // increment by 2 (user + assistant)
      favorite_model: model.id
    });

    return data.content;
  } catch (error) {
    console.error("Error in sendMessageToAI:", error);
    throw error;
  }
};

// Edge Functions for each AI provider will be implemented in Supabase
