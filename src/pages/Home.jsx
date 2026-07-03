import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getExpressions } from '../data/api'

export default function Home() {
  const [expressions, setExpressions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getExpressions().then((list) => {
      setExpressions(list)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="page-shell page-main">
        <p style={{ color: '#8888a0', textAlign: 'center' }} className="loading-dots">
          Loading feed…
        </p>
      </div>
    )
  }

  return (
    <div className="page-shell page-main page-enter">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>
            AR Social Expression
          </h1>
          <p style={{ color: '#8888a0', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Interactive streetwear layers. Point, scan, and express.
          </p>
        </div>
        <Link
          to="/create"
          className="btn-primary"
          style={{
            padding: '0.5rem 1rem',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          + Create
        </Link>
      </header>

      <div className="feed-stack" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {expressions.map((e) => (
          <Link
            key={e.id}
            to={'/expression/' + e.id}
            className="feed-card"
            style={{
              background: 'rgba(26, 26, 32, 0.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'inherit',
              textDecoration: 'none',
              display: 'block',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  background: '#15151e',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  backgroundImage: e.overlayImage ? 'url(' + e.overlayImage + ')' : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '1.05rem', color: '#fff' }}>{e.name}</strong>
                  <span
                    style={{
                      background: 'rgba(124, 92, 255, 0.12)',
                      border: '1px solid rgba(124, 92, 255, 0.3)',
                      color: '#cabeff',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {e.mood}
                  </span>
                </div>
                {e.caption && (
                  <p style={{ fontSize: '0.85rem', color: '#8888a0', marginTop: '0.25rem', fontStyle: 'italic' }}>
                    "{e.caption}"
                  </p>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#7a7f90', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span>❤️ {e.likes || 0} Likes</span>
              <span>👋 {e.greetings || 0} Greetings</span>
              <span>💬 {e.comments ? e.comments.length : 0} Comments</span>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
        <Link
          to="/ar"
          className="btn-primary"
          style={{
            padding: '0.9rem 2rem',
            background: '#7c5cff',
            color: '#fff',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 8px 32px rgba(124, 92, 255, 0.3)',
            textAlign: 'center',
            minWidth: '200px',
          }}
        >
          Scan AR Target
        </Link>
      </div>
    </div>
  )
}

