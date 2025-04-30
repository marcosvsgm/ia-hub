
import { useState } from "react";
import { format } from "date-fns";
import { MessageCircle, Clock, Trash2 } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { Message, AIModel, availableModels } from "@/types/ai";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Helper function to get model information by ID
const getModelById = (modelId: string | undefined): AIModel | undefined => {
  return availableModels.find(model => model.id === modelId);
};

// Mock data for conversation history (would be replaced with real data)
const mockHistory: {
  id: string;
  title: string;
  modelId: string;
  lastMessage: string;
  messageCount: number;
  date: Date;
  messages: Message[];
}[] = [
  {
    id: "conv1",
    title: "Explicação sobre IA Generativa",
    modelId: "gpt",
    lastMessage: "Obrigado pela explicação detalhada!",
    messageCount: 8,
    date: new Date(2023, 3, 15),
    messages: [
      {
        id: "m1",
        role: "user",
        content: "O que é IA generativa?",
        timestamp: new Date(2023, 3, 15, 14, 30)
      },
      {
        id: "m2",
        role: "assistant",
        content: "IA generativa se refere a algoritmos de inteligência artificial capazes de gerar novos conteúdos como texto, imagens, música ou outros tipos de dados.",
        timestamp: new Date(2023, 3, 15, 14, 31),
        model: "gpt"
      }
    ]
  },
  {
    id: "conv2",
    title: "Análise de dados com Python",
    modelId: "gemini",
    lastMessage: "Vou implementar essas sugestões!",
    messageCount: 12,
    date: new Date(2023, 3, 12),
    messages: [
      {
        id: "m3",
        role: "user",
        content: "Como otimizar análise de dados com pandas?",
        timestamp: new Date(2023, 3, 12, 10, 15)
      },
      {
        id: "m4",
        role: "assistant",
        content: "Para otimizar o pandas, considere usar: vectorização em vez de loops, .query() para filtragem eficiente, dtypes apropriados, e processamento em chunks para grandes datasets.",
        timestamp: new Date(2023, 3, 12, 10, 16),
        model: "gemini"
      }
    ]
  },
  {
    id: "conv3",
    title: "Desenvolvimento Web Frontend",
    modelId: "claude",
    lastMessage: "Muito obrigado pelas dicas!",
    messageCount: 6,
    date: new Date(2023, 3, 10),
    messages: [
      {
        id: "m5",
        role: "user",
        content: "Quais frameworks frontend devo aprender em 2023?",
        timestamp: new Date(2023, 3, 10, 9, 45)
      },
      {
        id: "m6",
        role: "assistant",
        content: "Em 2023, recomendo focar em React (especialmente com Next.js), Vue.js 3 com Nuxt, ou Svelte/SvelteKit. React continua dominante no mercado, mas Svelte está ganhando popularidade pela simplicidade.",
        timestamp: new Date(2023, 3, 10, 9, 46),
        model: "claude"
      }
    ]
  }
];

const History = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [modelFilter, setModelFilter] = useState<string>("all");
  
  // Get the conversation details for the selected conversation
  const conversation = mockHistory.find(conv => conv.id === selectedConversation);
  
  // Filter conversations by model
  const filteredConversations = modelFilter === "all" 
    ? mockHistory 
    : mockHistory.filter(conv => conv.modelId === modelFilter);

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Histórico de Conversas</h1>
            <div className="flex items-center gap-2">
              <Select value={modelFilter} onValueChange={setModelFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os modelos</SelectItem>
                  {availableModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Conversas</CardTitle>
                  <CardDescription>
                    {filteredConversations.length} conversas encontradas
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[600px] overflow-y-auto">
                    {filteredConversations.map((conv) => {
                      const model = getModelById(conv.modelId);
                      return (
                        <div 
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv.id)}
                          className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${selectedConversation === conv.id ? 'bg-muted' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{conv.title}</h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{format(conv.date, "dd/MM/yyyy")}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            {model && (
                              <>
                                <img 
                                  src={model.avatar} 
                                  alt={model.name} 
                                  className="h-4 w-4 rounded-full"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://placehold.co/40x40?text=${model.name.charAt(0)}`;
                                  }} 
                                />
                                <span>{model.name}</span>
                              </>
                            )}
                          </div>
                          
                          <div className="text-sm line-clamp-2 text-muted-foreground">
                            {conv.lastMessage}
                          </div>
                          
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <MessageCircle className="h-3 w-3" />
                            <span>{conv.messageCount} mensagens</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              {conversation ? (
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{conversation.title}</CardTitle>
                      <CardDescription>
                        {format(conversation.date, "dd/MM/yyyy")} • {conversation.messageCount} mensagens
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Origem</TableHead>
                          <TableHead>Mensagem</TableHead>
                          <TableHead className="text-right">Tempo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {conversation.messages.map((message) => (
                          <TableRow key={message.id}>
                            <TableCell className="font-medium">
                              {message.role === "user" ? "Usuário" : getModelById(message.model)?.name || "IA"}
                            </TableCell>
                            <TableCell>{message.content}</TableCell>
                            <TableCell className="text-right">
                              {format(message.timestamp, "HH:mm")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex h-full items-center justify-center bg-muted/20 rounded-lg border border-dashed">
                  <div className="text-center p-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Selecione uma conversa</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Clique em uma conversa na lista para ver detalhes e histórico completo.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default History;
