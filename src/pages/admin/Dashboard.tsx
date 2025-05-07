
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/AdminLayout";
import { getDashboardStats } from "@/services/userService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  Area, 
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });
  
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [userModelData, setUserModelData] = useState<any[]>([]);
  const [userTimeData] = useState([
    { name: "0-5m", usuarios: 20 },
    { name: "5-15m", usuarios: 35 },
    { name: "15-30m", usuarios: 45 },
    { name: "30-60m", usuarios: 30 },
    { name: ">60m", usuarios: 15 },
  ]);
  
  useEffect(() => {
    if (stats) {
      // Format user growth data
      const growthData = Object.entries(stats.userGrowth).map(([day, count]) => ({
        day,
        users: count
      }));
      setUserGrowthData(growthData);
      
      // Format model usage data
      const modelData = stats.modelUsage.map((item: any) => ({
        model: item.model,
        usuarios: item.count
      }));
      setUserModelData(modelData);
    }
  }, [stats]);
  
  const chartConfig = {
    users: { 
      label: "Usuários", 
      theme: { light: "#9b87f5", dark: "#9b87f5" } 
    },
    usuarios: { 
      label: "Usuários", 
      theme: { light: "#9b87f5", dark: "#9b87f5" } 
    },
  };
  
  if (isLoading) {
    return <AdminLayout title="Dashboard">Carregando dados...</AdminLayout>;
  }
  
  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats && stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio por Sessão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageSessionTime || "0"} min</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Usuários</CardTitle>
            <CardDescription>Novos usuários nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={chartConfig}>
              <AreaChart data={userGrowthData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="users" name="users" stroke="#9b87f5" fill="#9b87f5" fillOpacity={0.2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tempo de Uso</CardTitle>
            <CardDescription>Distribuição de tempo médio por sessão</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={chartConfig}>
              <BarChart data={userTimeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="usuarios" name="usuarios" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Uso por Modelo de IA</CardTitle>
          <CardDescription>Distribuição de usuários por modelo</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer config={chartConfig}>
            <BarChart 
              data={userModelData} 
              layout="vertical" 
              margin={{ top: 20, right: 30, left: 50, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                dataKey="model" 
                type="category" 
                stroke="var(--muted-foreground)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="usuarios" name="usuarios" fill="#9b87f5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
