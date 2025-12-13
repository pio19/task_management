import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../services/api'

export default function SearchResults() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [tab, setTab] = useState('tasks')
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (!q) return
    setLoading(true)
    let mounted = true
    Promise.all([
      api.get('/tasks', { q, _limit: 100 }).catch(() => []),
      api.get('/projects', { q, _limit: 100 }).catch(() => []),
      api.get('/users', { q, _limit: 100 }).catch(() => [])
    ]).then(([t, p, u]) => {
      if (!mounted) return
      setTasks(t || [])
      setProjects(p || [])
      setUsers(u || [])
      // auto switch tab if current tab empty
      if (tab === 'tasks' && (t || []).length === 0) {
        if ((p || []).length > 0) setTab('projects')
        else if ((u || []).length > 0) setTab('users')
      }
    }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [q])

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Kết quả tìm kiếm</h2>
          <div className="text-sm text-gray-500">Kết quả cho: <span className="font-medium">{q}</span></div>
        </div>
        <div>
          <Link to="/projects" className="btn-ghost mr-2">Dự án</Link>
          <Link to="/users" className="btn-ghost">Người dùng</Link>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <button className={`px-3 py-2 rounded ${tab==='tasks' ? 'bg-primary text-white' : 'bg-white border'}`} onClick={() => setTab('tasks')}>Tasks ({tasks.length})</button>
          <button className={`px-3 py-2 rounded ${tab==='projects' ? 'bg-primary text-white' : 'bg-white border'}`} onClick={() => setTab('projects')}>Projects ({projects.length})</button>
          <button className={`px-3 py-2 rounded ${tab==='users' ? 'bg-primary text-white' : 'bg-white border'}`} onClick={() => setTab('users')}>Users ({users.length})</button>
        </div>
      </div>

      <div>
        {loading && <div className="text-sm text-gray-500">Đang tìm...</div>}

        {!loading && tab === 'tasks' && (
          <div className="space-y-3">
            {tasks.length === 0 && <div className="text-sm text-gray-500">Không có task</div>}
            {tasks.map(t => (
              <div key={t.id} className="card p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-gray-500">Project #{t.project_id} • {t.status}</div>
                    <div className="mt-2 text-sm text-gray-700">{t.description}</div>
                  </div>
                  <div className="text-sm text-gray-500">{t.due_date ? new Date(t.due_date).toLocaleDateString() : ''}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'projects' && (
          <div className="space-y-3">
            {projects.length === 0 && <div className="text-sm text-gray-500">Không có project</div>}
            {projects.map(p => (
              <div key={p.id} className="card p-3 flex items-start justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.course} • {p.description}</div>
                </div>
                <Link to={`/projects/${p.id}`} className="btn-ghost">Mở</Link>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'users' && (
          <div className="space-y-3">
            {users.length === 0 && <div className="text-sm text-gray-500">Không có user</div>}
            {users.map(u => (
              <div key={u.id} className="card p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.email} • {u.role}</div>
                </div>
                <Link to={`/users`} className="btn-ghost">Xem</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}