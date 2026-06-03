import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, CheckCircle2 } from "lucide-react";

import { Button } from "../components/ui/button";
import { LottieAnimation } from "../components/LottieAnimation";

export default function AnalyzeResumes() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!job) {
    navigate("/dashboard/jobs");
    return null;
  }

  const startAnalysis = () => {
    setAnalyzing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setDone(true);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 500);
  };

  return (
    <div>
      <button
        onClick={() => navigate("/dashboard/jobs")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <h1
        className="text-2xl font-bold mb-1"
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        Análise com IA
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Vaga: <strong className="text-foreground">{job.title}</strong> —{" "}
        {job.resumes.length} currículos
      </p>

      <div className="max-w-md mx-auto text-center py-8">
        {!analyzing && !done && (
          <div className="animate-fade-up">
            <LottieAnimation
              src="../../animation/computer.lottie"
              className="w-48 h-48 mx-auto mb-6"
            />
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Pronto para Analisar
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              A IA irá analisar {job.resumes.length} currículos com base nos
              requisitos: <br />
              <strong className="text-foreground">{job.requirements}</strong>
            </p>
            <Button
              onClick={startAnalysis}
              size="lg"
              className="rounded-xl bg-foreground text-background hover:bg-foreground/90"
            >
              <Brain className="h-5 w-5 mr-2" /> Iniciar Análise
            </Button>
          </div>
        )}

        {analyzing && (
          <div>
            <LottieAnimation
              src="../../animation/computer.lottie"
              className="w-48 h-48 mx-auto mb-6"
            />
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Analisando Currículos...
            </h2>
            <p className="text-muted-foreground text-sm mb-5">
              A IA está avaliando competências e experiências
            </p>
            <div className="w-full bg-secondary rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.min(Math.round(progress), 100)}%
            </p>
          </div>
        )}

        {done && (
          <div className="animate-fade-up">
            <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-6" />
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Análise Concluída!
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Todos os currículos foram analisados e ranqueados.
            </p>
            <Button
              onClick={() =>
                navigate(`/dashboard/jobs/${job.id}/resumes`, {
                  state: { job },
                })
              }
              className="rounded-xl bg-foreground text-background hover:bg-foreground/90"
            >
              Ver Ranking dos Candidatos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
