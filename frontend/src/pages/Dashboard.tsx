import { useEffect, useState } from "react";
import { Briefcase, Users, FileText, TrendingUp, ArrowRight, Plus, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { Button } from "../components/ui/button";
import { LottieAnimation } from "../components/LottieAnimation";

const roleLabel: Record<string, string> = {
  company_admin: "Admin",
  company_user: "Usuário",
  site_creator: "Criador",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.dashboard.get().then(setData).catch(() => {});
  }, []);

  const isCreator = user?.role === "site_creator";

  const stats = isCreator
    ? [
        { label: "Empresas Cadastradas", value: "—", icon: Briefcase, color: "bg-blue-500/10 text-blue-500" },
        { label: "Usuários Ativos", value: "—", icon: Users, color: "bg-violet-500/10 text-violet-500" },
        { label: "Currículos Analisados", value: data?.analyzedResumes ?? "—", icon: FileText, color: "bg-emerald-500/10 text-emerald-500" },
        { label: "Taxa de Aprovação", value: "—", icon: TrendingUp, color: "bg-amber-500/10 text-amber-500" },
      ]
    : [
        { label: "Vagas Ativas", value: data?.openJobs ?? "—", icon: Briefcase, color: "bg-blue-500/10 text-blue-500" },
        { label: "Candidatos", value: data?.totalResumes ?? "—", icon: Users, color: "bg-violet-500/10 text-violet-500" },
        { label: "Currículos Analisados", value: data?.analyzedResumes ?? "—", icon: FileText, color: "bg-emerald-500/10 text-emerald-500" },
        { label: "Total de Vagas", value: data?.totalJobs ?? "—", icon: TrendingUp, color: "bg-amber-500/10 text-amber-500" },
      ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="space-y-6">

      {/* Hero banner */}
      <div className="relative bg-foreground rounded-2xl overflow-hidden p-6 sm:p-8 flex items-center justify-between gap-4 min-h-[140px]">
        <div className="absolute top-[-30%] right-[20%] w-[400px] h-[400px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/10 text-background/70 text-xs font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {roleLabel[user?.role || "company_user"]}
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-background"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {greeting()}, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-background/50 text-sm mt-1">
            {isCreator ? "Visão geral da plataforma TalentMind" : `Painel da ${user?.companyName}`}
          </p>
        </div>

        <div className="relative z-10 shrink-0 hidden sm:block">
          <LottieAnimation
            src="/animation/Hello.lottie"
            className="w-28 h-28 sm:w-36 sm:h-36"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-card rounded-2xl border border-border p-4 sm:p-5 hover:shadow-elevated transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${s.color}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{s.value}</div>
            <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Vagas Recentes */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold" style={{ fontFamily: "'Manrope', sans-serif" }}>
              {isCreator ? "Atividade Recente" : "Vagas Recentes"}
            </h2>
            {!isCreator && (
              <Link to="/dashboard/jobs">
                <Button variant="ghost" size="sm" className="rounded-lg text-xs h-8 gap-1">
                  Ver todas <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            )}
          </div>

          {data?.recentJobs?.length > 0 ? (
            <div className="space-y-0">
              {data.recentJobs.map((job: any) => (
                <div key={job.id} className="flex items-center gap-3 py-3.5 border-b border-border last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.department}</p>
                  </div>
                  <Link to={`/dashboard/jobs/${job.id}/resumes`} state={{ job }}>
                    <Button variant="ghost" size="sm" className="rounded-lg h-7 text-xs shrink-0">
                      Ver
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <LottieAnimation
                src="/animation/computer-animation.lottie"
                className="w-32 h-32"
              />
              <p className="text-sm font-medium -mt-2">Nenhuma vaga criada ainda</p>
              <p className="text-xs text-muted-foreground mt-1">Crie sua primeira vaga para começar</p>
              {!isCreator && (
                <Link to="/dashboard/jobs" className="mt-4">
                  <Button size="sm" className="rounded-xl bg-foreground text-background hover:bg-foreground/90">
                    <Plus className="h-3.5 w-3.5 mr-1.5" /> Nova Vaga
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Ações Rápidas */}
        <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 flex flex-col">
          <h2 className="text-base font-semibold mb-1" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Ações Rápidas
          </h2>
          <p className="text-xs text-muted-foreground mb-5">O que deseja fazer agora?</p>

          <div className="space-y-2 flex-1">
            {!isCreator ? (
              <>
                <Link to="/dashboard/jobs" className="block">
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Plus className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Nova Vaga</p>
                      <p className="text-xs text-muted-foreground">Criar nova oportunidade</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </Link>

                <Link to="/dashboard/jobs" className="block">
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Brain className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Analisar com IA</p>
                      <p className="text-xs text-muted-foreground">Rankear currículos</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </Link>

                <Link to="/dashboard/jobs" className="block">
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Users className="h-4 w-4 text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Ver Candidatos</p>
                      <p className="text-xs text-muted-foreground">Todos os currículos</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </Link>
              </>
            ) : (
              <Link to="/dashboard/companies" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Briefcase className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Empresas Pendentes</p>
                    <p className="text-xs text-muted-foreground">Revisar cadastros</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </Link>
            )}
          </div>

          {/* Lottie decorativo no rodapé do card */}
          <div className="mt-4 pt-4 border-t border-border flex justify-center">
            <LottieAnimation
              src="/animation/Mobile Tap Interaction animation.lottie"
              className="w-20 h-20 opacity-70"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
