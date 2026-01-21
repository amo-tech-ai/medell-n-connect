import { Link } from "react-router-dom";
import { MoreVertical, Pencil, Trash2, Share2, Lock, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Collection } from "@/types/saved";

interface CollectionCardProps {
  collection: Collection;
  itemCount?: number;
  previewImages?: string[];
  onEdit?: (collection: Collection) => void;
  onDelete?: (collection: Collection) => void;
  onShare?: (collection: Collection) => void;
}

const colorClasses: Record<string, string> = {
  red: "bg-red-500/10 text-red-600 border-red-500/20",
  orange: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  yellow: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  green: "bg-green-500/10 text-green-600 border-green-500/20",
  blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  purple: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  pink: "bg-pink-500/10 text-pink-600 border-pink-500/20",
};

export function CollectionCard({
  collection,
  itemCount = 0,
  previewImages = [],
  onEdit,
  onDelete,
  onShare,
}: CollectionCardProps) {
  const colorClass = collection.color ? colorClasses[collection.color] : "";
  const displayCount = itemCount || collection.item_count || 0;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all">
      <Link to={`/saved?collection=${collection.id}`}>
        {/* Preview Images Grid */}
        <div className="aspect-[4/3] relative bg-muted overflow-hidden">
          {previewImages.length > 0 ? (
            <div className="grid grid-cols-2 grid-rows-2 h-full">
              {previewImages.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden"
                  style={{
                    gridColumn: i === 0 && previewImages.length < 4 ? "span 2" : undefined,
                    gridRow: i === 0 && previewImages.length < 2 ? "span 2" : undefined,
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <span className="text-5xl">{collection.emoji || "📁"}</span>
            </div>
          )}

          {/* Overlay with count */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Privacy badge */}
          <div className="absolute top-2 right-2">
            {collection.is_public ? (
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                <Globe className="w-3 h-3 mr-1" />
                Public
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                <Lock className="w-3 h-3 mr-1" />
                Private
              </Badge>
            )}
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">{collection.emoji || "📁"}</span>
              <h3 className="font-semibold truncate">{collection.name}</h3>
            </div>
            {collection.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {collection.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {displayCount} {displayCount === 1 ? "place" : "places"}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(collection)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare?.(collection)}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete?.(collection)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
