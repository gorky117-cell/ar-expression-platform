import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getExpression, getExpressions } from '../data/api'

export default function AR() {
  const [params] = useSearchParams()
  const expressionId = params.get('expression')
  const [expr, setExpr] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (expressionId) {
      getExpression(expressionId).then(setExpr).finally(() => setLoading(false))
    } else {
      getExpressions().then((list) => {
        setExpr(list[0] || null)
        setLoading(false)
      })
    }
  }, [expressionId])

  if (loading) {
    return (
      <div>
        <p style={{ color: '#8888a0' }}>Loading…</p>
      </div>
    )
  }

  const overlayUrl = expr ? (expr.overlayImage || '/overlays/tree-birds.svg') : '/overlays/tree-birds.svg'
  const mood = expr ? expr.mood : 'calm'
  const caption = (expr && expr.caption) ? encodeURIComponent(expr.caption) : ''
  const arUrl = '/ar.html?overlay=' + encodeURIComponent(overlayUrl) + '&mood=' + mood + (caption ? '&caption=' + caption : '')

  return (
    <div>
      <Link to="/feed" style={{ display: 'inline-block', marginBottom: '1rem', color: '#7c5cff' }}>← Feed</Link>
      <h1 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>AR View</h1>
      <p style={{ color: '#8888a0', marginBottom: '1.5rem' }}>
        Point your camera at the <strong>Hiro marker</strong> to see the overlay. Birds and tree sway in AR.
      </p>
      <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        Print the marker from the link below, or show it on another screen.
      </p>
      <a
        href="/markers/hiro.patt"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', marginBottom: 8, color: '#7c5cff' }}
      >
        Hiro pattern (for reference)
      </a>
      <a
        href="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/hiro.png"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', marginBottom: '1.5rem', color: '#7c5cff' }}
      >
        Download Hiro marker image (print this)
      </a>
      <a
        href={arUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          padding: '1rem 1.5rem',
          background: '#7c5cff',
          color: '#fff',
          borderRadius: 12,
          fontWeight: 600,
          fontSize: '1.1rem',
        }}
      >
        Open AR experience
      </a>
      <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#8888a0' }}>
        Use a phone or device with camera for best results. Allow camera access.
      </p>
    </div>
  )
}
