import React, { useState } from 'react'
import api from '../services/api'

export default function InviteModal({ projectId, onClose, onInvited }) {
  const [email, setEmail] = useState('')

  const send = async () => {
    if (!email.trim()) return alert('Email required')
    const invite = { id: Math.floor(Math.random()*100000)+7000, email, project_id: Number(projectId), token: 'inv-'+Math.random().toString(36).slice(2), role: 'member', created_at: new Date().toISOString() }
    await api.post('/invites', invite)
    onInvited && onInvited(invite)
    onClose()
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div className="card" style={{ width:420 }}>
        <h3>Mời thành viên</h3>
        <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <div style={{ marginTop:12 }}>
          <button className="btn" onClick={send}>Gửi lời mời</button>
          <button className="input" onClick={onClose} style={{ marginLeft:8 }}>Hủy</button>
        </div>
      </div>
    </div>
  )
}