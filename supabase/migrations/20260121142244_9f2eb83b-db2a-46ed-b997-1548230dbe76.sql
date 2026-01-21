-- Step 1: Create or replace the update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Step 2: Create user_roles table for RBAC (separate from profiles)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create has_role function (core function for role checking)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- Step 4: Update is_admin to use has_role (CREATE OR REPLACE preserves dependencies)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role((SELECT auth.uid()), 'admin'::user_role) 
      OR public.has_role((SELECT auth.uid()), 'super_admin'::user_role)
$$;

-- Step 5: Update is_moderator to use has_role
CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role((SELECT auth.uid()), 'moderator'::user_role)
      OR public.has_role((SELECT auth.uid()), 'admin'::user_role)
      OR public.has_role((SELECT auth.uid()), 'super_admin'::user_role)
$$;

-- Step 6: RLS policies for user_roles table
CREATE POLICY "users_view_own_roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "admins_view_all_roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "super_admins_insert_roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role((SELECT auth.uid()), 'super_admin'::user_role));

CREATE POLICY "super_admins_update_roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role((SELECT auth.uid()), 'super_admin'::user_role))
WITH CHECK (public.has_role((SELECT auth.uid()), 'super_admin'::user_role));

CREATE POLICY "super_admins_delete_roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role((SELECT auth.uid()), 'super_admin'::user_role));

-- Step 7: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Step 8: Update trigger for updated_at
DROP TRIGGER IF EXISTS update_user_roles_updated_at ON public.user_roles;
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();