# 🧠 TalentMind

> Plataforma inteligente de recrutamento com análise de currículos por IA.

TalentMind automatiza a triagem de currículos usando inteligência artificial (Groq + LLaMA 3), gerando rankings automáticos de candidatos, pontuações e análises detalhadas para cada vaga.

🌐 **Demo ao vivo:** https://talent-mind-eight.vercel.app  
⚙️ **API:** https://talent-mind.onrender.com

---

## ✨ Funcionalidades

- 📋 **Gestão de Vagas** — Crie e gerencie vagas com descrição, requisitos, localização e tipo de contrato
- 📄 **Upload de Currículos** — Envio de currículos em PDF com extração automática de texto
- 🤖 **Análise por IA** — Pontuação de 0 a 100, pontos fortes, pontos fracos, skills e experiência identificados automaticamente
- 🏆 **Ranking de Candidatos** — Candidatos ordenados automaticamente por score de compatibilidade
- 👥 **Gestão de Time** — Convide membros da equipe com diferentes níveis de acesso
- 🌙 **Tema Dark/Light** — Interface com suporte a tema escuro e claro
- 🔐 **Autenticação JWT** — Login seguro com tokens de acesso

---

## 🛠️ Tecnologias

### Backend
- **Node.js** (v22+) com Express
- **SQLite** nativo (Node.js experimental)
- **Groq API** com modelo LLaMA 3.3 70B
- **JWT** para autenticação
- **Multer** para upload de arquivos
- **pdf-parse** para extração de texto de PDFs
- **bcryptjs** para hash de senhas

### Frontend
- **React 19** com TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilização
- **shadcn/ui** como biblioteca de componentes
- **React Router DOM** para navegação
- **TanStack Query** para gerenciamento de estado
- **Recharts** para gráficos
- **Lottie** para animações

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js v22 ou superior
- npm

Verifique sua versão: `node --version`

### 1. Clone o repositório
```bash
git clone https://github.com/MiguelTacchi/Talent-Mind.git
cd Talent-Mind
```

### 2. Configure o Backend
```bash
cd backend
npm install
```

Crie o arquivo `.env` na pasta `backend` (use UTF-8 sem BOM):
```env
GROQ_API_KEY=sua_chave_aqui
```

> 💡 Obtenha sua chave gratuita em [console.groq.com](https://console.groq.com)

Rode o backend:
```bash
npm run dev
```

O backend estará disponível em `http://localhost:3001`

### 3. Configure o Frontend
```bash
cd ../frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

---

## 🔑 Logins de Teste

| Perfil | Email | Senha |
|--------|-------|-------|
| Site Creator | admin@talentmind.com | admin123 |
| Company Admin | admin@empresa.com | empresa123 |
| Company User | usuario@empresa.com | usuario123 |

---

## 🌐 Deploy

| Serviço | URL |
|---------|-----|
| Frontend (Vercel) | https://talent-mind-eight.vercel.app |
| Backend (Render) | https://talent-mind.onrender.com |

> ⚠️ O plano gratuito do Render pode demorar até 50 segundos para responder após inatividade.

---

## 📁 Estrutura do Projeto

```
TalentMind/
├── backend/
│   ├── uploads/          # Currículos enviados
│   ├── database.sqlite   # Banco de dados (criado automaticamente)
│   ├── server.js         # Servidor Express
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── contexts/     # Contextos React
│   │   ├── hooks/        # Hooks customizados
│   │   └── lib/          # Utilitários e API client
│   └── package.json
└── README.md
```

## 🗄️ Banco de Dados

SQLite em `backend/database.sqlite` — criado automaticamente na primeira execução. Nenhuma configuração extra necessária.

Tabelas: `users`, `jobs`, `resumes`

---

## 👥 Equipe

- **Miguel Tachi**
- **Luana Cirilo**
- **Igor Honório**
