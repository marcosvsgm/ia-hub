
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layouts/MainLayout";
import AIModelSelector from "@/components/AIModelSelector";
import ChatInterface from "@/components/ChatInterface";
import { AIModel, Message } from "@/types/ai";

const Index = () => {
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

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
      // Simulate AI response (in a real app, this would call an API)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const responseContent = `Esta é uma resposta simulada do ${selectedModel.name}. 
      Em uma implementação real, este seria um retorno da API do modelo selecionado.`;
      
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
        description: "Ocorreu um erro ao processar sua mensagem",
        variant: "destructive",
      });
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex flex-col md:flex-row">
          <AIModelSelector 
            selectedModel={selectedModel} 
            onSelectModel={handleModelSelect} 
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
