import React, { useEffect, useState } from 'react'
import api from '../services/api'
import StatCard from '../components/StatCard'
import RecentActivity from '../components/RecentActivity'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const [ps, ts, ns, al] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks'),
          api.get('/notifications'),
          api.get('/activity_logs')
        ])
        if (!mounted) return
        setProjects(ps || [])
        // normalize status to lower-case to avoid mismatch
        const normalized = (ts || []).map(t => ({ ...t, status: String(t.status || '').toLowerCase() }))
        setTasks(normalized)
        setNotifications(ns || [])
        // sort activities newest first
        const acts = (al || []).slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        setActivities(acts)
      } catch (e) {
        console.error('Load dashboard data error', e)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // computed stats
  const totalProjects = projects.length
  const totalTasks = tasks.length
  const todo = tasks.filter(t => t.status === 'todo').length
  const inProgress = tasks.filter(t => t.status === 'in_progress').length
  const done = tasks.filter(t => t.status === 'done').length
  const unreadNoti = notifications.filter(n => !n.is_read).length

  // upcoming deadlines (next 7 days)
  const upcoming = tasks
    .filter(t => t.due_date)
    .map(t => ({ ...t, dueTs: new Date(t.due_date).getTime() }))
    .filter(t => {
      const now = Date.now()
      const in7d = now + 7 * 24 * 60 * 60 * 1000
      return t.dueTs >= now && t.dueTs <= in7d
    })
    .sort((a, b) => a.dueTs - b.dueTs)
    .slice(0, 6)

  // tasks per project (simple progress percent)
  const projectProgress = projects.map(p => {
    const pTasks = tasks.filter(t => t.project_id === p.id)
    const doneCount = pTasks.filter(t => t.status === 'done').length
    const pct = pTasks.length ? Math.round((doneCount / pTasks.length) * 100) : 0
    return { id: p.id, name: p.name, pct, total: pTasks.length }
  })

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Dự án"
            value={totalProjects}
            delta={5}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7h18M12 3v18" /></svg>}
          />
          <StatCard
            title="Tổng nhiệm vụ"
            value={totalTasks}
            delta={2}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6M9 16h6M9 8h6M4 6h16v12H4z" /></svg>}
          />
          <StatCard
            title="Đang làm"
            value={inProgress}
            delta={-3}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l4 2" /></svg>}
          />
          <StatCard
            title="Thông báo chưa đọc"
            value={unreadNoti}
            delta={0}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" /></svg>}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Tổng quan nhiệm vụ</h3>
              <div className="text-sm text-gray-500">{totalTasks} nhiệm vụ</div>
            </div>

            {/* simple status bars */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700">To Do</div>
                  <div className="text-sm text-gray-500">{todo}</div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: `${totalTasks ? (todo / totalTasks) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700">In Progress</div>
                  <div className="text-sm text-gray-500">{inProgress}</div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-yellow-400 h-3 rounded-full" style={{ width: `${totalTasks ? (inProgress / totalTasks) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700">Done</div>
                  <div className="text-sm text-gray-500">{done}</div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: `${totalTasks ? (done / totalTasks) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            {/* upcoming deadlines */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Hạn sắp tới (7 ngày)</h4>
                <Link to="/projects" className="text-sm text-primary">Xem tất cả</Link>
              </div>
              {upcoming.length === 0 ? (
                <div className="text-sm text-gray-500">Không có hạn nộp trong 7 ngày tới</div>
              ) : (
                <ul className="space-y-2">
                  {upcoming.map(t => (
                    <li key={t.id} className="flex items-center justify-between p-3 rounded border border-gray-100 bg-white">
                      <div>
                        <div className="font-medium">{t.title}</div>
                        <div className="text-xs text-gray-500">{t.project_id ? `Project #${t.project_id}` : ''}</div>
                      </div>
                      <div className="text-sm text-gray-600">{new Date(t.due_date).toLocaleDateString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <RecentActivity activities={activities.slice(0, 8)} />
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Tiến độ dự án</h3>
              <div className="text-sm text-gray-500">Tổng {projectProgress.length}</div>
            </div>

            <div className="space-y-3">
              {projectProgress.length === 0 && <div className="text-sm text-gray-500">Chưa có dự án</div>}
              {projectProgress.map(p => (
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500">{p.pct}%</div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-primary h-3 rounded-full" style={{ width: `${p.pct}%` }}></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{p.total} nhiệm vụ</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Thông báo mới</h3>
              <Link to="/notifications" className="text-sm text-primary">Xem tất cả</Link>
            </div>
            <div className="space-y-2 max-h-56 overflow-auto">
              {notifications.length === 0 && <div className="text-sm text-gray-500">Không có thông báo</div>}
              {notifications.slice(0,6).map(n => (
                <div key={n.id} className={`p-3 rounded ${n.is_read ? 'bg-white' : 'bg-primary/10'}`}>
                  <div className="font-medium text-sm">{n.title}</div>
                  <div className="text-xs text-gray-500">{n.body}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {loading && <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"><div className="card p-4">Đang tải...</div></div>}
    </div>
  )
}