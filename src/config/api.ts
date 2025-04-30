
// Configuração das APIs
export const API_CONFIG = {
  openai: {
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini', // Modelo padrão
  },
  gemini: {
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent',
  },
  anthropic: {
    apiUrl: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-haiku-20240307', // Modelo mais acessível
  },
  perplexity: {
    apiUrl: 'https://api.perplexity.ai/chat/completions',
    model: 'llama-3.1-sonar-small-128k-online', // Modelo padrão
  },
  cohere: {
    apiUrl: 'https://api.cohere.ai/v1/chat',
    model: 'command-r-plus', // Modelo padrão
  },
  lovable: {
    // Para API interna ou simulação
    simulateResponse: true,
  }
};

// Tempo de espera simulado em ms (para desenvolvimento)
export const SIMULATED_DELAY = 1000;
