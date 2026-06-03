// TalentMind Backend — Node.js puro, sem TypeScript
// Requer Node.js v22+ (SQLite nativo)
'use strict'

const fs = require('fs');
const express    = require('express')
const cors       = require('cors')
const bcrypt     = require('bcryptjs')
const jwt        = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const multer     = require('multer')
const path       = require('path')
const { DatabaseSync } = require('node:sqlite')

// ─── Config ──────────────────────────────────────────────────────────────────
const PORT         = process.env.PORT         || 3001
const JWT_SECRET   = process.env.JWT_SECRET   || 'dev_secret_change_me'
const JWT_EXPIRES  = process.env.JWT_EXPIRES_IN || '7d'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const UPLOAD_DIR   = process.env.UPLOAD_DIR   || path.join(__dirname, 'uploads')
const DB_PATH      = process.env.DB_PATH      || path.join(__dirname, 'database.sqlite')
const MAX_MB       = parseInt(process.env.MAX_FILE_SIZE_MB || '10')
const GROQ_KEY    = process.env.GROQ_API_KEY || ''

// ─── Upload dir ───────────────────────────────────────────────────────────────
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

// ─── SQLite ───────────────────────────────────────────────────────────────────
let db = null

function getDb() {
  if (!db) {
    db = new DatabaseSync(DB_PATH)
    db.exec('PRAGMA journal_mode = WAL')
    db.exec('PRAGMA foreign_keys = ON')
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id           TEXT PRIMARY KEY,
        name         TEXT NOT NULL,
        email        TEXT UNIQUE NOT NULL,
        password     TEXT NOT NULL,
        role         TEXT NOT NULL DEFAULT 'company_admin',
        company_id   TEXT,
        company_name TEXT,
        created_at   TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS jobs (
        id           TEXT PRIMARY KEY,
        user_id      TEXT NOT NULL,
        company_id   TEXT NOT NULL,
        title        TEXT NOT NULL,
        department   TEXT NOT NULL DEFAULT '',
        location     TEXT NOT NULL DEFAULT '',
        type         TEXT NOT NULL DEFAULT 'CLT',
        description  TEXT NOT NULL,
        requirements TEXT NOT NULL,
        status       TEXT NOT NULL DEFAULT 'open',
        created_at   TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS resumes (
        id            TEXT PRIMARY KEY,
        job_id        TEXT NOT NULL,
        name          TEXT NOT NULL,
        email         TEXT NOT NULL,
        phone         TEXT NOT NULL DEFAULT '',
        file_path     TEXT,
        file_name     TEXT,
        resume_text   TEXT,
        ai_score      REAL,
        ai_summary    TEXT,
        ai_pros       TEXT,
        ai_cons       TEXT,
        ai_skills     TEXT,
        ai_experience TEXT,
        status        TEXT NOT NULL DEFAULT 'pending',
        created_at    TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
      );
    `)
  }
  return db
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Não autorizado.' })
    }
    req.user = jwt.verify(auth.split(' ')[1], JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido.' })
  }
}

// ─── Resume helpers ───────────────────────────────────────────────────────────
function parseResume(r) {
  if (!r) return r
  return {
    ...r,
    ai_pros:   r.ai_pros   ? JSON.parse(r.ai_pros)   : [],
    ai_cons:   r.ai_cons   ? JSON.parse(r.ai_cons)   : [],
    ai_skills: r.ai_skills ? JSON.parse(r.ai_skills) : [],
  }
}

// ─── AI analysis ─────────────────────────────────────────────────────────────
async function analyzeResume(resumeText, jobTitle, jobRequirements) {
  if (!GROQ_KEY) {
    return {
      score: 50,
      summary: 'Configure GROQ_API_KEY no .env para análise automática.',
      pros: ['Currículo recebido com sucesso'],
      cons: ['Análise de IA desativada'],
      skills: [],
      experience: 'Não identificado',
    }
  }

  const prompt = `
Você é um recrutador especialista. Analise o currículo abaixo para a vaga descrita e responda APENAS com JSON válido, sem markdown.

VAGA: ${jobTitle}
REQUISITOS: ${jobRequirements}

CURRÍCULO:
${resumeText.slice(0, 6000)}

JSON exato:
{"score":<0-100>,"summary":"<2-3 frases>","pros":["<forte 1>","<forte 2>"],"cons":["<fraco 1>","<fraco 2>"],"skills":["<skill 1>","<skill 2>"],"experience":"<ex: 3 anos>"}
`.trim()

  try {
    const res = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
        }),
      }
    )
    const data = await res.json()
    const raw = data?.choices?.[0]?.message?.content ?? ''
    return JSON.parse(raw.replace(/```json|```/g, '').trim())
  } catch (err) {
    console.error('[ai] erro:', err.message)
    return { score: 50, summary: 'Erro na análise automática.', pros: [], cons: [], skills: [], experience: 'Não identificado' }
  }
}

// ─── Express app ─────────────────────────────────────────────────────────────
const app = express()

app.use(cors({ origin: FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use('/uploads', express.static(UPLOAD_DIR))

// Multer (upload de arquivos)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
})
const upload = multer({
  storage,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ['.pdf', '.doc', '.docx'].includes(path.extname(file.originalname).toLowerCase())
    cb(null, ok)
  },
})

// ─── ROTAS ───────────────────────────────────────────────────────────────────

// Health
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// ── Auth: Register ────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body
    if (!name || !email || !password || !companyName)
      return res.status(400).json({ error: 'Preencha todos os campos.' })
    if (password.length < 6)
      return res.status(400).json({ error: 'Senha deve ter ao menos 6 caracteres.' })

    const db = getDb()
    if (db.prepare('SELECT id FROM users WHERE email = ?').get(email))
      return res.status(409).json({ error: 'E-mail já cadastrado.' })

    const id = uuidv4()
    const companyId = 'c' + uuidv4()
    const hashed = await bcrypt.hash(password, 12)
    db.prepare('INSERT INTO users (id,name,email,password,role,company_id,company_name) VALUES (?,?,?,?,?,?,?)')
      .run(id, name, email, hashed, 'company_admin', companyId, companyName)

    const user = { id, name, email, role: 'company_admin', companyId, companyName }
    res.status(201).json({ user, token: signToken(user) })
  } catch (err) {
    console.error('[register]', err)
    res.status(500).json({ error: 'Erro interno.' })
  }
})

// ── Auth: Login ───────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' })

    const db = getDb()
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    if (!row || !(await bcrypt.compare(password, row.password)))
      return res.status(401).json({ error: 'Credenciais inválidas.' })

    const user = { id: row.id, name: row.name, email: row.email, role: row.role, companyId: row.company_id, companyName: row.company_name }
    res.json({ user, token: signToken(user) })
  } catch (err) {
    console.error('[login]', err)
    res.status(500).json({ error: 'Erro interno.' })
  }
})

// ── Auth: Me ──────────────────────────────────────────────────────────────────
app.get('/api/auth/me', requireAuth, (req, res) => res.json({ user: req.user }))

// ── Auth: Change password ─────────────────────────────────────────────────────
app.patch('/api/auth/password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const db = getDb()
    const row = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id)
    if (!row) return res.status(404).json({ error: 'Usuário não encontrado.' })
    if (!(await bcrypt.compare(currentPassword, row.password)))
      return res.status(400).json({ error: 'Senha atual incorreta.' })
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ error: 'Nova senha deve ter ao menos 6 caracteres.' })
    db.prepare('UPDATE users SET password=? WHERE id=?').run(await bcrypt.hash(newPassword, 12), req.user.id)
    res.json({ ok: true })
  } catch (err) {
    console.error('[changePassword]', err)
    res.status(500).json({ error: 'Erro interno.' })
  }
})

// ── Dashboard ─────────────────────────────────────────────────────────────────
app.get('/api/dashboard', requireAuth, (req, res) => {
  const db = getDb()
  const cid = req.user.companyId || req.user.id
  const totalJobs      = db.prepare('SELECT COUNT(*) as n FROM jobs WHERE company_id=?').get(cid).n
  const openJobs       = db.prepare("SELECT COUNT(*) as n FROM jobs WHERE company_id=? AND status='open'").get(cid).n
  const totalResumes   = db.prepare('SELECT COUNT(r.id) as n FROM resumes r JOIN jobs j ON j.id=r.job_id WHERE j.company_id=?').get(cid).n
  const analyzedResumes = db.prepare("SELECT COUNT(r.id) as n FROM resumes r JOIN jobs j ON j.id=r.job_id WHERE j.company_id=? AND r.status='analyzed'").get(cid).n
  const recentJobs     = db.prepare('SELECT j.*,COUNT(r.id) as resumes_count FROM jobs j LEFT JOIN resumes r ON r.job_id=j.id WHERE j.company_id=? GROUP BY j.id ORDER BY j.created_at DESC LIMIT 5').all(cid)
  res.json({ totalJobs, openJobs, totalResumes, analyzedResumes, recentJobs })
})

// ── Jobs ──────────────────────────────────────────────────────────────────────
app.get('/api/jobs', requireAuth, (req, res) => {
  const db = getDb()
  const cid = req.user.companyId || req.user.id
  const jobs = db.prepare('SELECT j.*,COUNT(r.id) as resumes_count FROM jobs j LEFT JOIN resumes r ON r.job_id=j.id WHERE j.company_id=? GROUP BY j.id ORDER BY j.created_at DESC').all(cid)
  res.json({ jobs })
})

app.post('/api/jobs', requireAuth, (req, res) => {
  const { title, department, location, type, description, requirements } = req.body
  if (!title || !description || !requirements)
    return res.status(400).json({ error: 'Título, descrição e requisitos são obrigatórios.' })
  const db = getDb()
  const id = uuidv4()
  const cid = req.user.companyId || req.user.id
  db.prepare('INSERT INTO jobs (id,user_id,company_id,title,department,location,type,description,requirements) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(id, req.user.id, cid, title, department||'', location||'', type||'CLT', description, requirements)
  res.status(201).json({ job: db.prepare('SELECT * FROM jobs WHERE id=?').get(id) })
})

app.get('/api/jobs/:id', requireAuth, (req, res) => {
  const job = getDb().prepare('SELECT * FROM jobs WHERE id=? AND company_id=?').get(req.params.id, req.user.companyId || req.user.id)
  if (!job) return res.status(404).json({ error: 'Vaga não encontrada.' })
  res.json({ job })
})

app.put('/api/jobs/:id', requireAuth, (req, res) => {
  const db = getDb()
  const cid = req.user.companyId || req.user.id
  if (!db.prepare('SELECT id FROM jobs WHERE id=? AND company_id=?').get(req.params.id, cid))
    return res.status(404).json({ error: 'Vaga não encontrada.' })
  const { title, department, location, type, description, requirements, status } = req.body
  db.prepare('UPDATE jobs SET title=?,department=?,location=?,type=?,description=?,requirements=?,status=? WHERE id=?')
    .run(title, department, location, type, description, requirements, status, req.params.id)
  res.json({ job: db.prepare('SELECT * FROM jobs WHERE id=?').get(req.params.id) })
})

app.delete('/api/jobs/:id', requireAuth, (req, res) => {
  const db = getDb()
  const cid = req.user.companyId || req.user.id
  if (!db.prepare('SELECT id FROM jobs WHERE id=? AND company_id=?').get(req.params.id, cid))
    return res.status(404).json({ error: 'Vaga não encontrada.' })
  db.prepare('DELETE FROM jobs WHERE id=?').run(req.params.id)
  res.json({ ok: true })
})

// ── Resumes ───────────────────────────────────────────────────────────────────
app.get('/api/jobs/:id/resumes', requireAuth, (req, res) => {
  const db = getDb()
  const cid = req.user.companyId || req.user.id
  if (!db.prepare('SELECT id FROM jobs WHERE id=? AND company_id=?').get(req.params.id, cid))
    return res.status(404).json({ error: 'Vaga não encontrada.' })
  const resumes = db.prepare('SELECT * FROM resumes WHERE job_id=? ORDER BY CASE WHEN ai_score IS NULL THEN 1 ELSE 0 END, ai_score DESC, created_at DESC').all(req.params.id).map(parseResume)
  res.json({ resumes })
})

app.post('/api/jobs/:id/resumes', requireAuth, upload.single('resume'), async (req, res) => {
  const db = getDb()
  const cid = req.user.companyId || req.user.id
  const job = db.prepare('SELECT * FROM jobs WHERE id=? AND company_id=?').get(req.params.id, cid)
  if (!job) return res.status(404).json({ error: 'Vaga não encontrada.' })

  const { name, email, phone } = req.body
  if (!name || !email) return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' })
  if (!req.file)        return res.status(400).json({ error: 'Envie o currículo em PDF.' })

  try {
    let resumeText = ''
    let analysis = { score: 50, summary: 'Processando...', pros: [], cons: [], skills: [], experience: 'Não identificado' }

    if (path.extname(req.file.originalname).toLowerCase() === '.pdf') {
      const pdfParse = require('pdf-parse').default || require('pdf-parse')
      const pdfData  = await pdfParse(fs.readFileSync(req.file.path))
      resumeText = pdfData.text
      analysis   = await analyzeResume(resumeText, job.title, job.requirements)
    }

    const id = uuidv4()
    db.prepare('INSERT INTO resumes (id,job_id,name,email,phone,file_path,file_name,resume_text,ai_score,ai_summary,ai_pros,ai_cons,ai_skills,ai_experience,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
      .run(id, req.params.id, name, email, phone||'', req.file.path, req.file.originalname, resumeText, analysis.score, analysis.summary, JSON.stringify(analysis.pros), JSON.stringify(analysis.cons), JSON.stringify(analysis.skills), analysis.experience, 'analyzed')

    res.status(201).json({ resume: parseResume(db.prepare('SELECT * FROM resumes WHERE id=?').get(id)) })
  } catch (err) {
    console.error('[uploadResume]', err)
    if (req.file) fs.unlink(req.file.path, () => {})
    res.status(500).json({ error: 'Erro ao processar currículo.' })
  }
})

app.get('/api/jobs/:id/resumes/:resumeId', requireAuth, (req, res) => {
  const db = getDb()
  const cid = req.user.companyId || req.user.id
  if (!db.prepare('SELECT id FROM jobs WHERE id=? AND company_id=?').get(req.params.id, cid))
    return res.status(404).json({ error: 'Vaga não encontrada.' })
  const resume = db.prepare('SELECT * FROM resumes WHERE id=? AND job_id=?').get(req.params.resumeId, req.params.id)
  if (!resume) return res.status(404).json({ error: 'Currículo não encontrado.' })
  res.json({ resume: parseResume(resume) })
})

app.patch('/api/jobs/:id/resumes/:resumeId/status', requireAuth, (req, res) => {
  const { status } = req.body
  if (!['pending','analyzed','approved','rejected'].includes(status))
    return res.status(400).json({ error: 'Status inválido.' })
  const db = getDb()
  const cid = req.user.companyId || req.user.id
  if (!db.prepare('SELECT id FROM jobs WHERE id=? AND company_id=?').get(req.params.id, cid))
    return res.status(404).json({ error: 'Vaga não encontrada.' })
  db.prepare('UPDATE resumes SET status=? WHERE id=? AND job_id=?').run(status, req.params.resumeId, req.params.id)
  res.json({ resume: parseResume(db.prepare('SELECT * FROM resumes WHERE id=?').get(req.params.resumeId)) })
})

app.delete('/api/jobs/:id/resumes/:resumeId', requireAuth, (req, res) => {
  const db = getDb()
  const cid = req.user.companyId || req.user.id
  if (!db.prepare('SELECT id FROM jobs WHERE id=? AND company_id=?').get(req.params.id, cid))
    return res.status(404).json({ error: 'Vaga não encontrada.' })
  const resume = db.prepare('SELECT * FROM resumes WHERE id=? AND job_id=?').get(req.params.resumeId, req.params.id)
  if (!resume) return res.status(404).json({ error: 'Currículo não encontrado.' })
  if (resume.file_path && fs.existsSync(resume.file_path)) fs.unlinkSync(resume.file_path)
  db.prepare('DELETE FROM resumes WHERE id=?').run(req.params.resumeId)
  res.json({ ok: true })
})

// ── Analyze all pending resumes ───────────────────────────────────────────────
app.post('/api/jobs/:id/analyze', requireAuth, async (req, res) => {
  const db = getDb()
  const cid = req.user.companyId || req.user.id
  const job = db.prepare('SELECT * FROM jobs WHERE id=? AND company_id=?').get(req.params.id, cid)
  if (!job) return res.status(404).json({ error: 'Vaga não encontrada.' })

  const pending = db.prepare("SELECT * FROM resumes WHERE job_id=? AND status='pending'").all(req.params.id)
  let analyzed = 0
  for (const r of pending) {
    try {
      const a = await analyzeResume(r.resume_text || '', job.title, job.requirements)
      db.prepare("UPDATE resumes SET ai_score=?,ai_summary=?,ai_pros=?,ai_cons=?,ai_skills=?,ai_experience=?,status='analyzed' WHERE id=?")
        .run(a.score, a.summary, JSON.stringify(a.pros), JSON.stringify(a.cons), JSON.stringify(a.skills), a.experience, r.id)
      analyzed++
    } catch (err) { console.error('[analyze]', err) }
  }
  res.json({ analyzed, total: pending.length })
})

// ── Team ──────────────────────────────────────────────────────────────────────
app.get('/api/team', requireAuth, (req, res) => {
  const members = getDb().prepare('SELECT id,name,email,role,created_at FROM users WHERE company_id=? ORDER BY created_at DESC').all(req.user.companyId || req.user.id)
  res.json({ members })
})

app.post('/api/team', requireAuth, async (req, res) => {
  if (req.user.role !== 'company_admin' && req.user.role !== 'site_creator')
    return res.status(403).json({ error: 'Sem permissão.' })
  const { name, email, password, role } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' })
  const db = getDb()
  if (db.prepare('SELECT id FROM users WHERE email=?').get(email))
    return res.status(409).json({ error: 'E-mail já cadastrado.' })
  const id = uuidv4()
  db.prepare('INSERT INTO users (id,name,email,password,role,company_id,company_name) VALUES (?,?,?,?,?,?,?)')
    .run(id, name, email, await bcrypt.hash(password, 12), role||'company_user', req.user.companyId, req.user.companyName)
  res.status(201).json({ member: db.prepare('SELECT id,name,email,role,created_at FROM users WHERE id=?').get(id) })
})

app.delete('/api/team/:memberId', requireAuth, (req, res) => {
  if (req.user.role !== 'company_admin' && req.user.role !== 'site_creator')
    return res.status(403).json({ error: 'Sem permissão.' })
  const db = getDb()
  const member = db.prepare('SELECT * FROM users WHERE id=? AND company_id=?').get(req.params.memberId, req.user.companyId || req.user.id)
  if (!member) return res.status(404).json({ error: 'Membro não encontrado.' })
  if (member.id === req.user.id) return res.status(400).json({ error: 'Não é possível remover a si mesmo.' })
  db.prepare('DELETE FROM users WHERE id=?').run(req.params.memberId)
  res.json({ ok: true })
})

// ── Company ───────────────────────────────────────────────────────────────────
app.get('/api/company', requireAuth, (req, res) => {
  const row = getDb().prepare('SELECT company_id,company_name FROM users WHERE id=?').get(req.user.id)
  res.json({ company: { id: row?.company_id, name: row?.company_name } })
})

app.patch('/api/company', requireAuth, (req, res) => {
  const { companyName } = req.body
  if (!companyName) return res.status(400).json({ error: 'Nome da empresa é obrigatório.' })
  getDb().prepare('UPDATE users SET company_name=? WHERE company_id=?').run(companyName, req.user.companyId)
  res.json({ ok: true, companyName })
})

// ─── Seed de desenvolvimento ──────────────────────────────────────────────────
const DEV_USERS = [
  {
    id: 'seed-site-creator-001',
    name: 'Admin Plataforma',
    email: 'admin@talentmind.com',
    password: 'admin123',
    role: 'site_creator',
    company_id: null,
    company_name: null,
  },
  {
    id: 'seed-company-admin-001',
    name: 'Admin Empresa',
    email: 'admin@empresa.com',
    password: 'empresa123',
    role: 'company_admin',
    company_id: 'company-demo-001',
    company_name: 'Empresa Demo',
  },
  {
    id: 'seed-company-user-001',
    name: 'Usuário Empresa',
    email: 'usuario@empresa.com',
    password: 'usuario123',
    role: 'company_user',
    company_id: 'company-demo-001',
    company_name: 'Empresa Demo',
  },
]

async function seedDevUsers() {
  const db = getDb()
  for (const u of DEV_USERS) {
    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(u.email)
    if (!exists) {
      const hashed = await bcrypt.hash(u.password, 12)
      db.prepare('INSERT INTO users (id,name,email,password,role,company_id,company_name) VALUES (?,?,?,?,?,?,?)')
        .run(u.id, u.name, u.email, hashed, u.role, u.company_id, u.company_name)
    }
  }
}

// ─── Start ────────────────────────────────────────────────────────────────────
seedDevUsers().then(() => {
  app.listen(PORT, () => {
    console.log(`\n✅ TalentMind API → http://localhost:${PORT}`)
    console.log(`   Banco de dados: ${DB_PATH}`)
    console.log(`   IA Groq: ${GROQ_KEY ? '✅ configurada' : '⚠️  não configurada (defina GROQ_API_KEY no .env)'}`)
    console.log(`\n🔑 Logins de teste:`)
    console.log(`   site_creator  → admin@talentmind.com   / admin123`)
    console.log(`   company_admin → admin@empresa.com      / empresa123`)
    console.log(`   company_user  → usuario@empresa.com    / usuario123\n`)
  })
}).catch(console.error)
