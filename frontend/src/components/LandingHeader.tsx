import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

export function LandingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
            <span className="text-background text-xs font-bold">T</span>
          </div>
          <span
            className="font-bold text-lg tracking-tight"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Talent<span className="text-primary">Mind</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Plataforma
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Como Funciona
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Preços
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Entrar
            </Button>
          </Link>
          <Link to="/register">
            <Button
              size="sm"
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-5"
            >
              Começar Agora
            </Button>
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border p-4 space-y-3">
          <a
            href="#features"
            className="block text-sm font-medium text-muted-foreground"
            onClick={() => setOpen(false)}
          >
            Plataforma
          </a>
          <a
            href="#how-it-works"
            className="block text-sm font-medium text-muted-foreground"
            onClick={() => setOpen(false)}
          >
            Como Funciona
          </a>
          <a
            href="#pricing"
            className="block text-sm font-medium text-muted-foreground"
            onClick={() => setOpen(false)}
          >
            Preços
          </a>
          <Link to="/login" className="block">
            <Button variant="ghost" size="sm" className="w-full">
              Entrar
            </Button>
          </Link>
          <Link to="/register" className="block">
            <Button
              size="sm"
              className="w-full rounded-full bg-foreground text-background"
            >
              Começar Agora
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
