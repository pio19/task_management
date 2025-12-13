import React, { useEffect, useState } from 'react'
import api from '../services/api'
import CommentList from './CommentList'

function ActivityLog({ taskId }) {
  const [logs, setLogs] = useState([])
  useEffect(() => {
    if (!taskId) return
    api.get('/activity_logs', { target_type: 'task', target_id: taskId }).then(setLogs).catch(()=>{})
  }, [taskId])
  return (
    <div style={{ marginTop: 12 }}>
      <div><strong>Lịch sử hoạt động</strong></div>
      {logs.length === 0 && <div className="small">Không có lịch sử</div>}
      {logs.map(l => (
        <div key={l.id} className="card" style={{ marginTop:8 }}>
          <div style={{ fontWeight:600 }}>{l.action_type}</div>
          <div className="small">{new Date(l.created_at).toLocaleString()}</div>
          <div>{JSON.stringify(l.payload || {})}</div>
        </div>
      ))}
    </div>
  )
}

export default function TaskModal({ taskId, onClose, onUpdated }) {
  const [task, setTask] = useState(null)
  const [attachments, setAttachments] = useState([])
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (!taskId) return
    api.get(`/tasks/${taskId}`).then(t => {
      setTask(t)
      api.get('/attachments', { task_id: taskId }).then(setAttachments).catch(()=>{})
    })
  }, [taskId])

  if (!task) return null

  const save = async () => {
    try {
      const patched = await api.patch(`/tasks/${task.id}`, { ...task, version: task.version })
      setTask(patched)
      onUpdated && onUpdated(patched)
      alert('Lưu thành công (mock)')
    } catch (e) {
      alert('Lưu thất bại (mock)')
    }
  }

  const upload = async () => {
    if (!file) return alert('Chọn file trước')
    // mock presigned: instead of uploading to S3, we read file as data URL and save metadata
    const reader = new FileReader()
    reader.onload = async (e) => {
      const url = e.target.result // base64 data url
      const newAtt = { id: Math.floor(Math.random()*100000)+5000, owner_id: 1, task_id: task.id, filename: file.name, url, mime_type: file.type, size: file.size, created_at: new Date().toISOString() }
      await api.post('/attachments', newAtt)
      setAttachments(prev => [newAtt, ...prev])
      setFile(null)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: 820, maxHeight: '90vh', overflow: 'auto' }} className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>{task.title}</h3>
          <div>
            <button className="btn" onClick={save} style={{ marginRight: 8 }}>Lưu</button>
            <button className="input" onClick={onClose}>Đóng</button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 8 }}><strong>Mô tả</strong></div>
          <div className="card">{task.description || <span className="small">Không có mô tả</span>}</div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div><strong>Trạng thái</strong></div>
            <select className="input" value={task.status} onChange={e => setTask({ ...task, status: e.target.value })}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
              <option value="blocked">Blocked</option>
            </select>
            <div style={{ marginTop: 8 }}>
              <div><strong>Assignees</strong></div>
              <div className="small">{(task.assignee_ids || []).join(', ')}</div>
            </div>
            <div style={{ marginTop: 8 }}>
              <div><strong>Tags</strong></div>
              <div style={{ display:'flex', gap:6, marginTop:6 }}>{(task.tags || []).map(tag => <div key={tag} className="kbadge">{tag}</div>)}</div>
            </div>
          </div>

          <div style={{ width: 260 }}>
            <div><strong>Hạn nộp</strong></div>
            <input className="input" type="date" value={task.due_date ? task.due_date.split('T')[0] : ''} onChange={e => setTask({ ...task, due_date: e.target.value })} />
            <div style={{ marginTop: 12 }}>
              <div><strong>Đính kèm</strong></div>
              <input type="file" onChange={e => setFile(e.target.files[0])} className="input" />
              <div style={{ marginTop:8 }}>
                <button className="btn" onClick={upload}>Upload (mock)</button>
              </div>
              <div style={{ marginTop:8 }}>
                {(attachments || []).map(a => (
                  <div key={a.id} style={{ marginTop:6 }}>
                    <a href={a.url} target="_blank" rel="noreferrer" className="small">{a.filename}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div><strong>Bình luận</strong></div>
          <CommentList taskId={task.id} />
        </div>

        <ActivityLog taskId={task.id} />

      </div>
    </div>
  )
}