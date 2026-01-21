// This file is deprecated. Use the new 3-panel system from:
// - src/components/explore/ThreePanelLayout.tsx
// - src/context/ThreePanelContext.tsx

// Re-export from new location for backwards compatibility
export { ThreePanelLayout, useThreePanelContext, usePanel } from "@/components/explore/ThreePanelLayout";

// Legacy alias for any code still using the old usePanelContext
export const usePanelContext = () => {
  console.warn("usePanelContext is deprecated. Use useThreePanelContext instead.");
  const { useThreePanelContext } = require("@/components/explore/ThreePanelLayout");
  return useThreePanelContext();
};
