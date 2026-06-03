import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";

export default function CompanySettings() {
  const { user, changePassword } = useAuth();
  const { toast } = useToast();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPass || newPass.length < 6) {
      toast({ title: "Erro", description: "Preencha corretamente. Senha mínima: 6 caracteres.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const success = await changePassword(currentPass, newPass);
    setSaving(false);
    if (success) {
      toast({ title: "Senha alterada com sucesso!" });
      setPasswordOpen(false);
      setCurrentPass("");
      setNewPass("");
    } else {
      toast({ title: "Erro", description: "Senha atual incorreta.", variant: "destructive" });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Manrope', sans-serif" }}>Configurações</h1>
      <p className="text-muted-foreground text-sm mb-8">Gerencie as configurações da sua conta e empresa</p>

      <div className="max-w-xl space-y-4">
        {[
          { label: "Nome da Empresa", value: user?.companyName || "—" },
          { label: "Email de Contato", value: user?.email || "—" },
          { label: "Função", value: user?.role === "company_admin" ? "Administrador" : "Usuário" },
        ].map((field) => (
          <div key={field.label} className="bg-card rounded-2xl border border-border p-5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{field.label}</label>
            <p className="mt-1.5 text-sm font-medium">{field.value}</p>
          </div>
        ))}

        <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-xl w-full h-12 justify-start gap-3">
              <KeyRound className="h-4 w-4" /> Alterar Minha Senha
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: "'Manrope', sans-serif" }}>Alterar Senha</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Senha Atual</Label>
                <Input type="password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} className="mt-2 h-11 rounded-xl" />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nova Senha</Label>
                <Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Mínimo 6 caracteres" className="mt-2 h-11 rounded-xl" />
              </div>
              <Button onClick={handleChangePassword} disabled={saving} className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Salvar Nova Senha
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
