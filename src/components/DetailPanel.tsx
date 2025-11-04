import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function DetailPanel({ isOpen, onClose, title, children }: DetailPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-lg z-50 animate-slide-in-right">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="p-4">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}
