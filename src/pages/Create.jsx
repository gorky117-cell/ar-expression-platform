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
  const [hoveredState, setHoveredState] = useState(null) // { overlay, mood }
  const [submitting, setSubmitting] = useState(false)

  const activeOverlay = hoveredState?.overlay || selectedOverlay
  const activeMood = hoveredState?.mood || mood
  const isHoveredPreview = !!hoveredState

  // Dynamic aura colors per mood
  const getAuraColor = (m) => {
    switch (m) {
      case 'inspired': return 'rgba(0, 240, 255, 0.4)'
      case 'calm': return 'rgba(16, 185, 129, 0.4)'
      case 'happy': return 'rgba(245, 158, 11, 0.4)'
      case 'playful': return 'rgba(236, 72, 153, 0.4)'
      case 'peaceful': return 'rgba(99, 102, 241, 0.4)'
      default: return 'rgba(124, 92, 255, 0.4)'
    }
  }

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
      {/* CSS Animations for AR Graphic Preview */}
      <style>{`
        @keyframes butterflyFlap {
          0%, 100% { transform: scaleX(1) scaleY(1) rotate(0deg); }
          50% { transform: scaleX(0.82) scaleY(1.05) rotate(-3deg); }
        }
        @keyframes treeSway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2.5deg); }
        }
        @keyframes floatText {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      <Link to="/feed" style={{ display: 'inline-block', marginBottom: '1.5rem', color: '#7c5cff', fontWeight: 600 }}>
        ← Back to Feed
      </Link>
      
      <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>
        Create Expression
      </h1>
      <p style={{ color: '#8888a0', marginBottom: '2rem', fontSize: '0.9rem' }}>
        Publish a digital layer linked to your wearable design. Dictate caption and mood.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 540 }}>
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
                      onMouseEnter={() => setHoveredState({ overlay, mood: overlay.mood })}
                      onMouseLeave={() => setHoveredState(null)}
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
                      Select Expression Mood (Hover to preview in AR):
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {MOODS.map((m) => {
                        const isMoodActive = isSelected && mood === m
                        const isHovered = hoveredState?.overlay.label === overlay.label && hoveredState?.mood === m
                        return (
                          <button
                            type="button"
                            key={m}
                            onClick={() => {
                              setSelectedOverlay(overlay)
                              setMood(m)
                            }}
                            onMouseEnter={() => setHoveredState({ overlay, mood: m })}
                            onMouseLeave={() => setHoveredState(null)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: 999,
                              border: isMoodActive ? '1px solid #7c5cff' : isHovered ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
                              background: isMoodActive ? '#7c5cff' : isHovered ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                              color: isMoodActive ? '#fff' : isHovered ? '#00f0ff' : '#aaa',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
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
            background: isHoveredPreview 
              ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(30, 24, 54, 0.9) 100%)' 
              : 'linear-gradient(135deg, rgba(30, 24, 54, 0.8) 0%, rgba(18, 18, 24, 0.9) 100%)',
            border: isHoveredPreview ? '1px solid #00f0ff' : '1px solid rgba(124, 92, 255, 0.3)',
            borderRadius: 16,
            padding: '1.25rem',
            boxShadow: isHoveredPreview ? '0 8px 32px rgba(0, 240, 255, 0.25)' : '0 8px 32px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.25s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: isHoveredPreview ? '#00f0ff' : '#7c5cff' }}>
                🔮 LIVE AR VISUAL PREVIEW {isHoveredPreview ? '(HOVER PREVIEW)' : ''}
              </span>
              <span style={{
                background: isHoveredPreview ? 'rgba(0, 240, 255, 0.2)' : 'rgba(124, 92, 255, 0.2)',
                color: isHoveredPreview ? '#00f0ff' : '#bfaeff',
                padding: '3px 10px',
                borderRadius: 99,
                fontSize: '0.72rem',
                fontWeight: 700,
              }}>
                {activeOverlay.label} ({activeMood})
              </span>
            </div>

            {/* LIVE ANIMATED GRAPHIC CANVAS PREVIEW BOX */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: 160,
              borderRadius: 12,
              backgroundColor: '#0a0a10',
              border: `1px solid ${getAuraColor(activeMood)}`,
              boxShadow: `inset 0 0 30px ${getAuraColor(activeMood)}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              overflow: 'hidden',
              marginBottom: '1rem',
            }}>
              {/* Pulsing Aura Ring Behind Artwork */}
              <div style={{
                position: 'absolute',
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: getAuraColor(activeMood),
                filter: 'blur(20px)',
                animation: 'floatText 2.5s infinite ease-in-out',
              }} />

              {/* Animated Artwork Graphic Preview */}
              <img
                src={activeOverlay.path}
                alt="AR Preview"
                style={{
                  width: 90,
                  height: 90,
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 2,
                  animation: activeOverlay.label === 'Cosmic Butterfly' 
                    ? 'butterflyFlap 1.2s infinite ease-in-out' 
                    : 'treeSway 3s infinite ease-in-out',
                }}
              />

              {/* Live Floating 3D Caption Story Badge */}
              <div style={{
                position: 'relative',
                zIndex: 3,
                marginTop: 8,
                padding: '4px 12px',
                borderRadius: 999,
                background: 'rgba(0, 0, 0, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                animation: 'floatText 2s infinite ease-in-out',
              }}>
                💬 &ldquo;{caption || 'Your 3D AR story floats here'}&rdquo;
              </div>
            </div>

            {/* Detailed Description */}
            <div style={{ fontSize: '0.82rem', color: '#d0cce0', lineHeight: 1.6 }}>
              {activeOverlay.label === 'Cosmic Butterfly' ? (
                <>
                  <p style={{ margin: '0 0 4px 0' }}>🦋 <strong>3D Motion:</strong> Flapping Wing Oscillations &amp; Star-Dust Flight Trail</p>
                  <p style={{ margin: '0 0 4px 0' }}>🎨 <strong>Ambient Aura:</strong> {activeMood === 'inspired' ? 'Cyan & Magenta Neon Galactic Glow' : activeMood === 'calm' ? 'Teal Soft Ambient Glow' : activeMood === 'happy' ? 'Golden Radiant Sparkles' : activeMood === 'playful' ? 'Bouncing Sparkle Particle Swarm' : 'Soft Zen Breathing Waves'}</p>
                </>
              ) : (
                <>
                  <p style={{ margin: '0 0 4px 0' }}>🌿 <strong>3D Motion:</strong> 2 Perched Bluebirds &amp; Falling Autumn Leaves floating in wind</p>
                  <p style={{ margin: '0 0 4px 0' }}>🧘 <strong>Ambient Aura:</strong> {activeMood === 'calm' ? 'Soothing Emerald & Teal Breathing Glow' : activeMood === 'peaceful' ? 'Soft Blue Zen Aura' : activeMood === 'happy' ? 'Golden Sunlight Pulse' : activeMood === 'inspired' ? 'Glowing Starlight Roots' : 'Sparkling Leaf Aura'}</p>
                </>
              )}
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
