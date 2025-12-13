import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

export default function ResetPassword() {
  const { token } = useParams()
  const [valid, setValid] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    const check = async () => {
      try {
        const resets = await api.get('/password_resets', { token })
        const rec = (resets || []).find(r => r.token === token)
        if (!rec) {
          if (mounted) setValid(false)
        } else {
          if (new Date(rec.expires_at).getTime() < Date.now()) {
            if (mounted) setValid(false)
          } else {
            if (mounted) setValid(true)
          }
        }
      } catch {
        if (mounted) setValid(false)
      } finally {
        if (mounted) setChecking(false)
      }
    }
    check()
    return () => { mounted = false }
  }, [token])

  const submit = async (e) => {
    e.preventDefault()
    if (!password || password.length < 4) return alert('Mật khẩu tối thiểu 4 ký tự (mock)')
    if (password !== confirm) return alert('Mật khẩu xác nhận không khớp')
    setLoading(true)
    try {
      await resetPassword(token, password)
      alert('Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới.')
      navigate('/login')
    } catch (err) {
      alert(err.message || 'Đặt lại mật khẩu thất bại')
    } finally {
      setLoading(false)
    }
  }

  const copyLink = async () => {
    const link = `${window.location.origin}/reset-password/${token}`
    try {
      await navigator.clipboard.writeText(link)
      alert('Link đã được copy (mock).')
    } catch {
      alert('Không thể copy link')
    }
  }

  if (checking) return <div className="card">Đang kiểm tra token...</div>
  if (!valid) return (
    <div className="card">
      <h3 className="text-lg font-semibold">Token không hợp lệ hoặc đã hết hạn.</h3>
      <div className="mt-3">
        <button className="btn-ghost" onClick={() => navigate('/forgot-password')}>Yêu cầu token mới</button>
        <button className="btn ml-2" onClick={copyLink}>Copy link (debug)</button>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 520, margin: '48px auto' }}>
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Đặt lại mật khẩu</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
            <input className="input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <button className="btn-ghost" type="button" onClick={() => navigate('/login')}>Hủy</button>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Đang...' : 'Đặt lại'}</button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-500">
          Token sẽ hết hạn sau 1 giờ. Nếu gặp sự cố, hãy tạo token mới từ trang Quên mật khẩu.
        </div>
      </div>
    </div>
  )
}