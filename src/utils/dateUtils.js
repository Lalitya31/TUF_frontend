// Utility date helpers
export function formatDate(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isSameDay(a, b) {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function isInRange(day, start, end) {
  if (!start || !end) return false
  const t = dateToNumber(day)
  return dateToNumber(start) <= t && t <= dateToNumber(end)
}

function dateToNumber(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

// Generate an array of days to fill a 6-row calendar grid for the provided month
export function generateCalendarDays(year, month) {
  // month: 0-based
  const firstOfMonth = new Date(year, month, 1)
  const startDay = firstOfMonth.getDay() // 0 (Sun) - 6

  // start from the Sunday before (or the day itself)
  const startDate = new Date(year, month, 1 - startDay)

  const days = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + i)
    days.push({ date: d, currentMonth: d.getMonth() === month })
  }
  return days
}
