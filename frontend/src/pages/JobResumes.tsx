import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trophy, Eye, Mail, Phone, Star, User, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { api } from "../lib/api";

interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  ai_score?: number;
  ai_summary?: string;
  ai_pros?: string;
  ai_cons?: string;
  ai_skills?: string;
  status: string;
  file_name?: string;
}

export default function JobResumes() {
  const { id: jobId } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const jobFromState = location.state?.job;
  const [job, setJob] = useState<any>(jobFromState);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  useEffect(() => {
    if (!jobId) return;
    Promise.all([
      job ? Promise.resolve({ job }) : api.jobs.get(jobId),
      api.resumes.list(jobId),
    ]).then(([jobRes, resumesRes]) => {
      if (!job) setJob((jobRes as any).job);
      setResumes(resumesRes.resumes);
    }).finally(() => setLoading(false));
  }, [jobId]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (!job) { navigate("/dashboard/jobs"); return null; }

  const analyzed = resumes.filter((r) => r.ai_score !== undefined && r.ai_score !== null)
    .sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0));
  const pending = resumes.filter((r) => r.ai_score === undefined || r.ai_score === null);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  const parseJson = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return []; }
  };

  return (
    <div>
      <button onClick={() => navigate("/dashboard/jobs")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar para Vagas
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Manrope', sans-serif" }}>{job.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">Ranking de candidatos ({resumes.length} total)</p>
      </div>

      {analyzed.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-warning" />
            <h2 className="text-base font-semibold" style={{ fontFamily: "'Manrope', sans-serif" }}>Ranking dos Melhores</h2>
          </div>
          <div className="space-y-3">
            {analyzed.map((r, i) => (
              <div key={r.id} className={`bg-card rounded-2xl border p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-elevated ${i === 0 ? "border-warning/30" : "border-border"}`}>
                <div className="text-2xl w-10 text-center">{getMedal(i)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{r.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {parseJson(r.ai_skills).map((s: string) => (
                      <span key={s} className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${getScoreColor(r.ai_score!)}`}>{r.ai_score}%</div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} className={`h-3 w-3 ${si < Math.round((r.ai_score! / 100) * 5) ? "text-warning fill-warning" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setSelectedResume(r)}>
                    <Eye className="h-4 w-4 mr-1" /> Ver
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg" onClick={() => window.open(`mailto:${r.email}`)}>
                    <Mail className="h-4 w-4 mr-1" /> Contato
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: "'Manrope', sans-serif" }}>Pendentes de Análise</h2>
          <div className="space-y-3">
            {pending.map((r) => (
              <div key={r.id} className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{r.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.file_name || r.email}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">Pendente</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {resumes.length === 0 && (
        <div className="text-center py-20 text-muted-foreground text-sm">Nenhum currículo enviado ainda.</div>
      )}

      <Dialog open={!!selectedResume} onOpenChange={() => setSelectedResume(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Manrope', sans-serif" }}>Currículo de {selectedResume?.name}</DialogTitle>
          </DialogHeader>
          {selectedResume && (
            <div className="space-y-5 mt-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-lg font-bold text-muted-foreground">
                  {selectedResume.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ fontFamily: "'Manrope', sans-serif" }}>{selectedResume.name}</h3>
                  {selectedResume.ai_summary && <p className="text-sm text-muted-foreground mt-1">{selectedResume.ai_summary}</p>}
                </div>
                {selectedResume.ai_score && (
                  <div className={`ml-auto text-3xl font-bold ${getScoreColor(selectedResume.ai_score)}`}>{selectedResume.ai_score}%</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate">{selectedResume.email}</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedResume.phone || "—"}</span>
                </div>
              </div>

              {parseJson(selectedResume.ai_skills).length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Competências</h4>
                  <div className="flex flex-wrap gap-2">
                    {parseJson(selectedResume.ai_skills).map((s: string) => (
                      <span key={s} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => window.open(`mailto:${selectedResume.email}`)}>
                  <Mail className="h-4 w-4 mr-2" /> Entrar em Contato
                </Button>
                {selectedResume.phone && (
                  <Button variant="outline" className="rounded-xl" onClick={() => window.open(`tel:${selectedResume.phone}`)}>
                    <Phone className="h-4 w-4 mr-2" /> Ligar
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
