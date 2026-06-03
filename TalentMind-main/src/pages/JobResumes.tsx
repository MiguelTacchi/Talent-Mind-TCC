import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Eye, Mail, Phone, Star, User } from "lucide-react";
import { useState } from "react";

import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  score?: number;
  status: string;
  skills: string[];
  experience: string;
}

export default function JobResumes() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  if (!job) {
    navigate("/dashboard/jobs");
    return null;
  }

  const analyzed = job.resumes
    .filter((r: Resume) => r.score !== undefined)
    .sort((a: Resume, b: Resume) => (b.score || 0) - (a.score || 0));
  const pending = job.resumes.filter((r: Resume) => r.score === undefined);

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

  return (
    <div>
      <button
        onClick={() => navigate("/dashboard/jobs")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para Vagas
      </button>

      <div className="mb-8">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          {job.title}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Ranking de candidatos ({job.resumes.length} total)
        </p>
      </div>

      {analyzed.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-warning" />
            <h2
              className="text-base font-semibold"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Ranking dos Melhores
            </h2>
          </div>
          <div className="space-y-3">
            {analyzed.map((r: Resume, i: number) => (
              <div
                key={r.id}
                className={`bg-card rounded-2xl border p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-elevated ${i === 0 ? "border-warning/30" : "border-border"}`}
              >
                <div className="text-2xl w-10 text-center">{getMedal(i)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{r.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      • {r.experience} de experiência
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {r.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-xl font-bold ${getScoreColor(r.score!)}`}
                  >
                    {r.score}%
                  </div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className={`h-3 w-3 ${si < Math.round((r.score! / 100) * 5) ? "text-warning fill-warning" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => setSelectedResume(r)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => window.open(`mailto:${r.email}`)}
                  >
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
          <h2
            className="text-base font-semibold mb-4"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Pendentes de Análise
          </h2>
          <div className="space-y-3">
            {pending.map((r: Resume) => (
              <div
                key={r.id}
                className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{r.name}</h3>
                  <div className="flex gap-1.5 mt-1">
                    {r.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                  Pendente
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog
        open={!!selectedResume}
        onOpenChange={() => setSelectedResume(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Manrope', sans-serif" }}>
              Currículo de {selectedResume?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedResume && (
            <div className="space-y-5 mt-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-lg font-bold text-muted-foreground">
                  {selectedResume.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {selectedResume.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedResume.experience} de experiência
                  </p>
                </div>
                {selectedResume.score && (
                  <div
                    className={`ml-auto text-3xl font-bold ${getScoreColor(selectedResume.score)}`}
                  >
                    {selectedResume.score}%
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate">
                    {selectedResume.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedResume.phone}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Competências
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedResume.skills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 rounded-xl bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => window.open(`mailto:${selectedResume.email}`)}
                >
                  <Mail className="h-4 w-4 mr-2" /> Entrar em Contato
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => window.open(`tel:${selectedResume.phone}`)}
                >
                  <Phone className="h-4 w-4 mr-2" /> Ligar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
