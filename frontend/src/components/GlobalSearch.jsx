import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import useDebounce from '../hooks/useDebounce'

export default function GlobalSearch() {
  const [q, setQ] = useState('')
  const debouncedQ = useDebounce(q, 300)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({ projects: [], tasks: [], users: [] })
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const containerRef = useRef(null)

  useEffect(() => {
    if (!debouncedQ || debouncedQ.trim().length < 1) {
      setResults({ projects: [], tasks: [], users: [] })
      setLoading(false)
      return
    }

    let mounted = true
    setLoading(true)
    Promise.all([
      api.get('/projects', { q: debouncedQ, _limit: 6 }).catch(() => []),
      api.get('/tasks', { q: debouncedQ, _limit: 8 }).catch(() => []),
      api.get('/users', { q: debouncedQ, _limit: 6 }).catch(() => [])
    ]).then(([projects, tasks, users]) => {
      if (!mounted) return
      setResults({ projects: projects || [], tasks: tasks || [], users: users || [] })
    }).finally(() => {
      if (mounted) setLoading(false)
    })
    return () => { mounted = false }
  }, [debouncedQ])

  useEffect(() => {
    function onDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`)
      setOpen(false)
    }
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const openItem = (type, item) => {
    setOpen(false)
    if (type === 'task') navigate(`/projects/${item.project_id}`) // open project board; user can click task inside
    else if (type === 'project') navigate(`/projects/${item.id}`)
    else if (type === 'user') navigate(`/users`)
  }

  return (
    <div ref={containerRef} className="relative" style={{ minWidth: 260 }}>
      <input
        value={q}
        onChange={e => { setQ(e.target.value); setOpen(true) }}
        onFocus={() => q && setOpen(true)}
        onKeyDown={onKeyDown}
        className="input"
        placeholder="Tìm dự án, nhiệm vụ, người dùng..."
        aria-label="Tìm kiếm"
      />
      {open && ( (results.projects.length || results.tasks.length || results.users.length || loading) && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded shadow-lg border border-gray-100 p-2">
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="text-sm text-gray-500">Kết quả cho “{q}”</div>
            <button className="text-xs text-primary" onClick={() => navigate(`/search?q=${encodeURIComponent(q.trim())}`)}>Xem tất cả</button>
          </div>

          {loading && <div className="text-sm text-gray-500 p-2">Đang tìm...</div>}

          {!loading && (
            <div className="space-y-2 max-h-56 overflow-auto">
              {results.tasks.length > 0 && (
                <div>
                  <div className="text-xs text-gray-400 px-2 mb-1">Tasks</div>
                  {results.tasks.map(t => (
                    <div key={t.id} className="p-2 hover:bg-gray-50 rounded cursor-pointer" onClick={() => openItem('task', t)}>
                      <div className="font-medium text-sm">{t.title}</div>
                      <div className="text-xs text-gray-500">Project #{t.project_id} • {t.status}</div>
                    </div>
                  ))}
                </div>
              )}

              {results.projects.length > 0 && (
                <div>
                  <div className="text-xs text-gray-400 px-2 mb-1">Projects</div>
                  {results.projects.map(p => (
                    <div key={p.id} className="p-2 hover:bg-gray-50 rounded cursor-pointer" onClick={() => openItem('project', p)}>
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.course}</div>
                    </div>
                  ))}
                </div>
              )}

              {results.users.length > 0 && (
                <div>
                  <div className="text-xs text-gray-400 px-2 mb-1">Users</div>
                  {results.users.map(u => (
                    <div key={u.id} className="p-2 hover:bg-gray-50 rounded cursor-pointer" onClick={() => openItem('user', u)}>
                      <div className="font-medium text-sm">{u.name}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                  ))}
                </div>
              )}

              {(!results.tasks.length && !results.projects.length && !results.users.length) && (
                <div className="text-sm text-gray-500 p-2">Không tìm thấy kết quả</div>
              )}
            </div>
          )}
        </div>
      )) }
    </div>
  )
}