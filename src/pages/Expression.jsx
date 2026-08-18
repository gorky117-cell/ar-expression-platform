import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getExpression, likeExpression, sendGreeting, addComment, updateExpression, deleteExpression, MOODS } from '../data/api'

export default function Expression() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expr, setExpr] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [viewMode, setViewMode] = useState('scan')
  const [voiceListening, setVoiceListening] = useState(false)
  const [voiceError, setVoiceError] = useState('')
  
  // Edit & Delete state
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editMood, setEditMood] = useState('inspired')
  const [editCaption, setEditCaption] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    let mounted = true
    const loadData = () => {
      getExpression(id).then((e) => {
        if (mounted && e) {
          setExpr(e)
          setEditName(e.name || '')
          setEditMood(e.mood || 'inspired')
          setEditCaption(e.caption || '')
          setLoading(false)
        }
      })
    }
    loadData()
    const interval = setInterval(loadData, 1000)
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

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    setSavingEdit(true)
    try {
      await updateExpression(id, {
        name: editName.trim() || expr.name,
        mood: editMood,
        caption: editCaption.trim() || null,
      })
      setIsEditing(false)
      refresh()
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDelete = async () => {
    await deleteExpression(id)
    navigate('/')
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              {expr.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.25rem' }}>
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
                  textTransform: 'uppercase',
                }}
              >
                {expr.mood}
              </span>
              {expr.caption && (
                <span style={{ color: '#8888a0', fontSize: '0.85rem', fontStyle: 'italic' }}>
                  "{expr.caption}"
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                padding: '0.6rem 1rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              {isEditing ? '✕ Cancel' : '✏️ Edit Story'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                padding: '0.6rem 0.75rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
              title="Delete Expression"
            >
              🗑️
            </button>
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
        </div>

        {/* Inline Edit Form */}
        {isEditing && (
          <form
            onSubmit={handleSaveEdit}
            style={{
              background: 'rgba(15, 15, 22, 0.8)',
              border: '1px solid rgba(124, 92, 255, 0.3)',
              borderRadius: '16px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <h3 style={{ color: '#cabeff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              ✏️ Update Living Expression
            </h3>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8888a0', marginBottom: '4px' }}>Story Title</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={inputStyle}
                placeholder="e.g. Cosmic Butterfly"
              />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8888a0', marginBottom: '4px' }}>Wearer Mood</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setEditMood(m.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: editMood === m.id ? '1px solid #7c5cff' : '1px solid rgba(255,255,255,0.1)',
                      background: editMood === m.id ? 'rgba(124,92,255,0.25)' : 'rgba(255,255,255,0.04)',
                      color: editMood === m.id ? '#fff' : '#8888a0',
                      cursor: 'pointer',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8888a0', marginBottom: '4px' }}>Caption / Story</label>
              <input
                type="text"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                style={inputStyle}
                placeholder="e.g. Living AR on streetwear fabric"
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{ ...actionBtn, padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                style={{ ...sendBtn, padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
              >
                {savingEdit ? 'Saving…' : '✓ Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <div
              style={{
                background: '#181822',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '20px',
                padding: '1.5rem',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                textAlign: 'center',
              }}
            >
              <h3 style={{ color: '#f87171', fontSize: '1.1rem', marginBottom: '0.5rem' }}>🗑️ Delete Expression?</h3>
              <p style={{ color: '#a0a0b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Are you sure you want to remove "{expr.name}" from your active feed?
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{ ...actionBtn, padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '0.5rem 1.25rem',
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

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
          <button
            onClick={() => setViewMode('qr')}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: '1px solid ' + (viewMode === 'qr' ? '#7c5cff' : 'rgba(255,255,255,0.1)'),
              background: viewMode === 'qr' ? 'rgba(124,92,255,0.15)' : 'transparent',
              color: viewMode === 'qr' ? '#cabeff' : '#8888a0',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            📱 Phone AR QR
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
              padding: viewMode === 'qr' ? '2rem' : 0,
            }}
          >
            {viewMode === 'qr' ? (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`https://ar.aiforall.ltd/scanner?id=${id}&mood=${expr.mood}&caption=${encodeURIComponent(expr.caption || '')}`)}`}
                  alt="Scan QR code with phone"
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 12,
                    display: 'block',
                    margin: '0 auto 1rem',
                    background: '#fff',
                    padding: 8,
                  }}
                />
                <p style={{ color: '#cabeff', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
                  Scan with Phone Camera to Launch Paired AR
                </p>
              </div>
            ) : (
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
            )}
          </div>

          <p style={{ color: '#8888a0', fontSize: '0.8rem', marginTop: '0.75rem', textAlign: 'center' }}>
            {viewMode === 'qr'
              ? '📱 Point your phone camera at this QR code to launch AR scanner paired to this exact expression'
              : viewMode === 'scan'
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
