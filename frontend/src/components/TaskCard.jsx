import React from 'react'

export default function TaskCard({ task, onOpen, onMove }) {
  return (
    <div className="task-card">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-800">{task.title}</div>
            <div className="text-xs text-gray-500">{task.priority}</div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {task.description ? (task.description.length > 100 ? task.description.slice(0, 100) + '…' : task.description) : <span className="text-gray-400">Không có mô tả</span>}
          </div>
          <div className="mt-3 flex items-center gap-2">
            {(task.tags || []).map(tag => <span key={tag} className="kbadge">{tag}</span>)}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button className="btn-ghost text-sm" onClick={() => onOpen(task)}>Chi tiết</button>
          <div className="flex gap-2">
            <button className="btn-muted text-xs" onClick={() => onMove(task.id, 'todo')}>To Do</button>
            <button className="btn-muted text-xs" onClick={() => onMove(task.id, 'in_progress')}>In Progress</button>
            <button className="btn-muted text-xs" onClick={() => onMove(task.id, 'done')}>Done</button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          {(task.assignee_ids || []).slice(0,3).map(a => (
            <div key={a} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-700">{typeof a === 'number' ? `U${a}` : a[0]}</div>
          ))}
        </div>
        <div className="text-xs text-gray-400">{task.due_date ? new Date(task.due_date).toLocaleDateString() : ''}</div>
      </div>
    </div>
  )
}