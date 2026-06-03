import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  LogOut,
  Building2,
  Shield,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { Button } from "../components/ui/button";

const navItems = {
  company_user: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/dashboard/jobs", icon: Briefcase, label: "Vagas" },
  ],
  company_admin: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/dashboard/jobs", icon: Briefcase, label: "Vagas" },
    { to: "/dashboard/team", icon: Users, label: "Equipe" },
    { to: "/dashboard/settings", icon: Settings, label: "Configurações" },
  ],
  site_creator: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/dashboard/companies", icon: Building2, label: "Empresas" },
    { to: "/dashboard/admin", icon: Shield, label: "Administração" },
  ],
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const items = navItems[user?.role || "company_user"];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        <div className="p-5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground text-xs font-bold">
              R
            </span>
          </div>
          <span
            className="font-bold text-sidebar-foreground tracking-tight"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Recruta<span className="text-sidebar-primary">IA</span>
          </span>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {items.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="px-3 py-2.5 mb-2">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-sidebar-foreground/40 truncate">
              {user?.companyName || "Administrador"}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle className="text-sidebar-foreground/40 hover:text-sidebar-foreground" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
