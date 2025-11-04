import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CellData {
  row: number;
  col: number;
  value: string;
}

const DatabaseCanvas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(10);
  const [cells, setCells] = useState<Map<string, string>>(new Map());
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [showMapperDialog, setShowMapperDialog] = useState(false);
  const [selectedCellForTransfer, setSelectedCellForTransfer] = useState<{ row: number; col: number } | null>(null);
  const [mappers, setMappers] = useState<string[]>([]);
  const [selectedMapper, setSelectedMapper] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedData = localStorage.getItem(`database-${id}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCells(new Map(parsed.cells));
      setRows(parsed.rows);
      setCols(parsed.cols);
    }
    loadMappers();
  }, [id]);

  const loadMappers = () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('mapper-'));
    const mapperIds = keys.map(key => key.replace('mapper-', ''));
    setMappers(mapperIds);
  };

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleCellChange = (value: string) => {
    if (selectedCell) {
      const key = getCellKey(selectedCell.row, selectedCell.col);
      const newCells = new Map(cells);
      if (value) {
        newCells.set(key, value);
      } else {
        newCells.delete(key);
      }
      setCells(newCells);
    }
  };

  const handleSave = () => {
    const data = {
      cells: Array.from(cells.entries()),
      rows,
      cols,
    };
    localStorage.setItem(`database-${id}`, JSON.stringify(data));
    toast.success("Database saved successfully!");
  };

  const addRow = () => setRows(rows + 1);
  const addCol = () => setCols(cols + 1);

  const getColumnLabel = (col: number) => {
    let label = "";
    let num = col;
    while (num >= 0) {
      label = String.fromCharCode(65 + (num % 26)) + label;
      num = Math.floor(num / 26) - 1;
    }
    return label;
  };

  const handleAddToMapper = (row: number, col: number) => {
    setSelectedCellForTransfer({ row, col });
    setShowMapperDialog(true);
  };

  const confirmAddToMapper = () => {
    if (!selectedMapper || !selectedCellForTransfer) return;
    
    const cellKey = getCellKey(selectedCellForTransfer.row, selectedCellForTransfer.col);
    const value = cells.get(cellKey) || "";
    const cellRef = `${id}:${getColumnLabel(selectedCellForTransfer.col)}${selectedCellForTransfer.row + 1}`;
    
    localStorage.setItem('transferring-cell', JSON.stringify({
      database: id,
      column: getColumnLabel(selectedCellForTransfer.col),
      row: selectedCellForTransfer.row + 1,
      value,
      cellRef,
      targetMapper: selectedMapper
    }));
    
    setShowMapperDialog(false);
    setSelectedCellForTransfer(null);
    navigate(`/dashboard/mapper/${selectedMapper}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Database: {id}</h1>
          <p className="text-sm text-muted-foreground">Excel-like data storage</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addRow} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Row
          </Button>
          <Button onClick={addCol} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Column
          </Button>
          <Button onClick={handleSave} size="sm">
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </div>

      {selectedCell && (
        <div className="flex gap-2 items-center p-4 bg-card border border-border rounded-lg">
          <span className="text-sm font-medium text-foreground">
            {getColumnLabel(selectedCell.col)}{selectedCell.row + 1}:
          </span>
          <Input
            ref={inputRef}
            value={cells.get(getCellKey(selectedCell.row, selectedCell.col)) || ""}
            onChange={(e) => handleCellChange(e.target.value)}
            placeholder="Enter value..."
            className="flex-1"
          />
        </div>
      )}

      <div className="border border-border rounded-lg overflow-auto bg-card">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-muted border border-border p-2 w-12 text-xs font-semibold text-foreground">
                #
              </th>
              {Array.from({ length: cols }, (_, col) => (
                <th
                  key={col}
                  className="bg-muted border border-border p-2 min-w-[120px] text-xs font-semibold text-foreground"
                >
                  {getColumnLabel(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, row) => (
              <tr key={row}>
                <td className="sticky left-0 z-10 bg-muted border border-border p-2 text-center text-xs font-medium text-foreground">
                  {row + 1}
                </td>
                {Array.from({ length: cols }, (_, col) => {
                  const key = getCellKey(row, col);
                  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
                  const isHovered = hoveredCell?.row === row && hoveredCell?.col === col;
                  const hasValue = cells.get(key);
                  return (
                    <td
                      key={key}
                      className={`relative border border-border p-2 cursor-pointer hover:bg-accent/20 transition-colors ${
                        isSelected ? "bg-accent/30 ring-2 ring-primary" : "bg-background"
                      }`}
                      onClick={() => handleCellClick(row, col)}
                      onMouseEnter={() => setHoveredCell({ row, col })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {hasValue && isHovered && (
                        <Button
                          size="icon"
                          className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full shadow-lg animate-pulse bg-primary hover:bg-primary/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToMapper(row, col);
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      )}
                      <div className="text-sm text-foreground truncate">
                        {cells.get(key) || ""}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showMapperDialog} onOpenChange={setShowMapperDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Cell to Mapper</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Mapper Canvas</label>
              <Select value={selectedMapper} onValueChange={setSelectedMapper}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a mapper" />
                </SelectTrigger>
                <SelectContent>
                  {mappers.map((mapper) => (
                    <SelectItem key={mapper} value={mapper}>
                      {mapper}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={confirmAddToMapper} disabled={!selectedMapper} className="w-full">
              Add to Mapper
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatabaseCanvas;
