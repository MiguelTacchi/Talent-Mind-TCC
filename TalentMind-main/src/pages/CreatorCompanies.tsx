import { Building2, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";

interface Company {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: "pending" | "approved" | "rejected";
  users: number;
  jobs: number;
  createdAt: string;
}

const INITIAL: Company[] = [
  {
    id: "c1",
    name: "Tech Solutions",
    email: "maria@techsolutions.com",
    plan: "Pro",
    status: "approved",
    users: 5,
    jobs: 12,
    createdAt: "2026-03-15",
  },
  {
    id: "c2",
    name: "Inova Digital",
    email: "carlos@inovadigital.com",
    plan: "Starter",
    status: "approved",
    users: 2,
    jobs: 3,
    createdAt: "2026-03-20",
  },
  {
    id: "c3",
    name: "DataCorp",
    email: "ana@datacorp.com",
    plan: "Enterprise",
    status: "approved",
    users: 15,
    jobs: 28,
    createdAt: "2026-02-10",
  },
  {
    id: "c4",
    name: "StartupXYZ",
    email: "pedro@startupxyz.com",
    plan: "Starter",
    status: "pending",
    users: 1,
    jobs: 0,
    createdAt: "2026-04-05",
  },
  {
    id: "c5",
    name: "MegaSoft",
    email: "julia@megasoft.com",
    plan: "Pro",
    status: "pending",
    users: 1,
    jobs: 0,
    createdAt: "2026-04-06",
  },
];

export default function CreatorCompanies() {
  const [companies, setCompanies] = useState<Company[]>(INITIAL);
  const { toast } = useToast();

  const approve = (id: string) => {
    setCompanies(
      companies.map((c) => (c.id === id ? { ...c, status: "approved" } : c)),
    );
    toast({ title: "Empresa aprovada!" });
  };

  const reject = (id: string) => {
    setCompanies(
      companies.map((c) => (c.id === id ? { ...c, status: "rejected" } : c)),
    );
    toast({ title: "Empresa rejeitada" });
  };

  const remove = (id: string) => {
    setCompanies(companies.filter((c) => c.id !== id));
    toast({ title: "Empresa removida" });
  };

  const pending = companies.filter((c) => c.status === "pending");
  const approved = companies.filter((c) => c.status === "approved");

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Empresas Cadastradas
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie as empresas que utilizam a plataforma
        </p>
      </div>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-base font-semibold mb-4 flex items-center gap-2"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            <span className="w-2 h-2 rounded-full bg-warning" /> Pendentes de
            Aprovação ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((c) => (
              <div
                key={c.id}
                className="bg-card rounded-2xl border border-warning/20 p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-warning" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {c.email} • {c.createdAt}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="rounded-lg bg-success text-success-foreground hover:bg-success/90"
                    onClick={() => approve(c.id)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg text-destructive border-destructive/20 hover:bg-destructive/10"
                    onClick={() => reject(c.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2
        className="text-base font-semibold mb-4"
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        Empresas Ativas ({approved.length})
      </h2>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">
                Empresa
              </th>
              <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">
                Plano
              </th>
              <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">
                Usuários
              </th>
              <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">
                Vagas
              </th>
              <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">
                Desde
              </th>
              <th className="text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {approved.map((c) => (
              <tr
                key={c.id}
                className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {c.name[0]}
                    </div>
                    <div>
                      <span className="font-medium text-sm">{c.name}</span>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {c.plan}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{c.users}</td>
                <td className="p-4 text-sm text-muted-foreground">{c.jobs}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {c.createdAt}
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(c.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
