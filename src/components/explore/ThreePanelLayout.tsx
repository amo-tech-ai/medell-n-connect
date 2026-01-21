import { ReactNode, useEffect, useState } from "react";
import { ThreePanelProvider, useThreePanelContext } from "@/context/ThreePanelContext";
import { LeftPanel } from "@/components/layout/LeftPanel";
import { MobileNav } from "@/components/layout/MobileNav";
import { RightDetailPanel } from "./RightDetailPanel";
import { cn } from "@/lib/utils";

// Desktop breakpoint detection
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isDesktop;
}

// Tablet breakpoint detection
function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isTablet;
}

interface ThreePanelLayoutInnerProps {
  children: ReactNode;
}

function ThreePanelLayoutInner({ children }: ThreePanelLayoutInnerProps) {
  const isDesktop = useIsDesktop();
  const isTablet = useIsTablet();
  const { leftPanelCollapsed, rightPanelOpen, toggleLeftPanel } = useThreePanelContext();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout (≥1024px) */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Panel - Fixed 280px */}
        <div className="w-[280px] flex-shrink-0">
          <LeftPanel />
        </div>

        {/* Center Panel - Flexible width */}
        <main 
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300",
            rightPanelOpen && "mr-[500px]"
          )}
        >
          {children}
        </main>

        {/* Right Panel - Slides in from right */}
        <RightDetailPanel />
      </div>

      {/* Tablet Layout (768px - 1023px) */}
      <div className="hidden md:flex lg:hidden min-h-screen">
        {/* Collapsible Left Panel */}
        <div
          className={cn(
            "flex-shrink-0 transition-all duration-300",
            leftPanelCollapsed ? "w-16" : "w-[200px]"
          )}
        >
          <LeftPanel collapsed={leftPanelCollapsed} onToggle={toggleLeftPanel} />
        </div>

        {/* Center Panel - Full remaining width */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Right Panel - Overlay */}
        <RightDetailPanel />
      </div>

      {/* Mobile Layout (< 768px) */}
      <div className="md:hidden min-h-screen pb-20">
        {/* Center Panel - Full width */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Bottom Navigation */}
        <MobileNav />

        {/* Right Panel - Full screen overlay */}
        <RightDetailPanel />
      </div>
    </div>
  );
}

interface ThreePanelLayoutProps {
  children: ReactNode;
}

export function ThreePanelLayout({ children }: ThreePanelLayoutProps) {
  return (
    <ThreePanelProvider>
      <ThreePanelLayoutInner>{children}</ThreePanelLayoutInner>
    </ThreePanelProvider>
  );
}

// Re-export context hook for convenience
export { useThreePanelContext, usePanel } from "@/context/ThreePanelContext";
