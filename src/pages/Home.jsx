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
      <div>
        <p style={{ color: '#8888a0' }}>Loading feed…</p>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Expression Feed</h1>
      <p style={{ color: '#8888a0', marginBottom: '1.5rem' }}>
        Point your phone at a trigger to see AR. Tap an expression to react.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {expressions.map((e) => (
          <Link
            key={e.id}
            to={'/expression/' + e.id}
            style={{
              display: 'block',
              background: '#1a1a20',
              borderRadius: 12,
              padding: '1rem',
              border: '1px solid #2a2a35',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 8,
                  background: '#252530',
                  backgroundImage: e.overlayImage ? 'url(' + e.overlayImage + ')' : undefined,
                  backgroundSize: 'cover',
                }}
              />
              <div>
                <strong>{e.name}</strong>
                <span style={{ marginLeft: '0.5rem', color: '#7c5cff', fontSize: '0.85rem' }}>{e.mood}</span>
              </div>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#8888a0' }}>
              Likes {e.likes || 0} | Greetings {e.greetings || 0} | Comments {e.comments ? e.comments.length : 0}
            </div>
          </Link>
        ))}
      </div>
      <Link
        to="/ar"
        style={{
          display: 'inline-block',
          marginTop: '1.5rem',
          padding: '0.75rem 1.25rem',
          background: '#7c5cff',
          color: '#fff',
          borderRadius: 8,
          fontWeight: 600,
        }}
      >
        Open AR View
      </Link>
    </div>
  )
}
