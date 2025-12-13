import React from 'react'

export default function RecentActivity({ activities = [] }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Hoạt động gần đây</h3>
        <div className="text-sm text-gray-500">{activities.length} mục</div>
      </div>

      <div className="space-y-3 max-h-64 overflow-auto">
        {activities.length === 0 && <div className="text-sm text-gray-500">Chưa có hoạt động</div>}
        {activities.map(a => (
          <div key={a.id} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-700">
              {a.actor_id ? `U${a.actor_id}` : 'S'}
            </div>
            <div className="flex-1">
              <div className="text-sm">
                <span className="font-medium">{a.action_type}</span>
                <span className="text-gray-500"> — {a.target_type} #{a.target_id}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">{new Date(a.created_at).toLocaleString()}</div>
              {a.payload && Object.keys(a.payload).length > 0 && (
                <div className="mt-2 text-xs text-gray-600">{JSON.stringify(a.payload)}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}