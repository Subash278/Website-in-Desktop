import { useState } from "react";
import { Bug, ChevronRight, RefreshCw } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { DetailPanel } from "@/components/DetailPanel";
import { mockVulnerabilities, Vulnerability } from "@/data/mockVulnerabilities";
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

export default function Vulnerabilities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(mockVulnerabilities);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const statuses = ["All", "Open", "Mitigated", "Patched"];

  const fetchVulnerabilities = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-nvd-cves');
      
      if (error) throw error;
      
      if (data?.vulnerabilities) {
        setVulnerabilities(data.vulnerabilities);
        toast({
          title: "Data synced successfully",
          description: `Fetched ${data.vulnerabilities.length} vulnerabilities from NVD`,
        });
      }
    } catch (error) {
      console.error('Error fetching vulnerabilities:', error);
      toast({
        title: "Sync failed",
        description: "Failed to fetch data from NVD",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVulns = vulnerabilities.filter((vuln) => {
    const matchesSearch =
      vuln.cveId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.affectedProduct.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || vuln.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-blue-500";
      default:
        return "bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "text-red-500";
      case "Mitigated":
        return "text-yellow-500";
      case "Patched":
        return "text-green-500";
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
            <span className="text-foreground">Vulnerabilities</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bug className="h-8 w-8" />
            Vulnerabilities
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and manage CVE vulnerabilities across your infrastructure
          </p>
        </div>
        <Button 
          onClick={fetchVulnerabilities} 
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
          placeholder="Search vulnerabilities..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <div className="flex gap-2">
          {statuses.map((status) => (
            <Badge
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </Badge>
          ))}
        </div>
      </div>

      {/* Vulnerabilities Table */}
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CVE ID</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>CVSS</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Affected Product</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVulns.map((vuln) => (
              <TableRow
                key={vuln.id}
                className="cursor-pointer"
                onClick={() => setSelectedVuln(vuln)}
              >
                <TableCell className="font-mono font-semibold">{vuln.cveId}</TableCell>
                <TableCell>
                  <Badge className={getSeverityColor(vuln.severity)}>
                    {vuln.severity}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">{vuln.cvssScore}</TableCell>
                <TableCell>
                  <span className={`font-semibold ${getStatusColor(vuln.status)}`}>
                    {vuln.status}
                  </span>
                </TableCell>
                <TableCell>{vuln.affectedProduct}</TableCell>
                <TableCell className="max-w-md truncate">{vuln.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Panel */}
      <DetailPanel
        isOpen={!!selectedVuln}
        onClose={() => setSelectedVuln(null)}
        title="Vulnerability Details"
      >
        {selectedVuln && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">CVE ID</label>
              <p className="text-lg font-mono font-semibold">{selectedVuln.cveId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Severity</label>
              <div className="mt-1">
                <Badge className={getSeverityColor(selectedVuln.severity)}>
                  {selectedVuln.severity}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">CVSS Score</label>
              <p className="text-foreground font-semibold">{selectedVuln.cvssScore}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <p className={`font-semibold ${getStatusColor(selectedVuln.status)}`}>
                {selectedVuln.status}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Affected Product</label>
              <p className="text-foreground">{selectedVuln.affectedProduct}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-foreground mt-1">{selectedVuln.description}</p>
            </div>
          </div>
        )}
      </DetailPanel>
    </div>
  );
}
