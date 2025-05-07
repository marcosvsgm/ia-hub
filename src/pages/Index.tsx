
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layouts/MainLayout";
import AIModelSelector from "@/components/AIModelSelector";
import ChatInterface from "@/components/ChatInterface";
import { AIModel, Message, ApiKeys } from "@/types/ai";
import { sendMessageToAI } from "@/services/aiService";
import { createConversation, getMessages } from "@/services/conversationService";
import { saveApiKey, getApiKeys, deleteApiKey } from "@/services/apiKeyService";

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [hasApiKeys, setHasApiKeys] = useState<ApiKeys>({});
  
  // Fetch API keys status when user is loaded
  useEffect(() => {
    const fetchApiKeys = async () => {
      if (user) {
        try {
          const keys = await getApiKeys(user.id);
          setHasApiKeys(keys);
        } catch (error) {
          console.error("Error fetching API keys", error);
        }
      }
    };
    
    fetchApiKeys();
  }, [user]);

  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
    setMessages([]);
    setCurrentConversationId(null);
    toast({
      title: `${model.name} selecionado`,
      description: `Agora você está conversando com ${model.name}`,
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !selectedModel || !user) return;

    // Add user message to the UI
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Create a new conversation if needed
      let conversationId = currentConversationId;
      if (!conversationId) {
        const newConversation = await createConversation({
          user_id: user.id,
          title: content.substring(0, 30) + (content.length > 30 ? "..." : ""),
          model_id: selectedModel.id,
          provider: selectedModel.provider
        });
        conversationId = newConversation.id;
        setCurrentConversationId(conversationId);
      }

      // Send message to AI
      const responseContent = await sendMessageToAI(
        selectedModel,
        [...messages, userMessage],
        conversationId,
        user.id
      );
      
      // Add AI response to UI
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

  const handleApiKeyChange = async (modelId: string, apiKey: string) => {
    if (!user) return;
    
    try {
      await saveApiKey(user.id, modelId, apiKey);
      setHasApiKeys(prev => ({ ...prev, [modelId]: true }));
      toast({
        title: "Chave de API salva",
        description: `A chave de API para ${modelId} foi salva com segurança.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar chave API",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar sua chave de API",
        variant: "destructive",
      });
    }
  };

  const handleDeleteApiKey = async (modelId: string) => {
    if (!user) return;
    
    try {
      await deleteApiKey(user.id, modelId);
      setHasApiKeys(prev => ({ ...prev, [modelId]: false }));
      toast({
        title: "Chave de API removida",
        description: `A chave de API para ${modelId} foi removida com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao remover chave API",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao remover sua chave de API",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex flex-col md:flex-row">
          <AIModelSelector 
            selectedModel={selectedModel} 
            onSelectModel={handleModelSelect}
            onApiKeyChange={handleApiKeyChange}
            onDeleteApiKey={handleDeleteApiKey}
            apiKeys={hasApiKeys}
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
