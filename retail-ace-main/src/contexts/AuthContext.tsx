import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/services/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("rp_token") || window.localStorage.getItem("token");
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = typeof window !== "undefined"
      ? window.localStorage.getItem("rp_token") || window.localStorage.getItem("token")
      : null;

    if (storedToken) {
      setToken(storedToken);
      api.getMe(storedToken)
        .then((u) => setUser(u))
        .catch(() => {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("rp_token");
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("user");
          }
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("rp_token", res.token);
      window.localStorage.setItem("token", res.token);
    }
    setToken(res.token);
    setUser(res.user);
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string, role = "staff") => {
    const res = await api.register(name, email, password, role);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("rp_token", res.token);
      window.localStorage.setItem("token", res.token);
    }
    setToken(res.token);
    setUser(res.user);
    setIsLoading(false);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("rp_token");
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
