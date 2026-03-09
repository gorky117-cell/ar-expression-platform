import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getExpression, likeExpression, sendGreeting, addComment } from '../data/api'

export default function Expression() {
  const { id } = useParams()
  const [expr, setExpr] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')

  useEffect(() => {
    getExpression(id).then((e) => {
      setExpr(e)
      setLoading(false)
    })
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

  if (loading) {
    return (
      <div>
        <p style={{ color: '#8888a0' }}>Loading…</p>
      </div>
    )
  }

  if (!expr) {
    return (
      <div>
        <p>Expression not found.</p>
        <Link to="/">Back to Feed</Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem', color: '#7c5cff' }}>← Feed</Link>
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>{expr.name}</h1>
        <span style={{ color: '#7c5cff', fontSize: '0.9rem' }}>{expr.mood}</span>
      </div>
      <div
        style={{
          width: '100%',
          aspectRatio: '1',
          maxWidth: 320,
          borderRadius: 12,
          background: '#252530',
          backgroundImage: expr.overlayImage ? `url(${expr.overlayImage})` : undefined,
          backgroundSize: 'cover',
          marginBottom: '1rem',
        }}
      />
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button onClick={onLike} style={actionBtn}>❤️ Like ({expr.likes || 0})</button>
        <button onClick={onGreeting} style={actionBtn}>👋 Greeting ({expr.greetings || 0})</button>
        <Link to={`/ar?expression=${id}`} style={{ ...actionBtn, display: 'inline-flex', alignItems: 'center' }}>
          📷 Open AR
        </Link>
      </div>
      <div>
        <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Comments</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            style={inputStyle}
            onKeyDown={(e) => e.key === 'Enter' && onAddComment()}
          />
          <button onClick={onAddComment} style={sendBtn}>Send</button>
        </div>
        <ul style={{ listStyle: 'none' }}>
          {(expr.comments || []).map((c) => (
            <li key={c.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #2a2a35', fontSize: '0.9rem' }}>
              <strong>{c.author}</strong>: {c.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const actionBtn = {
  padding: '0.5rem 1rem',
  background: '#252530',
  color: '#f0f0f5',
  borderRadius: 8,
  fontWeight: 500,
  border: '1px solid #2a2a35',
}
const inputStyle = {
  flex: 1,
  padding: '0.5rem',
  borderRadius: 8,
  border: '1px solid #2a2a35',
  background: '#252530',
  color: '#f0f0f5',
}
const sendBtn = {
  padding: '0.5rem 1rem',
  background: '#7c5cff',
  color: '#fff',
  borderRadius: 8,
  fontWeight: 600,
}
