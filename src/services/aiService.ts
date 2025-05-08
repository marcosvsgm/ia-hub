
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Message, AIModel } from "@/types/ai";
import { createMessage } from './conversationService';
import { updateUserStats } from './userService';

// Função de mock para simular respostas de AI quando o Supabase não está configurado
const mockAIResponse = async (model: AIModel, messages: Message[]): Promise<string> => {
  console.log(`Simulando resposta para o modelo ${model.id} (${model.provider})`);
  const userMessage = messages[messages.length - 1].content;
  
  // Respostas simuladas para desenvolvimento
  const responses = {
    gpt: `Resposta simulada do ChatGPT para: "${userMessage}"`,
    gemini: `Resposta simulada do Gemini para: "${userMessage}"`,
    claude: `Resposta simulada do Claude para: "${userMessage}"`,
    perplexity: `Resposta simulada do Perplexity para: "${userMessage}"`,
    cohere: `Resposta simulada do Cohere para: "${userMessage}"`,
    lovable: `Resposta simulada do Lovable para: "${userMessage}"`,
  };
  
  // Atraso simulado
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return responses[model.id as keyof typeof responses] || 
    `Resposta simulada do modelo ${model.name} para: "${userMessage}"`;
};

// Function to send messages to AI models through Supabase Edge Functions
export const sendMessageToAI = async (
  model: AIModel,
  messages: Message[],
  conversationId: string,
  userId: string
): Promise<string> => {
  try {
    // Se o Supabase não estiver configurado, use resposta simulada
    if (!isSupabaseConfigured()) {
      console.warn('Supabase não está configurado. Usando resposta simulada.');
      const mockResponse = await mockAIResponse(model, messages);
      
      // Salvar mensagens localmente
      const userMessage = messages[messages.length - 1];
      
      // Registrar no console para fins de desenvolvimento
      console.log("Mensagem do usuário:", userMessage.content);
      console.log("Resposta da IA:", mockResponse);
      
      return mockResponse;
    }
    
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
