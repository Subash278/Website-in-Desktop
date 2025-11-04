import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Database as DatabaseIcon,
  Network,
  Star,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Shield,
  AlertTriangle,
  Bug,
  Server,
  Map,
  BarChart3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const mainItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Favorites", url: "/dashboard/favorites", icon: Star },
];

const securityItems = [
  { title: "Controls Catalog", url: "/dashboard/controls", icon: Shield },
  { title: "Threats & Techniques", url: "/dashboard/threats", icon: AlertTriangle },
  { title: "Vulnerabilities", url: "/dashboard/vulnerabilities", icon: Bug },
  { title: "Asset Inventory", url: "/dashboard/assets", icon: Server },
  { title: "Control Mapper", url: "/dashboard/control-mapper", icon: Map },
  { title: "Compliance Dashboard", url: "/dashboard/compliance", icon: BarChart3 },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const [databases, setDatabases] = useState<string[]>([]);
  const [mappers, setMappers] = useState<string[]>([]);
  const [renamingDb, setRenamingDb] = useState<string | null>(null);
  const [renamingMapper, setRenamingMapper] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    loadDatabases();
    loadMappers();
  }, []);

  const loadDatabases = () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('database-'));
    setDatabases(keys.map(key => key.replace('database-', '')));
  };

  const loadMappers = () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('mapper-'));
    setMappers(keys.map(key => key.replace('mapper-', '')));
  };

  const handleAddDatabase = () => {
    const newDbId = `db-${Date.now()}`;
    const emptyData = { cells: [], rows: 20, cols: 10 };
    localStorage.setItem(`database-${newDbId}`, JSON.stringify(emptyData));
    loadDatabases();
    navigate(`/dashboard/database/${newDbId}`);
    toast.success("New database created!");
  };

  const handleAddMapper = () => {
    const newMapperId = `map-${Date.now()}`;
    const emptyData = { cells: [] };
    localStorage.setItem(`mapper-${newMapperId}`, JSON.stringify(emptyData));
    loadMappers();
    navigate(`/dashboard/mapper/${newMapperId}`);
    toast.success("New mapper created!");
  };

  const renameDatabase = (oldId: string, newId: string) => {
    if (!newId || newId === oldId) {
      setRenamingDb(null);
      return;
    }
    if (databases.includes(newId)) {
      toast.error("Database name already exists!");
      return;
    }
    const data = localStorage.getItem(`database-${oldId}`);
    if (data) {
      localStorage.setItem(`database-${newId}`, data);
      localStorage.removeItem(`database-${oldId}`);
      loadDatabases();
      toast.success("Database renamed!");
      navigate(`/dashboard/database/${newId}`);
    }
    setRenamingDb(null);
    setNewName("");
  };

  const renameMapper = (oldId: string, newId: string) => {
    if (!newId || newId === oldId) {
      setRenamingMapper(null);
      return;
    }
    if (mappers.includes(newId)) {
      toast.error("Mapper name already exists!");
      return;
    }
    const data = localStorage.getItem(`mapper-${oldId}`);
    if (data) {
      localStorage.setItem(`mapper-${newId}`, data);
      localStorage.removeItem(`mapper-${oldId}`);
      loadMappers();
      toast.success("Mapper renamed!");
      navigate(`/dashboard/mapper/${newId}`);
    }
    setRenamingMapper(null);
    setNewName("");
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const role = localStorage.getItem("userRole") || "user";

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-sidebar-primary to-accent rounded flex items-center justify-center">
            <span className="text-xs font-bold text-white">SI</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground">SecureIT</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{role}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={({ isActive }) =>
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    }>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Security Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Security & Compliance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {securityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={({ isActive }) =>
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    }>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Database Section */}
        <SidebarGroup>
          <div className="flex items-center justify-between px-2">
            <SidebarGroupLabel>Database</SidebarGroupLabel>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleAddDatabase}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {databases.map((dbId) => (
                <SidebarMenuItem key={dbId}>
                  {renamingDb === dbId ? (
                    <div className="flex items-center gap-1 px-2 py-1">
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={() => renameDatabase(dbId, newName)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') renameDatabase(dbId, newName);
                          if (e.key === 'Escape') { setRenamingDb(null); setNewName(""); }
                        }}
                        autoFocus
                        className="h-7 text-xs"
                      />
                    </div>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink to={`/dashboard/database/${dbId}`} className={({ isActive }) =>
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground group" : "group"
                      }>
                        <DatabaseIcon className="h-4 w-4" />
                        <span className="flex-1">{dbId}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            setRenamingDb(dbId);
                            setNewName(dbId);
                          }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Mapper Section */}
        <SidebarGroup>
          <div className="flex items-center justify-between px-2">
            <SidebarGroupLabel>Mappers</SidebarGroupLabel>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleAddMapper}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {mappers.map((mapperId) => (
                <SidebarMenuItem key={mapperId}>
                  {renamingMapper === mapperId ? (
                    <div className="flex items-center gap-1 px-2 py-1">
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={() => renameMapper(mapperId, newName)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') renameMapper(mapperId, newName);
                          if (e.key === 'Escape') { setRenamingMapper(null); setNewName(""); }
                        }}
                        autoFocus
                        className="h-7 text-xs"
                      />
                    </div>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink to={`/dashboard/mapper/${mapperId}`} className={({ isActive }) =>
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground group" : "group"
                      }>
                        <Network className="h-4 w-4" />
                        <span className="flex-1">{mapperId}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            setRenamingMapper(mapperId);
                            setNewName(mapperId);
                          }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/dashboard/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
