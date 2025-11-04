import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Network, FileText, CheckCircle } from "lucide-react";

const DashboardHome = () => {
  const role = localStorage.getItem("userRole") || "user";

  const stats = [
    {
      title: "Active Projects",
      value: "12",
      icon: FileText,
      description: "Ongoing compliance projects",
    },
    {
      title: "Databases",
      value: "5",
      icon: Database,
      description: "Knowledge databases",
    },
    {
      title: "Mappers",
      value: "8",
      icon: Network,
      description: "Active flow diagrams",
    },
    {
      title: "Compliance Rate",
      value: "94%",
      icon: CheckCircle,
      description: "Overall compliance status",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
        <p className="text-muted-foreground mt-1">
          IT Network & Security Framework Dashboard
        </p>
      </div>

      {role === "super-admin" && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="text-primary">Super Admin Access</CardTitle>
            <CardDescription>
              You have full system access including code modifications
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with your compliance framework
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer">
            <Database className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold text-foreground">Create Database</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Store and organize your compliance data
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer">
            <Network className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold text-foreground">Build Mapper</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create visual flow diagrams
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer">
            <FileText className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold text-foreground">Generate Report</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Export compliance documentation
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
