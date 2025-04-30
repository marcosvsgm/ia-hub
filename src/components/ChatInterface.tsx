
import { useState, useRef, useEffect } from "react";
import { Message, AIModel } from "@/types/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import { format } from "date-fns";

interface ChatInterfaceProps {
  messages: Message[];
  loading: boolean;
  selectedModel: AIModel | null;
  onSendMessage: (content: string) => void;
}

const ChatInterface = ({
  messages,
  loading,
  selectedModel,
  onSendMessage,
}: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput("");
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedModel) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-gradient-radial from-primary/20 to-transparent p-6 rounded-full mx-auto mb-4 w-20 h-20 flex items-center justify-center">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Escolha um modelo para começar</h2>
          <p className="text-muted-foreground">
            Selecione um dos modelos de IA disponíveis na barra lateral para iniciar uma conversa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b">
        <div className="h-8 w-8 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
          <img
            src={selectedModel.avatar}
            alt={selectedModel.name}
            className="h-6 w-6 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/80x80?text=" + selectedModel.name.charAt(0);
            }}
          />
        </div>
        <div>
          <h2 className="font-medium">{selectedModel.name}</h2>
          <p className="text-xs text-muted-foreground">{selectedModel.provider}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              Envie uma mensagem para começar a conversa com {selectedModel.name}
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 message-fade-in ${
              message.role === "user" ? "justify-end" : ""
            }`}
          >
            {message.role === "assistant" && (
              <div className="h-8 w-8 rounded-full overflow-hidden bg-secondary flex-shrink-0 flex items-center justify-center">
                <Bot className="h-4 w-4 text-foreground" />
              </div>
            )}

            <Card
              className={`max-w-[80%] ${
                message.role === "user" ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              <CardContent className="p-3">
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.role === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {format(message.timestamp, "HH:mm")}
                </div>
              </CardContent>
            </Card>

            {message.role === "user" && (
              <div className="h-8 w-8 rounded-full overflow-hidden bg-primary flex-shrink-0 flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-secondary flex-shrink-0 flex items-center justify-center">
              <Bot className="h-4 w-4 text-foreground animate-pulse" />
            </div>
            <Card>
              <CardContent className="p-3">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Envie uma mensagem para ${selectedModel.name}...`}
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={loading}
          />
          <Button
            type="submit"
            size="icon"
            className="h-[60px] w-[60px]"
            disabled={!input.trim() || loading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
