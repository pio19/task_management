import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'
import ProjectFormModal from '../components/ProjectFormModal'
import { useAuth } from '../contexts/AuthContext'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    api.get('/projects').then(setProjects)
  }, [])

  const afterCreate = (p) => {
    setProjects(prev => [p, ...prev])
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Danh sách dự án</h2>
        <div>
          <button className="btn" onClick={() => setShowCreate(true)}>Tạo dự án</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(p => (
          <div key={p.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-medium">{p.name}</div>
                <div className="text-sm text-gray-500">{p.course} • {p.semester}</div>
                <div className="mt-2 text-sm text-gray-700">{p.description ? (p.description.length > 120 ? p.description.slice(0,120) + '…' : p.description) : 'Không có mô tả'}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Leader #{p.leader_id}</div>
                <Link to={`/projects/${p.id}`} className="btn-ghost mt-3">Mở</Link>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && <div className="text-sm text-gray-500">Chưa có dự án</div>}
      </div>

      {showCreate && <ProjectFormModal onClose={() => setShowCreate(false)} onCreated={afterCreate} />}
    </div>
  )
}