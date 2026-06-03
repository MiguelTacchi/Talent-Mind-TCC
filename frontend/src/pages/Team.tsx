import { UserPlus, Shield, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { api } from "../lib/api";

export default function Team() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null);
  const [newMember, setNewMember] = useState({ name: "", email: "", password: "", role: "company_user" });
  const { toast } = useToast();

  useEffect(() => {
    api.team.list().then((r) => setMembers(r.members)).finally(() => setLoading(false));
  }, []);

  const addMember = async () => {
    if (!newMember.name || !newMember.email || !newMember.password) return;
    setSaving(true);
    try {
      const r = await api.team.invite(newMember as any);
      setMembers([...members, r.member]);
      setNewMember({ name: "", email: "", password: "", role: "company_user" });
      setDialogOpen(false);
      toast({ title: "Membro adicionado!" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const confirmRemove = async () => {
    if (!removeTarget) return;
    try {
      await api.team.remove(removeTarget.id);
      setMembers(members.filter((m) => m.id !== removeTarget.id));
      toast({ title: "Membro removido" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setRemoveTarget(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Manrope', sans-serif" }}>Equipe</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie os acessos da sua equipe de RH</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/90 shrink-0">
              <UserPlus className="h-4 w-4 mr-2" /> Adicionar Membro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: "'Manrope', sans-serif" }}>Adicionar Membro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</Label>
                <Input value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} className="mt-2 h-11 rounded-xl" />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
                <Input type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} className="mt-2 h-11 rounded-xl" />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Senha</Label>
                <Input type="password" value={newMember.password} onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres" className="mt-2 h-11 rounded-xl" />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Função</Label>
                <Select value={newMember.role} onValueChange={(v) => setNewMember({ ...newMember, role: v })}>
                  <SelectTrigger className="mt-2 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company_user">Usuário</SelectItem>
                    <SelectItem value="company_admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addMember} disabled={saving} className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">Nome</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4 hidden sm:table-cell">Email</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">Função</th>
                <th className="text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                        {m.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium text-sm">{m.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">{m.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${m.role === "company_admin" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      {m.role === "company_admin" && <Shield className="h-3 w-3" />}
                      {m.role === "company_admin" ? "Admin" : "Usuário"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => setRemoveTarget({ id: m.id, name: m.name })}
                      className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {members.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">Nenhum membro na equipe.</p>}
      </div>

      <AlertDialog open={!!removeTarget} onOpenChange={(open) => { if (!open) setRemoveTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover membro?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <span className="font-medium text-foreground">{removeTarget?.name}</span> da equipe? O acesso será revogado imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
