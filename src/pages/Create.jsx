import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { addExpression, MOODS } from '../data/api'

const SYSTEM_OVERLAYS = [
  { mood: 'calm', path: '/overlays/tree-birds.svg', label: 'Calm Canopy' },
  { mood: 'happy', path: '/overlays/happy.svg', label: 'Happy Sparks' },
  { mood: 'playful', path: '/overlays/playful.svg', label: 'Playful Bubbles' },
  { mood: 'inspired', path: '/overlays/inspired.svg', label: 'Inspired Prism' },
  { mood: 'peaceful', path: '/overlays/peaceful.svg', label: 'Peaceful Zen' },
]

export default function Create() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [mood, setMood] = useState(MOODS[0])
  const [caption, setCaption] = useState('')
  const [selectedOverlay, setSelectedOverlay] = useState(SYSTEM_OVERLAYS[0])
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const expr = await addExpression({
        name: name || 'My Expression',
        mood,
        caption: caption.trim() || undefined,
        triggerImage: '/markers/hiro.png',
        overlayImage: selectedOverlay.path,
      })
      navigate(`/expression/${expr.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-shell page-main page-enter">
      <Link to="/feed" style={{ display: 'inline-block', marginBottom: '1.5rem', color: '#7c5cff', fontWeight: 600 }}>
        ← Back to Feed
      </Link>
      
      <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>
        Create Expression
      </h1>
      <p style={{ color: '#8888a0', marginBottom: '2rem', fontSize: '0.9rem' }}>
        Publish a digital layer linked to your wearable design. Dictate caption and mood.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 480 }}>
        <label>
          <span style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: '#c9c4d8' }}>
            Expression Name
          </span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cyberpunk Hoodie"
            style={inputStyle}
          />
        </label>

        <label>
          <span style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: '#c9c4d8' }}>
            Active Mood
          </span>
          <select 
            value={mood} 
            onChange={(e) => {
              setMood(e.target.value)
              const matchingOverlay = SYSTEM_OVERLAYS.find(o => o.mood === e.target.value)
              if (matchingOverlay) setSelectedOverlay(matchingOverlay)
            }} 
            style={inputStyle}
          >
            {MOODS.map((m) => (
              <option key={m} value={m} style={{ background: '#1a1a20' }}>{m}</option>
            ))}
          </select>
        </label>

        <label>
          <span style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: '#c9c4d8' }}>
            Caption Story (shows on AR)
          </span>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Fresh design drops today"
            style={inputStyle}
          />
        </label>

        <div>
          <span style={{ display: 'block', marginBottom: 12, fontSize: '0.85rem', fontWeight: 600, color: '#c9c4d8' }}>
            Select AR Visual Overlay Template
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.75rem' }}>
            {SYSTEM_OVERLAYS.map((overlay) => {
              const isSelected = selectedOverlay.mood === overlay.mood
              return (
                <button
                  type="button"
                  key={overlay.mood}
                  onClick={() => {
                    setSelectedOverlay(overlay)
                    setMood(overlay.mood)
                  }}
                  style={{
                    background: isSelected ? 'rgba(124, 92, 255, 0.15)' : 'rgba(26, 26, 32, 0.7)',
                    border: isSelected ? '2px solid #7c5cff' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 12,
                    padding: '0.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      backgroundImage: `url(${overlay.path})`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      marginBottom: 6,
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', color: isSelected ? '#fff' : '#8888a0', fontWeight: 600 }}>
                    {overlay.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <button type="submit" className="btn-primary" style={btnStyle} disabled={submitting}>
          {submitting ? 'Creating…' : 'Publish Expression'}
        </button>
      </form>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: 8,
  border: '1px solid rgba(255, 255, 255, 0.08)',
  background: 'rgba(26, 26, 32, 0.7)',
  color: '#f0f0f5',
  fontSize: '0.95rem',
}
const btnStyle = {
  marginTop: '1rem',
  padding: '0.85rem 1.5rem',
  background: '#7c5cff',
  color: '#fff',
  borderRadius: '9999px',
  fontWeight: 700,
  fontSize: '0.95rem',
  boxShadow: '0 4px 16px rgba(124, 92, 255, 0.25)',
}

