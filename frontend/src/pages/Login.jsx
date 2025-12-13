import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(localStorage.getItem('remember_email') || 'leader@example.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(!!localStorage.getItem('remember_email'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
  }, [email, password])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Vui lòng nhập email')
    if (!password) return setError('Vui lòng nhập mật khẩu')

    setLoading(true)
    try {
      await login(email.trim(), password)
      if (remember) localStorage.setItem('remember_email', email.trim())
      else localStorage.removeItem('remember_email')
      navigate('/')
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  // social login mock: gọi chung vào đây
  async function socialLogin(provider) {
    setError('')
    setLoading(true)
    try {
      // dùng email giả, AuthContext sẽ tạo user mock nếu cần
      await login(`${provider.toLowerCase()}@example.com`, 'demo123')
      navigate('/')
    } catch (err) {
      setError('Social login thất bại (mock)')
    } finally {
      setLoading(false)
    }
  }

  // wrapper để gắn vào onClick (tên rõ ràng)
  function socialLoginHandler(provider) {
    socialLogin(provider)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Illustration / branding */}
        <div className="hidden md:flex flex-col items-start justify-center gap-6 p-8 bg-white rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">QT</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">QL Công việc nhóm</h1>
              <div className="text-sm text-gray-500">Dành cho sinh viên • Demo</div>
            </div>
          </div>

          <div className="text-gray-600">
            <h3 className="text-lg font-semibold mb-2">Quản lý nhiệm vụ & hợp tác nhóm</h3>
            <p className="text-sm">Đăng nhập để xem dashboard, quản lý dự án, tạo và phân công nhiệm vụ, theo dõi tiến độ và tương tác với nhóm.</p>
          </div>

          <div className="w-full">
            {/* simple SVG illustration */}
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
        </div>

        {/* Login form */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-10">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Chào mừng trở lại</h2>
            <p className="text-sm text-gray-500">Đăng nhập vào tài khoản của bạn để tiếp tục</p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-2 top-2 text-sm text-gray-500 px-2 py-1 rounded"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" className="form-checkbox h-4 w-4" checked={remember} onChange={e => setRemember(e.target.checked)} />
                <span className="text-gray-600">Ghi nhớ email</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">Quên mật khẩu?</Link>
            </div>

            <div>
              <button type="submit" className="btn w-full flex items-center justify-center gap-2" disabled={loading}>
                {loading ? <Spinner /> : null}
                <span>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
              </button>
            </div>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100"></div>
            <div className="text-xs text-gray-400">hoặc</div>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button onClick={() => socialLoginHandler('Google')} className="flex items-center gap-2 justify-center border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
              <svg className="w-4 h-4" viewBox="0 0 533.5 544.3"><path fill="#4285F4" d="M533.5 278.4c0-17.8-1.6-35..."/></svg>
              <span className="text-sm">Tiếp tục với Google</span>
            </button>
            <button onClick={() => socialLoginHandler('Facebook')} className="flex items-center gap-2 justify-center border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#1877F2" d="M22 12a10 10 0 10-11.5 9.9v-7..."/></svg>
              <span className="text-sm">Tiếp tục với Facebook</span>
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            Chưa có tài khoản? <Link to="/register" className="text-primary font-medium hover:underline">Đăng ký</Link>
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