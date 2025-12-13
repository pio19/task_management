import React from 'react'
import { Outlet } from 'react-router-dom'
import TopBar from './components/TopBar'

export default function App() {
  return (
    <div className="app-shell" style={{ background: 'var(--tw-color-neutral-100)' }}>
      <TopBar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  )
}