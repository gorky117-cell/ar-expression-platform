import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { addExpression } from '../data/api'

// ARTWORK-SPECIFIC MOODS & EXPRESSION OPTIONS
const SYSTEM_OVERLAYS = [
  {
    label: 'Cosmic Butterfly',
    path: '/overlays/cosmic-butterfly.svg',
    defaultMood: 'inspired',
    moods: [
      { id: 'inspired', label: '🌌 galactic', particle: '✨', aura: 'rgba(0, 240, 255, 0.6)', motion: 'Flapping Wing Oscillations & Star-Dust Flight Trail', auraDesc: 'Cyan & Magenta Neon Galactic Glow' },
      { id: 'flutter', label: '🦋 micro-swarm', particle: '🦋', aura: 'rgba(236, 72, 153, 0.6)', motion: 'Micro-Butterfly Swarm & Pulsing Wing Flap', auraDesc: 'Vibrant Magenta & Pink Sparkle Swarm' },
      { id: 'hyperdrive', label: '⚡ hyperdrive', particle: '⚡', aura: 'rgba(245, 158, 11, 0.6)', motion: 'Electric Gold Sparkle Burst & High-Speed Flap', auraDesc: 'Radiant Golden Sunlight Pulse' },
      { id: 'zenith', label: '🧘 zenith aura', particle: '🔮', aura: 'rgba(99, 102, 241, 0.6)', motion: 'Soft Violet Breathing Aura Waves', auraDesc: 'Deep Indigo & Violet Zen Ripple' },
    ]
  },
  {
    label: 'Test Tree',
    path: '/overlays/tree-birds-target.png',
    defaultMood: 'calm',
    moods: [
      { id: 'calm', label: '🌿 canopy-calm', particle: '🍃', aura: 'rgba(16, 185, 129, 0.6)', motion: '2 Perched Bluebirds & Falling Autumn Leaves floating in wind', auraDesc: 'Soothing Emerald & Teal Breathing Glow around trunk' },
      { id: 'breeze', label: '🍃 leaf-whirlwind', particle: '🍁', aura: 'rgba(245, 158, 11, 0.6)', motion: 'Swirling Golden Leaf Whirlwind & Swaying Tree Canopy', auraDesc: 'Warm Autumn Gold & Amber Glow' },
      { id: 'sunlight', label: '☀️ solar-beams', particle: '☀️', aura: 'rgba(251, 191, 36, 0.6)', motion: 'Radiant Sun Beams & Nesting Bird Animations', auraDesc: 'Bright Sunlight Ray Particles' },
      { id: 'starlight', label: '✨ starlight-roots', particle: '🌟', aura: 'rgba(56, 189, 248, 0.6)', motion: 'Starlight Root Pulses & Glowing Hummingbird Hover', auraDesc: 'Sky-Blue Starlight Aura' },
    ]
  },
]

export default function Create() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [caption, setCaption] = useState('')
  const [selectedOverlay, setSelectedOverlay] = useState(SYSTEM_OVERLAYS[0])
  const [mood, setMood] = useState(SYSTEM_OVERLAYS[0].defaultMood)
  const [hoveredState, setHoveredState] = useState(null) // { overlay, moodObj }
  const [submitting, setSubmitting] = useState(false)

  const activeOverlay = hoveredState?.overlay || selectedOverlay
  
  // Find current mood object
  const currentMoodObj = activeOverlay.moods.find(m => m.id === (hoveredState?.moodObj?.id || mood)) || activeOverlay.moods[0]
  const isHoveredPreview = !!hoveredState

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const expr = await addExpression({
        name: name || 'My Expression',
        mood: currentMoodObj.id,
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
      {/* CSS Animations for AR Graphic Preview & Floating Particles */}
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
        @keyframes particleUp {
          0% { transform: translateY(20px) scale(0.6); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-30px) scale(1.1); opacity: 0; }
        }
        @keyframes particleDown {
          0% { transform: translateY(-20px) scale(0.6); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(30px) scale(1.1); opacity: 0; }
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
                        setMood(overlay.defaultMood)
                      }}
                      onMouseEnter={() => setHoveredState({ overlay, moodObj: overlay.moods[0] })}
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

                  {/* Artwork-Specific Mood Selector Buttons */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#a0a0b8', marginBottom: 6 }}>
                      Select Artwork Expression Mood for {overlay.label}:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {overlay.moods.map((mObj) => {
                        const isMoodActive = isSelected && mood === mObj.id
                        const isHovered = hoveredState?.overlay.label === overlay.label && hoveredState?.moodObj?.id === mObj.id
                        return (
                          <button
                            type="button"
                            key={mObj.id}
                            onClick={() => {
                              setSelectedOverlay(overlay)
                              setMood(mObj.id)
                            }}
                            onMouseEnter={() => setHoveredState({ overlay, moodObj: mObj })}
                            onMouseLeave={() => setHoveredState(null)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: 999,
                              border: isMoodActive ? '1px solid #7c5cff' : isHovered ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
                              background: isMoodActive ? '#7c5cff' : isHovered ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                              color: isMoodActive ? '#fff' : isHovered ? '#00f0ff' : '#aaa',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {mObj.label}
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
                {activeOverlay.label} ({currentMoodObj.id})
              </span>
            </div>

            {/* LIVE ANIMATED GRAPHIC CANVAS PREVIEW BOX */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: 170,
              borderRadius: 12,
              backgroundColor: '#0a0a10',
              border: `1px solid ${currentMoodObj.aura}`,
              boxShadow: `inset 0 0 35px ${currentMoodObj.aura}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginBottom: '1rem',
            }}>
              {/* Dynamic Mood Particles Floating Over Artwork */}
              <div style={{ position: 'absolute', top: '15%', left: '20%', fontSize: '1.1rem', animation: 'particleUp 2.2s infinite ease-in-out', zIndex: 1 }}>
                {currentMoodObj.particle}
              </div>
              <div style={{ position: 'absolute', top: '25%', right: '25%', fontSize: '1.2rem', animation: 'particleUp 1.8s infinite ease-in-out 0.4s', zIndex: 1 }}>
                {currentMoodObj.particle}
              </div>
              <div style={{ position: 'absolute', bottom: '20%', left: '30%', fontSize: '1rem', animation: 'particleDown 2.5s infinite ease-in-out 0.8s', zIndex: 1 }}>
                {currentMoodObj.particle}
              </div>

              {/* Pulsing Aura Ring Behind Artwork */}
              <div style={{
                position: 'absolute',
                width: 110,
                height: 110,
                borderRadius: '50%',
                background: currentMoodObj.aura,
                filter: 'blur(22px)',
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
              <p style={{ margin: '0 0 4px 0' }}>✨ <strong>3D Motion:</strong> {currentMoodObj.motion}</p>
              <p style={{ margin: 0 }}>🎨 <strong>Ambient Aura:</strong> {currentMoodObj.auraDesc}</p>
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
