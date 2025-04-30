
// Configuração das APIs
export const API_CONFIG = {
  openai: {
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini', // Modelo padrão
  },
  gemini: {
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent',
  },
  lovable: {
    // Para API interna ou simulação
    simulateResponse: true,
  }
};

// Tempo de espera simulado em ms (para desenvolvimento)
export const SIMULATED_DELAY = 1000;
