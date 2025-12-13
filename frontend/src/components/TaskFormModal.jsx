import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function TaskFormModal({ projectId, onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [assigneeIds, setAssigneeIds] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => { api.get('/users').then(setUsers) }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return alert('Tiêu đề là bắt buộc')
    const newTask = {
      id: Math.floor(Math.random() * 100000) + 200,
      title, description, project_id: Number(projectId), priority, assignee_ids: assigneeIds.map(Number), status: 'todo', version: 1, created_at: new Date().toISOString()
    }
    await api.post('/tasks', newTask)
    onCreated && onCreated(newTask)
    onClose()
  }

  return (
    <div className="modal">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-panel">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tạo nhiệm vụ mới</h3>
          <button className="btn-ghost" onClick={onClose}>Đóng</button>
        </div>

        <form className="mt-4 space-y-3" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea className="input" rows="4" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Mức ưu tiên</label>
              <select className="input" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Người thực hiện</label>
              <select multiple className="input h-28" value={assigneeIds.map(String)} onChange={e => setAssigneeIds(Array.from(e.target.selectedOptions).map(o => o.value))}>
                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button type="button" className="btn-ghost" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn">Tạo nhiệm vụ</button>
          </div>
        </form>
      </div>
    </div>
  )
}