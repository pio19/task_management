import React from 'react'

export default function StatCard({ title, value, delta, icon, bg = 'bg-white' }) {
  return (
    <div className={`card ${bg} p-4`}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <div className="flex-1">
          <div className="text-sm text-gray-500">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-gray-800">{value}</div>
          {typeof delta !== 'undefined' && (
            <div className="mt-2 text-sm">
              <span className={delta >= 0 ? 'text-green-600' : 'text-red-600'}>
                {delta >= 0 ? `▲ ${Math.abs(delta)}%` : `▼ ${Math.abs(delta)}%`}
              </span>
              <span className="text-gray-400 ml-2">so với tuần trước</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}