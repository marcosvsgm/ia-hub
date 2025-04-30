
import { API_CONFIG, SIMULATED_DELAY } from "@/config/api";
import { Message, AIModel } from "@/types/ai";

// Função base para enviar mensagens para qualquer modelo
export const sendMessageToAI = async (
  model: AIModel,
  messages: Message[],
  apiKey?: string
): Promise<string> => {
  // Baseado no ID do modelo, escolha o serviço apropriado
  switch (model.id) {
    case "gpt":
      return sendToOpenAI(messages, apiKey);
    case "gemini":
      return sendToGemini(messages, apiKey);
    case "claude":
      return sendToAnthropic(messages, apiKey);
    case "perplexity":
      return sendToPerplexity(messages, apiKey);
    case "cohere":
      return sendToCohere(messages, apiKey);
    case "lovable":
      return sendToLovable(messages);
    default:
      throw new Error(`Modelo não suportado: ${model.id}`);
  }
};

// OpenAI / ChatGPT
const sendToOpenAI = async (messages: Message[], apiKey?: string): Promise<string> => {
  if (!apiKey) {
    console.warn("Chave da API OpenAI não fornecida, usando resposta simulada");
    return simulateResponse("ChatGPT");
  }

  try {
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await fetch(API_CONFIG.openai.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: API_CONFIG.openai.model,
        messages: formattedMessages,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erro na API da OpenAI");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao chamar a API da OpenAI:", error);
    throw error;
  }
};

// Google Gemini
const sendToGemini = async (messages: Message[], apiKey?: string): Promise<string> => {
  if (!apiKey) {
    console.warn("Chave da API Gemini não fornecida, usando resposta simulada");
    return simulateResponse("Gemini");
  }

  try {
    // Formatar as mensagens para o formato do Gemini
    const contents = [];
    
    for (const msg of messages) {
      contents.push({
        role: msg.role === "assistant" ? "model" : msg.role,
        parts: [{ text: msg.content }]
      });
    }

    const response = await fetch(`${API_CONFIG.gemini.apiUrl}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erro na API do Gemini");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    throw error;
  }
};

// Anthropic / Claude
const sendToAnthropic = async (messages: Message[], apiKey?: string): Promise<string> => {
  if (!apiKey) {
    console.warn("Chave da API Claude não fornecida, usando resposta simulada");
    return simulateResponse("Claude");
  }

  try {
    // Converter mensagens para o formato do Claude
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await fetch(API_CONFIG.anthropic.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: API_CONFIG.anthropic.model,
        messages: formattedMessages,
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erro na API da Anthropic");
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error("Erro ao chamar a API da Anthropic:", error);
    throw error;
  }
};

// Perplexity
const sendToPerplexity = async (messages: Message[], apiKey?: string): Promise<string> => {
  if (!apiKey) {
    console.warn("Chave da API Perplexity não fornecida, usando resposta simulada");
    return simulateResponse("Perplexity");
  }

  try {
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await fetch(API_CONFIG.perplexity.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: API_CONFIG.perplexity.model,
        messages: formattedMessages,
        temperature: 0.2,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erro na API da Perplexity");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao chamar a API da Perplexity:", error);
    throw error;
  }
};

// Cohere
const sendToCohere = async (messages: Message[], apiKey?: string): Promise<string> => {
  if (!apiKey) {
    console.warn("Chave da API Cohere não fornecida, usando resposta simulada");
    return simulateResponse("Cohere");
  }

  try {
    // Converter mensagens para o formato do Cohere
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      message: msg.content
    }));

    const response = await fetch(API_CONFIG.cohere.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: API_CONFIG.cohere.model,
        chat_history: formattedMessages.slice(0, -1),
        message: formattedMessages[formattedMessages.length - 1].message,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erro na API da Cohere");
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Erro ao chamar a API da Cohere:", error);
    throw error;
  }
};

// Lovable (simulado ou API interna)
const sendToLovable = async (messages: Message[]): Promise<string> => {
  // Aqui poderíamos implementar uma API real para Lovable
  // Por enquanto, vamos apenas simular
  return simulateResponse("Lovable");
};

// Função para simular resposta (para desenvolvimento)
const simulateResponse = async (modelName: string): Promise<string> => {
  // Simula o tempo de resposta da API
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  
  return `Esta é uma resposta simulada do ${modelName}. Em um ambiente de produção, 
  esta seria uma resposta real da API do modelo. Por favor, forneça uma chave de API
  válida para obter respostas reais.`;
};
