import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { addExpression, updateExpression, getActiveExpressionByOverlay, MOODS } from '../data/api'

// 2 Official Artworks with Detailed Mood Behavior Descriptions
const SYSTEM_OVERLAYS = [
  {
    label: 'Cosmic Butterfly',
    path: '/overlays/cosmic-butterfly.svg',
    defaultMood: 'inspired',
    moodBehaviors: {
      inspired: { particle: '✨', aura: 'rgba(0, 240, 255, 0.6)', motion: '3D Flapping Wing Oscillations & Galactic Star-Dust Flight Trail', auraDesc: 'Cyan & Magenta Neon Galactic Glow' },
      calm: { particle: '🍃', aura: 'rgba(16, 185, 129, 0.6)', motion: 'Soft Wing Oscillations & Gentle Floating Breeze', auraDesc: 'Teal & Emerald Soft Ambient Breathing Glow' },
      happy: { particle: '⚡', aura: 'rgba(245, 158, 11, 0.6)', motion: 'High-Speed Flap & Electric Gold Sparkle Burst', auraDesc: 'Radiant Golden Sunlight Pulse' },
      playful: { particle: '🎨', aura: 'rgba(236, 72, 153, 0.6)', motion: 'Micro-Butterfly Swarm & Bouncing Sparkle Particles', auraDesc: 'Vibrant Magenta & Pink Sparkle Swarm' },
      peaceful: { particle: '🧘', aura: 'rgba(99, 102, 241, 0.6)', motion: 'Deep Zen Breathing Aura & Floating Indigo Ripples', auraDesc: 'Deep Indigo & Violet Zen Ripple' },
    }
  },
  {
    label: 'Test Tree',
    path: '/overlays/tree-birds-target.png',
    defaultMood: 'calm',
    moodBehaviors: {
      calm: { particle: '🍃', aura: 'rgba(16, 185, 129, 0.6)', motion: '2 Perched Bluebirds & Falling Autumn Leaves floating in wind', auraDesc: 'Soothing Emerald & Teal Breathing Glow around trunk' },
      happy: { particle: '☀️', aura: 'rgba(251, 191, 36, 0.6)', motion: 'Radiant Sun Beams & Golden Leaf Oscillations', auraDesc: 'Bright Sunlight Ray Burst & Warm Amber Pulsing' },
      playful: { particle: '🍁', aura: 'rgba(245, 158, 11, 0.6)', motion: 'Swirling Golden Leaf Whirlwind & Bouncing Canopy Motion', auraDesc: 'Vibrant Amber & Gold Leaf Swarm' },
      inspired: { particle: '🌟', aura: 'rgba(56, 189, 248, 0.6)', motion: 'Glowing Starlight Root Pulses & Hummingbird Hover', auraDesc: 'Sky-Blue Starlight Canopy Aura' },
      peaceful: { particle: '🧘', aura: 'rgba(99, 102, 241, 0.6)', motion: 'Gentle Forest Wind & Soft Blue Zen Aura Waves', auraDesc: 'Quiet Zen Blue Forest Glow' },
    }
  },
]

