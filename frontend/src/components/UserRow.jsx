import React from 'react'

export default function UserRow({ user, onEdit, onDelete, onAssign }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 border border-gray-100 rounded">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">{user.name ? user.name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase() : 'U'}</div>
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div className="text-sm text-gray-600">{user.role}</div>
        <button className="btn-ghost text-sm" onClick={() => onAssign && onAssign(user)}>Gán dự án</button>
        <button className="btn-ghost text-sm" onClick={() => onEdit && onEdit(user)}>Sửa</button>
        <button className="btn-ghost text-sm text-red-600" onClick={() => onDelete && onDelete(user)}>Xóa</button>
      </div>
    </div>
  )
}