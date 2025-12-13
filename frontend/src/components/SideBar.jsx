import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar({ projects = [] }) {
  return (
    <aside className="hidden md:block w-64">
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Dự án</div>
          <div className="text-sm text-gray-500">{projects.length}</div>
        </div>
        <div className="divide-y divide-gray-100">
          {projects.map(p => (
            <div key={p.id} className="py-2">
              <Link to={`/projects/${p.id}`} className="block hover:bg-gray-50 p-2 rounded-md">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-gray-500">{p.course}</div>
              </Link>
            </div>
          ))}
          {projects.length === 0 && <div className="p-2 text-sm text-gray-500">Chưa có dự án</div>}
        </div>
      </div>
    </aside>
  )
}