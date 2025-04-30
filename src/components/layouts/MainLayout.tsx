
import { ReactNode } from "react";
import { Brain } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b bg-background/80 backdrop-blur supports-backdrop-blur:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              IA Hub
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <a 
              href="#" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Histórico
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Ajuda
            </a>
          </nav>
        </div>
      </header>
      <main className="container flex-1">
        {children}
      </main>
      <footer className="border-t py-4">
        <div className="container flex items-center justify-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} IA Hub - Plataforma Generativa
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
