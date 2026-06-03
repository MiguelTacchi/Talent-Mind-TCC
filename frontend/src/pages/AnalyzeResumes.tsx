import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Brain, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "../components/ui/button";
import { LottieAnimation } from "../components/LottieAnimation";
import { api } from "../lib/api";
import { useToast } from "../hooks/use-toast";

export default function AnalyzeResumes() {
  const { id: jobId } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<{ analyzed: number; total: number } | null>(null);

  if (!job && !jobId) { navigate("/dashboard/jobs"); return null; }

  const startAnalysis = async () => {
    setAnalyzing(true);
    try {
      const r = await api.jobs.analyze(jobId || job.id);
      setResult(r);
      setDone(true);
    } catch (e: any) {
      toast({ title: "Erro na análise", description: e.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/dashboard/jobs")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Manrope', sans-serif" }}>Análise com IA</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Vaga: <strong className="text-foreground">{job?.title}</strong>
      </p>

      <div className="max-w-md mx-auto text-center py-8">
        {!analyzing && !done && (
          <div className="animate-fade-up">
            <LottieAnimation src="/animation/deep_seacrh.lottie" className="w-48 h-48 mx-auto mb-6" />
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>Pronto para Analisar</h2>
            <p className="text-muted-foreground text-sm mb-6">
              A IA irá analisar todos os currículos pendentes com base nos requisitos:{" "}
              <br /><strong className="text-foreground">{job?.requirements}</strong>
            </p>
            <Button onClick={startAnalysis} size="lg" className="rounded-xl bg-foreground text-background hover:bg-foreground/90">
              <Brain className="h-5 w-5 mr-2" /> Iniciar Análise
            </Button>
          </div>
        )}

        {analyzing && (
          <div>
            <LottieAnimation src="/animation/deep_seacrh.lottie" className="w-48 h-48 mx-auto mb-6" />
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>Analisando Currículos...</h2>
            <p className="text-muted-foreground text-sm mb-5">A IA está avaliando competências e experiências</p>
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          </div>
        )}

        {done && (
          <div className="animate-fade-up">
            <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-6" />
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>Análise Concluída!</h2>
            <p className="text-muted-foreground text-sm mb-6">
              {result?.analyzed} de {result?.total} currículos foram analisados e ranqueados.
            </p>
            <Button onClick={() => navigate(`/dashboard/jobs/${jobId || job?.id}/resumes`, { state: { job } })}
              className="rounded-xl bg-foreground text-background hover:bg-foreground/90">
              Ver Ranking dos Candidatos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
