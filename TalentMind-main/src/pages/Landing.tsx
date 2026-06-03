import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "../components/ui/button";
import { LandingHeader } from "../components/LandingHeader";
import { LottieAnimation } from "../components/LottieAnimation";

const features = [
  {
    title: "Ranking Inteligente",
    desc: "Receba um ranking automático dos candidatos mais qualificados com scores de precisão.",
  },
  {
    title: "Upload Simplificado",
    desc: "Envie múltiplos currículos de uma vez. Suportamos PDF, DOCX e outros formatos.",
  },
  {
    title: "Gestão de Equipe",
    desc: "Gerencie acessos e permissões da sua equipe de RH com total controle.",
  },
];

const steps = [
  {
    num: "01",
    title: "Cadastre sua Empresa",
    desc: "Crie sua conta empresarial em poucos cliques.",
  },
  {
    num: "02",
    title: "Crie suas Vagas",
    desc: "Defina os requisitos e competências desejadas.",
  },
  {
    num: "03",
    title: "Envie os Currículos",
    desc: "Faça upload dos currículos dos candidatos.",
  },
  {
    num: "04",
    title: "Receba o Ranking",
    desc: "A IA analisa e classifica os melhores candidatos.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <LandingHeader />

      {/* Ambient glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="fixed top-[30%] right-[-15%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4">
        <div className="container mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur-md mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground tracking-wide">
              IA de última geração ativa
            </span>
          </div>

          <h1
            className="max-w-3xl text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 animate-fade-up"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Encontre talentos com{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              precisão absoluta.
            </span>
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed mb-10 animate-fade-up">
            Nossa IA analisa currículos além das palavras-chave, identificando
            competências reais e alinhamento cultural com sua empresa.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up">
            <Link to="/register">
              <Button
                size="lg"
                className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8 text-base shadow-elevated"
              >
                Começar Grátis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-base"
              >
                Como Funciona
              </Button>
            </a>
          </div>

          <div className="mt-16 w-full max-w-md mx-auto animate-fade-up">
            <LottieAnimation
              src="../../animation/computer.lottie"
              className="w-full h-auto"
            />
          </div>

          <div className="grid grid-cols-3 gap-12 max-w-md mx-auto mt-16">
            {[
              ["10k+", "Currículos"],
              ["500+", "Empresas"],
              ["95%", "Precisão"],
            ].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {val}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Funcionalidades Poderosas
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Tudo que seu RH precisa para recrutar com eficiência
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group p-7 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-elevated transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                  <div className="w-3 h-3 rounded-full border-2 border-foreground/60 group-hover:border-primary transition-colors" />
                </div>
                <h3
                  className="text-base font-semibold mb-2"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Como Funciona
            </h2>
            <p className="text-muted-foreground">
              4 passos simples para revolucionar seu recrutamento
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((s) => (
              <div
                key={s.num}
                className="flex gap-5 p-6 rounded-2xl bg-card border border-border"
              >
                <span
                  className="text-4xl font-extrabold text-primary/20"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {s.num}
                </span>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Planos
            </h2>
            <p className="text-muted-foreground">
              Escolha o plano ideal para sua empresa
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: "Starter",
                price: "Grátis",
                feats: ["Até 3 vagas", "50 currículos/mês", "1 usuário"],
              },
              {
                name: "Pro",
                price: "R$ 149/mês",
                feats: [
                  "Vagas ilimitadas",
                  "500 currículos/mês",
                  "5 usuários",
                  "Ranking avançado",
                ],
                highlight: true,
              },
              {
                name: "Enterprise",
                price: "Sob consulta",
                feats: [
                  "Tudo do Pro",
                  "Currículos ilimitados",
                  "Usuários ilimitados",
                  "API dedicada",
                  "Suporte prioritário",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-7 border transition-all ${plan.highlight ? "bg-foreground text-background border-foreground shadow-elevated scale-[1.02]" : "bg-card border-border"}`}
              >
                {plan.highlight && (
                  <div className="text-xs font-medium text-background/60 uppercase tracking-widest mb-4">
                    Mais Popular
                  </div>
                )}
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {plan.name}
                </h3>
                <div className="text-2xl font-bold mb-5">{plan.price}</div>
                <ul className="space-y-2.5 mb-7">
                  {plan.feats.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 shrink-0 opacity-60" />{" "}
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button
                    className={`w-full rounded-full ${plan.highlight ? "bg-background text-foreground hover:bg-background/90" : "bg-foreground text-background hover:bg-foreground/90"}`}
                  >
                    Começar
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center">
              <span className="text-background text-[10px] font-bold">R</span>
            </div>
            <span
              className="font-bold text-lg tracking-tight"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Talent<span className="text-primary">Mind</span>
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2026 TalentMind. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
