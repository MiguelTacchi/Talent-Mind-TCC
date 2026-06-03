import { Building2, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "../components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
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
  { id: "c1", name: "Tech Solutions", email: "maria@techsolutions.com", plan: "Pro", status: "approved", users: 5, jobs: 12, createdAt: "2026-03-15" },
  { id: "c2", name: "Inova Digital", email: "carlos@inovadigital.com", plan: "Starter", status: "approved", users: 2, jobs: 3, createdAt: "2026-03-20" },
  { id: "c3", name: "DataCorp", email: "ana@datacorp.com", plan: "Enterprise", status: "approved", users: 15, jobs: 28, createdAt: "2026-02-10" },
  { id: "c4", name: "StartupXYZ", email: "pedro@startupxyz.com", plan: "Starter", status: "pending", users: 1, jobs: 0, createdAt: "2026-04-05" },
  { id: "c5", name: "MegaSoft", email: "julia@megasoft.com", plan: "Pro", status: "pending", users: 1, jobs: 0, createdAt: "2026-04-06" },
];

type ConfirmAction = { type: "approve" | "reject" | "remove"; company: Company };

export default function CreatorCompanies() {
  const [companies, setCompanies] = useState<Company[]>(INITIAL);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const { toast } = useToast();

  const executeAction = () => {
    if (!confirmAction) return;
    const { type, company } = confirmAction;

    if (type === "approve") {
      setCompanies(companies.map((c) => (c.id === company.id ? { ...c, status: "approved" } : c)));
      toast({ title: "Empresa aprovada!", description: `${company.name} foi aprovada com sucesso.` });
    } else if (type === "reject") {
      setCompanies(companies.map((c) => (c.id === company.id ? { ...c, status: "rejected" } : c)));
      toast({ title: "Empresa rejeitada", description: `O cadastro de ${company.name} foi rejeitado.` });
    } else if (type === "remove") {
      setCompanies(companies.filter((c) => c.id !== company.id));
      toast({ title: "Empresa removida", description: `${company.name} foi removida da plataforma.` });
    }

    setConfirmAction(null);
  };

  const dialogConfig = confirmAction && {
    approve: {
      title: "Aprovar empresa?",
      description: `Confirma a aprovação de "${confirmAction.company.name}"? A empresa terá acesso imediato à plataforma.`,
      actionLabel: "Aprovar",
      actionClass: "bg-success text-success-foreground hover:bg-success/90",
    },
    reject: {
      title: "Rejeitar cadastro?",
      description: `Tem certeza que deseja rejeitar o cadastro de "${confirmAction.company.name}"? A empresa não terá acesso à plataforma.`,
      actionLabel: "Rejeitar",
      actionClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    remove: {
      title: "Remover empresa?",
      description: `Tem certeza que deseja remover "${confirmAction.company.name}" da plataforma? Todos os dados serão perdidos. Esta ação não pode ser desfeita.`,
      actionLabel: "Remover",
      actionClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
  }[confirmAction.type];

  const pending = companies.filter((c) => c.status === "pending");
  const approved = companies.filter((c) => c.status === "approved");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Manrope', sans-serif" }}>
          Empresas Cadastradas
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie as empresas que utilizam a plataforma</p>
      </div>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "'Manrope', sans-serif" }}>
            <span className="w-2 h-2 rounded-full bg-warning" /> Pendentes de Aprovação ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((c) => (
              <div key={c.id} className="bg-card rounded-2xl border border-warning/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.email} • {c.createdAt}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" className="rounded-lg bg-success text-success-foreground hover:bg-success/90"
                    onClick={() => setConfirmAction({ type: "approve", company: c })}>
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Aprovar
                  </Button>
                  <Button size="sm" variant="outline"
                    className="rounded-lg text-destructive border-destructive/20 hover:bg-destructive/10"
                    onClick={() => setConfirmAction({ type: "reject", company: c })}>
                    <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-base font-semibold mb-4" style={{ fontFamily: "'Manrope', sans-serif" }}>
        Empresas Ativas ({approved.length})
      </h2>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">Empresa</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4 hidden sm:table-cell">Plano</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4 hidden md:table-cell">Usuários</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4 hidden md:table-cell">Vagas</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4 hidden lg:table-cell">Desde</th>
                <th className="text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {approved.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                        {c.name[0]}
                      </div>
                      <div className="min-w-0">
                        <span className="font-medium text-sm block truncate">{c.name}</span>
                        <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{c.plan}</span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{c.users}</td>
                  <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{c.jobs}</td>
                  <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">{c.createdAt}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => setConfirmAction({ type: "remove", company: c })}
                      className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!confirmAction} onOpenChange={(open) => { if (!open) setConfirmAction(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogConfig?.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialogConfig?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executeAction} className={dialogConfig?.actionClass}>
              {dialogConfig?.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
