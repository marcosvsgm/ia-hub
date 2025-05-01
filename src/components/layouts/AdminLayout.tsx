
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart, Users, Home } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b bg-background/80 backdrop-blur supports-backdrop-blur:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                IA Hub
              </span>
            </Link>
            <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded">
              Admin
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Voltar ao app
            </Link>
          </nav>
        </div>
      </header>
      
      <div className="container flex flex-1 gap-6 pt-4">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r pr-6 hidden md:block">
          <nav className="flex flex-col gap-2 py-4">
            <h3 className="font-medium text-sm text-muted-foreground mb-2 pl-4">Administração</h3>
            <Link 
              to="/admin" 
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md ${isActive('/admin') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'}`}>
              <BarChart className="h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              to="/admin/users" 
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md ${isActive('/admin/users') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'}`}>
              <Users className="h-4 w-4" />
              Usuários
            </Link>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 py-4">
          <h1 className="text-2xl font-bold tracking-tight mb-6">{title}</h1>
          {children}
        </main>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-10">
        <div className="grid grid-cols-2 gap-2 p-2">
          <Link 
            to="/admin"
            className={`flex flex-col items-center justify-center p-2 rounded-md ${isActive('/admin') ? 'text-primary' : 'text-muted-foreground'}`}>
            <BarChart className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link 
            to="/admin/users"
            className={`flex flex-col items-center justify-center p-2 rounded-md ${isActive('/admin/users') ? 'text-primary' : 'text-muted-foreground'}`}>
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Usuários</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
