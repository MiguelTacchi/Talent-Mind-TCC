import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ArrowLeft, ChevronDown, FlaskConical } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../contexts/AuthContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { useToast } from "../hooks/use-toast";
import { LottieAnimation } from "../components/LottieAnimation";

const TEST_ACCOUNTS = [
  { label: "Admin da Plataforma", role: "site_creator", email: "admin@talentmind.com", password: "admin123" },
  { label: "Admin da Empresa", role: "company_admin", email: "admin@empresa.com", password: "empresa123" },
  { label: "Usuário da Empresa", role: "company_user", email: "usuario@empresa.com", password: "usuario123" },
];

const ROLE_COLOR: Record<string, string> = {
  site_creator: "bg-violet-500/10 text-violet-500",
  company_admin: "bg-blue-500/10 text-blue-500",
  company_user: "bg-emerald-500/10 text-emerald-500",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) {
      navigate("/dashboard");
    } else {
      toast({ title: "Erro", description: "Email ou senha inválidos", variant: "destructive" });
    }
  };

  const fillAccount = (account: typeof TEST_ACCOUNTS[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setShowTestAccounts(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-foreground items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="relative z-10 flex flex-col items-center">
          <LottieAnimation src="/animation/Login.lottie" className="w-80 h-80" />
          <h2 className="text-3xl font-bold text-background mt-4" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Talent<span className="text-primary">Mind</span>
          </h2>
          <p className="text-background/50 mt-2 text-center max-w-sm">
            A plataforma inteligente que transforma seu recrutamento com IA de última geração.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background relative">
        <ThemeToggle className="absolute top-4 right-4" />

        <div className="w-full max-w-sm">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao início
          </Link>

          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-background text-xs font-bold">T</span>
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Talent<span className="text-primary">Mind</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Bem-vindo de volta
          </h1>
          <p className="text-muted-foreground text-sm mb-8">Entre com suas credenciais para acessar o painel</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" required className="mt-2 h-11 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Senha</Label>
              <div className="relative mt-2">
                <Input id="password" type={showPass ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required className="h-11 rounded-xl pr-10" />
                <button type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Cadastrar empresa</Link>
          </p>

          {/* Contas de teste */}
          <div className="mt-8 border border-dashed border-border rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowTestAccounts(!showTestAccounts)}
              className="w-full flex items-center gap-2 px-4 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              <FlaskConical className="h-3.5 w-3.5" />
              <span>Contas de teste</span>
              <ChevronDown className={`h-3.5 w-3.5 ml-auto transition-transform duration-200 ${showTestAccounts ? "rotate-180" : ""}`} />
            </button>

            {showTestAccounts && (
              <div className="border-t border-dashed border-border divide-y divide-border/50">
                {TEST_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => fillAccount(acc)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${ROLE_COLOR[acc.role]}`}>
                      {acc.role === "site_creator" ? "PLATAFORMA" : acc.role === "company_admin" ? "ADMIN" : "USUÁRIO"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{acc.label}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{acc.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
