import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { addExpression, updateExpression, getActiveExpressionByOverlay } from '../data/api'
import Model3DPreview from '../components/Model3DPreview'
import { MODELS_3D } from '../components/arModels'

const MOOD_HEX = {
  inspired: '#00f0ff',
  calm: '#10b981',
  happy: '#f59e0b',
  playful: '#ec4899',
  peaceful: '#6366f1',
}

export const VIBES = [
  { id: 'calm', label: 'Calm', emoji: '🌿', color: '#10b981', tagline: 'Serene & Grounded' },
  { id: 'happy', label: 'Happy', emoji: '⚡', color: '#f59e0b', tagline: 'Radiant & Energized' },
  { id: 'playful', label: 'Playful', emoji: '🎨', color: '#ec4899', tagline: 'Creative & Spirited' },
  { id: 'inspired', label: 'Inspired', emoji: '🌌', color: '#00f0ff', tagline: 'Visionary & Electric' },
  { id: 'peaceful', label: 'Peaceful', emoji: '🧘', color: '#6366f1', tagline: 'Tranquil & Centered' },
]

// 2 Official Garment Artworks with Native 3D Hologram Pairing
export const SYSTEM_OVERLAYS = [
  {
    label: 'Cosmic Butterfly',
    displayTitle: 'Cosmic Butterfly',
    path: '/overlays/cosmic-butterfly.svg',
    defaultMood: 'inspired',
    defaultModel: 'butterfly',
    moodBehaviors: {
      inspired: { 
        model: 'butterfly',
        particle: '✨', 
        aura: 'rgba(0, 240, 255, 0.6)', 
        title: 'Neon Stardust Flight',
        motion: '3D Flapping Wing Oscillations & Galactic Star-Dust Trail', 
        auraDesc: 'Cyan & Magenta Neon Galactic Glow' 
      },
      calm: { 
        model: 'butterfly',
        particle: '🍃', 
        aura: 'rgba(16, 185, 129, 0.6)', 
        title: 'Gentle Emerald Glide',
        motion: 'Soft Wing Oscillations & Gentle Floating Breeze', 
        auraDesc: 'Teal & Emerald Soft Ambient Breathing Glow' 
      },
      happy: { 
        model: 'butterfly',
        particle: '⚡', 
        aura: 'rgba(245, 158, 11, 0.6)', 
        title: 'Electric Gold Flutter',
        motion: 'High-Speed Flap & Electric Gold Sparkle Burst', 
        auraDesc: 'Radiant Golden Sunlight Pulse' 
      },
      playful: { 
        model: 'butterfly',
        particle: '🎨', 
        aura: 'rgba(236, 72, 153, 0.6)', 
        title: 'Sparkle Swarm Flutter',
        motion: 'Micro-Butterfly Swarm & Bouncing Sparkle Particles', 
        auraDesc: 'Vibrant Magenta & Pink Sparkle Swarm' 
      },
      peaceful: { 
        model: 'butterfly',
        particle: '🧘', 
        aura: 'rgba(99, 102, 241, 0.6)', 
        title: 'Violet Zen Breathing',
        motion: 'Deep Zen Breathing Aura & Floating Indigo Ripples', 
        auraDesc: 'Deep Indigo & Violet Zen Ripple' 
      },
    }
  },
  {
    label: 'Test Tree',
    displayTitle: 'Tree of Life',
    path: '/overlays/tree-birds-target.png',
    defaultMood: 'calm',
    defaultModel: 'birds',
    moodBehaviors: {
      calm: { 
        model: 'birds',
        particle: '🍃', 
        aura: 'rgba(16, 185, 129, 0.6)', 
        title: 'Forest Breeze & Perched Spirit Birds',
        motion: 'Spirit Birds & Falling Autumn Leaves floating in wind', 
        auraDesc: 'Soothing Emerald & Teal Breathing Glow around trunk' 
      },
      happy: { 
        model: 'birds',
        particle: '☀️', 
        aura: 'rgba(251, 191, 36, 0.6)', 
        title: 'Golden Sunbeams & Soaring Birds',
        motion: 'Radiant Sun Beams & Golden Leaf Oscillations', 
        auraDesc: 'Bright Sunlight Ray Burst & Warm Amber Pulsing' 
      },
      playful: { 
        model: 'birds',
        particle: '🍁', 
        aura: 'rgba(245, 158, 11, 0.6)', 
        title: 'Whirlwind Flocking & Autumn Swirl',
        motion: 'Swirling Golden Leaf Whirlwind & 3D Spirit Birds Flocking', 
        auraDesc: 'Vibrant Amber & Gold Leaf Whirlwind' 
      },
      inspired: { 
        model: 'birds',
        particle: '🌟', 
        aura: 'rgba(56, 189, 248, 0.6)', 
        title: 'Celestial Canopy & Starlight Flight',
        motion: 'Glowing Starlight Root Pulses & Luminous Birds Orbiting', 
        auraDesc: 'Sky-Blue Starlight Canopy Aura' 
      },
      peaceful: { 
        model: 'birds',
        particle: '🧘', 
        aura: 'rgba(99, 102, 241, 0.6)', 
        title: 'Indigo Zen Aura & Gentle Orbit',
        motion: 'Gentle Forest Wind & Soft Blue Zen Aura Waves', 
        auraDesc: 'Quiet Zen Blue Forest Glow' 
      },
    }
  },
]

