import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function ProjectFormModal({ onClose, onCreated }) {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [course, setCourse] = useState('')
  const [semester, setSemester] = useState('')
  const [memberIdsText, setMemberIdsText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setMemberIdsText(String(user.id))
    }
  }, [user])

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return alert('Vui lòng nhập tên dự án')
    setLoading(true)
    try {
      const member_ids = memberIdsText.split(',').map(s => s.trim()).filter(Boolean).map(v => Number(v))
      const payload = {
        name, description, course, semester,
        leader_id: user ? user.id : null,
        member_ids: member_ids,
        status: 'active',
        created_at: new Date().toISOString()
      }
      const created = await api.post('/projects', payload)
      onCreated && onCreated(created)
      onClose()
    } catch (err) {
      console.error(err)
      alert('Tạo dự án thất bại (mock)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-panel">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tạo dự án mới</h3>
          <button className="btn-ghost" onClick={onClose}>Đóng</button>
        </div>

        <form className="mt-4 space-y-3" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium mb-1">Tên dự án</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea className="input" rows="3" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Khóa/Môn</label>
              <input className="input" value={course} onChange={e => setCourse(e.target.value)} />
            </div>
            <div style={{ width: 160 }}>
              <label className="block text-sm font-medium mb-1">Học kỳ</label>
              <input className="input" value={semester} onChange={e => setSemester(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Member IDs (comma separated)</label>
            <input className="input" value={memberIdsText} onChange={e => setMemberIdsText(e.target.value)} />
            <div className="text-xs text-gray-500 mt-1">Ví dụ: 1,2,3 (được lấy từ danh sách users)</div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={onClose}>Hủy</button>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo dự án'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}