import { ReactNode } from "react";
import { ThreePanelLayout } from "@/components/explore/ThreePanelLayout";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * AppLayout - Main application layout wrapper
 * Uses the new 3-panel system from src/components/explore/ThreePanelLayout.tsx
 * 
 * @param children - Main panel content
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ThreePanelLayout>
      {children}
    </ThreePanelLayout>
  );
}
