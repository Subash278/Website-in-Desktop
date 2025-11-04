import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

export const DashboardHeader = () => {
  const role = localStorage.getItem("userRole") || "user";
  const username = localStorage.getItem("username") || "User";

  const getRoleBadgeVariant = () => {
    switch (role) {
      case "super-admin":
        return "destructive";
      case "admin":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h2 className="text-lg font-semibold text-foreground">IT Compliance Framework</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{username}</p>
          <Badge variant={getRoleBadgeVariant()} className="text-xs capitalize">
            {role}
          </Badge>
        </div>
      </div>
    </header>
  );
};