export default function Create() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [caption, setCaption] = useState('')
  const [selectedOverlay, setSelectedOverlay] = useState(SYSTEM_OVERLAYS[0])
  const [mood, setMood] = useState('inspired')
  const [hoveredState, setHoveredState] = useState(null) // { overlay, mood }
  const [submitting, setSubmitting] = useState(false)
  const [existingExpr, setExistingExpr] = useState(null)
  const [publishMode, setPublishMode] = useState('update') // 'update' | 'new'

  useEffect(() => {
    getActiveExpressionByOverlay(selectedOverlay.path).then((found) => {
      if (found) {
        setExistingExpr(found)
        setName(found.name || selectedOverlay.label)
        setMood(found.mood || selectedOverlay.defaultMood)
        setCaption(found.caption || '')
        setPublishMode('update')
      } else {
        setExistingExpr(null)
        setPublishMode('new')
      }
    })
  }, [selectedOverlay])

  const activeOverlay = hoveredState?.overlay || selectedOverlay
  const activeMood = hoveredState?.mood || mood
  const activeBehavior = activeOverlay.moodBehaviors[activeMood] || activeOverlay.moodBehaviors.calm
  const isHoveredPreview = !!hoveredState

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (publishMode === 'update' && existingExpr) {
        const updated = await updateExpression(existingExpr.id, {
          name: name.trim() || selectedOverlay.label,
          mood,
          caption: caption.trim() || undefined,
          overlayImage: selectedOverlay.path,
        })
        navigate(`/expression/${existingExpr.id}`)
      } else {
        const expr = await addExpression({
          name: name || selectedOverlay.label,
          mood,
          caption: caption.trim() || undefined,
          triggerImage: '/markers/hiro.png',
          overlayImage: selectedOverlay.path,
        })
        navigate(`/expression/${expr.id}`)
      }
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
                      onMouseEnter={() => setHoveredState({ overlay, mood: overlay.defaultMood })}
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

                  {/* Standard Mood Selector Buttons inside each artwork */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#a0a0b8', marginBottom: 6 }}>
                      Select Expression Mood for {overlay.label}:
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
                            {m === 'calm' ? '🌿 calm' : m === 'happy' ? '⚡ happy' : m === 'playful' ? '🎨 playful' : m === 'inspired' ? '🌌 inspired' : '🧘 peaceful'}
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
              height: 170,
              borderRadius: 12,
              backgroundColor: '#0a0a10',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginBottom: '1rem',
            }}>
              {/* Dynamic Mood Particles Floating Over Artwork */}
              <div style={{ position: 'absolute', top: '15%', left: '20%', fontSize: '1.1rem', animation: 'particleUp 2.2s infinite ease-in-out', zIndex: 1 }}>
                {activeBehavior.particle}
              </div>
              <div style={{ position: 'absolute', top: '25%', right: '25%', fontSize: '1.2rem', animation: 'particleUp 1.8s infinite ease-in-out 0.4s', zIndex: 1 }}>
                {activeBehavior.particle}
              </div>
              <div style={{ position: 'absolute', bottom: '20%', left: '30%', fontSize: '1rem', animation: 'particleDown 2.5s infinite ease-in-out 0.8s', zIndex: 1 }}>
                {activeBehavior.particle}
              </div>

              {/* Pulsing Aura Ring Behind Artwork */}
              <div style={{
                position: 'absolute',
                width: 110,
                height: 110,
                borderRadius: '50%',
                background: activeBehavior.aura,
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
              <p style={{ margin: '0 0 4px 0' }}>✨ <strong>3D Motion:</strong> {activeBehavior.motion}</p>
              <p style={{ margin: 0 }}>🎨 <strong>Ambient Aura:</strong> {activeBehavior.auraDesc}</p>
            </div>
          </div>
        </div>

        {/* Smart Garment Update vs New Expression Mode */}
        {existingExpr && (
          <div
            style={{
              background: 'rgba(124, 92, 255, 0.08)',
              border: '1px solid rgba(124, 92, 255, 0.25)',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>
                👕 Active Shirt Detected: {existingExpr.name}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setPublishMode('update')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: publishMode === 'update' ? '1px solid #7c5cff' : '1px solid rgba(255,255,255,0.1)',
                    background: publishMode === 'update' ? '#7c5cff' : 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  🔄 Update Active Story
                </button>
                <button
                  type="button"
                  onClick={() => setPublishMode('new')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: publishMode === 'new' ? '1px solid #7c5cff' : '1px solid rgba(255,255,255,0.1)',
                    background: publishMode === 'new' ? '#7c5cff' : 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  + Create New Entry
                </button>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#a0a0b8' }}>
              {publishMode === 'update' 
                ? 'Updates the living mood & story on your physical shirt in-place without adding duplicate cards to the feed.'
                : 'Publishes a separate new card on your public feed.'}
            </p>
          </div>
        )}

        <button type="submit" className="btn-primary" style={btnStyle} disabled={submitting}>
          {submitting 
            ? 'Saving…' 
            : (publishMode === 'update' && existingExpr ? '✓ Update Active Story' : 'Publish Expression')}
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
