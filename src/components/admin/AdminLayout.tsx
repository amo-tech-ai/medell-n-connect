import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminProtectedRoute } from "./AdminProtectedRoute";

interface AdminLayoutProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "moderator" | "super_admin";
}

export function AdminLayout({ children, requiredRole = "admin" }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AdminProtectedRoute requiredRole={requiredRole}>
      <div className="min-h-screen bg-background flex">
        <AdminSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AdminProtectedRoute>
  );
}
