import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'
import { v4 as uuidv4 } from 'uuid'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const u = localStorage.getItem('workteam_user')
      if (u) setUser(JSON.parse(u))
    } catch {}
  }, [])

  const login = async (email, password) => {
    try {
      const users = await api.get('/users', { email })
      const found = (users || []).find(u => u.email === email)
      if (!found) throw new Error('Không tìm thấy tài khoản')
      if ((found.password || '') !== password) throw new Error('Mật khẩu không đúng')
      localStorage.setItem('workteam_user', JSON.stringify(found))
      setUser(found)
      return found
    } catch (err) {
      throw err
    }
  }

  const register = async ({ name, email, password, role = 'student' }) => {
    try {
      const existing = await api.get('/users', { email })
      if ((existing || []).length > 0) throw new Error('Email đã được sử dụng')
      const payload = { name, email, role, password, created_at: new Date().toISOString() }
      const created = await api.post('/users', payload)
      localStorage.setItem('workteam_user', JSON.stringify(created))
      setUser(created)
      return created
    } catch (err) {
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('workteam_user')
    setUser(null)
  }

  // forgotPassword: create password_resets record and return the created record (mock)
  const forgotPassword = async (email) => {
    try {
      const users = await api.get('/users', { email })
      const found = (users || []).find(u => u.email === email)
      if (!found) {
        // For UX in demo keep consistent - return null but still resolve
        // throw new Error('Không tìm thấy email')
        return null
      }
      const token = uuidv4()
      const expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
      const payload = { email, token, userId: found.id, expires_at, created_at: new Date().toISOString() }
      const created = await api.post('/password_resets', payload)
      // return full created record so UI can show token and link
      return created
    } catch (err) {
      throw err
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      const resets = await api.get('/password_resets', { token })
      const record = (resets || []).find(r => r.token === token)
      if (!record) throw new Error('Token không hợp lệ')
      if (new Date(record.expires_at).getTime() < Date.now()) throw new Error('Token đã hết hạn')
      const userId = record.userId
      await api.patch(`/users/${userId}`, { password: newPassword })
      // delete reset record
      await api.del(`/password_resets/${record.id}`)
      return true
    } catch (err) {
      throw err
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}