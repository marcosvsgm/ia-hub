
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
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
            Acesse sua conta para começar a usar IA
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Entre com seu email e senha para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-primary font-medium hover:underline"
              >
                Criar conta
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
