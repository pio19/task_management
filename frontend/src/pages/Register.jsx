import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState('student')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agree, setAgree] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
  }, [name, email, password, confirm, role])

  const validate = () => {
    if (!name.trim()) return 'Vui lòng nhập họ và tên'
    if (!email.trim()) return 'Vui lòng nhập email'
    // simple email regex for UX (not strict)
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'Email không hợp lệ'
    if (!password || password.length < 4) return 'Mật khẩu tối thiểu 4 ký tự (demo)'
    if (password !== confirm) return 'Mật khẩu xác nhận không khớp'
    if (!agree) return 'Vui lòng đồng ý điều khoản'
    return null
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const v = validate()
    if (v) return setError(v)

    setLoading(true)
    try {
      await register({ name: name.trim(), email: email.trim(), password, role })
      // success: redirect to dashboard
      navigate('/')
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại (mock)')
    } finally {
      setLoading(false)
    }
  }

  // social sign-up mock
  const socialRegister = async (provider) => {
    setError('')
    setLoading(true)
    try {
      // create user with mock email and password
      const socialEmail = `${provider.toLowerCase()}-${Date.now()}@example.com`
      await register({ name: `${provider} User`, email: socialEmail, password: 'demo123', role: 'student' })
      navigate('/')
    } catch (err) {
      setError('Đăng ký xã hội thất bại (mock)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left illustration / info (hidden on small) */}
        <div className="hidden md:flex flex-col items-start justify-center gap-6 p-8 bg-white rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">QT</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">QL Công việc nhóm</h1>
              <div className="text-sm text-gray-500">Tạo tài khoản để bắt đầu quản lý dự án</div>
            </div>
          </div>

          <div className="text-gray-600">
            <h3 className="text-lg font-semibold mb-2">Bắt đầu miễn phí</h3>
            <p className="text-sm">Tạo tài khoản demo để thử toàn bộ chức năng: dashboard, board Kanban, bình luận, upload mock...</p>
          </div>

          <svg viewBox="0 0 600 400" className="w-full h-44" xmlns="http://www.w3.org/2000/svg" fill="none">
            <rect x="20" y="20" width="560" height="360" rx="12" fill="#F8FAFC" stroke="#E6EEF2"></rect>
            <g fill="#0b7285" opacity="0.9">
              <rect x="60" y="70" rx="6" width="120" height="22"></rect>
              <rect x="200" y="70" rx="6" width="240" height="22"></rect>
              <rect x="60" y="110" rx="8" width="420" height="14"></rect>
              <rect x="60" y="140" rx="8" width="300" height="14"></rect>
              <rect x="60" y="170" rx="8" width="200" height="14"></rect>
            </g>
          </svg>
        </div>

        {/* Register form */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-10">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Tạo tài khoản mới</h2>
            <p className="text-sm text-gray-500">Nhanh chóng và miễn phí — dành cho demo</p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input className="input" placeholder="Nguyễn Văn A" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <div className="relative">
                  <input className="input pr-12" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mật khẩu" />
                  <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-2 text-sm text-gray-500 px-2 py-1 rounded">{showPassword ? 'Ẩn' : 'Hiện'}</button>
                </div>
                <div className="text-xs text-gray-400 mt-1">Mật khẩu tối thiểu 4 ký tự (demo)</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input className="input pr-12" type={showConfirm ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Xác nhận mật khẩu" />
                  <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-2 top-2 text-sm text-gray-500 px-2 py-1 rounded">{showConfirm ? 'Ẩn' : 'Hiện'}</button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <select className="input" value={role} onChange={e => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="leader">Leader</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" className="form-checkbox h-4 w-4" checked={agree} onChange={e => setAgree(e.target.checked)} />
                <span className="text-gray-600">Tôi đồng ý với <a className="text-primary hover:underline" href="#">Điều khoản & Chính sách</a></span>
              </label>
            </div>

            <div>
              <button type="submit" className="btn w-full flex items-center justify-center gap-2" disabled={loading}>
                {loading ? <Spinner /> : null}
                <span>{loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}</span>
              </button>
            </div>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100"></div>
            <div className="text-xs text-gray-400">hoặc</div>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button onClick={() => socialRegister('Google')} className="flex items-center gap-2 justify-center border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
              <svg className="w-4 h-4" viewBox="0 0 533.5 544.3"><path fill="#4285F4" d="M533.5 278.4c0-17.8-1.6-35..."/></svg>
              <span className="text-sm">Đăng ký với Google</span>
            </button>
            <button onClick={() => socialRegister('Facebook')} className="flex items-center gap-2 justify-center border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#1877F2" d="M22 12a10 10 0 10-11.5 9.9v-7..."/></svg>
              <span className="text-sm">Đăng ký với Facebook</span>
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            Đã có tài khoản? <Link to="/login" className="text-primary font-medium hover:underline">Đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  )

  // helper components
  function Spinner() {
    return (
      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
    )
  }
}