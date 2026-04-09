import React from 'react'
import Calendar from './components/Calendar/Calendar'

export default function App() {
  return (
    <div className="app-shell">
      <div className="bg-layer" aria-hidden />
      <div className="bg-overlay" aria-hidden />
      <Calendar />
    </div>
  )
}
