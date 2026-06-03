import { useState, useEffect } from "react";
import { Plus, Upload, Eye, Brain, MapPin, Clock, Users, Loader2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
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
import { useToast } from "../hooks/use-toast";
import { api } from "../lib/api";

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", department: "", location: "", type: "CLT", description: "", requirements: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    api.jobs.list().then((r) => setJobs(r.jobs)).finally(() => setLoading(false));
  }, []);

  const createJob = async () => {
    if (!newJob.title) return;
    setSaving(true);
    try {
      const r = await api.jobs.create(newJob);
      setJobs([r.job, ...jobs]);
      setNewJob({ title: "", department: "", location: "", type: "CLT", description: "", requirements: "" });
      setDialogOpen(false);
      toast({ title: "Vaga criada!", description: `"${r.job.title}" criada com sucesso.` });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.jobs.delete(deleteTarget.id);
      setJobs(jobs.filter((j) => j.id !== deleteTarget.id));
      toast({ title: "Vaga removida", description: `"${deleteTarget.title}" foi removida.` });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Manrope', sans-serif" }}>Vagas</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie suas vagas e currículos</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/90 shrink-0">
              <Plus className="h-4 w-4 mr-2" /> Nova Vaga
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: "'Manrope', sans-serif" }}>Criar Nova Vaga</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Título da Vaga</Label>
                <Input value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="Ex: Desenvolvedor Front-end" className="mt-2 h-11 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Departamento</Label>
                  <Input value={newJob.department} onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                    placeholder="Ex: Tecnologia" className="mt-2 h-11 rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Localização</Label>
                  <Input value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    placeholder="Ex: Remoto" className="mt-2 h-11 rounded-xl" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</Label>
                <Textarea value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Descreva a vaga..." className="mt-2 rounded-xl" />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Requisitos (vírgula)</Label>
                <Input value={newJob.requirements} onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  placeholder="React, TypeScript, Node.js" className="mt-2 h-11 rounded-xl" />
              </div>
              <Button onClick={createJob} disabled={saving} className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Criar Vaga
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-sm">Nenhuma vaga criada ainda.</div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => {
            const reqs = job.requirements || "";
            return (
              <div key={job.id} className="bg-card rounded-2xl border border-border p-5 sm:p-6 hover:shadow-elevated transition-all duration-300">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold" style={{ fontFamily: "'Manrope', sans-serif" }}>{job.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" />{job.location}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 shrink-0" />{job.type}</span>
                      <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 shrink-0" />{job.resumes_count ?? 0} candidatos</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {reqs.split(",").filter(Boolean).map((r: string) => (
                        <span key={r} className="px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs font-medium">{r.trim()}</span>
                      ))}
                    </div>
                  </div>
                  {(job.resumes_count ?? 0) > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium shrink-0">{job.resumes_count} currículos</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-border">
                  <Link to={`/dashboard/jobs/${job.id}/resumes`} state={{ job }}>
                    <Button variant="outline" size="sm" className="rounded-lg"><Eye className="h-4 w-4 mr-1.5" /> Ver Currículos</Button>
                  </Link>
                  <Link to={`/dashboard/jobs/${job.id}/upload`} state={{ job }}>
                    <Button variant="outline" size="sm" className="rounded-lg"><Upload className="h-4 w-4 mr-1.5" /> Enviar Currículo</Button>
                  </Link>
                  <Link to={`/dashboard/jobs/${job.id}/analyze`} state={{ job }}>
                    <Button size="sm" className="rounded-lg bg-foreground text-background hover:bg-foreground/90"><Brain className="h-4 w-4 mr-1.5" /> Analisar com IA</Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="rounded-lg text-destructive hover:text-destructive ml-auto"
                    onClick={() => setDeleteTarget({ id: job.id, title: job.title })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover vaga?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a vaga <span className="font-medium text-foreground">"{deleteTarget?.title}"</span>? Todos os currículos vinculados serão excluídos. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
