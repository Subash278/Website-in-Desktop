import { useState } from "react";
import { Shield, CheckCircle, XCircle, ChevronRight, RefreshCw } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { DetailPanel } from "@/components/DetailPanel";
import { mockControls, Control } from "@/data/mockControls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ControlsCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [filterFramework, setFilterFramework] = useState<string>("All");
  const [controls, setControls] = useState<Control[]>(mockControls);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const frameworks = ["All", "NIST CSF", "CIS Controls"];

  const fetchControls = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-cis-controls');
      
      if (error) throw error;
      
      if (data?.controls) {
        setControls(data.controls);
        toast({
          title: "Data synced successfully",
          description: `Fetched ${data.controls.length} controls from NIST and CIS`,
        });
      }
    } catch (error) {
      console.error('Error fetching controls:', error);
      toast({
        title: "Sync failed",
        description: "Failed to fetch data from control frameworks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredControls = controls.filter((control) => {
    const matchesSearch =
      control.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFramework =
      filterFramework === "All" || control.framework === filterFramework;
    return matchesSearch && matchesFramework;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Controls Catalog</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Controls Catalog
          </h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage security controls from multiple frameworks
          </p>
        </div>
        <Button 
          onClick={fetchControls} 
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
          placeholder="Search controls..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <div className="flex gap-2">
          {frameworks.map((framework) => (
            <Badge
              key={framework}
              variant={filterFramework === framework ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterFramework(framework)}
            >
              {framework}
            </Badge>
          ))}
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredControls.map((control) => (
          <Card
            key={control.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedControl(control)}
          >
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span className="font-mono text-sm">{control.id}</span>
                {control.implemented ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <h3 className="font-semibold text-foreground">{control.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {control.description}
              </p>
              <div className="flex gap-2 pt-2">
                <Badge variant="secondary">{control.framework}</Badge>
                <Badge variant="outline">{control.category}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Panel */}
      <DetailPanel
        isOpen={!!selectedControl}
        onClose={() => setSelectedControl(null)}
        title="Control Details"
      >
        {selectedControl && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Control ID</label>
              <p className="text-lg font-mono">{selectedControl.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-foreground">{selectedControl.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-foreground">{selectedControl.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Framework</label>
              <p className="text-foreground">{selectedControl.framework}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <p className="text-foreground">{selectedControl.category}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="flex items-center gap-2 mt-1">
                {selectedControl.implemented ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-500">Implemented</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Not Implemented</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </DetailPanel>
    </div>
  );
}
