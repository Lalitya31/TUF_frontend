import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CalendarGrid from './CalendarGrid'
import MarchImage from '../../assets/March.jpg'
import MayImage from '../../assets/May.jpg'
import { formatDate, generateCalendarDays } from '../../utils/dateUtils'

const STORAGE_KEY = 'wall_calendar_state_v2'

const defaultQuotes = [
  { text: "Act like the person you're trying to become.", tint: 'rgba(197, 64, 30, 0.08)', mood: 'motivating' },
  { text: 'Your habits are your real resume.', tint: 'rgba(42, 107, 110, 0.08)', mood: 'grounding' },
  { text: 'What you do daily is who you are.', tint: 'rgba(197, 64, 30, 0.08)', mood: 'grounding' },
  { text: 'Identity is built in repetition, not intention.', tint: 'rgba(42, 107, 110, 0.08)', mood: 'contemplative' },
  { text: 'Your future is scheduled, not imagined.', tint: 'rgba(197, 64, 30, 0.08)', mood: 'motivating' }
]

const headerImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80&fm=jpg&fit=crop'

const monthHeaderImages = {
  2: MarchImage,
  3: headerImage,
  4: MayImage
}

const monthThemes = {
  default: { accent: '#f97316', range: '#2a6b6e', rangeSoft: 'rgba(42, 107, 110, 0.12)', rangeBorder: 'rgba(42, 107, 110, 0.2)' },
  0: { accent: '#7ba7bc', range: '#4a8fa8', rangeSoft: 'rgba(74, 143, 168, 0.12)', rangeBorder: 'rgba(74, 143, 168, 0.22)' },
  1: { accent: '#9b7fa8', range: '#7a5f8a', rangeSoft: 'rgba(122, 95, 138, 0.12)', rangeBorder: 'rgba(122, 95, 138, 0.22)' },
  2: { accent: '#6a8cab', range: '#3f6a86', rangeSoft: 'rgba(63, 106, 134, 0.12)', rangeBorder: 'rgba(63, 106, 134, 0.22)' },
  3: { accent: '#c5401e', range: '#2a6b6e', rangeSoft: 'rgba(42, 107, 110, 0.12)', rangeBorder: 'rgba(42, 107, 110, 0.2)' },
  4: { accent: '#7aa6a1', range: '#4a7b76', rangeSoft: 'rgba(74, 123, 118, 0.12)', rangeBorder: 'rgba(74, 123, 118, 0.22)' },
  6: { accent: '#c9872a', range: '#8a6820', rangeSoft: 'rgba(138, 104, 32, 0.12)', rangeBorder: 'rgba(138, 104, 32, 0.22)' },
  9: { accent: '#a84832', range: '#6b3020', rangeSoft: 'rgba(107, 48, 32, 0.12)', rangeBorder: 'rgba(107, 48, 32, 0.22)' }
}

const weatherByMonth = {
  2: [
    { icon: '☁', temp: '12°' }, { icon: '⛅', temp: '14°' }, { icon: '☀', temp: '18°' },
    { icon: '☀', temp: '19°' }, { icon: '⛅', temp: '16°' }, { icon: '☁', temp: '13°' }, { icon: '☁', temp: '12°' }
  ],
  3: [
    { icon: '☀', temp: '22°' }, { icon: '☀', temp: '24°' }, { icon: '⛅', temp: '23°' },
    { icon: '☀', temp: '25°' }, { icon: '⛅', temp: '21°' }, { icon: '☁', temp: '20°' }, { icon: '☀', temp: '26°' }
  ],
  4: [
    { icon: '☀', temp: '27°' }, { icon: '☀', temp: '28°' }, { icon: '⛅', temp: '26°' },
    { icon: '☀', temp: '29°' }, { icon: '⛅', temp: '27°' }, { icon: '☀', temp: '30°' }, { icon: '☀', temp: '31°' }
  ]
}

const defaultWeather = [
  { icon: '☀', temp: '24°' }, { icon: '⛅', temp: '22°' }, { icon: '☁', temp: '20°' },
  { icon: '☀', temp: '25°' }, { icon: '⛅', temp: '23°' }, { icon: '☀', temp: '26°' }, { icon: '☁', temp: '21°' }
]

const holidays = {
  '2026-01-01': 'New Year',
  '2026-04-14': 'Ambedkar Jayanti',
  '2026-12-25': 'Christmas'
}

