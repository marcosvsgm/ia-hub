
# IA Hub - Plataforma Generativa

## Sobre o projeto

IA Hub é uma plataforma generativa que permite interagir com múltiplos modelos de IA, incluindo:
- OpenAI (GPT)
- Google (Gemini)
- Anthropic (Claude)
- Perplexity
- Cohere

## Arquitetura

A plataforma é composta por:

### Frontend
- Interface de usuário interativa em React
- Chat em tempo real com diferentes modelos de IA
- Dashboard administrativo com estatísticas de uso
- Gerenciamento de conversas e histórico

### Backend (Supabase)
- **Autenticação**: Sistema completo de registro e login de usuários
- **Banco de Dados**: Armazenamento estruturado para usuários, conversas e estatísticas
- **Edge Functions**: Intermediação segura com APIs de IA
- **Armazenamento**: Sistema para guardar dados de conversas de forma segura
- **Row Level Security (RLS)**: Proteção de dados por usuário e nível de acesso

## Como executar localmente

Para executar o projeto em seu ambiente local, siga estas etapas:

### Pré-requisitos

- Node.js (versão 18 ou superior) - [instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- NPM (normalmente instalado com o Node.js)
- Um editor de código como VSCode (opcional)
- Conta no [Supabase](https://supabase.com) para o backend

### Passos para instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/ia-hub.git

# 2. Entre no diretório do projeto
cd ia-hub

# 3. Instale as dependências
npm install

# 4. Configure as variáveis de ambiente para o Supabase
# Crie um arquivo .env na raiz do projeto com:
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

Após executar estes comandos, o projeto estará disponível em [http://localhost:8080](http://localhost:8080) no seu navegador.

### Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Use o script SQL abaixo para criar as tabelas necessárias no Editor SQL do Supabase:

```sql
-- Cria tabelas para o projeto IA Hub
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'user',
  last_login TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL,
  title TEXT NOT NULL,
  model_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  model TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL,
  provider TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL UNIQUE,
  session_count INTEGER DEFAULT 0,
  total_usage_time NUMERIC DEFAULT 0,
  favorite_model TEXT,
  last_activity TIMESTAMP WITH TIME ZONE,
  messages_sent INTEGER DEFAULT 0
);

-- Função para contagem de mensagens por modelo
CREATE OR REPLACE FUNCTION public.count_messages_by_model()
RETURNS TABLE (model TEXT, count BIGINT)
LANGUAGE SQL
AS $$
  SELECT model, COUNT(*) 
  FROM public.messages 
  WHERE model IS NOT NULL 
  GROUP BY model;
$$;
```

4. Configure as políticas de Row Level Security (RLS) para proteger os dados:

```sql
-- Habilita RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY users_select_own ON public.users 
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY users_select_all_admin ON public.users 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Políticas para conversations
CREATE POLICY conversations_select_own ON public.conversations 
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY conversations_insert_own ON public.conversations 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY conversations_update_own ON public.conversations 
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY conversations_delete_own ON public.conversations 
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for messages and other tables...
```

5. Crie Edge Functions para a comunicação com as APIs de IA:

```typescript
// Exemplo de Edge Function para OpenAI (ai-gpt)
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.6'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )
    
    const { messages } = await req.json()
    const openai_key = Deno.env.get('OPENAI_API_KEY') ?? ''
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openai_key}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        temperature: 0.7
      })
    })
    
    const data = await response.json()
    
    return new Response(
      JSON.stringify({ content: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

### Configuração das APIs

Para utilizar os diferentes modelos de IA, você precisará configurar suas chaves de API:

1. Obtenha chaves de API dos provedores que deseja utilizar
2. Acesse a página inicial do IA Hub
3. Faça login com sua conta
4. Clique no ícone de configuração ao lado do seletor de modelo
5. Insira suas chaves de API para os serviços desejados

> **Nota:** As chaves de API são armazenadas de forma segura no Supabase, utilizando hash para proteção adicional.

## Tecnologias utilizadas

Este projeto foi construído com:

### Frontend
- Vite
- TypeScript
- React
- React Router
- Tailwind CSS
- shadcn-ui
- Tanstack Query

### Backend
- Supabase (PostgreSQL)
- Supabase Edge Functions
- Supabase Auth
- Row Level Security (RLS)

## Estrutura do projeto

```
src/
├── components/      # Componentes reutilizáveis
├── config/          # Configurações do projeto
├── contexts/        # Contextos React (Auth, etc)
├── lib/             # Bibliotecas e utilitários
├── pages/           # Páginas da aplicação
│   ├── admin/       # Páginas administrativas
│   └── auth/        # Páginas de autenticação
├── services/        # Serviços para comunicação com APIs
│   ├── aiService.ts       # Serviço para modelos de IA
│   ├── apiKeyService.ts   # Gerenciamento de chaves de API
│   ├── conversationService.ts  # Gerenciamento de conversas
│   └── userService.ts     # Gerenciamento de usuários
├── types/           # Definições de tipos TypeScript
└── utils/           # Funções utilitárias
```

## Funcionalidades

- Autenticação completa (login/registro)
- Chat com múltiplos modelos de IA
- Histórico de conversas
- Dashboard administrativo
- Gestão de usuários
- Configuração de chaves de API
- Estatísticas de uso

## URL do projeto

[https://lovable.dev/projects/6aef4626-8c98-4acb-b859-d5a5494c7e08](https://lovable.dev/projects/6aef4626-8c98-4acb-b859-d5a5494c7e08)
