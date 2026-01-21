import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2 } from "lucide-react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "moderator" | "super_admin";
}

export function AdminProtectedRoute({ 
  children, 
  requiredRole = "admin" 
}: AdminProtectedRouteProps) {
  const { user, loading, isAdmin, isModerator, isSuperAdmin } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  let hasAccess = false;
  switch (requiredRole) {
    case "super_admin":
      hasAccess = isSuperAdmin;
      break;
    case "admin":
      hasAccess = isAdmin;
      break;
    case "moderator":
      hasAccess = isModerator;
      break;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-display font-semibold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin dashboard. 
            Please contact a super admin if you believe this is an error.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
