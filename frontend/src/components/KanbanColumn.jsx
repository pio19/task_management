import React from 'react'
import TaskCard from './TaskCard'

export default function KanbanColumn({ title, tasks = [], onOpen, onMove }) {
  return (
    <div style={{ minWidth: 260 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <h4 style={{ margin:0 }}>{title}</h4>
        <div style={{ background:'#eaf6f7', color:'#0b7285', padding:'4px 8px', borderRadius:999 }}>{tasks.length}</div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {tasks.length === 0 && <div style={{ color:'#6c757d', fontSize:13 }}>Không có nhiệm vụ</div>}
        {tasks.map(task => (
          <div key={task.id}>
            <TaskCard task={task} onOpen={onOpen} onMove={onMove} />
          </div>
        ))}
      </div>
    </div>
  )
}