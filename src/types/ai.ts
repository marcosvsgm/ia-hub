
export interface AIModel {
  id: string;
  name: string;
  description: string;
  avatar: string;
  capabilities: string[];
  provider: string;
}

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  model?: string;
}

export const availableModels: AIModel[] = [
  {
    id: "gpt",
    name: "ChatGPT",
    description: "Modelo avançado da OpenAI com conhecimentos até setembro de 2021",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png",
    capabilities: ["Conhecimentos gerais", "Programação", "Escrita criativa", "Resumos"],
    provider: "OpenAI"
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Modelo multimodal do Google com capacidades de visão e texto",
    avatar: "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-logo.max-1200x1200.png",
    capabilities: ["Visão computacional", "Análise de dados", "Processamento multimídia"],
    provider: "Google"
  },
  {
    id: "lovable",
    name: "Lovable",
    description: "Assistente especializado em desenvolvimento web e UI/UX",
    avatar: "https://media.licdn.com/dms/image/D4E0BAQHsMhes8y0OgA/company-logo_200_200/0/1698731149770/lovable_ai_logo?e=1719446400&v=beta&t=eR_SFW85Vt2ui4GwS_T40ZXwfwBtLHCkQXGA_VzmznE",
    capabilities: ["Desenvolvimento Web", "Design de UI/UX", "Programação React", "Prototipagem"],
    provider: "Lovable"
  }
];
