import { Briefcase, Users, FileText, TrendingUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { LottieAnimation } from "../components/LottieAnimation";

export default function Dashboard() {
  const { user } = useAuth();

  const stats =
    user?.role === "site_creator"
      ? [
          {
            label: "Empresas Cadastradas",
            value: "24",
            icon: Briefcase,
            change: "+3 este mês",
          },
          {
            label: "Usuários Ativos",
            value: "156",
            icon: Users,
            change: "+12 esta semana",
          },
          {
            label: "Currículos Analisados",
            value: "2.4k",
            icon: FileText,
            change: "+340 hoje",
          },
          {
            label: "Taxa de Aprovação",
            value: "89%",
            icon: TrendingUp,
            change: "+2% vs mês anterior",
          },
        ]
      : [
          {
            label: "Vagas Ativas",
            value: "8",
            icon: Briefcase,
            change: "+2 esta semana",
          },
          {
            label: "Candidatos",
            value: "142",
            icon: Users,
            change: "+28 esta semana",
          },
          {
            label: "Currículos Analisados",
            value: "89",
            icon: FileText,
            change: "+15 hoje",
          },
          {
            label: "Taxa de Match",
            value: "73%",
            icon: TrendingUp,
            change: "+5% vs mês anterior",
          },
        ];

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Olá, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {user?.role === "site_creator"
              ? "Visão geral da plataforma"
              : `Painel da ${user?.companyName}`}
          </p>
        </div>
        <LottieAnimation
          src="../../animation/computer.lottie"
          className="w-20 h-20 -mt-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-card rounded-2xl border border-border p-5 hover:shadow-elevated transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {s.label}
              </span>
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <p className="text-xs text-success mt-1">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h2
          className="text-base font-semibold mb-5"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Atividade Recente
        </h2>
        <div className="space-y-0">
          {[
            {
              text: "Novo currículo analisado para vaga de Desenvolvedor Full Stack",
              time: "2 min atrás",
            },
            {
              text: "Vaga de UX Designer recebeu 5 novos currículos",
              time: "15 min atrás",
            },
            {
              text: "Ranking atualizado para vaga de Data Scientist",
              time: "1 hora atrás",
            },
            {
              text: "Novo candidato entrou em contato via plataforma",
              time: "3 horas atrás",
            },
          ].map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-3.5 border-b border-border last:border-0"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <p className="text-sm flex-1">{a.text}</p>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {a.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
