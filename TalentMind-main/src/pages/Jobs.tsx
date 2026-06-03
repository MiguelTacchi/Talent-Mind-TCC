import { useState } from "react";
import { Plus, Upload, Eye, Brain, MapPin, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { useToast } from "../hooks/use-toast";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  resumes: Resume[];
  createdAt: string;
}

interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  score?: number;
  status: "pending" | "analyzed" | "approved" | "rejected";
  skills: string[];
  experience: string;
}

const INITIAL_JOBS: Job[] = [
  {
    id: "j1",
    title: "Desenvolvedor Full Stack",
    department: "Tecnologia",
    location: "Remoto",
    type: "CLT",
    description: "Buscamos um desenvolvedor full stack experiente...",
    requirements: "React, Node.js, TypeScript, PostgreSQL",
    createdAt: "2026-04-01",
    resumes: [
      {
        id: "r1",
        name: "Carlos Oliveira",
        email: "carlos@email.com",
        phone: "(11) 99999-0001",
        score: 95,
        status: "analyzed",
        skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
        experience: "5 anos",
      },
      {
        id: "r2",
        name: "Ana Costa",
        email: "ana@email.com",
        phone: "(11) 99999-0002",
        score: 88,
        status: "analyzed",
        skills: ["React", "Python", "TypeScript"],
        experience: "3 anos",
      },
      {
        id: "r3",
        name: "Pedro Lima",
        email: "pedro@email.com",
        phone: "(11) 99999-0003",
        score: 72,
        status: "analyzed",
        skills: ["Vue.js", "Node.js", "JavaScript"],
        experience: "2 anos",
      },
      {
        id: "r4",
        name: "Juliana Santos",
        email: "juliana@email.com",
        phone: "(11) 99999-0004",
        status: "pending",
        skills: ["Angular", "Java"],
        experience: "4 anos",
      },
    ],
  },
  {
    id: "j2",
    title: "UX Designer Senior",
    department: "Design",
    location: "São Paulo, SP",
    type: "CLT",
    description: "Procuramos um UX Designer para liderar projetos...",
    requirements: "Figma, Design System, Pesquisa com usuários",
    createdAt: "2026-04-03",
    resumes: [
      {
        id: "r5",
        name: "Mariana Ferreira",
        email: "mariana@email.com",
        phone: "(11) 99999-0005",
        score: 91,
        status: "analyzed",
        skills: ["Figma", "Design System", "User Research"],
        experience: "6 anos",
      },
      {
        id: "r6",
        name: "Rafael Mendes",
        email: "rafael@email.com",
        phone: "(11) 99999-0006",
        score: 78,
        status: "analyzed",
        skills: ["Figma", "Sketch", "Adobe XD"],
        experience: "3 anos",
      },
    ],
  },
];

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    type: "CLT",
    description: "",
    requirements: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const createJob = () => {
    if (!newJob.title) return;
    const job: Job = {
      id: "j" + Date.now(),
      ...newJob,
      resumes: [],
      createdAt: new Date().toISOString().split("T")[0],
    };
    setJobs([job, ...jobs]);
    setNewJob({
      title: "",
      department: "",
      location: "",
      type: "CLT",
      description: "",
      requirements: "",
    });
    setDialogOpen(false);
    toast({
      title: "Vaga criada!",
      description: `A vaga "${job.title}" foi criada com sucesso.`,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Vagas
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie suas vagas e currículos
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/90">
              <Plus className="h-4 w-4 mr-2" /> Nova Vaga
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: "'Manrope', sans-serif" }}>
                Criar Nova Vaga
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Título da Vaga
                </Label>
                <Input
                  value={newJob.title}
                  onChange={(e) =>
                    setNewJob({ ...newJob, title: e.target.value })
                  }
                  placeholder="Ex: Desenvolvedor Front-end"
                  className="mt-2 h-11 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Departamento
                  </Label>
                  <Input
                    value={newJob.department}
                    onChange={(e) =>
                      setNewJob({ ...newJob, department: e.target.value })
                    }
                    placeholder="Ex: Tecnologia"
                    className="mt-2 h-11 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Localização
                  </Label>
                  <Input
                    value={newJob.location}
                    onChange={(e) =>
                      setNewJob({ ...newJob, location: e.target.value })
                    }
                    placeholder="Ex: Remoto"
                    className="mt-2 h-11 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Descrição
                </Label>
                <Textarea
                  value={newJob.description}
                  onChange={(e) =>
                    setNewJob({ ...newJob, description: e.target.value })
                  }
                  placeholder="Descreva a vaga..."
                  className="mt-2 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Requisitos (vírgula)
                </Label>
                <Input
                  value={newJob.requirements}
                  onChange={(e) =>
                    setNewJob({ ...newJob, requirements: e.target.value })
                  }
                  placeholder="React, TypeScript, Node.js"
                  className="mt-2 h-11 rounded-xl"
                />
              </div>
              <Button
                onClick={createJob}
                className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90"
              >
                Criar Vaga
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => {
          const analyzed = job.resumes.filter(
            (r) => r.status === "analyzed",
          ).length;
          const pending = job.resumes.filter(
            (r) => r.status === "pending",
          ).length;
          return (
            <div
              key={job.id}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-elevated transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {job.resumes.length} candidatos
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {job.requirements.split(",").map((r) => (
                      <span
                        key={r}
                        className="px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs font-medium"
                      >
                        {r.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                    {analyzed} analisados
                  </span>
                  {pending > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                      {pending} pendentes
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-5 pt-5 border-t border-border">
                <Link to={`/dashboard/jobs/${job.id}/resumes`} state={{ job }}>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Eye className="h-4 w-4 mr-1.5" /> Ver Currículos
                  </Button>
                </Link>
                <Link to={`/dashboard/jobs/${job.id}/upload`} state={{ job }}>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Upload className="h-4 w-4 mr-1.5" /> Enviar Currículo
                  </Button>
                </Link>
                <Link to={`/dashboard/jobs/${job.id}/analyze`} state={{ job }}>
                  <Button
                    size="sm"
                    className="rounded-lg bg-foreground text-background hover:bg-foreground/90"
                  >
                    <Brain className="h-4 w-4 mr-1.5" /> Analisar com IA
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
