import axios from 'axios'

const BASE = 'http://localhost:8080'

const api = axios.create({ baseURL: BASE })

// Auto-attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-redirect to login on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── Auth ─────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login:    (data) => api.post('/api/auth/login', data),
}

// ─── Analysis ─────────────────────────────────────
export const analysisAPI = {
  submit: (data) => api.post('/api/analyze', data),
}

// ─── Reports ──────────────────────────────────────
export const reportsAPI = {
  getAll:    ()         => api.get('/api/reports'),
  getOne:    (id)       => api.get(`/api/reports/${id}`),
  deleteOne: (id)       => api.delete(`/api/reports/${id}`),
}

export default api