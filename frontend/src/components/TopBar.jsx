import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import NotificationCenter from './NotificationCenter'
import api from '../services/api'

export default function TopBar() {
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      api.get('/notifications', { user_id: user.id }).then(data => setNotifications(data || []))
    }
  }, [user])

  return (
    <header className="card flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-semibold text-primary">QL Công việc nhóm</Link>
        <nav className="hidden sm:flex gap-3 text-sm text-gray-700">
          <Link to="/" className="hover:text-primary">Dashboard</Link>
          <Link to="/projects" className="hover:text-primary">Dự án</Link>
          <Link to="/users" className="hover:text-primary">Người dùng</Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <NotificationCenter notifications={notifications} />
        {user ? (
          <>
            <div className="text-sm text-gray-700 hidden sm:block">{user.name} <span className="text-xs text-gray-400">({user.role})</span></div>
            <button className="btn-ghost" onClick={() => { logout(); navigate('/login') }}>Đăng xuất</button>
          </>
        ) : (
          <Link to="/login" className="btn">Đăng nhập</Link>
        )}
      </div>
    </header>
  )
}