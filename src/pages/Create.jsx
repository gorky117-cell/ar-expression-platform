import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addExpression, MOODS } from '../data/api'

export default function Create() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [mood, setMood] = useState(MOODS[0])
  const [caption, setCaption] = useState('')
  const [triggerUrl, setTriggerUrl] = useState('')
  const [overlayUrl, setOverlayUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const expr = await addExpression({
        name: name || 'My Expression',
        mood,
        caption: caption.trim() || undefined,
        triggerImage: triggerUrl || '/markers/hiro.png',
        overlayImage: overlayUrl || '/overlays/tree-birds.svg',
      })
      navigate(`/expression/${expr.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Create Expression</h1>
      <p style={{ color: '#8888a0', marginBottom: '1.5rem' }}>
        Add a trigger image (what people scan) and an overlay (what appears in AR).
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}>
        <label>
          <span style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Tree & Birds"
            style={inputStyle}
          />
        </label>
        <label>
          <span style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>Mood</span>
          <select value={mood} onChange={(e) => setMood(e.target.value)} style={inputStyle}>
            {MOODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
        <label>
          <span style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>Caption (shows below image in AR)</span>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Optional: e.g. Calm today"
            style={inputStyle}
          />
        </label>
        <label>
          <span style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>Trigger image URL</span>
          <input
            type="text"
            value={triggerUrl}
            onChange={(e) => setTriggerUrl(e.target.value)}
            placeholder="Leave empty to use default marker"
            style={inputStyle}
          />
        </label>
        <label>
          <span style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>Overlay image URL</span>
          <input
            type="text"
            value={overlayUrl}
            onChange={(e) => setOverlayUrl(e.target.value)}
            placeholder="Leave empty to use default"
            style={inputStyle}
          />
        </label>
        <button type="submit" style={btnStyle} disabled={submitting}>
          {submitting ? 'Creating…' : 'Create Expression'}
        </button>
      </form>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.6rem',
  borderRadius: 8,
  border: '1px solid #2a2a35',
  background: '#252530',
  color: '#f0f0f5',
}
const btnStyle = {
  padding: '0.75rem 1.25rem',
  background: '#7c5cff',
  color: '#fff',
  borderRadius: 8,
  fontWeight: 600,
}