export default function Create() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [caption, setCaption] = useState('')
  const [selectedOverlay, setSelectedOverlay] = useState(SYSTEM_OVERLAYS[0])
  const [mood, setMood] = useState('inspired')
  const [selectedModel, setSelectedModel] = useState(MODELS_3D[0])
  const [isCustomModel, setIsCustomModel] = useState(false)
  const [showModelCustomizer, setShowModelCustomizer] = useState(false)
  const [hoveredMood, setHoveredMood] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [existingExpr, setExistingExpr] = useState(null)
  const [publishMode, setPublishMode] = useState('update') // 'update' | 'new'

  useEffect(() => {
    // When switching garment, automatically pair default 3D model unless user customized
    if (!isCustomModel) {
      const defaultMId = selectedOverlay.defaultModel || (selectedOverlay.label === 'Test Tree' ? 'birds' : 'butterfly')
      const pairedModel = MODELS_3D.find(m => m.id === defaultMId) || MODELS_3D[0]
      setSelectedModel(pairedModel)
    }

    getActiveExpressionByOverlay(selectedOverlay.path).then((found) => {
      if (found) {
        setExistingExpr(found)
        setName(found.name || (selectedOverlay.displayTitle || selectedOverlay.label))
        setMood(found.mood || selectedOverlay.defaultMood)
        setCaption(found.caption || '')
        if (found.overlay_image && found.overlay_image.includes('#model=')) {
          const mId = found.overlay_image.split('#model=')[1].split('&')[0]
          const mObj = MODELS_3D.find(m => m.id === mId)
          if (mObj) {
            setSelectedModel(mObj)
            if (mObj.id !== selectedOverlay.defaultModel) {
              setIsCustomModel(true)
            }
          }
        }
        setPublishMode('update')
      } else {
        setExistingExpr(null)
        setPublishMode('new')
      }
    })
  }, [selectedOverlay])

  const activeMood = hoveredMood || mood
  const activeBehavior = selectedOverlay.moodBehaviors[activeMood] || selectedOverlay.moodBehaviors.calm
  const activeMoodHex = MOOD_HEX[activeMood] || '#00f0ff'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const overlayWithModel = `${selectedOverlay.path}#model=${selectedModel.id}`
    try {
      if (publishMode === 'update' && existingExpr) {
        await updateExpression(existingExpr.id, {
          name: name.trim() || (selectedOverlay.displayTitle || selectedOverlay.label),
          mood,
          caption: caption.trim() || undefined,
          overlayImage: overlayWithModel,
        })
        navigate(`/expression/${existingExpr.id}`)
      } else {
        const expr = await addExpression({
          name: name || (selectedOverlay.displayTitle || selectedOverlay.label),
          mood,
          caption: caption.trim() || undefined,
          triggerImage: '/markers/hiro.png',
          overlayImage: overlayWithModel,
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
        Set Garment Expression
      </h1>
      <p style={{ color: '#8888a0', marginBottom: '2rem', fontSize: '0.9rem' }}>
        Pick your shirt, choose today&apos;s living vibe in 1 tap, and publish your floating AR story.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 580 }}>
        
        {/* STEP 1: CHOOSE PHYSICAL SHIRT ARTWORK */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f0f0f5', letterSpacing: '-0.01em' }}>
              1. Choose Your Physical Shirt Artwork
            </span>
            <span style={{ fontSize: '0.75rem', color: '#8888a0' }}>
              Markerless print on your chest
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
            {SYSTEM_OVERLAYS.map((overlay) => {
              const isSelected = selectedOverlay.label === overlay.label
              const title = overlay.displayTitle || overlay.label
              return (
                <div
                  key={overlay.label}
                  onClick={() => {
                    setSelectedOverlay(overlay)
                    if (!isCustomModel) {
                      const paired = MODELS_3D.find(m => m.id === overlay.defaultModel) || MODELS_3D[0]
                      setSelectedModel(paired)
                    }
                  }}
                  style={{
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(124, 92, 255, 0.22) 0%, rgba(26, 26, 36, 0.9) 100%)' 
                      : 'rgba(26, 26, 32, 0.6)',
                    border: isSelected ? '2px solid #7c5cff' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 16,
                    padding: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    boxShadow: isSelected ? '0 8px 24px rgba(124, 92, 255, 0.25)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 62,
                      height: 62,
                      borderRadius: 12,
                      backgroundImage: `url(${overlay.path})`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundColor: '#121218',
                      border: isSelected ? '1.5px solid #7c5cff' : '1px solid rgba(255, 255, 255, 0.1)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 4 }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>{title}</h4>
                      {isSelected && (
                        <span style={{ fontSize: '0.68rem', background: '#7c5cff', color: '#fff', padding: '2px 8px', borderRadius: 999, fontWeight: 700, flexShrink: 0 }}>
                          ✓ SELECTED
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#8888a0', lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {overlay.label === 'Cosmic Butterfly' 
                        ? 'Cyberpunk Print • Living 3D Butterfly'
                        : 'Tree of Life • Living 3D Spirit Birds'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* STEP 2: 1-TAP LIVING VIBE SELECTOR */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f0f0f5', letterSpacing: '-0.01em' }}>
              2. Select Today&apos;s Living Vibe (1-Tap)
            </span>
            <span style={{ fontSize: '0.75rem', color: activeMoodHex, fontWeight: 700, textTransform: 'uppercase' }}>
              ● {activeMood}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.5rem',
          }}>
            {VIBES.map((v) => {
              const isActive = mood === v.id
              const isHovered = hoveredMood === v.id
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setMood(v.id)
                    if (!isCustomModel) {
                      const paired = MODELS_3D.find(m => m.id === selectedOverlay.defaultModel) || MODELS_3D[0]
                      setSelectedModel(paired)
                    }
                  }}
                  onMouseEnter={() => setHoveredMood(v.id)}
                  onMouseLeave={() => setHoveredMood(null)}
                  style={{
                    background: isActive 
                      ? `linear-gradient(135deg, ${v.color}25 0%, rgba(20, 20, 30, 0.95) 100%)`
                      : isHovered
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(255, 255, 255, 0.03)',
                    border: isActive 
                      ? `2px solid ${v.color}` 
                      : isHovered 
                        ? `1px solid ${v.color}88` 
                        : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 14,
                    padding: '12px 4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 5,
                    cursor: 'pointer',
                    transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isActive ? 'scale(1.04)' : isHovered ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isActive ? `0 6px 20px ${v.color}35` : 'none',
                  }}
                >
                  <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{v.emoji}</span>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: isActive ? '#fff' : '#c0bcd0',
                  }}>
                    {v.label}
                  </span>
                  <span style={{
                    fontSize: '0.62rem',
                    color: isActive ? v.color : '#8888a0',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}>
                    {v.tagline}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* STEP 3: INTERACTIVE 3D AR PREVIEW CANVAS */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 24, 54, 0.8) 0%, rgba(18, 18, 24, 0.9) 100%)',
          border: `1px solid ${activeMoodHex}55`,
          borderRadius: 18,
          padding: '1.25rem',
          boxShadow: `0 8px 32px ${activeMoodHex}18`,
          transition: 'all 0.25s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: activeMoodHex }}>
              🔮 3D AR HOLOGRAM PREVIEW
            </span>
            <span style={{
              background: `${activeMoodHex}22`,
              color: activeMoodHex,
              padding: '3px 10px',
              borderRadius: 99,
              fontSize: '0.72rem',
              fontWeight: 700,
            }}>
              {selectedModel.name} • {activeMood.toUpperCase()}
            </span>
          </div>

          {/* LIVE 3D WEBGL GRAPHIC CANVAS */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: 220,
            borderRadius: 14,
            backgroundColor: '#0a0a12',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}>
            {/* Dynamic Mood Particles Floating Over Artwork */}
            <div style={{ position: 'absolute', top: '15%', left: '12%', fontSize: '1.1rem', animation: 'particleUp 2.2s infinite ease-in-out', zIndex: 1, pointerEvents: 'none' }}>
              {activeBehavior.particle}
            </div>
            <div style={{ position: 'absolute', top: '25%', right: '14%', fontSize: '1.2rem', animation: 'particleUp 1.8s infinite ease-in-out 0.4s', zIndex: 1, pointerEvents: 'none' }}>
              {activeBehavior.particle}
            </div>
            <div style={{ position: 'absolute', bottom: '20%', left: '20%', fontSize: '1rem', animation: 'particleDown 2.5s infinite ease-in-out 0.8s', zIndex: 1, pointerEvents: 'none' }}>
              {activeBehavior.particle}
            </div>

            {/* Pulsing Aura Glow Ring Behind Artwork */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: activeBehavior.aura,
              filter: 'blur(32px)',
              pointerEvents: 'none',
              zIndex: 0,
            }} />

            {/* The Physical Garment Artwork Print Substrate */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: selectedOverlay.label === 'Test Tree' ? 145 : 135,
              height: selectedOverlay.label === 'Test Tree' ? 145 : 135,
              backgroundImage: `url(${selectedOverlay.path})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.9))',
              animation: selectedOverlay.label === 'Cosmic Butterfly' && selectedModel.id === 'butterfly'
                ? 'butterflyFlap 1.2s infinite ease-in-out'
                : 'treeSway 3.5s infinite ease-in-out',
              pointerEvents: 'none',
              zIndex: 1,
            }} />

            {/* Real-time 3D Holographic Model Viewer (Orbit/Touch enabled) floating over the physical artwork! */}
            <div style={{ position: 'relative', zIndex: 2, width: '100%', height: 220 }}>
              <Model3DPreview modelId={selectedModel.id} moodColor={activeMoodHex} height={220} />
            </div>

            {/* Live Floating 3D Caption Story Badge */}
            <div style={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 3,
              width: '88%',
              maxWidth: 320,
              padding: '4px 12px',
              borderRadius: 999,
              background: 'rgba(0, 0, 0, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontSize: '0.74rem',
              fontWeight: 600,
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              animation: 'floatText 2s infinite ease-in-out',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              💬 &ldquo;{caption || 'Your 3D AR story floats here'}&rdquo;
            </div>
          </div>

          {/* Hologram Information & Avatar Customizer Toggle */}
          <div style={{
            marginTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: '#d0cce0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                padding: '3px 10px',
                borderRadius: 999,
                background: `${activeMoodHex}22`,
                border: `1px solid ${activeMoodHex}66`,
                color: activeMoodHex,
                fontWeight: 700,
                fontSize: '0.75rem',
              }}>
                {selectedModel.emoji} {selectedModel.name}
              </span>
              <span style={{ color: '#a09cb2', fontSize: '0.75rem' }}>
                {activeBehavior.title || activeBehavior.motion}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowModelCustomizer(!showModelCustomizer)}
              style={{
                background: 'none',
                border: 'none',
                color: '#7c5cff',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              {showModelCustomizer ? '✕ Close Avatar Picker' : '✨ Customize 3D Avatar (Optional)'}
            </button>
          </div>

          {/* Optional 3D Avatar Selector for Power Users (Dragon, Sailboat, etc.) */}
          {showModelCustomizer && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: 'rgba(20, 20, 30, 0.7)',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#c0bcd0', fontWeight: 600 }}>
                  Override 3D Holographic Avatar:
                </span>
                {isCustomModel && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomModel(false)
                      const paired = MODELS_3D.find(m => m.id === selectedOverlay.defaultModel) || MODELS_3D[0]
                      setSelectedModel(paired)
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#00f0ff',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    ↺ Reset to Garment Default
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                {MODELS_3D.map((m) => {
                  const isMActive = selectedModel.id === m.id
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(m)
                        setIsCustomModel(true)
                      }}
                      style={{
                        padding: '6px 4px',
                        borderRadius: 8,
                        border: isMActive ? '1px solid #7c5cff' : '1px solid rgba(255,255,255,0.08)',
                        background: isMActive ? 'rgba(124, 92, 255, 0.25)' : 'rgba(255,255,255,0.03)',
                        color: isMActive ? '#fff' : '#8888a0',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{m.emoji}</span>
                      <span>{m.name.replace('3D ', '')}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* STEP 4: STORY & PUBLISH DETAILS */}
        <label>
          <span style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: '#c9c4d8' }}>
            Caption Story (floats in AR directly over your shirt)
          </span>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Fresh design drops today • living streetwear"
            style={inputStyle}
          />
        </label>

        <label>
          <span style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: '#c9c4d8' }}>
            Expression Title
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cosmic Butterfly"
            style={inputStyle}
          />
        </label>

        {/* Smart Garment Update vs New Expression Mode */}
        {existingExpr && (
          <div
            style={{
              background: 'rgba(124, 92, 255, 0.08)',
              border: '1px solid rgba(124, 92, 255, 0.25)',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
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
  marginTop: '0.5rem',
  padding: '0.85rem 1.5rem',
  background: '#7c5cff',
  color: '#fff',
  borderRadius: '9999px',
  fontWeight: 700,
  fontSize: '0.95rem',
  boxShadow: '0 4px 16px rgba(124, 92, 255, 0.25)',
}
