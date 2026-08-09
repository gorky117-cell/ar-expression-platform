import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getExpression, likeExpression, sendGreeting, addComment, updateExpression } from '../data/api'

export default function Expression() {
  const { id } = useParams()
  const [expr, setExpr] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [viewMode, setViewMode] = useState('scan')
  const [voiceListening, setVoiceListening] = useState(false)
  const [voiceError, setVoiceError] = useState('')

  useEffect(() => {
    let mounted = true
    const loadData = () => {
      getExpression(id).then((e) => {
        if (mounted) {
          setExpr(e)
          setLoading(false)
        }
      })
    }
    loadData()
    const interval = setInterval(loadData, 500)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [id])

  const refresh = () => getExpression(id).then(setExpr)

  const onLike = () => likeExpression(id).then(refresh)
  const onGreeting = () => sendGreeting(id).then(refresh)
  const onAddComment = () => {
    if (comment.trim()) {
      addComment(id, comment.trim()).then(() => {
        setComment('')
        refresh()
      })
    }
  }

  const onSetMoodByVoice = () => {
    setVoiceError('')
    setVoiceListening(true)
    import('../utils/voice')
      .then(({ startVoiceInput }) => startVoiceInput())
      .then(({ mood, caption }) => {
        const patch = {}
        if (mood) patch.mood = mood
        if (caption) patch.caption = caption
        if (Object.keys(patch).length) return updateExpression(id, patch).then(refresh)
      })
      .catch((e) => setVoiceError(e.message || 'Voice failed'))
      .finally(() => setVoiceListening(false))
  }

  if (loading) {
    return (
      <div className="page-shell page-main">
        <p style={{ color: '#8888a0', textAlign: 'center' }} className="loading-dots">
          Loading expression details…
        </p>
      </div>
    )
  }

  if (!expr) {
    return (
      <div className="page-shell page-main">
        <p style={{ color: '#e57373', marginBottom: '1rem' }}>Expression not found.</p>
        <Link to="/feed" style={{ color: '#7c5cff', fontWeight: 600 }}>← Back to Feed</Link>
      </div>
    )
  }

  return (
    <div className="page-shell page-main page-enter">
      <Link to="/feed" style={{ display: 'inline-block', marginBottom: '1.5rem', color: '#7c5cff', fontWeight: 600 }}>
        ← Back to Feed
      </Link>

      <div
        className="feed-card"
        style={{
          background: 'rgba(26, 26, 32, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              {expr.name}
            </h1>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(124, 92, 255, 0.12)',
                border: '1px solid rgba(124, 92, 255, 0.3)',
                color: '#cabeff',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                marginTop: '0.25rem',
                textTransform: 'uppercase',
              }}
            >
              {expr.mood}
            </span>
          </div>
          <a
            href={`/scanner?id=${id}&caption=${encodeURIComponent(expr.caption || '')}&mood=${expr.mood}&overlay=${encodeURIComponent(expr.overlayImage || '')}`}
            className="btn-primary"
            style={{
              padding: '0.6rem 1.25rem',
              background: '#7c5cff',
              color: '#fff',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.85rem',
              boxShadow: '0 4px 16px rgba(124, 92, 255, 0.25)',
              textDecoration: 'none',
            }}
          >
            📷 Launch AR
          </a>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setViewMode('art')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: '1px solid ' + (viewMode === 'art' ? '#7c5cff' : 'rgba(255,255,255,0.1)'),
              background: viewMode === 'art' ? 'rgba(124,92,255,0.15)' : 'transparent',
              color: viewMode === 'art' ? '#cabeff' : '#8888a0',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🎨 Artwork Design
          </button>
          <button
            onClick={() => setViewMode('scan')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: '1px solid ' + (viewMode === 'scan' ? '#7c5cff' : 'rgba(255,255,255,0.1)'),
              background: viewMode === 'scan' ? 'rgba(124,92,255,0.15)' : 'transparent',
              color: viewMode === 'scan' ? '#cabeff' : '#8888a0',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            📷 AR Scan Target
          </button>
        </div>

        {/* Display Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 450,
              aspectRatio: '1',
              borderRadius: 20,
              overflow: 'hidden',
              background: '#0B0B12',
              boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
              border: '2px solid rgba(124, 92, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <img
              src={expr.overlayImage || '/overlays/cosmic-butterfly.svg'}
              alt={expr.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>

          <p style={{ color: '#8888a0', fontSize: '0.8rem', marginTop: '0.75rem', textAlign: 'center' }}>
            {viewMode === 'scan'
              ? '✨ Point your phone camera directly at this target image to trigger 3D AR'
              : '🎨 Clean artwork design (Pure Markerless Target)'
            }
          </p>
        </div>

        {expr.caption && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              textAlign: 'center',
              borderLeft: '3px solid #7c5cff',
              marginBottom: '1.5rem',
            }}
          >
            <p style={{ fontSize: '0.9rem', color: '#f0f0f5', fontStyle: 'italic', margin: 0 }}>
              "{expr.caption}"
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          <button onClick={onLike} style={actionBtn}>
            ❤️ Like ({expr.likes || 0})
          </button>
          <button onClick={onGreeting} style={actionBtn}>
            👋 Wave ({expr.greetings || 0})
          </button>
        </div>
      </div>

      {/* Wearer Mic Portal Section */}
      <div
        className="feed-card"
        style={{
          background: 'rgba(26, 26, 32, 0.55)',
          borderRadius: '24px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          Wearer Voice Control Portal
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#8888a0', marginBottom: '1.25rem' }}>
          Tap the microphone and describe your current mood to update your print's AR overlay.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <button
            onClick={onSetMoodByVoice}
            disabled={voiceListening}
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: voiceListening ? 'rgba(124, 92, 255, 0.35)' : 'rgba(124, 92, 255, 0.15)',
              border: voiceListening ? '3px solid #7c5cff' : '2px solid rgba(124, 92, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: voiceListening ? '0 0 24px rgba(124, 92, 255, 0.6)' : 'none',
              animation: voiceListening ? 'pulse 1.5s infinite' : 'none',
              transition: 'all 0.25s ease',
            }}
          >
            <span style={{ fontSize: '2rem' }}>🎤</span>
          </button>
        </div>
        <span style={{ fontSize: '0.85rem', color: voiceListening ? '#cabeff' : '#8888a0', fontWeight: 600 }}>
          {voiceListening ? 'Listening... Speak now.' : 'Ready to listen'}
        </span>

        {voiceError && (
          <p style={{ fontSize: '0.8rem', color: '#e57373', marginTop: '0.75rem' }}>
            Error: {voiceError}
          </p>
        )}
      </div>

      {/* Social Comments Section */}
      <div
        className="feed-card"
        style={{
          background: 'rgba(26, 26, 32, 0.65)',
          borderRadius: '24px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
          Social Memory Thread
        </h2>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment on this print..."
            style={inputStyle}
            onKeyDown={(e) => e.key === 'Enter' && onAddComment()}
          />
          <button onClick={onAddComment} style={sendBtn}>
            Send
          </button>
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(expr.comments || []).length === 0 ? (
            <p style={{ color: '#7a7f90', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
              No comments yet. Leave the first one!
            </p>
          ) : (
            (expr.comments || []).map((c) => (
              <li
                key={c.id}
                style={{
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <strong style={{ color: '#cabeff' }}>{c.author}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#7a7f90' }}>
                    {new Date(c.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ color: '#f0f0f5', margin: 0 }}>{c.text}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

const actionBtn = {
  padding: '0.6rem 1.25rem',
  background: 'rgba(255, 255, 255, 0.04)',
  color: '#f0f0f5',
  borderRadius: '9999px',
  fontWeight: 600,
  fontSize: '0.85rem',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.2s ease',
}
const inputStyle = {
  flex: 1,
  padding: '0.75rem',
  borderRadius: 8,
  border: '1px solid rgba(255, 255, 255, 0.08)',
  background: 'rgba(26, 26, 32, 0.7)',
  color: '#f0f0f5',
  fontSize: '0.9rem',
}
const sendBtn = {
  padding: '0.75rem 1.25rem',
  background: '#7c5cff',
  color: '#fff',
  borderRadius: 8,
  fontWeight: 700,
  fontSize: '0.9rem',
  boxShadow: '0 4px 16px rgba(124, 92, 255, 0.2)',
}
