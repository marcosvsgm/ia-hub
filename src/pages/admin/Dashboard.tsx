
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  Area, 
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid, 
  Legend, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

// Mock data
const userGrowthData = [
  { day: "Seg", users: 12 },
  { day: "Ter", users: 19 },
  { day: "Qua", users: 15 },
  { day: "Qui", users: 27 },
  { day: "Sex", users: 32 },
  { day: "Sab", users: 21 },
  { day: "Dom", users: 18 },
];

const userTimeData = [
  { name: "0-5m", usuarios: 20 },
  { name: "5-15m", usuarios: 35 },
  { name: "15-30m", usuarios: 45 },
  { name: "30-60m", usuarios: 30 },
  { name: ">60m", usuarios: 15 },
];

const userModelData = [
  { model: "GPT", usuarios: 42 },
  { model: "Gemini", usuarios: 28 },
  { model: "Claude", usuarios: 18 },
  { model: "Perplexity", usuarios: 12 },
  { model: "Cohere", usuarios: 8 },
];

const AdminDashboard = () => {
  const totalUsers = 125;
  const activeUsers = 78;
  const averageSessionTime = "18.5";
  
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
  
  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activeUsers / totalUsers) * 100)}% do total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio por Sessão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageSessionTime} min</div>
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
