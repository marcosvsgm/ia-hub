
import { ReactNode } from "react";
import { Brain, History, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b bg-background/80 backdrop-blur supports-backdrop-blur:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                IA Hub
              </h1>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link 
              to="/history" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <History className="h-4 w-4" />
              Histórico
            </Link>
            <Link
              to="/help"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <HelpCircle className="h-4 w-4" />
              Ajuda
            </Link>
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
