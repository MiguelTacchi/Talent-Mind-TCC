import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileText, CheckCircle2 } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { LottieAnimation } from "../components/LottieAnimation";

export default function UploadResume() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState(false);

  if (!job) {
    navigate("/dashboard/jobs");
    return null;
  }

  const handleUpload = () => {
    if (files.length === 0) return;
    setUploaded(true);
    toast({
      title: "Currículos enviados!",
      description: `${files.length} currículo(s) enviado(s) para a vaga "${job.title}".`,
    });
  };

  return (
    <div>
      <button
        onClick={() => navigate("/dashboard/jobs")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para Vagas
      </button>

      <h1
        className="text-2xl font-bold mb-1"
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        Enviar Currículos
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Vaga: <strong className="text-foreground">{job.title}</strong>
      </p>

      {uploaded ? (
        <div className="text-center py-16 animate-fade-up">
          <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
          <h2
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Currículos Enviados!
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {files.length} arquivo(s) enviado(s) com sucesso.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => {
                setFiles([]);
                setUploaded(false);
              }}
              variant="outline"
              className="rounded-xl"
            >
              Enviar Mais
            </Button>
            <Button
              onClick={() => navigate("/dashboard/jobs")}
              className="rounded-xl bg-foreground text-background hover:bg-foreground/90"
            >
              Voltar para Vagas
            </Button>
          </div>
        </div>
      ) : (
        <div className="max-w-xl">
          <div
            className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/40 transition-colors cursor-pointer bg-card"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <LottieAnimation
              src="../../animation/computer.lottie"
              className="w-24 h-24 mx-auto mb-4"
            />
            <p className="font-medium mb-1 text-sm">
              Clique ou arraste os arquivos aqui
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, DOCX — Máximo 10MB por arquivo
            </p>
            <Input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.docx,.doc"
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Arquivos selecionados
              </Label>
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 rounded-xl bg-secondary text-sm"
                >
                  <FileText className="h-4 w-4 text-primary" />
                  <span>{f.name}</span>
                  <span className="text-muted-foreground ml-auto text-xs">
                    {(f.size / 1024).toFixed(0)} KB
                  </span>
                </div>
              ))}
              <Button
                onClick={handleUpload}
                className="w-full mt-4 rounded-xl h-11 bg-foreground text-background hover:bg-foreground/90"
              >
                <Upload className="h-4 w-4 mr-2" /> Enviar {files.length}{" "}
                Currículo(s)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
