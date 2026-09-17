import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "./types";
import { login as loginApi, me } from "./api/client";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("qa-token");
    if (!token) {
      setLoading(false);
      return;
    }
    me()
      .then(setUser)
      .catch(() => localStorage.removeItem("qa-token"))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      login: async (email, password) => {
        const result = await loginApi(email, password);
        localStorage.setItem("qa-token", result.token);
        setUser(result.user);
      },
      logout: () => {
        localStorage.removeItem("qa-token");
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider missing");
  return ctx;
}
