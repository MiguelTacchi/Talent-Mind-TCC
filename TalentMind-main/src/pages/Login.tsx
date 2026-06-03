import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../contexts/AuthContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { useToast } from "../hooks/use-toast";
import { LottieAnimation } from "../components/LottieAnimation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate("/dashboard");
    } else {
      toast({
        title: "Erro",
        description: "Email ou senha inválidos",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-foreground items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="relative z-10 flex flex-col items-center">
          <LottieAnimation
            src="../../animation/computer.lottie"
            className="w-80 h-80"
          />
          <h2
            className="text-3xl font-bold text-background mt-4"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Recruta<span className="text-primary">IA</span>
          </h2>
          <p className="text-background/50 mt-2 text-center max-w-sm">
            A plataforma inteligente que transforma seu recrutamento com IA de
            última geração.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-background relative">
        <ThemeToggle className="absolute top-4 right-4" />
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-background text-xs font-bold">R</span>
            </div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Recruta<span className="text-primary">IA</span>
            </span>
          </div>

          <h1
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Bem-vindo de volta
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Entre com suas credenciais para acessar o painel
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label
                htmlFor="email"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="mt-2 h-11 rounded-xl"
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Senha
              </Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  className="h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90"
            >
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Cadastrar empresa
            </Link>
          </p>

          <div className="mt-8 p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-2">
              Contas de demonstração
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <strong className="text-foreground">Criador:</strong>{" "}
                admin@talentmind.com / admin123
              </p>
              <p>
                <strong className="text-foreground">Admin:</strong>{" "}
                maria@empresa.com / 123456
              </p>
              <p>
                <strong className="text-foreground">Usuário:</strong>{" "}
                joao@empresa.com / 123456
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
