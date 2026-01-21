import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

// Generic item type for any entity (restaurant, event, apartment, car, etc.)
export interface SelectedItem {
  type: "restaurant" | "event" | "apartment" | "car" | "destination";
  id: string;
  data: any; // Full entity data
}

interface ThreePanelContextType {
  // Right panel state
  selectedItem: SelectedItem | null;
  rightPanelOpen: boolean;
  
  // Left panel state
  leftPanelCollapsed: boolean;
  
  // View state
  viewMode: "grid" | "list" | "map";
  
  // Actions
  openDetailPanel: (item: SelectedItem) => void;
  closeDetailPanel: () => void;
  toggleLeftPanel: () => void;
  setViewMode: (mode: "grid" | "list" | "map") => void;
}

const ThreePanelContext = createContext<ThreePanelContextType | null>(null);

export function useThreePanelContext() {
  const context = useContext(ThreePanelContext);
  if (!context) {
    throw new Error("useThreePanelContext must be used within ThreePanelProvider");
  }
  return context;
}

// Alias for convenience
export const usePanel = useThreePanelContext;

interface ThreePanelProviderProps {
  children: ReactNode;
}

export function ThreePanelProvider({ children }: ThreePanelProviderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [viewMode, setViewModeState] = useState<"grid" | "list" | "map">("grid");

  // Open detail panel with URL sync
  const openDetailPanel = useCallback((item: SelectedItem) => {
    setSelectedItem(item);
    setRightPanelOpen(true);
    
    // Update URL with detail param
    const newParams = new URLSearchParams(searchParams);
    newParams.set("detail", item.id);
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Close detail panel with URL sync
  const closeDetailPanel = useCallback(() => {
    setRightPanelOpen(false);
    setSelectedItem(null);
    
    // Remove detail param from URL
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("detail");
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const toggleLeftPanel = useCallback(() => {
    setLeftPanelCollapsed((prev) => !prev);
  }, []);

  const setViewMode = useCallback((mode: "grid" | "list" | "map") => {
    setViewModeState(mode);
  }, []);

  return (
    <ThreePanelContext.Provider
      value={{
        selectedItem,
        rightPanelOpen,
        leftPanelCollapsed,
        viewMode,
        openDetailPanel,
        closeDetailPanel,
        toggleLeftPanel,
        setViewMode,
      }}
    >
      {children}
    </ThreePanelContext.Provider>
  );
}
