import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function CommentList({ taskId }) {
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    if (!taskId) return
    api.get('/comments', { task_id: taskId }).then(setComments)
  }, [taskId])

  const add = async () => {
    if (!text.trim()) return
    const newComment = { id: Math.floor(Math.random()*100000)+9000, task_id: taskId, author_id: 1, content: text, created_at: new Date().toISOString() }
    await api.post('/comments', newComment)
    setComments([newComment, ...comments])
    setText('')
  }

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <textarea className="input" rows="3" value={text} onChange={e => setText(e.target.value)} placeholder="Viết bình luận..." />
        <div style={{ marginTop:6 }}>
          <button className="btn" onClick={add}>Gửi</button>
        </div>
      </div>
      <div>
        {comments.length === 0 && <div className="small">Chưa có bình luận</div>}
        {comments.map(c => (
          <div key={c.id} className="card" style={{ marginBottom:8 }}>
            <div style={{ fontWeight:600 }}>User #{c.author_id}</div>
            <div className="small">{new Date(c.created_at).toLocaleString()}</div>
            <div style={{ marginTop:6 }}>{c.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}