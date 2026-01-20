import { useAuth as useAuthFeature } from '@/src/features/auth';

/**
 * @deprecated Use useAuth from @features/auth instead.
 * This hook is a compatibility wrapper around the global AuthProvider.
 * Options are ignored as auth state is now global.
 */
export function useAuth(options?: any) {
  return useAuthFeature();
}
