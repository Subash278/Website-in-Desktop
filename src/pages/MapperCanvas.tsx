import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface MapperCell {
  id: string;
  x: number;
  y: number;
  database: string;
  column: string;
  row: number;
  value: string;
  cellRef: string;
}

const MapperCanvas = () => {
  const { id } = useParams();
  const [cells, setCells] = useState<MapperCell[]>([]);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [draggingCell, setDraggingCell] = useState<MapperCell | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedData = localStorage.getItem(`mapper-${id}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCells(parsed.cells || []);
    }

    // Check if there's a cell being transferred
    const transferData = localStorage.getItem('transferring-cell');
    if (transferData) {
      const cellData = JSON.parse(transferData);
      if (cellData.targetMapper === id) {
        const newCell: MapperCell = {
          id: `cell-${Date.now()}`,
          x: 0,
          y: 0,
          database: cellData.database,
          column: cellData.column,
          row: cellData.row,
          value: cellData.value,
          cellRef: cellData.cellRef,
        };
        setDraggingCell(newCell);
        localStorage.removeItem('transferring-cell');
        toast.info("Click to place the cell on the canvas");
      }
    }
  }, [id]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingCell && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    if (draggingCell) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [draggingCell]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingCell && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 75; // Center the cell
      const y = e.clientY - rect.top - 40;
      
      const placedCell = {
        ...draggingCell,
        x: Math.max(0, x),
        y: Math.max(0, y),
      };
      
      setCells([...cells, placedCell]);
      setDraggingCell(null);
      toast.success("Cell placed on canvas!");
    }
  };

  const handleSave = () => {
    const data = { cells };
    localStorage.setItem(`mapper-${id}`, JSON.stringify(data));
    toast.success("Mapper saved successfully!");
  };

  const deleteCell = (cellId: string) => {
    setCells(cells.filter(c => c.id !== cellId));
    if (selectedCell === cellId) setSelectedCell(null);
    toast.success("Cell removed");
  };

  const moveCell = (cellId: string, deltaX: number, deltaY: number) => {
    setCells(cells.map(cell => 
      cell.id === cellId 
        ? { ...cell, x: Math.max(0, cell.x + deltaX), y: Math.max(0, cell.y + deltaY) }
        : cell
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mapper: {id}</h1>
          <p className="text-sm text-muted-foreground">
            {draggingCell ? "Click to place the cell" : "Visual data flow mapper"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm">
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </div>

      {selectedCell && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Selected: {cells.find(c => c.id === selectedCell)?.cellRef}
              </p>
              <p className="text-xs text-muted-foreground">
                Value: {cells.find(c => c.id === selectedCell)?.value || "No data"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const cell = cells.find(c => c.id === selectedCell);
                  if (cell) moveCell(cell.id, 0, -10);
                }}
              >
                ↑
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const cell = cells.find(c => c.id === selectedCell);
                  if (cell) moveCell(cell.id, 0, 10);
                }}
              >
                ↓
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const cell = cells.find(c => c.id === selectedCell);
                  if (cell) moveCell(cell.id, -10, 0);
                }}
              >
                ←
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const cell = cells.find(c => c.id === selectedCell);
                  if (cell) moveCell(cell.id, 10, 0);
                }}
              >
                →
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteCell(selectedCell)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card
        ref={canvasRef}
        className={`relative h-[600px] bg-gradient-to-br from-background to-muted overflow-hidden ${
          draggingCell ? "cursor-crosshair" : "cursor-default"
        }`}
        onClick={handleCanvasClick}
      >
        {cells.map(cell => (
          <div
            key={cell.id}
            className={`absolute p-3 bg-card border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
              selectedCell === cell.id ? "border-primary shadow-lg ring-2 ring-primary" : "border-border"
            }`}
            style={{
              left: `${cell.x}px`,
              top: `${cell.y}px`,
              minWidth: "150px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCell(cell.id);
            }}
          >
            <div className="text-xs font-mono text-muted-foreground mb-1">
              {cell.cellRef}
            </div>
            <div className="font-medium text-foreground">
              {cell.value || "No data"}
            </div>
          </div>
        ))}

        {draggingCell && (
          <div
            className="absolute p-3 bg-card border-2 border-primary rounded-lg shadow-2xl pointer-events-none opacity-90"
            style={{
              left: `${mousePos.x - 75}px`,
              top: `${mousePos.y - 40}px`,
              minWidth: "150px",
            }}
          >
            <div className="text-xs font-mono text-muted-foreground mb-1">
              {draggingCell.cellRef}
            </div>
            <div className="font-medium text-foreground">
              {draggingCell.value || "No data"}
            </div>
          </div>
        )}

        {cells.length === 0 && !draggingCell && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Add cells from your databases using the + button
          </div>
        )}
      </Card>
    </div>
  );
};

export default MapperCanvas;
