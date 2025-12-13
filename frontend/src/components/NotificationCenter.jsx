import React, { useState } from 'react'
import api from '../services/api'

export default function NotificationCenter({ notifications = [] }) {
  const [open, setOpen] = useState(false)
  const unread = notifications.filter(n => !n.is_read).length

  const markRead = async (n) => {
    if (n.is_read) return
    try {
      await api.patch(`/notifications/${n.id}`, { is_read: true })
      n.is_read = true
    } catch {}
  }

  const markAllRead = async () => {
    for (const n of notifications.filter(x => !x.is_read)) {
      await markRead(n)
    }
  }

  return (
    <div className="relative">
      <button className="btn" onClick={() => { setOpen(!open); if (!open) markAllRead() }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        <span className="ml-2">{unread}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 card">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Thông báo</div>
            <div className="text-sm text-gray-500">{unread} chưa đọc</div>
          </div>
          <div className="space-y-2 max-h-72 overflow-auto">
            {notifications.length === 0 && <div className="text-sm text-gray-500">Không có thông báo</div>}
            {notifications.map(n => (
              <div key={n.id} className={`p-2 rounded ${n.is_read ? 'bg-white' : 'bg-primary/10'}`}>
                <div className="font-medium text-sm">{n.title}</div>
                <div className="text-xs text-gray-600">{n.body}</div>
                <div className="mt-1">
                  <button className="btn-ghost text-xs" onClick={() => markRead(n)}>Đánh dấu đã đọc</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
