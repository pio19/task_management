import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function UserFormModal({ user = null, open, onClose, onSaved }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setRole(user.role || 'student')
    } else {
      setName('')
      setEmail('')
      setRole('student')
    }
  }, [user, open])

  const submit = async (e) => {
    e && e.preventDefault()
    if (!email.trim() || !name.trim()) return alert('Tên và email là bắt buộc')
    setLoading(true)
    try {
      if (user && user.id) {
        const updated = await api.patch(`/users/${user.id}`, { name, email, role })
        onSaved && onSaved(updated)
      } else {
        const payload = { name, email, role, created_at: new Date().toISOString() }
        const created = await api.post('/users', payload)
        onSaved && onSaved(created)
      }
      onClose()
    } catch (err) {
      console.error(err)
      alert('Lưu thất bại (mock)')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null
  return (
    <div className="modal">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-panel">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{user ? 'Sửa người dùng' : 'Tạo người dùng'}</h3>
          <button className="btn-ghost" onClick={onClose}>Đóng</button>
        </div>

        <form className="mt-4 space-y-3" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vai trò</label>
            <select className="input" value={role} onChange={e => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="leader">Leader</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={onClose}>Hủy</button>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}