import { useState } from "react";
import { Server, ChevronRight } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { DetailPanel } from "@/components/DetailPanel";
import { mockAssets, Asset } from "@/data/mockAssets";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AssetInventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [filterType, setFilterType] = useState<string>("All");

  const types = ["All", "Server", "Database", "Cloud Resource", "Network Device", "Endpoint"];

  const filteredAssets = mockAssets.filter((asset) => {
    const matchesSearch =
      asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || asset.type === filterType;
    return matchesSearch && matchesType;
  });

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
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
      case "Active":
        return "text-green-500";
      case "Inactive":
        return "text-red-500";
      case "Maintenance":
        return "text-yellow-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Asset Inventory</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Server className="h-8 w-8" />
          Asset Inventory
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and track all IT assets across your organization
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 flex-wrap">
        <SearchBar
          placeholder="Search assets..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <div className="flex gap-2 flex-wrap">
          {types.map((type) => (
            <Badge
              key={type}
              variant={filterType === type ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssets.map((asset) => (
          <Card
            key={asset.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedAsset(asset)}
          >
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span className="font-mono text-sm">{asset.id}</span>
                <Badge className={getCriticalityColor(asset.criticality)}>
                  {asset.criticality}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <h3 className="font-semibold text-foreground">{asset.name}</h3>
              <div className="flex gap-2">
                <Badge variant="secondary">{asset.type}</Badge>
                <span className={`text-sm font-semibold ${getStatusColor(asset.status)}`}>
                  {asset.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{asset.location}</p>
              <p className="text-xs text-muted-foreground">Owner: {asset.owner}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Panel */}
      <DetailPanel
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
        title="Asset Details"
      >
        {selectedAsset && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Asset ID</label>
              <p className="text-lg font-mono">{selectedAsset.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-foreground font-semibold">{selectedAsset.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <Badge variant="secondary" className="mt-1">{selectedAsset.type}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Criticality</label>
              <div className="mt-1">
                <Badge className={getCriticalityColor(selectedAsset.criticality)}>
                  {selectedAsset.criticality}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <p className={`font-semibold ${getStatusColor(selectedAsset.status)}`}>
                {selectedAsset.status}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              <p className="text-foreground">{selectedAsset.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Owner</label>
              <p className="text-foreground">{selectedAsset.owner}</p>
            </div>
          </div>
        )}
      </DetailPanel>
    </div>
  );
}
