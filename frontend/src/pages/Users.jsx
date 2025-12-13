import React, { useEffect, useState } from 'react'
import api from '../services/api'
import UserRow from '../components/UserRow'
import UserFormModal from '../components/UserFormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import { useAuth } from '../contexts/AuthContext'
import { exportToCSV } from '../utils/csvExport'

export default function Users() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)

  const [editingUser, setEditingUser] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [confirm, setConfirm] = useState({ open: false, user: null })

  // bulk invite state
  const [bulkText, setBulkText] = useState('')
  const [showBulk, setShowBulk] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [page, q])

  async function fetchUsers() {
    setLoading(true)
    try {
      // json-server supports _page/_limit and q for full-text
      const params = { _page: page, _limit: limit }
      if (q) params.q = q
      const res = await api.get('/users', params)
      // json-server doesn't return total in body; read header x-total-count via lower-level axios
      // but our api wrapper hides headers; so simplest: request without paging when first demo, or modify api wrapper.
      // For now fetch all when no pagination required:
      if (!params._page) {
        setUsers(res || [])
      } else {
        // fallback: fetch all, then slice (mock)
        const all = await api.get('/users')
        setTotal(all.length)
        setUsers(all.slice((page - 1) * limit, page * limit))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => { setEditingUser(null); setShowForm(true) }
  const onSaved = (u) => {
    // refresh list or insert
    setUsers(prev => {
      const exists = prev.find(x => x.id === u.id)
      if (exists) return prev.map(p => p.id === u.id ? u : p)
      return [u, ...prev]
    })
  }

  const onDelete = (u) => {
    setConfirm({ open: true, user: u })
  }

  const confirmDelete = async () => {
    const u = confirm.user
    try {
      await api.del(`/users/${u.id}`)
      setUsers(prev => prev.filter(x => x.id !== u.id))
      setConfirm({ open: false, user: null })
    } catch (err) {
      console.error(err)
      alert('Xóa thất bại (mock)')
    }
  }

  const onAssign = async (u) => {
    const pid = prompt('Nhập project ID để gán user vào (ví dụ 1):')
    const idNum = Number(pid)
    if (!idNum) return
    try {
      // fetch project, add to member_ids
      const project = await api.get(`/projects/${idNum}`)
      const member_ids = Array.isArray(project.member_ids) ? [...project.member_ids] : []
      if (!member_ids.includes(u.id)) member_ids.push(u.id)
      await api.patch(`/projects/${idNum}`, { member_ids })
      alert(`Gán user ${u.email} vào project #${idNum} (mock)`)
    } catch (err) {
      console.error(err)
      alert('Gán thất bại (mock)')
    }
  }

  const doBulkInvite = async () => {
    const emails = bulkText.split(/\s|,|;|\n/).map(s => s.trim()).filter(Boolean)
    if (emails.length === 0) return alert('Nhập email để mời')
    // create invites records in /invites
    try {
      for (const e of emails) {
        await api.post('/invites', { email: e, project_id: null, token: 'inv-' + Math.random().toString(36).slice(2), role: 'member', created_at: new Date().toISOString(), expires_at: null })
      }
      alert(`Đã gửi ${emails.length} lời mời (mock)`)
      setBulkText('')
      setShowBulk(false)
    } catch (err) {
      console.error(err)
      alert('Gửi lời mời thất bại (mock)')
    }
  }

  const exportUsers = () => {
    exportToCSV('users.csv', users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Người dùng</h2>
        <div className="flex items-center gap-2">
          <input className="input" placeholder="Tìm kiếm tên hoặc email..." value={q} onChange={e => { setQ(e.target.value); setPage(1) }} />
          {(currentUser && (currentUser.role === 'admin' || currentUser.role === 'leader')) && (
            <>
              <button className="btn" onClick={openCreate}>Tạo user</button>
              <button className="btn" onClick={() => setShowBulk(true)}>Bulk invite</button>
            </>
          )}
          <button className="btn-ghost" onClick={exportUsers}>Xuất CSV</button>
        </div>
      </div>

      <div className="space-y-3">
        {loading && <div className="text-sm text-gray-500">Đang tải...</div>}
        {!loading && users.length === 0 && <div className="text-sm text-gray-500">Chưa có người dùng</div>}
        {users.map(u => (
          <UserRow key={u.id} user={u}
            onEdit={(user) => { setEditingUser(user); setShowForm(true) }}
            onDelete={(user) => onDelete(user)}
            onAssign={(user) => onAssign(user)}
          />
        ))}
      </div>

      {/* simple pagination controls (mock slicing used) */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">Trang {page}</div>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={() => setPage(p => Math.max(1, p - 1))}>Trước</button>
          <button className="btn-ghost" onClick={() => setPage(p => p + 1)}>Sau</button>
        </div>
      </div>

      {showForm && <UserFormModal user={editingUser} open={showForm} onClose={() => setShowForm(false)} onSaved={onSaved} />}

      <ConfirmDialog
        open={confirm.open}
        title="Xác nhận xóa"
        message={`Bạn có chắc muốn xóa người dùng ${confirm.user ? confirm.user.email : ''}?`}
        onCancel={() => setConfirm({ open: false, user: null })}
        onConfirm={confirmDelete}
      />

      {showBulk && (
        <div className="modal">
          <div className="modal-backdrop" onClick={() => setShowBulk(false)}></div>
          <div className="modal-panel">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Bulk Invite</h3>
              <button className="btn-ghost" onClick={() => setShowBulk(false)}>Đóng</button>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Nhập danh sách email (phân cách bằng dấu phẩy/enter):</div>
              <textarea className="input" rows="6" value={bulkText} onChange={e => setBulkText(e.target.value)}></textarea>
              <div className="flex justify-end gap-2 mt-3">
                <button className="btn-ghost" onClick={() => setShowBulk(false)}>Hủy</button>
                <button className="btn" onClick={doBulkInvite}>Gửi lời mời</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}