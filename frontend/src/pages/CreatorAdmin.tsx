import { Shield, Server, Activity, Database } from "lucide-react";

export default function CreatorAdmin() {
  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Administração
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configurações gerais da plataforma
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            icon: Shield,
            title: "Segurança",
            desc: "Configurações de autenticação, 2FA, e políticas de senha",
            status: "Ativo",
          },
          {
            icon: Server,
            title: "API & Integrações",
            desc: "Gerencie chaves de API e webhooks",
            status: "3 integrações",
          },
          {
            icon: Database,
            title: "Banco de Dados",
            desc: "Status do banco, backups e manutenção",
            status: "Saudável",
          },
          {
            icon: Activity,
            title: "Monitoramento",
            desc: "Logs de atividade e métricas de uso",
            status: "Online",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-card rounded-2xl border border-border p-6 hover:shadow-elevated transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <item.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3
                  className="font-semibold text-sm"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.desc}
                </p>
                <span className="inline-block mt-3 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
