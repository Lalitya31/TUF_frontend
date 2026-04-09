import React, { useRef, useState } from 'react'
import { formatDate } from '../../utils/dateUtils'

export default function DayCell({
  date,
  currentMonth,
  onClick,
  onDoubleClick,
  onLongPress,
  onHover,
  isToday,
  isStart,
  isEnd,
  inRange,
  previewRange,
  noteStatus,
  isActive,
  holidayLabel
}) {
  const touchTimer = useRef(null)
  const [ripple, setRipple] = useState(null)

  const cls = [
    'day-cell',
    currentMonth ? '' : 'muted',
    isToday ? 'today' : '',
    isStart ? 'start' : '',
    isEnd ? 'end' : '',
    inRange ? 'in-range' : '',
    previewRange ? 'preview-range' : '',
    noteStatus !== 'none' ? 'has-note' : '',
    isActive ? 'active-date' : ''
  ].filter(Boolean).join(' ')

  const handleTouchStart = () => {
    touchTimer.current = setTimeout(() => {
      onLongPress()
    }, 600)
  }

  const handleTouchEnd = () => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current)
      touchTimer.current = null
    }
  }

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    setRipple({ x, y, key: Date.now() })
    setTimeout(() => setRipple(null), 400)
    onClick()
  }

  return (
    <div
      className={cls}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex={0}
      aria-label={formatDate(date)}
    >
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="date-num">{date.getDate()}</div>
        {noteStatus !== 'none' ? (
          <div className={`status-dot ${noteStatus}`} aria-hidden>
            {noteStatus === 'done' ? '✓' : ''}
          </div>
        ) : null}
        {holidayLabel ? <div className="holiday-dot" title={holidayLabel} aria-hidden /> : null}
      </div>
      {ripple ? (
        <span
          key={ripple.key}
          className="ink-ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ) : null}
    </div>
  )
}