const createBlock = (type = 'text') => ({
  id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
  type,
  content: '',
  done: false,
  createdAt: Date.now()
})

const normalizeRangeKey = (start, end) => {
  if (!start || !end) return null
  const s = formatDate(start)
  const e = formatDate(end)
  return s <= e ? `${s}_${e}` : `${e}_${s}`
}

export default function Calendar() {
  const today = useMemo(() => new Date(), [])
  const [flipClass, setFlipClass] = useState('')
  const [notesOpen, setNotesOpen] = useState(true)
  const [hoverDate, setHoverDate] = useState(null)
  const touchStartX = useRef(null)
  const themeRef = useRef('dark')

  const [state, setState] = useState(() => ({
    viewMonth: today.getMonth(),
    viewYear: today.getFullYear(),
    rangeStart: null,
    rangeEnd: null,
    activeDate: null,
    notes: {
      global: [createBlock('text')],
      byRange: {},
      byDate: {}
    },
    quoteIndex: 0,
    notesContext: 'global',
    theme: 'dark'
  }))

  const [quotes] = useState(defaultQuotes)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setState((prev) => ({
          ...prev,
          ...parsed,
          notes: {
            global: parsed.notes?.global || prev.notes.global,
            byRange: parsed.notes?.byRange || {},
            byDate: parsed.notes?.byDate || {}
          },
          theme: parsed.theme || prev.theme
        }))
      }
    } catch (e) {
      console.error('Failed to load calendar state', e)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const current = state.theme || root.getAttribute('data-theme') || 'dark'
    themeRef.current = current
    root.setAttribute('data-theme', current)
  }, [state.theme])

  useEffect(() => {
    const root = document.documentElement
    const theme = monthThemes[state.viewMonth] || monthThemes.default
    root.style.setProperty('--accent', theme.accent)
    root.style.setProperty('--range-color', theme.range)
    root.style.setProperty('--range-soft', theme.rangeSoft)
    root.style.setProperty('--range-border', theme.rangeBorder)
  }, [state.viewMonth])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.error('Failed to save calendar state', e)
    }
  }, [state])

  useEffect(() => {
    const id = setInterval(() => {
      setState((s) => ({ ...s, quoteIndex: (s.quoteIndex + 1) % quotes.length }))
    }, 3000)
    return () => clearInterval(id)
  }, [quotes.length])

  useEffect(() => {
    if ((!state.rangeStart || !state.rangeEnd) && state.notesContext === 'range') {
      setState((prev) => ({ ...prev, notesContext: 'global' }))
    }
  }, [state.rangeEnd, state.rangeStart, state.notesContext])

  const currentMonth = useMemo(
    () => new Date(state.viewYear, state.viewMonth, 1),
    [state.viewMonth, state.viewYear]
  )

  const days = useMemo(
    () => generateCalendarDays(state.viewYear, state.viewMonth),
    [state.viewYear, state.viewMonth]
  )

  const selectedRange = useMemo(
    () => ({
      start: state.rangeStart ? new Date(state.rangeStart) : null,
      end: state.rangeEnd ? new Date(state.rangeEnd) : null
    }),
    [state.rangeEnd, state.rangeStart]
  )

  const onMonthChange = useCallback((offset) => {
    if (!offset) return
    setFlipClass(offset > 0 ? 'flip-forward' : 'flip-back')
    setTimeout(() => setFlipClass(''), 650)
    setState((prev) => {
      const nextDate = new Date(prev.viewYear, prev.viewMonth + offset, 1)
      return { ...prev, viewMonth: nextDate.getMonth(), viewYear: nextDate.getFullYear() }
    })
  }, [])

  const onDayClick = useCallback((date) => {
    const dateKey = formatDate(date)
    setState((prev) => {
      if (!prev.rangeStart || (prev.rangeStart && prev.rangeEnd)) {
        return {
          ...prev,
          rangeStart: date.toISOString(),
          rangeEnd: null,
          activeDate: dateKey,
          notesContext: 'date'
        }
      }
      const start = new Date(prev.rangeStart)
      if (date.getTime() < start.getTime()) {
        return {
          ...prev,
          rangeStart: date.toISOString(),
          rangeEnd: start.toISOString(),
          activeDate: dateKey
        }
      }
      return { ...prev, rangeEnd: date.toISOString(), activeDate: dateKey }
    })
  }, [])

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 50) {
      onMonthChange(delta < 0 ? 1 : -1)
    }
    touchStartX.current = null
  }

  const rangeKey = selectedRange.start && selectedRange.end
    ? normalizeRangeKey(selectedRange.start, selectedRange.end)
    : null

  const activeDateKey = state.activeDate

  const activeContext = state.notesContext === 'range' && rangeKey
    ? 'range'
    : state.notesContext === 'date' && activeDateKey
      ? 'date'
      : 'global'

  const noteBlocks = activeContext === 'range'
    ? state.notes.byRange[rangeKey] || [createBlock('text')]
    : activeContext === 'date'
      ? state.notes.byDate[activeDateKey] || [createBlock('todo')]
      : state.notes.global

  const setBlocks = (nextBlocks) => {
    setState((prev) => {
      const notes = { ...prev.notes }
      if (activeContext === 'range' && rangeKey) {
        notes.byRange = { ...notes.byRange, [rangeKey]: nextBlocks }
      } else if (activeContext === 'date' && activeDateKey) {
        notes.byDate = { ...notes.byDate, [activeDateKey]: nextBlocks }
      } else {
        notes.global = nextBlocks
      }
      return { ...prev, notes }
    })
  }

  const attachNotesToRange = () => {
    if (!rangeKey) return
    setState((prev) => ({ ...prev, notesContext: 'range' }))
  }

  const attachNotesToDate = () => {
    if (!activeDateKey) return
    setState((prev) => ({ ...prev, notesContext: 'date' }))
  }

  const detachNotesFromRange = () => {
    setState((prev) => ({ ...prev, notesContext: 'global' }))
  }

  const handleBlockChange = (id, patch) => {
    const updated = noteBlocks.map((block) => (block.id === id ? { ...block, ...patch } : block))
    setBlocks(updated)
  }

  const handleAddBlock = (type = 'text') => {
    setBlocks([...noteBlocks, createBlock(type)])
  }

  const handleSlashCommand = (id, command) => {
    if (command === 'todo') return handleBlockChange(id, { type: 'todo', content: '' })
    if (command === 'h') return handleBlockChange(id, { type: 'heading', content: '' })
    return handleBlockChange(id, { type: 'text', content: '' })
  }

  const toggleTheme = () => {
    const root = document.documentElement
    const current = root.getAttribute('data-theme') || themeRef.current
    const next = current === 'dark' ? 'light' : 'dark'
    root.setAttribute('data-theme', next)
    themeRef.current = next
    setState((prev) => ({ ...prev, theme: next }))
  }

  const quote = quotes[state.quoteIndex] || quotes[0]
  const headerForMonth = monthHeaderImages[state.viewMonth] || headerImage
  const rangeDays = selectedRange.start && selectedRange.end
    ? Math.round((selectedRange.end.getTime() - selectedRange.start.getTime()) / 86400000) + 1
    : 0
  const rangeLabel = selectedRange.start && selectedRange.end
    ? `${selectedRange.start.toLocaleString(undefined, { month: 'short', day: 'numeric' })} -> ${selectedRange.end.toLocaleString(undefined, { month: 'short', day: 'numeric' })} · ${rangeDays} days`
    : ''

  const monthAbbr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const weatherForMonth = weatherByMonth[state.viewMonth] || defaultWeather

  const jumpToMonth = (targetMonth) => {
    if (targetMonth === state.viewMonth) return
    let diff = targetMonth - state.viewMonth
    if (diff > 6) diff -= 12
    if (diff < -6) diff += 12
    onMonthChange(diff)
  }

  return (
    <div className="calendar-wrapper" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="wire-binding">
        <div className="coil-row">
          {Array.from({ length: 13 }).map((_, i) => (
            <div className="coil" key={`coil-${i}`}>
              <div className="coil-back" />
              <div className="coil-front" />
            </div>
          ))}
        </div>
      </div>

      <div
        className="cal-header"
        style={{ '--quote-tint': quote.tint, '--header-image': `url(${headerForMonth})` }}
      >
        <div className="quote-section">
          <div className="big-quote-mark">“</div>
          <div className="quote-track">
            {quotes.map((q, idx) => (
              <div key={q.text} className={`quote-slide ${idx === state.quoteIndex ? 'active' : ''}`}>
                <div className="quote-text">{q.text}</div>
                <div className="quote-author">✦ ✦ ✦</div>
                <div className="quote-mood">- {q.mood} -</div>
              </div>
            ))}
          </div>
          <div className="quote-dots">
            {quotes.map((_, idx) => (
              <div
                key={`dot-${idx}`}
                onClick={() => setState((s) => ({ ...s, quoteIndex: idx }))}
                className={`quote-dot ${idx === state.quoteIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
        <div className="month-title-block">
          <div className="month-name">{currentMonth.toLocaleString(undefined, { month: 'long' })}</div>
          <div className="month-year">{currentMonth.getFullYear()}</div>
          <button className="btn" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
            {state.theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>

      <div className="year-strip" role="tablist" aria-label="Jump to month">
        {monthAbbr.map((label, idx) => (
          <button
            key={label}
            className={`year-chip ${idx === state.viewMonth ? 'active' : ''}`}
            onClick={() => jumpToMonth(idx)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="cal-body">
        <aside className={`notes-panel ${notesOpen ? '' : 'collapsed'}`}>
          <div className="notes-label">
            <span>Notes</span>
            <span className={`range-ctx-badge ${activeContext === 'range' ? 'visible' : ''}`}>
              Range
            </span>
            <span className={`range-ctx-badge ${activeContext === 'date' ? 'visible' : ''}`}>
              Date
            </span>
            <button className="notes-toggle" onClick={() => setNotesOpen((v) => !v)} aria-label="Toggle notes panel">
              {notesOpen ? '▾' : '▸'}
            </button>
          </div>
          <div className="notes-content">
            <div className="notes-actions">
              <button className="btn" onClick={() => handleAddBlock('text')}>Add</button>
              <button className="btn" onClick={() => handleAddBlock('todo')}>Todo</button>
              <button className={`btn ${activeContext === 'date' ? 'btn-active' : ''}`} onClick={attachNotesToDate} disabled={!activeDateKey}>Date</button>
              {activeContext === 'range' ? (
                <button className={`btn ${activeContext === 'range' ? 'btn-active' : ''}`} onClick={detachNotesFromRange}>Global</button>
              ) : rangeKey ? (
                <button className={`btn ${activeContext === 'range' ? 'btn-active' : ''}`} onClick={attachNotesToRange}>Attach</button>
              ) : null}
            </div>
            {noteBlocks.length === 1 && !noteBlocks[0].content.trim() ? (
              <div className="notes-empty">
                {activeContext === 'date' && activeDateKey
                  ? `No notes for ${activeDateKey}. Start typing...`
                  : 'Select a date or write a general note.'}
              </div>
            ) : null}
            <div className="notes-list">
              {noteBlocks.map((block) => (
                <div className="note-block" key={block.id}>
                  {block.type === 'todo' ? (
                    <div
                      className={`todo-check ${block.done ? 'active' : ''}`}
                      onClick={() => handleBlockChange(block.id, { done: !block.done })}
                      role="button"
                      tabIndex={0}
                    >
                      {block.done ? '✓' : ''}
                    </div>
                  ) : null}
                  <input
                    className={`note-input ${block.type} ${block.done ? 'done' : ''}`}
                    value={block.content}
                    placeholder={block.type === 'heading' ? 'Heading' : 'Write a note…'}
                    onChange={(e) => handleBlockChange(block.id, { content: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddBlock('text')
                      }
                    }}
                  />
                  {block.content.startsWith('/') ? (
                    <div className="slash-menu">
                      {['h', 'todo', 'text'].map((cmd) => (
                        <button
                          key={`${block.id}-${cmd}`}
                          className="slash-pill"
                          onClick={() => handleSlashCommand(block.id, cmd)}
                        >
                          /{cmd}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className={`grid-panel ${flipClass}`}>
          <div className="grid-header">
            <button className="nav-btn" onClick={() => onMonthChange(-1)} aria-label="Previous month">‹</button>
            <div className="month-title">
              {currentMonth.toLocaleString(undefined, { month: 'long' })} {currentMonth.getFullYear()}
            </div>
            <button className="nav-btn" onClick={() => onMonthChange(1)} aria-label="Next month">›</button>
          </div>
          {rangeLabel ? <div className="range-pill">{rangeLabel}</div> : null}
          <CalendarGrid
            days={days}
            today={today}
            selectedRange={selectedRange}
            hoverDate={hoverDate}
            onDayClick={onDayClick}
            onDayDoubleClick={() => {}}
            onDayLongPress={() => {}}
            onDayHover={setHoverDate}
            notesByDate={state.notes.byDate}
            activeDateKey={activeDateKey}
            holidays={holidays}
            weather={weatherForMonth}
          />
        </section>
      </div>
    </div>
  )
}
