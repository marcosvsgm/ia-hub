
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(email, password, name);
      if (!error) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            IA Hub
          </h1>
          <p className="text-muted-foreground mt-2">
            Crie sua conta para começar a usar IA
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para se registrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Senha deve ter pelo menos 6 caracteres
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Entrar
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
