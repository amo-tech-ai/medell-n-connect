import { ReactNode } from "react";
import { ThreePanelLayout } from "./ThreePanelLayout";

interface AppLayoutProps {
  children: ReactNode;
  showRightPanel?: boolean;
  rightPanelContent?: ReactNode;
}

/**
 * AppLayout - Main application layout wrapper
 * Uses the 3-panel system: Left (Context), Main (Work), Right (Intelligence)
 * 
 * @param children - Main panel content
 * @param showRightPanel - Whether to show the right intelligence panel (default: true)
 * @param rightPanelContent - Custom content for the right panel
 */
export function AppLayout({ 
  children, 
  showRightPanel = true,
  rightPanelContent 
}: AppLayoutProps) {
  return (
    <ThreePanelLayout 
      showRightPanel={showRightPanel}
      rightPanelContent={rightPanelContent}
    >
      {children}
    </ThreePanelLayout>
  );
}
