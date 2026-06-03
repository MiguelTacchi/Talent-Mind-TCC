import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  LogOut,
  Building2,
  Shield,
  Menu,
  X,
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

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const items = navItems[user?.role || "company_user"];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="p-5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <span className="text-sidebar-primary-foreground text-xs font-bold">T</span>
        </div>
        <span className="font-bold text-sidebar-foreground tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
          Talent<span className="text-sidebar-primary">Mind</span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {items.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="px-3 py-2.5 mb-2">
          <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
          <p className="text-xs text-sidebar-foreground/40 truncate">{user?.companyName || "Administrador"}</p>
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
    </>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-60 bg-sidebar border-r border-sidebar-border flex-col shrink-0">
        <NavContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col md:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        <NavContent onNavigate={() => setMobileOpen(false)} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-background sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center">
              <span className="text-background text-xs font-bold">T</span>
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Talent<span className="text-primary">Mind</span>
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
