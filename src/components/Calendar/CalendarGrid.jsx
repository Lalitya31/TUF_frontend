import React from 'react'
import DayCell from './DayCell'
import { formatDate, isSameDay, isInRange } from '../../utils/dateUtils'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarGrid({
  days,
  today,
  selectedRange,
  hoverDate,
  onDayClick,
  onDayDoubleClick,
  onDayLongPress,
  onDayHover,
  notesByDate,
  activeDateKey,
  holidays,
  weather
}) {
  return (
    <div className="cal-grid-wrap">
      <div className="weekdays">
        {weekdays.map((w) => (
          <div key={w} className="weekday">{w}</div>
        ))}
      </div>

      <div className="weather-strip">
        {(weather || []).map((item, idx) => (
          <div key={`weather-${idx}`} className="weather-cell">
            <span className="weather-icon">{item.icon}</span>
            <span className="weather-temp">{item.temp}</span>
          </div>
        ))}
      </div>

      <div className="cal-grid">
        {days.map(({ date, currentMonth }, idx) => {
          const isToday = isSameDay(date, today)
          const isStart = selectedRange.start && isSameDay(date, selectedRange.start)
          const isEnd = selectedRange.end && isSameDay(date, selectedRange.end)
          const inRange = selectedRange.start && selectedRange.end && isInRange(date, selectedRange.start, selectedRange.end)
          const previewRange = selectedRange.start && !selectedRange.end && hoverDate && isInRange(date, selectedRange.start, hoverDate)
          const dateKey = formatDate(date)
          const tasks = notesByDate?.[dateKey] || []
          const todos = tasks.filter((b) => b.type === 'todo' && b.content.trim())
          const todoTotal = todos.length
          const todoDone = todos.filter((b) => b.done).length
          const textNotes = tasks.filter((b) => b.type !== 'todo' && b.content.trim()).length
          const noteStatus = todoTotal > 0
            ? (todoDone === todoTotal ? 'done' : 'pending')
            : (textNotes > 0 ? 'note' : 'none')
          const isActive = activeDateKey === dateKey
          const holidayLabel = holidays?.[dateKey]

          return (
            <DayCell
              key={idx}
              date={date}
              currentMonth={currentMonth}
              onClick={() => onDayClick(date)}
              onDoubleClick={() => onDayDoubleClick(date)}
              onLongPress={() => onDayLongPress(date)}
              onHover={(over) => onDayHover(over ? date : null)}
              isToday={isToday}
              isStart={isStart}
              isEnd={isEnd}
              inRange={inRange}
              previewRange={previewRange}
              noteStatus={noteStatus}
              isActive={isActive}
              holidayLabel={holidayLabel}
            />
          )
        })}
      </div>
    </div>
  )
}
