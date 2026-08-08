import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { addExpression, MOODS } from '../data/api'

const SYSTEM_OVERLAYS = [
  { mood: 'inspired', path: '/overlays/cosmic-butterfly.svg', label: 'Cosmic Butterfly' },
  { mood: 'calm', path: '/overlays/tree-birds-target.png', label: 'Test Tree' },
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 520 }}>
        <label>
          <span style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: '#c9c4d8' }}>
            Expression Name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cyberpunk Hoodie"
            style={inputStyle}
          />
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
            Choose Artwork Design &amp; Expression Mood
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {SYSTEM_OVERLAYS.map((overlay) => {
              const isSelected = selectedOverlay.label === overlay.label
              return (
                <div
                  key={overlay.label}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, rgba(124, 92, 255, 0.18) 0%, rgba(26, 26, 32, 0.8) 100%)' : 'rgba(26, 26, 32, 0.6)',
                    border: isSelected ? '2px solid #7c5cff' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 16,
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      onClick={() => {
                        setSelectedOverlay(overlay)
                        setMood(overlay.mood)
                      }}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 12,
                        backgroundImage: `url(${overlay.path})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundColor: '#121218',
                        border: isSelected ? '2px solid #7c5cff' : '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{overlay.label}</h4>
                        {isSelected && (
                          <span style={{ fontSize: '0.7rem', background: '#7c5cff', color: '#fff', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                            ACTIVE SELECTION
                          </span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#8888a0', lineHeight: 1.4 }}>
                        {overlay.label === 'Cosmic Butterfly' 
                          ? '✨ 3D Flapping Wings & Star-Dust Flight Trail'
                          : '🌿 2 Perched Bluebirds & Falling Autumn Leaves'}
                      </p>
                    </div>
                  </div>

                  {/* Mood Selector Buttons inside this specific artwork */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#a0a0b8', marginBottom: 6 }}>
                      Select Expression Mood for {overlay.label}:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {MOODS.map((m) => {
                        const isMoodActive = isSelected && mood === m
                        return (
                          <button
                            type="button"
                            key={m}
                            onClick={() => {
                              setSelectedOverlay(overlay)
                              setMood(m)
                            }}
                            style={{
                              padding: '4px 10px',
                              borderRadius: 999,
                              border: isMoodActive ? '1px solid #7c5cff' : '1px solid rgba(255, 255, 255, 0.1)',
                              background: isMoodActive ? '#7c5cff' : 'rgba(255, 255, 255, 0.05)',
                              color: isMoodActive ? '#fff' : '#aaa',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {m === 'calm' ? '🌿 calm' : m === 'inspired' ? '🌌 inspired' : m === 'happy' ? '⚡ happy' : m === 'playful' ? '🎨 playful' : '🧘 peaceful'}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Interactive 3D AR Visual Preview Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 24, 54, 0.8) 0%, rgba(18, 18, 24, 0.9) 100%)',
            border: '1px solid rgba(124, 92, 255, 0.3)',
            borderRadius: 14,
            padding: '1rem 1.25rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7c5cff' }}>
                🔮 3D AR Visual Preview
              </span>
              <span style={{
                background: 'rgba(124, 92, 255, 0.2)',
                color: '#bfaeff',
                padding: '2px 8px',
                borderRadius: 99,
                fontSize: '0.7rem',
                fontWeight: 700,
              }}>
                {selectedOverlay.label} ({mood})
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#e0dcf0', lineHeight: 1.6, marginBottom: '0.5rem' }}>
              {selectedOverlay.label === 'Cosmic Butterfly' ? (
                <>
                  <p style={{ margin: '0 0 6px 0' }}>🦋 <strong>3D Motion:</strong> Flapping Wing Oscillations &amp; Star-Dust Flight Trail</p>
                  <p style={{ margin: '0 0 6px 0' }}>🎨 <strong>Ambient Aura:</strong> {mood === 'inspired' ? 'Cyan & Magenta Neon Galactic Glow' : mood === 'calm' ? 'Teal Soft Ambient Glow' : 'Golden Radiant Sparkles'}</p>
                  <p style={{ margin: 0 }}>❤️ <strong>Social Deck:</strong> Floating 3D Hearts rising upward on viewer Likes</p>
                </>
              ) : (
                <>
                  <p style={{ margin: '0 0 6px 0' }}>🌿 <strong>3D Motion:</strong> 2 Perched Birds &amp; Falling Autumn Leaves floating in wind</p>
                  <p style={{ margin: '0 0 6px 0' }}>🧘 <strong>Ambient Aura:</strong> {mood === 'calm' ? 'Soothing Emerald & Teal Breathing Glow' : mood === 'peaceful' ? 'Soft Blue Zen Aura' : 'Golden Sunlight Pulse'}</p>
                  <p style={{ margin: 0 }}>❤️ <strong>Social Deck:</strong> Live Reactions (Likes, Waves &amp; Comments) floating in 3D</p>
                </>
              )}
            </div>

            <div style={{
              marginTop: '0.75rem',
              padding: '0.5rem 0.75rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 8,
              borderLeft: '3px solid #7c5cff',
              fontSize: '0.8rem',
              color: '#a0a0b8',
              fontStyle: 'italic',
            }}>
              Floating 3D Caption Preview: &ldquo;{caption || 'Your custom story will float in 3D AR space right here!'}&rdquo;
            </div>
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
