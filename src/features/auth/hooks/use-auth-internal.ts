import * as Api from "@/lib/_core/api";
import * as Auth from "@/lib/_core/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { AuthContextType } from "../types";

type UseAuthOptions = {
    autoFetch?: boolean;
};

export function useAuthInternal(options?: UseAuthOptions): AuthContextType {
    const { autoFetch = true } = options ?? {};
    const [user, setUser] = useState<Auth.User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Web: use cookie-based auth
            if (Platform.OS === "web") {
                const apiUser = await Api.getMe();
                if (apiUser) {
                    const userInfo: Auth.User = {
                        id: apiUser.id,
                        openId: apiUser.openId,
                        name: apiUser.name,
                        email: apiUser.email,
                        loginMethod: apiUser.loginMethod,
                        lastSignedIn: new Date(apiUser.lastSignedIn),
                    };
                    setUser(userInfo);
                    await Auth.setUserInfo(userInfo);
                } else {
                    setUser(null);
                    await Auth.clearUserInfo();
                }
                return;
            }

            // Native: check session token
            const sessionToken = await Auth.getSessionToken();
            if (!sessionToken) {
                setUser(null);
                return;
            }

            // Try cached user first
            const cachedUser = await Auth.getUserInfo();
            if (cachedUser) {
                setUser(cachedUser);
            }

            // Verify/Refresh logic could go here for native (TODO: Implement token verification API)

        } catch (err) {
            const error = err instanceof Error ? err : new Error("Failed to fetch user");
            console.error("[Auth] fetchUser error:", error);
            setError(error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await Api.logout();
        } catch (err) {
            console.error("[Auth] Logout API call failed:", err);
        } finally {
            await Auth.removeSessionToken();
            await Auth.clearUserInfo();
            setUser(null);
            setError(null);
        }
    }, []);

    const isAuthenticated = useMemo(() => Boolean(user), [user]);

    useEffect(() => {
        if (autoFetch) {
            if (Platform.OS === "web") {
                fetchUser();
            } else {
                // Native optimization: check cache first then fetch? Logic is inside fetchUser now.
                fetchUser();
            }
        } else {
            setLoading(false);
        }
    }, [autoFetch, fetchUser]);

    return {
        user,
        loading,
        error,
        isAuthenticated,
        refresh: fetchUser,
        logout,
    };
}
