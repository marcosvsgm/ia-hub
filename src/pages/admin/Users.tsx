
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card } from "@/components/ui/card";
import { getUsers, updateUser, deleteUser } from "@/services/userService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import { 
  Edit, 
  Plus, 
  Search, 
  Trash2, 
  User 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Database } from "@/types/database";
import * as z from "zod";

type UserType = Database['public']['Tables']['users']['Row'];

// Form schema
const userFormSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  role: z.enum(["user", "admin"], { message: "Papel inválido" }),
  status: z.enum(["active", "inactive"], { message: "Status inválido" }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const { toast } = useToast();
  
  const { data: users = [], refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getUsers,
  });
  
  // Form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      status: "active",
    },
  });
  
  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleEditUser = (user: UserType) => {
    setCurrentUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  };
  
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      await refetch();
      toast({
        title: "Usuário removido",
        description: "O usuário foi removido com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao remover usuário",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao remover o usuário",
        variant: "destructive",
      });
    }
  };
  
  const onSubmit = async (data: UserFormValues) => {
    try {
      if (currentUser) {
        // Edit existing user
        await updateUser(currentUser.id, data);
        await refetch();
        toast({
          title: "Usuário atualizado",
          description: "As informações do usuário foram atualizadas com sucesso."
        });
      }
      
      form.reset({
        name: "",
        email: "",
        role: "user",
        status: "active",
      });
      setCurrentUser(null);
    } catch (error) {
      toast({
        title: "Erro ao atualizar usuário",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o usuário",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout title="Gerenciamento de Usuários">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuários..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              onClick={() => {
                setCurrentUser(null);
                form.reset({
                  name: "",
                  email: "",
                  role: "user",
                  status: "active",
                });
              }}
            >
              <Plus className="mr-1 h-4 w-4" /> Novo Usuário
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{currentUser ? "Editar Usuário" : "Adicionar Novo Usuário"}</SheetTitle>
              <SheetDescription>
                {currentUser 
                  ? "Edite as informações do usuário abaixo." 
                  : "Preencha os campos abaixo para criar um novo usuário."
                }
              </SheetDescription>
            </SheetHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Papel</FormLabel>
                      <FormControl>
                        <Tabs 
                          defaultValue={field.value} 
                          onValueChange={field.onChange}
                          className="w-full"
                        >
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="user">Usuário</TabsTrigger>
                            <TabsTrigger value="admin">Admin</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </FormControl>
                      <FormDescription>
                        Permissões do usuário na plataforma.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Tabs 
                          defaultValue={field.value} 
                          onValueChange={field.onChange}
                          className="w-full"
                        >
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="active">Ativo</TabsTrigger>
                            <TabsTrigger value="inactive">Inativo</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <SheetFooter className="mt-6">
                  <Button type="submit">
                    {currentUser ? "Atualizar" : "Criar"} Usuário
                  </Button>
                </SheetFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Acesso</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                      user.role === "admin" 
                        ? "bg-primary/20 text-primary" 
                        : "bg-secondary/50 text-secondary-foreground"
                    }`}>
                      {user.role === "admin" ? "Admin" : "Usuário"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      user.status === "active" 
                        ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-500" 
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {user.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.last_login ? (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="cursor-help underline decoration-dotted underline-offset-2">
                            {new Date(user.last_login).toLocaleDateString("pt-BR")}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-52">
                          Última vez que o usuário acessou a plataforma
                        </HoverCardContent>
                      </HoverCard>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar usuário</span>
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Editar Usuário</SheetTitle>
                            <SheetDescription>
                              Edite as informações do usuário abaixo.
                            </SheetDescription>
                          </SheetHeader>
                          
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Nome completo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Papel</FormLabel>
                                    <FormControl>
                                      <Tabs 
                                        defaultValue={field.value} 
                                        onValueChange={field.onChange}
                                        className="w-full"
                                      >
                                        <TabsList className="grid w-full grid-cols-2">
                                          <TabsTrigger value="user">Usuário</TabsTrigger>
                                          <TabsTrigger value="admin">Admin</TabsTrigger>
                                        </TabsList>
                                      </Tabs>
                                    </FormControl>
                                    <FormDescription>
                                      Permissões do usuário na plataforma.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                      <Tabs 
                                        defaultValue={field.value} 
                                        onValueChange={field.onChange}
                                        className="w-full"
                                      >
                                        <TabsList className="grid w-full grid-cols-2">
                                          <TabsTrigger value="active">Ativo</TabsTrigger>
                                          <TabsTrigger value="inactive">Inativo</TabsTrigger>
                                        </TabsList>
                                      </Tabs>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <SheetFooter className="mt-6">
                                <Button type="submit">
                                  Atualizar Usuário
                                </Button>
                              </SheetFooter>
                            </form>
                          </Form>
                        </SheetContent>
                      </Sheet>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir usuário</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </AdminLayout>
  );
};

export default AdminUsers;
