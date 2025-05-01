
# IA Hub - Plataforma Generativa

## Sobre o projeto

IA Hub é uma plataforma generativa que permite interagir com múltiplos modelos de IA, incluindo:
- OpenAI (GPT)
- Google (Gemini)
- Anthropic (Claude)
- Perplexity
- Cohere

## Como executar localmente

Para executar o projeto em seu ambiente local, siga estas etapas:

### Pré-requisitos

- Node.js (versão 18 ou superior) - [instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- NPM (normalmente instalado com o Node.js)
- Um editor de código como VSCode (opcional)

### Passos para instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/ia-hub.git

# 2. Entre no diretório do projeto
cd ia-hub

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Após executar estes comandos, o projeto estará disponível em [http://localhost:8080](http://localhost:8080) no seu navegador.

### Configuração das APIs

Para utilizar os diferentes modelos de IA, você precisará configurar suas chaves de API:

1. Acesse a página inicial do IA Hub
2. Clique no ícone de configuração ao lado do seletor de modelo
3. Insira suas chaves de API para os serviços desejados
4. As chaves serão salvas no armazenamento local do navegador

> **Nota:** As chaves de API são armazenadas apenas localmente no seu navegador e não são enviadas para nenhum servidor externo.

## Tecnologias utilizadas

Este projeto foi construído com:

- Vite
- TypeScript
- React
- React Router
- Tailwind CSS
- shadcn-ui
- Tanstack Query

## Estrutura do projeto

```
src/
├── components/      # Componentes reutilizáveis
├── config/          # Configurações do projeto
├── pages/           # Páginas da aplicação
├── services/        # Serviços para comunicação com APIs
├── types/           # Definições de tipos TypeScript
└── utils/           # Funções utilitárias
```

## Funcionalidades

- Chat com múltiplos modelos de IA
- Histórico de conversas
- Página de ajuda com informações detalhadas
- Configuração de chaves de API

## URL do projeto

[https://lovable.dev/projects/6aef4626-8c98-4acb-b859-d5a5494c7e08](https://lovable.dev/projects/6aef4626-8c98-4acb-b859-d5a5494c7e08)
