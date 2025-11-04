import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const Favorites = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Favorites</h1>
        <p className="text-sm text-muted-foreground">Your pinned items and quick access</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Favorite Items
          </CardTitle>
          <CardDescription>
            Star items from databases and mappers to access them quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            No favorite items yet. Start starring items to see them here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Favorites;
