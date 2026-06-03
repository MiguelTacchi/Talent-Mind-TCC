import { createContext, useContext, useState, type ReactNode } from "react";

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
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (data: {
    name: string;
    email: string;
    password: string;
    companyName: string;
  }) => boolean;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  register: () => false,
  changePassword: () => false,
});

export const useAuth = () => useContext(AuthContext);

const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "1",
    name: "Admin Criador",
    email: "admin@talentmind.com",
    password: "admin123",
    role: "site_creator",
  },
  {
    id: "2",
    name: "Maria Silva",
    email: "maria@empresa.com",
    password: "123456",
    role: "company_admin",
    companyId: "c1",
    companyName: "Tech Solutions",
  },
  {
    id: "3",
    name: "João Santos",
    email: "joao@empresa.com",
    password: "123456",
    role: "company_user",
    companyId: "c1",
    companyName: "Tech Solutions",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("recruta-user");
    return saved ? JSON.parse(saved) : null;
  });

  // Persist users list to allow logging in with registered accounts
  const [allUsers, setAllUsers] = useState<(User & { password: string })[]>(
    () => {
      const saved = localStorage.getItem("recruta-users-list");
      if (saved) return JSON.parse(saved);
      return MOCK_USERS;
    },
  );

  const login = (email: string, password: string) => {
    const found = allUsers.find(
      (u) => u.email === email && u.password === password,
    );
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem("recruta-user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("recruta-user");
  };

  const register = (data: {
    name: string;
    email: string;
    password: string;
    companyName: string;
  }) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: "company_admin",
      companyId: "c" + Date.now(),
      companyName: data.companyName,
    };

    const updatedUsers = [...allUsers, { ...newUser, password: data.password }];
    setAllUsers(updatedUsers);
    localStorage.setItem("recruta-users-list", JSON.stringify(updatedUsers));

    setUser(newUser);
    localStorage.setItem("recruta-user", JSON.stringify(newUser));
    return true;
  };

  const changePassword = (currentPassword: string, newPassword: string) => {
    if (!user) return false;
    const userIndex = allUsers.findIndex((u) => u.email === user.email);
    if (userIndex === -1 || allUsers[userIndex].password !== currentPassword)
      return false;

    const updatedUsers = [...allUsers];
    updatedUsers[userIndex].password = newPassword;
    setAllUsers(updatedUsers);
    localStorage.setItem("recruta-users-list", JSON.stringify(updatedUsers));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}
