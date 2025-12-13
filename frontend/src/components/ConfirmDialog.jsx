import React from 'react'

export default function ConfirmDialog({ open, title = 'Xác nhận', message, onCancel, onConfirm }) {
  if (!open) return null
  return (
    <div className="modal">
      <div className="modal-backdrop" onClick={onCancel}></div>
      <div className="modal-panel">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="btn-ghost" onClick={onCancel}>Đóng</button>
        </div>
        <div className="mt-4">
          <div className="text-sm text-gray-700">{message}</div>
          <div className="flex justify-end gap-2 mt-4">
            <button className="btn-ghost" onClick={onCancel}>Hủy</button>
            <button className="btn" onClick={onConfirm}>Xác nhận</button>
          </div>
        </div>
      </div>
    </div>
  )
}