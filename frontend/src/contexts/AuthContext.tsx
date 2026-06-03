import { createContext, useContext, useState, type ReactNode } from "react";
import { api } from "../lib/api";

export type UserRole = "company_admin" | "company_user" | "site_creator";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
  companyName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: {
    name: string;
    email: string;
    password: string;
    companyName: string;
  }) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => false,
  logout: () => {},
  register: async () => false,
  changePassword: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("tm-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { user: userData, token } = await api.auth.login(email, password);
      localStorage.setItem("tm-token", token);
      localStorage.setItem("tm-user", JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("tm-token");
    localStorage.removeItem("tm-user");
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    companyName: string;
  }): Promise<boolean> => {
    setLoading(true);
    try {
      const { user: userData, token } = await api.auth.register(data);
      localStorage.setItem("tm-token", token);
      localStorage.setItem("tm-user", JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      await api.auth.changePassword(currentPassword, newPassword);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}
