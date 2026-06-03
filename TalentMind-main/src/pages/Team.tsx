import { UserPlus, Shield, Trash2, KeyRound } from "lucide-react";
import { useState } from "react";

import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../hooks/use-toast";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "company_admin" | "company_user";
  status: "active" | "inactive";
}

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria@empresa.com",
    password: "123456",
    role: "company_admin",
    status: "active",
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao@empresa.com",
    password: "123456",
    role: "company_user",
    status: "active",
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana@empresa.com",
    password: "123456",
    role: "company_user",
    status: "active",
  },
];

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [newMember, setNewMember] = useState<{
    name: string;
    email: string;
    password: string;
    role: "company_admin" | "company_user";
  }>({
    name: "",
    email: "",
    password: "",
    role: "company_user",
  });
  const { toast } = useToast();

  const addMember = () => {
    if (!newMember.name || !newMember.email || !newMember.password) return;
    setMembers([
      ...members,
      { id: Date.now().toString(), ...newMember, status: "active" },
    ]);
    setNewMember({ name: "", email: "", password: "", role: "company_user" });
    setDialogOpen(false);
    toast({ title: "Membro adicionado!" });
  };

  const toggleStatus = (id: string) => {
    setMembers(
      members.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "active" ? "inactive" : "active" }
          : m,
      ),
    );
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
    toast({ title: "Membro removido" });
  };

  const openPasswordDialog = (id: string) => {
    setSelectedMemberId(id);
    setNewPassword("");
    setPasswordDialogOpen(true);
  };

  const changePassword = () => {
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter no mínimo 6 caracteres",
        variant: "destructive",
      });
      return;
    }
    setMembers(
      members.map((m) =>
        m.id === selectedMemberId ? { ...m, password: newPassword } : m,
      ),
    );
    setPasswordDialogOpen(false);
    setNewPassword("");
    toast({ title: "Senha alterada com sucesso!" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Equipe
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie os acessos da sua equipe de RH
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/90">
              <UserPlus className="h-4 w-4 mr-2" /> Adicionar Membro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: "'Manrope', sans-serif" }}>
                Adicionar Membro
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Nome
                </Label>
                <Input
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  className="mt-2 h-11 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </Label>
                <Input
                  type="email"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                  className="mt-2 h-11 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Senha
                </Label>
                <Input
                  type="password"
                  value={newMember.password}
                  onChange={(e) =>
                    setNewMember({ ...newMember, password: e.target.value })
                  }
                  placeholder="Mínimo 6 caracteres"
                  className="mt-2 h-11 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Função
                </Label>
                <Select
                  value={newMember.role}
                  onValueChange={(v: string) =>
                    setNewMember({
                      ...newMember,
                      role: v as "company_admin" | "company_user",
                    })
                  }
                >
                  <SelectTrigger className="mt-2 h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company_user">Usuário</SelectItem>
                    <SelectItem value="company_admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={addMember}
                className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90"
              >
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">
                Nome
              </th>
              <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">
                Email
              </th>
              <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">
                Função
              </th>
              <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">
                Status
              </th>
              <th className="text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-4">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr
                key={m.id}
                className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {m.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <span className="font-medium text-sm">{m.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{m.email}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${m.role === "company_admin" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}
                  >
                    {m.role === "company_admin" && (
                      <Shield className="h-3 w-3" />
                    )}
                    {m.role === "company_admin" ? "Admin" : "Usuário"}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleStatus(m.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${m.status === "active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
                  >
                    {m.status === "active" ? "Ativo" : "Inativo"}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openPasswordDialog(m.id)}
                      className="text-muted-foreground hover:text-foreground"
                      title="Alterar senha"
                    >
                      <KeyRound className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMember(m.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Manrope', sans-serif" }}>
              Alterar Senha
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Alterando senha de:{" "}
              <strong className="text-foreground">
                {members.find((m) => m.id === selectedMemberId)?.name}
              </strong>
            </p>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Nova Senha
              </Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="mt-2 h-11 rounded-xl"
              />
            </div>
            <Button
              onClick={changePassword}
              className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90"
            >
              Salvar Nova Senha
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
