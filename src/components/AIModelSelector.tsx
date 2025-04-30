
import { useState } from "react";
import { AIModel, availableModels } from "@/types/ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface AIModelSelectorProps {
  selectedModel: AIModel | null;
  onSelectModel: (model: AIModel) => void;
}

const AIModelSelector = ({ selectedModel, onSelectModel }: AIModelSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredModels = availableModels.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.capabilities.some((cap) => cap.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            onClick={() => onSelectModel(model)}
          >
            <CardHeader className="pb-2">
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
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">{model.description}</p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-1">
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
            </CardFooter>
          </Card>
        ))}

        {filteredModels.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum modelo encontrado para "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default AIModelSelector;
