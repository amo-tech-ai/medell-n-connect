import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import { MobileNav } from "./MobileNav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
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

// Custom hook to detect if we're on desktop (lg breakpoint)
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return isDesktop;
}

// Custom hook to detect if we're on tablet (md to lg)
function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkTablet();
    window.addEventListener("resize", checkTablet);
    return () => window.removeEventListener("resize", checkTablet);
  }, []);

  return isTablet;
}

export function ThreePanelLayout({
  children,
  rightPanelContent,
  showRightPanel = true,
}: ThreePanelLayoutProps) {
  const isDesktop = useIsDesktop();
  const isTablet = useIsTablet();
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const [dynamicRightContent, setRightPanelContent] = useState<ReactNode>(null);

  // When content changes from a card click, automatically open the drawer/bottom-sheet
  // on tablet/mobile so the user immediately sees the right panel.
  // On desktop, the right panel is always visible so no need to "open" anything.
  const setRightPanelContentAndOpen = (content: ReactNode) => {
    setRightPanelContent(content);
    // Only auto-open Sheet on non-desktop (tablet/mobile)
    if (showRightPanel && !isDesktop) {
      setRightVisible(true);
    }
  };

  const actualRightContent = rightPanelContent || dynamicRightContent;

  return (
    <PanelContext.Provider
      value={{
        leftCollapsed,
        setLeftCollapsed,
        rightVisible,
        setRightVisible,
        rightPanelContent: actualRightContent,
        setRightPanelContent: setRightPanelContentAndOpen,
      }}
    >
      <div className="min-h-screen bg-background">
        {/* Desktop Layout (≥1024px) - Full 3-panel grid */}
        <div className="hidden lg:grid lg:grid-cols-[240px_1fr_320px] min-h-screen">
          {/* Left Panel - Context/Navigation */}
          <LeftPanel />

          {/* Main Panel - Work */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

          {/* Right Panel - Intelligence (always visible on desktop) */}
          {showRightPanel ? (
            <RightPanel>
              {actualRightContent}
            </RightPanel>
          ) : (
            <div /> 
          )}
        </div>

        {/* Tablet Layout (768px - 1023px) - 2 columns + Sheet drawer */}
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

          {/* Main Panel - takes full remaining width */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

          {/* NO right panel column here - uses Sheet instead */}
        </div>

        {/* Mobile Layout (< 768px) - Single column + bottom nav */}
        <div className="md:hidden min-h-screen pb-20">
          {/* Main Panel - Full Screen */}
          <main className="min-h-screen">
            {children}
          </main>

          {/* Bottom Navigation (Left Panel becomes bottom nav) */}
          <MobileNav />

          {/* NO right panel column here - uses Sheet instead */}
        </div>

        {/* 
          Sheet/Drawer for tablet and mobile ONLY
          Rendered conditionally based on JS to prevent portal content 
          from appearing on desktop even when CSS hides the trigger 
        */}
        {showRightPanel && !isDesktop && (
          <Sheet open={rightVisible} onOpenChange={setRightVisible}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className={cn(
                  "fixed z-40 rounded-full shadow-elevated bg-primary text-primary-foreground hover:bg-primary/90",
                  isTablet ? "right-4 bottom-4" : "right-4 bottom-24"
                )}
              >
                <Sparkles className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side={isTablet ? "right" : "bottom"} 
              className={cn(
                "p-0",
                isTablet ? "w-[320px]" : "h-[70vh] rounded-t-3xl"
              )}
            >
              {!isTablet && (
                <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-3" />
              )}
              <RightPanel isDrawer>
                {actualRightContent}
              </RightPanel>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </PanelContext.Provider>
  );
}
