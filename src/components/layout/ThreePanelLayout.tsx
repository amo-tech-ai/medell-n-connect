import { ReactNode, createContext, useContext, useState } from "react";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import { MobileNav } from "./MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Context for panel state management
interface PanelContextType {
  leftCollapsed: boolean;
  setLeftCollapsed: (collapsed: boolean) => void;
  rightVisible: boolean;
  setRightVisible: (visible: boolean) => void;
  rightPanelContent: ReactNode;
  setRightPanelContent: (content: ReactNode) => void;
}

const PanelContext = createContext<PanelContextType | null>(null);

export function usePanelContext() {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error("usePanelContext must be used within ThreePanelLayout");
  }
  return context;
}

// Alias for convenience
export const usePanel = usePanelContext;

interface ThreePanelLayoutProps {
  children: ReactNode;
  rightPanelContent?: ReactNode;
  showRightPanel?: boolean;
}

export function ThreePanelLayout({
  children,
  rightPanelContent,
  showRightPanel = true,
}: ThreePanelLayoutProps) {
  const isMobile = useIsMobile();
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const [dynamicRightContent, setRightPanelContent] = useState<ReactNode>(null);

  const actualRightContent = rightPanelContent || dynamicRightContent;

  return (
    <PanelContext.Provider
      value={{
        leftCollapsed,
        setLeftCollapsed,
        rightVisible,
        setRightVisible,
        rightPanelContent: actualRightContent,
        setRightPanelContent,
      }}
    >
      <div className="min-h-screen bg-background">
        {/* Desktop/Tablet Layout */}
        <div className="hidden lg:grid lg:grid-cols-[240px_1fr_320px] min-h-screen">
          {/* Left Panel - Context/Navigation */}
          <LeftPanel />

          {/* Main Panel - Work */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

          {/* Right Panel - Intelligence */}
          {showRightPanel && (
            <RightPanel>
              {actualRightContent}
            </RightPanel>
          )}
        </div>

        {/* Tablet Layout (768px - 1023px) */}
        <div className="hidden md:flex lg:hidden min-h-screen">
          {/* Collapsible Left Panel */}
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              leftCollapsed ? "w-16" : "w-[200px]"
            )}
          >
            <LeftPanel collapsed={leftCollapsed} onToggle={() => setLeftCollapsed(!leftCollapsed)} />
          </div>

          {/* Main Panel */}
          <main className="flex-1 overflow-y-auto pb-0">
            {children}
          </main>

          {/* Right Panel as Drawer */}
          {showRightPanel && (
            <Sheet open={rightVisible} onOpenChange={setRightVisible}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="fixed right-4 bottom-4 z-40 rounded-full shadow-elevated bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Sparkles className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-0">
                <RightPanel isDrawer>
                  {actualRightContent}
                </RightPanel>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Mobile Layout (< 768px) */}
        <div className="md:hidden min-h-screen pb-20">
          {/* Main Panel - Full Screen */}
          <main className="min-h-screen">
            {children}
          </main>

          {/* Bottom Navigation (Left Panel becomes bottom nav) */}
          <MobileNav />

          {/* Right Panel as Bottom Sheet */}
          {showRightPanel && (
            <Sheet open={rightVisible} onOpenChange={setRightVisible}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="fixed right-4 bottom-24 z-40 rounded-full shadow-elevated bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Sparkles className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl p-0">
                <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-3" />
                <RightPanel isDrawer>
                  {actualRightContent}
                </RightPanel>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </PanelContext.Provider>
  );
}
