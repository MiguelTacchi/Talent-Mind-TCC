import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft, MailCheck, CheckCircle2 } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../contexts/AuthContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { useToast } from "../hooks/use-toast";
import { LottieAnimation } from "../components/LottieAnimation";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", companyName: "" });
  const [registered, setRegistered] = useState(false);
  const { register, loading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const ok = await register(form);
    if (ok) {
      setRegistered(true);
    } else {
      toast({ title: "Erro", description: "Erro ao cadastrar. Verifique os dados ou tente outro e-mail.", variant: "destructive" });
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <ThemeToggle className="absolute top-4 right-4" />
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
              <MailCheck className="h-10 w-10 text-success" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Solicitação enviada!
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">
            Recebemos o cadastro de <span className="font-medium text-foreground">{form.companyName}</span>.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Um e-mail foi enviado para a nossa equipe analisar sua solicitação. Em breve você receberá uma resposta no e-mail <span className="font-medium text-foreground">{form.email}</span>.
          </p>

          <div className="bg-secondary/50 rounded-2xl p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">O que acontece agora?</p>
                <p className="text-xs text-muted-foreground mt-1">Nossa equipe irá analisar os dados da sua empresa e você receberá um e-mail de confirmação com as instruções de acesso.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/login" className="flex-1">
              <Button className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90">
                Voltar ao Login
              </Button>
            </Link>
            <Button
              variant="outline"
              className="flex-1 h-11 rounded-xl"
              onClick={() => { setRegistered(false); setForm({ name: "", email: "", password: "", companyName: "" }); }}
            >
              Fazer outro cadastro
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background relative">
        <ThemeToggle className="absolute top-4 right-4" />

        <div className="w-full max-w-sm">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao login
          </Link>

          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-background text-xs font-bold">T</span>
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Talent<span className="text-primary">Mind</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Manrope', sans-serif" }}>Cadastre sua empresa</h1>
          <p className="text-muted-foreground text-sm mb-8">Preencha os dados para criar sua conta</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome da Empresa</Label>
              <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="Sua Empresa Ltda" required className="mt-2 h-11 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Seu Nome</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nome completo" required className="mt-2 h-11 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="seu@empresa.com" required className="mt-2 h-11 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Senha</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 6 caracteres" required minLength={6} className="mt-2 h-11 rounded-xl" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Cadastrar Empresa
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Entrar</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-foreground items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="relative z-10 flex flex-col items-center">
          <LottieAnimation src="/animation/Login.lottie" className="w-80 h-80" />
          <h2 className="text-3xl font-bold text-background mt-4" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Talent<span className="text-primary">Mind</span>
          </h2>
          <p className="text-background/50 mt-2 text-center max-w-sm">
            Crie sua conta e transforme seu recrutamento com IA de última geração.
          </p>
        </div>
      </div>
    </div>
  );
}
