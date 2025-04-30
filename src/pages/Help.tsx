
import React from "react";
import { Book, Search, MessageCircle, Bot, Info, HelpCircle } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { availableModels } from "@/types/ai";

const Help = () => {
  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Central de Ajuda</h1>
            <p className="text-muted-foreground">
              Encontre respostas para suas perguntas sobre como usar a plataforma IA Hub
            </p>
          </div>

          <Tabs defaultValue="inicio">
            <TabsList className="mb-4">
              <TabsTrigger value="inicio">
                <Info className="mr-2 h-4 w-4" />
                Início
              </TabsTrigger>
              <TabsTrigger value="modelos">
                <Bot className="mr-2 h-4 w-4" />
                Modelos de IA
              </TabsTrigger>
              <TabsTrigger value="dicas">
                <HelpCircle className="mr-2 h-4 w-4" />
                Dicas e Truques
              </TabsTrigger>
              <TabsTrigger value="faq">
                <MessageCircle className="mr-2 h-4 w-4" />
                Perguntas Frequentes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inicio" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bem-vindo ao IA Hub</CardTitle>
                    <CardDescription>Comece sua jornada</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      O IA Hub é uma plataforma que permite acesso a diversos modelos de IA generativa 
                      em uma única interface unificada.
                    </p>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Search className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Escolha seu modelo</h4>
                          <p className="text-sm text-muted-foreground">
                            Selecione entre diversos modelos disponíveis no painel esquerdo
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <MessageCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Converse naturalmente</h4>
                          <p className="text-sm text-muted-foreground">
                            Faça perguntas ou dê instruções em linguagem natural
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Book className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Acesse o histórico</h4>
                          <p className="text-sm text-muted-foreground">
                            Reveja suas conversas anteriores a qualquer momento
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Comece com estes exemplos</CardTitle>
                    <CardDescription>
                      Experimente estas prompts para ver o potencial das IAs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                      <p className="font-medium mb-1">Escrita criativa</p>
                      <p className="text-sm text-muted-foreground">
                        "Escreva um conto curto sobre um viajante do tempo que visita o Brasil em 2150."
                      </p>
                    </div>

                    <div className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                      <p className="font-medium mb-1">Análise de dados</p>
                      <p className="text-sm text-muted-foreground">
                        "Como eu poderia analisar dados de vendas para identificar tendências sazonais?"
                      </p>
                    </div>

                    <div className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                      <p className="font-medium mb-1">Explicação de conceitos</p>
                      <p className="text-sm text-muted-foreground">
                        "Explique o conceito de transformers em IA para alguém com conhecimentos básicos de programação."
                      </p>
                    </div>

                    <div className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                      <p className="font-medium mb-1">Código e desenvolvimento</p>
                      <p className="text-sm text-muted-foreground">
                        "Escreva um componente React que implemente um contador simples com botões para incrementar e decrementar."
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Como obter chaves de API</CardTitle>
                  <CardDescription>
                    Links e recursos para configurar os modelos de IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">OpenAI (ChatGPT)</h4>
                      <p className="text-sm text-muted-foreground">
                        Crie uma conta na OpenAI e obtenha sua chave de API no painel de desenvolvedores.
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                          Obter chave da OpenAI
                        </a>
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Google (Gemini)</h4>
                      <p className="text-sm text-muted-foreground">
                        Registre-se na Google AI Studio para obter uma chave de API para o Gemini.
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                          Obter chave do Gemini
                        </a>
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Anthropic (Claude)</h4>
                      <p className="text-sm text-muted-foreground">
                        Crie uma conta na Anthropic e solicite acesso à API do Claude.
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">
                          Obter chave do Claude
                        </a>
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Perplexity</h4>
                      <p className="text-sm text-muted-foreground">
                        Registre-se na plataforma Perplexity e obtenha sua chave de API.
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://www.perplexity.ai/settings" target="_blank" rel="noopener noreferrer">
                          Obter chave da Perplexity
                        </a>
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Cohere</h4>
                      <p className="text-sm text-muted-foreground">
                        Crie uma conta na Cohere para desenvolvedores e acesse sua chave de API.
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://dashboard.cohere.com/api-keys" target="_blank" rel="noopener noreferrer">
                          Obter chave da Cohere
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="modelos" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Modelos de IA Disponíveis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableModels.map((model) => (
                  <Card key={model.id} className="overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center overflow-hidden">
                          <img 
                            src={model.avatar} 
                            alt={model.name} 
                            className="h-8 w-8 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://placehold.co/80x80?text=${model.name.charAt(0)}`;
                            }} 
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">{model.name}</h3>
                          <p className="text-sm text-muted-foreground">{model.provider}</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="mb-4">{model.description}</p>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Capacidades:</h4>
                        <div className="flex flex-wrap gap-2">
                          {model.capabilities.map((capability, index) => (
                            <span 
                              key={index} 
                              className="text-xs bg-secondary px-2 py-1 rounded-full"
                            >
                              {capability}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="dicas" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Dicas para obter melhores resultados</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Técnicas de Prompting Efetivas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Seja específico e detalhado</h4>
                      <p className="text-sm text-muted-foreground">
                        Quanto mais detalhes você fornecer, melhor será a resposta. Inclua contexto, requisitos e formato desejado.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Use o role-playing</h4>
                      <p className="text-sm text-muted-foreground">
                        Peça ao modelo para assumir um papel específico: "Atue como um professor de história explicando..."
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Divida problemas complexos</h4>
                      <p className="text-sm text-muted-foreground">
                        Para tarefas complexas, divida em passos menores e trabalhe progressivamente com o modelo.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Itere sobre as respostas</h4>
                      <p className="text-sm text-muted-foreground">
                        Se a primeira resposta não for ideal, refine seu prompt baseado no que recebeu.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Formatos de Prompt Avançados</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-md p-4 bg-muted/20">
                      <h4 className="font-medium mb-2">Prompt com Etapas</h4>
                      <pre className="text-sm whitespace-pre-wrap">
{`Quero criar um plano de estudos para aprender programação. Por favor:
1. Identifique as principais áreas a serem estudadas
2. Crie um cronograma de 3 meses
3. Sugira recursos para cada tópico
4. Inclua pontos de verificação para avaliar o progresso`}
                      </pre>
                    </div>

                    <div className="border rounded-md p-4 bg-muted/20">
                      <h4 className="font-medium mb-2">Prompt com Contexto</h4>
                      <pre className="text-sm whitespace-pre-wrap">
{`Contexto: Sou um desenvolvedor júnior trabalhando em um projeto React.
Problema: Estou tendo dificuldades com o gerenciamento de estado.
Objetivo: Entender quando usar useState vs useReducer vs Context.
Conhecimento atual: Já sei usar useState para casos simples.`}
                      </pre>
                    </div>

                    <div className="border rounded-md p-4 bg-muted/20">
                      <h4 className="font-medium mb-2">Prompt com Formatos</h4>
                      <pre className="text-sm whitespace-pre-wrap">
{`Crie um resumo sobre inteligência artificial generativa.
Formato:
- Introdução (2 parágrafos)
- Principais técnicas (lista com 5 itens)
- Aplicações práticas (3 exemplos)
- Considerações éticas (1 parágrafo)
- Conclusão (1 parágrafo)`}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Casos de uso por modelo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">ChatGPT (OpenAI)</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Excelente para uma ampla variedade de tarefas, especialmente escrita, explicação de conceitos e código.
                      </p>
                      <div className="text-sm">
                        <span className="font-medium">Ideal para:</span> Escrita criativa, programação, tradução, resumos, explicações educativas
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Gemini (Google)</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Forte em multimodalidade, pode trabalhar com texto e imagens. Bom para análise técnica e consultas baseadas em dados.
                      </p>
                      <div className="text-sm">
                        <span className="font-medium">Ideal para:</span> Análise de imagens, dados científicos, pesquisas técnicas, matemática
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Claude (Anthropic)</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Excelente em processamento de textos longos e raciocínio nuançado. Bom para análises detalhadas.
                      </p>
                      <div className="text-sm">
                        <span className="font-medium">Ideal para:</span> Análise de documentos longos, raciocínio ético, resumos detalhados
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Perplexity</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Forte em pesquisa em tempo real e citação de fontes. Útil para consultas factuais atualizadas.
                      </p>
                      <div className="text-sm">
                        <span className="font-medium">Ideal para:</span> Pesquisa de informações atuais, consultas baseadas em fatos, citações
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Cohere</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Especializado em entendimento semântico e classificação de texto. Bom para análises textuais.
                      </p>
                      <div className="text-sm">
                        <span className="font-medium">Ideal para:</span> Classificação de conteúdo, moderação, análise semântica, geração de texto
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>Perguntas Frequentes</CardTitle>
                  <CardDescription>
                    Respostas para dúvidas comuns sobre a plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        As minhas chaves de API são armazenadas com segurança?
                      </AccordionTrigger>
                      <AccordionContent>
                        Sim. Suas chaves de API são armazenadas localmente no seu navegador através de localStorage. 
                        Elas nunca são enviadas para nossos servidores. As requisições para as APIs são feitas diretamente 
                        do seu navegador para os servidores dos provedores de IA.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        Preciso pagar para usar a plataforma?
                      </AccordionTrigger>
                      <AccordionContent>
                        Nossa plataforma é gratuita para uso, mas você precisará de suas próprias chaves de API 
                        dos provedores de IA que deseja utilizar. Alguns provedores oferecem níveis gratuitos, 
                        enquanto outros são totalmente pagos.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        Como obtenho uma chave de API para cada modelo?
                      </AccordionTrigger>
                      <AccordionContent>
                        Você precisa se registrar no serviço do provedor correspondente. Na seção "Início" desta página 
                        de ajuda, fornecemos links diretos para as páginas de cada provedor onde você pode obter suas 
                        chaves de API.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>
                        Posso exportar minhas conversas?
                      </AccordionTrigger>
                      <AccordionContent>
                        Atualmente, a função de exportação não está implementada, mas estamos trabalhando 
                        para adicionar essa funcionalidade em breve. Você poderá exportar suas conversas 
                        em formatos como PDF ou TXT.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger>
                        Qual modelo é melhor para programação?
                      </AccordionTrigger>
                      <AccordionContent>
                        ChatGPT da OpenAI e Claude da Anthropic geralmente oferecem os melhores resultados para tarefas de programação. 
                        O ChatGPT é frequentemente preferido devido à sua ampla experiência em código, enquanto o Claude se destaca 
                        em explicações detalhadas da lógica por trás do código.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                      <AccordionTrigger>
                        As conversas são salvas automaticamente?
                      </AccordionTrigger>
                      <AccordionContent>
                        Sim, todas as suas conversas são salvas automaticamente no armazenamento local do seu navegador. 
                        No entanto, se você limpar os dados do navegador, suas conversas serão perdidas. 
                        Em versões futuras, planejamos adicionar sincronização com a nuvem.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7">
                      <AccordionTrigger>
                        Existe limite de tokens ou tamanho de mensagens?
                      </AccordionTrigger>
                      <AccordionContent>
                        Sim, cada modelo tem seus próprios limites de tokens. Por exemplo, o GPT-4 tem um 
                        limite de contexto de 8K ou 32K tokens dependendo da versão, enquanto o Claude pode 
                        processar até 100K tokens. A plataforma respeita esses limites nativamente.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-8">
                      <AccordionTrigger>
                        Posso usar meus próprios prompts personalizados?
                      </AccordionTrigger>
                      <AccordionContent>
                        Sim, você tem total liberdade para inserir qualquer prompt de sua escolha. 
                        Na seção "Dicas e Truques" desta página, fornecemos orientações sobre como 
                        criar prompts eficazes para diferentes tipos de tarefas.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Help;
