
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layouts/MainLayout";
import { getConversations, deleteConversation } from "@/services/conversationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Trash2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const History = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: conversations = [], refetch } = useQuery({
    queryKey: ['user-conversations', user?.id],
    queryFn: () => (user ? getConversations(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteConversation(id);
      await refetch();
      toast({
        title: "Conversa excluída",
        description: "A conversa foi excluída com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conversa.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Histórico de Conversas</h1>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar conversas..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Suas conversas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <TableRow key={conversation.id}>
                      <TableCell className="font-medium">{conversation.title}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-secondary/50 text-secondary-foreground">
                          {conversation.model_id}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(conversation.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <MessageSquare className="h-4 w-4 mr-2" /> Ver conversa
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>{conversation.title}</DialogTitle>
                                  <DialogDescription>
                                    Conversa com {conversation.model_id} em{" "}
                                    {new Date(conversation.created_at).toLocaleDateString("pt-BR")}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="max-h-[60vh] overflow-y-auto mt-4 space-y-4">
                                  {/* Messages would be loaded here */}
                                  <p className="text-center text-muted-foreground py-8">
                                    Carregando mensagens...
                                  </p>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteConversation(conversation.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Nenhuma conversa encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default History;
