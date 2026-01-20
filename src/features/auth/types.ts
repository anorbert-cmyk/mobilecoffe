import { User } from '@/lib/_core/auth';

export { User };

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: Error | null;
    isAuthenticated: boolean;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
}
