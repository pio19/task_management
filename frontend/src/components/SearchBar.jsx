import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function SearchBar({ filters, setFilters }) {
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/users').then(setUsers)
  }, [])

  const onChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input className="input" placeholder="Tìm theo tiêu đề hoặc nội dung..." value={filters.q} onChange={(e)=>onChange('q', e.target.value)} />
      <select className="input" value={filters.status} onChange={(e)=>onChange('status', e.target.value)}>
        <option value="">Tất cả trạng thái</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select className="input" value={filters.assignee} onChange={(e)=>onChange('assignee', e.target.value)}>
        <option value="">Tất cả người được giao</option>
        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
      </select>
      <input className="input" placeholder="Tag" value={filters.tag} onChange={(e)=>onChange('tag', e.target.value)} />
      <button className="btn" onClick={() => setFilters({ q:'', assignee:'', tag:'', status:'' })}>Đặt lại</button>
    </div>
  )
}