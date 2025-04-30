
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layouts/MainLayout";
import AIModelSelector from "@/components/AIModelSelector";
import ChatInterface from "@/components/ChatInterface";
import { AIModel, Message } from "@/types/ai";
import { sendMessageToAI } from "@/services/aiService";

const Index = () => {
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estado para armazenar chaves de API
  const [openaiKey, setOpenaiKey] = useState<string>(
    localStorage.getItem("openai_api_key") || ""
  );
  const [geminiKey, setGeminiKey] = useState<string>(
    localStorage.getItem("gemini_api_key") || ""
  );
  const [claudeKey, setClaudeKey] = useState<string>(
    localStorage.getItem("claude_api_key") || ""
  );
  const [perplexityKey, setPerplexityKey] = useState<string>(
    localStorage.getItem("perplexity_api_key") || ""
  );
  const [cohereKey, setCohereKey] = useState<string>(
    localStorage.getItem("cohere_api_key") || ""
  );

  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
    setMessages([]);
    toast({
      title: `${model.name} selecionado`,
      description: `Agora você está conversando com ${model.name}`,
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !selectedModel) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Escolhe a chave de API correta
      let apiKey = "";
      if (selectedModel.id === "gpt") {
        apiKey = openaiKey;
      } else if (selectedModel.id === "gemini") {
        apiKey = geminiKey;
      } else if (selectedModel.id === "claude") {
        apiKey = claudeKey;
      } else if (selectedModel.id === "perplexity") {
        apiKey = perplexityKey;
      } else if (selectedModel.id === "cohere") {
        apiKey = cohereKey;
      }

      // Envia a mensagem para a API
      const responseContent = await sendMessageToAI(
        selectedModel,
        [...messages, userMessage],
        apiKey
      );
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        model: selectedModel.id,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar sua mensagem",
        variant: "destructive",
      });
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeyChange = (modelId: string, apiKey: string) => {
    if (modelId === "gpt") {
      setOpenaiKey(apiKey);
      localStorage.setItem("openai_api_key", apiKey);
    } else if (modelId === "gemini") {
      setGeminiKey(apiKey);
      localStorage.setItem("gemini_api_key", apiKey);
    } else if (modelId === "claude") {
      setClaudeKey(apiKey);
      localStorage.setItem("claude_api_key", apiKey);
    } else if (modelId === "perplexity") {
      setPerplexityKey(apiKey);
      localStorage.setItem("perplexity_api_key", apiKey);
    } else if (modelId === "cohere") {
      setCohereKey(apiKey);
      localStorage.setItem("cohere_api_key", apiKey);
    }
    
    toast({
      title: "Chave de API salva",
      description: `A chave de API para ${modelId} foi salva no navegador.`,
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex flex-col md:flex-row">
          <AIModelSelector 
            selectedModel={selectedModel} 
            onSelectModel={handleModelSelect}
            onApiKeyChange={handleApiKeyChange}
            apiKeys={{
              gpt: openaiKey,
              gemini: geminiKey,
              claude: claudeKey,
              perplexity: perplexityKey,
              cohere: cohereKey
            }}
          />
          <div className="flex-1 p-4">
            <ChatInterface
              messages={messages}
              loading={loading}
              selectedModel={selectedModel}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
