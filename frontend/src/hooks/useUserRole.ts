// This hook is kept only for backward compatibility.
// In the new public-only site, there is no concept of user role or admin.
// If used, it always returns a regular, non-admin user.

export type UserRole = 'regular';

export function useUserRole(): {
  userRole: UserRole;
  isAdmin: boolean;
  isRegular: boolean;
  loading: boolean;
} {
  return {
    userRole: 'regular',
    isAdmin: false,
    isRegular: true,
    loading: false,
  };
}
