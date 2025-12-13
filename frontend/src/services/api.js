import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const client = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } })

client.interceptors.response.use(
  res => res,
  err => {
    // pass through
    return Promise.reject(err)
  }
)

export default {
  get: (path, params) => client.get(path, { params }).then(r => r.data),
  post: (path, data) => client.post(path, data).then(r => r.data),
  patch: (path, data) => client.patch(path, data).then(r => r.data),
  del: (path) => client.delete(path).then(r => r.data)
}