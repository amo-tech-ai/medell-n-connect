import { Sparkles, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { CollectionSuggestion } from "@/hooks/useCollectionSuggestions";

interface CollectionSuggestionsProps {
  suggestions: CollectionSuggestion[];
  onCreateCollection: (suggestion: CollectionSuggestion) => void;
  onDismiss: (suggestion: CollectionSuggestion) => void;
  isCreating?: boolean;
}

export function CollectionSuggestions({
  suggestions,
  onCreateCollection,
  onDismiss,
  isCreating,
}: CollectionSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          AI Collection Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 pb-2">
            {suggestions.map((suggestion, index) => (
              <Card
                key={index}
                className="flex-shrink-0 w-[280px] bg-card hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: suggestion.color + '20' }}
                      >
                        {suggestion.emoji}
                      </span>
                      <div>
                        <h4 className="font-medium text-sm">{suggestion.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {suggestion.placeIds.length} places
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 -mt-1 -mr-1"
                      onClick={() => onDismiss(suggestion)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 whitespace-normal">
                    {suggestion.description}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="secondary" className="text-[10px]">
                      {Math.round(suggestion.confidence * 100)}% match
                    </Badge>
                    <Button
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => onCreateCollection(suggestion)}
                      disabled={isCreating}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Create
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
