import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sentRecord, setSentRecord] = useState(null) // will hold created password_resets record
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return alert('Nhập email')
    setLoading(true)
    try {
      const record = await forgotPassword(email)
      if (!record) {
        // email not found in mock — show friendly message
        alert('Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu (mock).')
        setLoading(false)
        return
      }
      // show modal with token
      setSentRecord(record)
    } catch (err) {
      alert(err.message || 'Không thể xử lý yêu cầu')
    } finally {
      setLoading(false)
    }
  }

  const openReset = () => {
    if (!sentRecord) return
    navigate(`/reset-password/${sentRecord.token}`)
  }

  const copyToken = async () => {
    if (!sentRecord) return
    try {
      await navigator.clipboard.writeText(sentRecord.token)
      alert('Token đã được copy (mock).')
    } catch {
      alert('Không thể copy token')
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: '48px auto' }}>
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Quên mật khẩu</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <button className="btn-ghost" type="button" onClick={() => navigate('/login')}>Hủy</button>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi email'}</button>
          </div>
        </form>
      </div>

      {sentRecord && (
        <div className="modal">
          <div className="modal-backdrop" onClick={() => setSentRecord(null)}></div>
          <div className="modal-panel">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Email đã gửi (Demo)</h3>
              <button className="btn-ghost" onClick={() => setSentRecord(null)}>Đóng</button>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Trong môi trường demo, token đặt lại mật khẩu được hiển thị ở đây (thay vì gửi email).</div>
              <div className="card p-3 mb-3">
                <div><strong>Token:</strong></div>
                <div className="mt-2 break-all">{sentRecord.token}</div>
                <div className="mt-3">
                  <button className="btn-ghost" onClick={copyToken}>Copy token</button>
                  <button className="btn ml-2" onClick={openReset}>Mở trang đặt lại mật khẩu</button>
                </div>
              </div>
              <div className="text-sm text-gray-500">Hoặc bạn có thể mở trang Reset bằng link: <code className="bg-gray-100 px-2 py-1 rounded">/reset-password/{sentRecord.token}</code></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}