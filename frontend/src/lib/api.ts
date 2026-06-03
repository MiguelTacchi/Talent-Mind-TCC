const BASE = import.meta.env.VITE_API_URL || ''

function getToken() {
  return localStorage.getItem('tm-token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type']
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`)
  }
  return data as T
}

// â”€â”€â”€ Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ user: any; token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (data: { name: string; email: string; password: string; companyName: string }) =>
      request<{ user: any; token: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    me: () => request<{ user: any }>('/api/auth/me'),

    changePassword: (currentPassword: string, newPassword: string) =>
      request<{ ok: boolean }>('/api/auth/password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },

  // â”€â”€â”€ Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  dashboard: {
    get: () => request<any>('/api/dashboard'),
  },

  // â”€â”€â”€ Jobs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  jobs: {
    list: () => request<{ jobs: any[] }>('/api/jobs'),

    create: (data: {
      title: string
      department: string
      location: string
      type: string
      description: string
      requirements: string
    }) => request<{ job: any }>('/api/jobs', { method: 'POST', body: JSON.stringify(data) }),

    get: (id: string) => request<{ job: any }>(`/api/jobs/${id}`),

    update: (id: string, data: any) =>
      request<{ job: any }>(`/api/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id: string) => request<{ ok: boolean }>(`/api/jobs/${id}`, { method: 'DELETE' }),

    analyze: (id: string) =>
      request<{ analyzed: number; total: number }>(`/api/jobs/${id}/analyze`, { method: 'POST' }),
  },

  // â”€â”€â”€ Resumes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  resumes: {
    list: (jobId: string) => request<{ resumes: any[] }>(`/api/jobs/${jobId}/resumes`),

    upload: (jobId: string, formData: FormData) =>
      request<{ resume: any }>(`/api/jobs/${jobId}/resumes`, {
        method: 'POST',
        body: formData,
      }),

    get: (jobId: string, resumeId: string) =>
      request<{ resume: any }>(`/api/jobs/${jobId}/resumes/${resumeId}`),

    updateStatus: (jobId: string, resumeId: string, status: string) =>
      request<{ resume: any }>(`/api/jobs/${jobId}/resumes/${resumeId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),

    delete: (jobId: string, resumeId: string) =>
      request<{ ok: boolean }>(`/api/jobs/${jobId}/resumes/${resumeId}`, { method: 'DELETE' }),
  },

  // â”€â”€â”€ Team â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  team: {
    list: () => request<{ members: any[] }>('/api/team'),

    invite: (data: { name: string; email: string; password: string; role: string }) =>
      request<{ member: any }>('/api/team', { method: 'POST', body: JSON.stringify(data) }),

    remove: (memberId: string) =>
      request<{ ok: boolean }>(`/api/team/${memberId}`, { method: 'DELETE' }),
  },

  // â”€â”€â”€ Company â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  company: {
    get: () => request<{ company: any }>('/api/company'),
    update: (companyName: string) =>
      request<{ ok: boolean }>('/api/company', {
        method: 'PATCH',
        body: JSON.stringify({ companyName }),
      }),
  },
}

