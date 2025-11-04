import { useState, useCallback } from "react";
import { ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { mockControls } from "@/data/mockControls";
import { mockThreats } from "@/data/mockThreats";
import { mockVulnerabilities } from "@/data/mockVulnerabilities";
import { mockAssets } from "@/data/mockAssets";
import { mockRelationships } from "@/data/mockRelationships";
import { Badge } from "@/components/ui/badge";

export default function ControlMapper() {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Create nodes for the graph
  const initialNodes: Node[] = [
    // Controls (left column)
    ...mockControls.slice(0, 4).map((control, i) => ({
      id: control.id,
      type: "default",
      position: { x: 50, y: 100 + i * 120 },
      data: {
        label: (
          <div className="text-xs">
            <div className="font-bold">{control.id}</div>
            <div className="text-[10px] max-w-[120px] truncate">{control.name}</div>
          </div>
        ),
      },
      style: {
        background: "hsl(var(--primary))",
        color: "white",
        border: "2px solid hsl(var(--primary))",
        borderRadius: "8px",
        padding: "8px",
        fontSize: "11px",
      },
    })),
    // Threats (middle-left)
    ...mockThreats.slice(0, 4).map((threat, i) => ({
      id: threat.id,
      type: "default",
      position: { x: 300, y: 100 + i * 120 },
      data: {
        label: (
          <div className="text-xs">
            <div className="font-bold">{threat.mitreId}</div>
            <div className="text-[10px] max-w-[120px] truncate">{threat.technique}</div>
          </div>
        ),
      },
      style: {
        background: "hsl(var(--destructive))",
        color: "white",
        border: "2px solid hsl(var(--destructive))",
        borderRadius: "8px",
        padding: "8px",
        fontSize: "11px",
      },
    })),
    // Vulnerabilities (middle-right)
    ...mockVulnerabilities.slice(0, 4).map((vuln, i) => ({
      id: vuln.cveId,
      type: "default",
      position: { x: 550, y: 100 + i * 120 },
      data: {
        label: (
          <div className="text-xs">
            <div className="font-bold">{vuln.cveId}</div>
            <div className="text-[10px]">{vuln.severity}</div>
          </div>
        ),
      },
      style: {
        background: "hsl(var(--accent))",
        color: "hsl(var(--accent-foreground))",
        border: "2px solid hsl(var(--accent))",
        borderRadius: "8px",
        padding: "8px",
        fontSize: "11px",
      },
    })),
    // Assets (right column)
    ...mockAssets.slice(0, 4).map((asset, i) => ({
      id: asset.id,
      type: "default",
      position: { x: 800, y: 100 + i * 120 },
      data: {
        label: (
          <div className="text-xs">
            <div className="font-bold">{asset.id}</div>
            <div className="text-[10px] max-w-[120px] truncate">{asset.name}</div>
          </div>
        ),
      },
      style: {
        background: "hsl(var(--secondary))",
        color: "hsl(var(--secondary-foreground))",
        border: "2px solid hsl(var(--secondary))",
        borderRadius: "8px",
        padding: "8px",
        fontSize: "11px",
      },
    })),
  ];

  // Create edges based on relationships
  const initialEdges: Edge[] = mockRelationships.map((rel, i) => ({
    id: `edge-${i}`,
    source: rel.source,
    target: rel.target,
    type: "smoothstep",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "hsl(var(--muted-foreground))",
    },
    style: {
      stroke: "hsl(var(--muted-foreground))",
      strokeWidth: 2,
    },
    label: rel.type,
    labelStyle: {
      fontSize: 10,
      fill: "hsl(var(--foreground))",
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((event: any, node: Node) => {
    // Find the original data
    const control = mockControls.find((c) => c.id === node.id);
    const threat = mockThreats.find((t) => t.id === node.id);
    const vuln = mockVulnerabilities.find((v) => v.cveId === node.id);
    const asset = mockAssets.find((a) => a.id === node.id);

    setSelectedNode({
      type: control ? "control" : threat ? "threat" : vuln ? "vulnerability" : "asset",
      data: control || threat || vuln || asset,
    });
  }, []);

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Control Mapper</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              🗺️ Control Mapper
            </h1>
            <p className="text-muted-foreground mt-2">
              Visualize relationships between controls, threats, vulnerabilities, and assets
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              Controls
            </Badge>
            <Badge variant="outline" className="gap-1">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              Threats
            </Badge>
            <Badge variant="outline" className="gap-1">
              <div className="w-3 h-3 rounded-full bg-accent" />
              Vulnerabilities
            </Badge>
            <Badge variant="outline" className="gap-1">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              Assets
            </Badge>
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="h-[calc(100vh-250px)] rounded-2xl border border-border bg-card overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="fixed bottom-4 right-4 w-80 bg-card border border-border rounded-2xl p-4 shadow-lg">
          <h3 className="font-semibold text-foreground mb-2">
            {selectedNode.type === "control" && "Control Details"}
            {selectedNode.type === "threat" && "Threat Details"}
            {selectedNode.type === "vulnerability" && "Vulnerability Details"}
            {selectedNode.type === "asset" && "Asset Details"}
          </h3>
          <div className="space-y-2 text-sm">
            {selectedNode.type === "control" && (
              <>
                <div>
                  <span className="text-muted-foreground">ID:</span>{" "}
                  <span className="font-mono">{selectedNode.data.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  {selectedNode.data.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Framework:</span>{" "}
                  {selectedNode.data.framework}
                </div>
              </>
            )}
            {selectedNode.type === "threat" && (
              <>
                <div>
                  <span className="text-muted-foreground">ID:</span>{" "}
                  <span className="font-mono">{selectedNode.data.mitreId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Technique:</span>{" "}
                  {selectedNode.data.technique}
                </div>
                <div>
                  <span className="text-muted-foreground">Severity:</span>{" "}
                  {selectedNode.data.severity}
                </div>
              </>
            )}
            {selectedNode.type === "vulnerability" && (
              <>
                <div>
                  <span className="text-muted-foreground">CVE:</span>{" "}
                  <span className="font-mono">{selectedNode.data.cveId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Severity:</span>{" "}
                  {selectedNode.data.severity}
                </div>
                <div>
                  <span className="text-muted-foreground">CVSS:</span>{" "}
                  {selectedNode.data.cvssScore}
                </div>
              </>
            )}
            {selectedNode.type === "asset" && (
              <>
                <div>
                  <span className="text-muted-foreground">ID:</span>{" "}
                  <span className="font-mono">{selectedNode.data.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  {selectedNode.data.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  {selectedNode.data.type}
                </div>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={() => setSelectedNode(null)}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
