
import { useState } from "react";
import { AIModel, availableModels } from "@/types/ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Settings, Key } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApiKeys {
  gpt?: string;
  gemini?: string;
  [key: string]: string | undefined;
}

interface AIModelSelectorProps {
  selectedModel: AIModel | null;
  onSelectModel: (model: AIModel) => void;
  onApiKeyChange?: (modelId: string, apiKey: string) => void;
  apiKeys?: ApiKeys;
}

const AIModelSelector = ({ 
  selectedModel, 
  onSelectModel, 
  onApiKeyChange,
  apiKeys = {}
}: AIModelSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [apiDialogOpen, setApiDialogOpen] = useState(false);
  const [currentModelId, setCurrentModelId] = useState<string>("");
  const [apiKeyInput, setApiKeyInput] = useState<string>("");

  const filteredModels = availableModels.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.capabilities.some((cap) => cap.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenApiDialog = (modelId: string) => {
    setCurrentModelId(modelId);
    setApiKeyInput(apiKeys[modelId] || "");
    setApiDialogOpen(true);
  };

  const handleSaveApiKey = () => {
    if (onApiKeyChange && currentModelId) {
      onApiKeyChange(currentModelId, apiKeyInput);
      setApiDialogOpen(false);
    }
  };

  return (
    <div className="w-full md:w-[350px] p-4 border-r border-border">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Modelos de IA</h2>
        <p className="text-muted-foreground mb-4">
          Selecione um modelo para começar a conversar
        </p>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar modelos..."
            className="w-full pl-10 py-2 bg-background border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredModels.map((model) => (
          <Card
            key={model.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedModel?.id === model.id
                ? "border-primary ring-1 ring-primary"
                : ""
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
                    <img
                      src={model.avatar}
                      alt={`${model.name} logo`}
                      className="h-8 w-8 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/80x80?text=" + model.name.charAt(0);
                      }}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-base">{model.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {model.provider}
                    </CardDescription>
                  </div>
                </div>
                
                {/* Apenas mostra ícone de chave para modelos que requerem API key */}
                {(model.id === "gpt" || model.id === "gemini") && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenApiDialog(model.id);
                    }}
                  >
                    <Key className={`h-4 w-4 ${apiKeys[model.id] ? "text-green-500" : "text-muted-foreground"}`} />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">{model.description}</p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-1 justify-between">
              <div className="flex flex-wrap gap-1">
                {model.capabilities.slice(0, 3).map((capability) => (
                  <Badge key={capability} variant="secondary" className="text-xs">
                    {capability}
                  </Badge>
                ))}
                {model.capabilities.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{model.capabilities.length - 3}
                  </Badge>
                )}
              </div>
              
              <Button 
                variant="secondary" 
                size="sm" 
                className="ml-auto" 
                onClick={() => onSelectModel(model)}
              >
                Selecionar
              </Button>
            </CardFooter>
          </Card>
        ))}

        {filteredModels.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum modelo encontrado para "{searchTerm}"
          </div>
        )}
      </div>

      <Dialog open={apiDialogOpen} onOpenChange={setApiDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configurar API Key</DialogTitle>
            <DialogDescription>
              Insira sua chave de API para conectar ao modelo de IA. 
              A chave será armazenada apenas no seu navegador.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setApiDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSaveApiKey}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIModelSelector;
