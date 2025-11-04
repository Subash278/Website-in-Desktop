import { useState, useEffect } from "react";
import { AlertTriangle, ChevronRight, RefreshCw } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { DetailPanel } from "@/components/DetailPanel";
import { mockThreats, Threat } from "@/data/mockThreats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ThreatsAndTechniques() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("All");
  const [threats, setThreats] = useState<Threat[]>(mockThreats);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const severities = ["All", "Low", "Medium", "High", "Critical"];

  const fetchThreats = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-mitre-attack');
      
      if (error) throw error;
      
      if (data?.techniques) {
        setThreats(data.techniques);
        toast({
          title: "Data synced successfully",
          description: `Fetched ${data.techniques.length} threats from MITRE ATT&CK`,
        });
      }
    } catch (error) {
      console.error('Error fetching threats:', error);
      toast({
        title: "Sync failed",
        description: "Failed to fetch data from MITRE ATT&CK",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredThreats = threats.filter((threat) => {
    const matchesSearch =
      threat.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.technique.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.tactic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      filterSeverity === "All" || threat.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-red-500";
      case "High":
        return "text-orange-500";
      case "Medium":
        return "text-yellow-500";
      case "Low":
        return "text-blue-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Threats & Techniques</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-8 w-8" />
            Threats & Techniques
          </h1>
          <p className="text-muted-foreground mt-2">
            MITRE ATT&CK framework threats and attack techniques
          </p>
        </div>
        <Button 
          onClick={fetchThreats} 
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Sync Data
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 flex-wrap">
        <SearchBar
          placeholder="Search threats..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <div className="flex gap-2">
          {severities.map((severity) => (
            <Badge
              key={severity}
              variant={filterSeverity === severity ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterSeverity(severity)}
            >
              {severity}
            </Badge>
          ))}
        </div>
      </div>

      {/* Threats Table */}
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Technique</TableHead>
              <TableHead>Tactic</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredThreats.map((threat) => (
              <TableRow
                key={threat.id}
                className="cursor-pointer"
                onClick={() => setSelectedThreat(threat)}
              >
                <TableCell className="font-mono">{threat.mitreId}</TableCell>
                <TableCell className="font-semibold">{threat.technique}</TableCell>
                <TableCell>
                  <Badge variant="outline">{threat.tactic}</Badge>
                </TableCell>
                <TableCell>
                  <span className={`font-semibold ${getSeverityColor(threat.severity)}`}>
                    {threat.severity}
                  </span>
                </TableCell>
                <TableCell className="max-w-md truncate">
                  {threat.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Panel */}
      <DetailPanel
        isOpen={!!selectedThreat}
        onClose={() => setSelectedThreat(null)}
        title="Threat Details"
      >
        {selectedThreat && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">MITRE ATT&CK ID</label>
              <p className="text-lg font-mono">{selectedThreat.mitreId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Technique</label>
              <p className="text-foreground font-semibold">{selectedThreat.technique}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tactic</label>
              <Badge variant="outline" className="mt-1">{selectedThreat.tactic}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Severity</label>
              <p className={`font-semibold ${getSeverityColor(selectedThreat.severity)}`}>
                {selectedThreat.severity}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-foreground mt-1">{selectedThreat.description}</p>
            </div>
          </div>
        )}
      </DetailPanel>
    </div>
  );
}
