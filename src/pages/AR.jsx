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
      <div className="page-shell page-main ar-loading">
        <p className="loading-dots" style={{ textAlign: 'center', color: '#8888a0' }}>Loading AR portal…</p>
      </div>
    )
  }

  const overlayUrl = expr ? (expr.overlayImage || '/overlays/tree-birds.svg') : '/overlays/tree-birds.svg'
  const mood = expr ? expr.mood : 'calm'
  const caption = (expr && expr.caption) ? encodeURIComponent(expr.caption) : ''
  const arUrl = '/ar.html?overlay=' + encodeURIComponent(overlayUrl) + '&mood=' + mood + (caption ? '&caption=' + caption : '')

  return (
    <div className="page-shell page-main ar-hero ar-shell page-enter">
      <div
        className="ar-panel"
        style={{
          background: 'rgba(26, 26, 32, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '2rem 1.5rem',
        }}
      >
        <Link to="/feed" className="ar-back" style={{ color: '#7c5cff', fontWeight: 600, display: 'inline-block', marginBottom: '1.25rem' }}>
          ← Back to Feed
        </Link>
        
        <h1 className="ar-title" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          AR Scanning Portal
        </h1>
        
        <p className="ar-copy ar-lede" style={{ fontSize: '0.95rem', color: '#8888a0', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          Point your phone camera at the physical printed **Hiro marker** on a flat surface or another screen. The animated 3D visual overlay representing the wearer's current expression will render instantly over the print.
        </p>

        {expr && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              borderLeft: '3px solid #7c5cff',
            }}
          >
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#7a7f90', fontWeight: 700 }}>
              Active Target
            </span>
            <p style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, margin: '2px 0 0' }}>
              {expr.name} ({expr.mood})
            </p>
          </div>
        )}

        <section className="ar-marker-section" aria-label="Hiro marker files" style={{ marginBottom: '1.75rem' }}>
          <p className="ar-marker-label" style={{ fontSize: '0.75rem', color: '#7a7f90', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            Target Marker Files
          </p>
          <div className="ar-marker-rows" style={{ display: 'flex', flexDirection: 'column', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
            <a
              href="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/hiro.png"
              target="_blank"
              rel="noopener noreferrer"
              className="ar-marker-row"
              style={{ padding: '0.75rem 1rem', color: '#cabeff', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}
            >
              📥 Download Hiro Image Target
            </a>
          </div>
        </section>

        <a
          href={arUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary ar-cta"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '1rem',
            background: '#7c5cff',
            color: '#fff',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 8px 24px rgba(124, 92, 255, 0.3)',
            textDecoration: 'none',
          }}
        >
          Open AR Camera View
        </a>

        <p className="ar-footnote" style={{ marginTop: '1.5rem', color: '#7a7f90', fontSize: '0.75rem', textAlign: 'center', lineHeight: 1.4 }}>
          Requires camera permissions. Works on iOS, Android, and webcams.
        </p>
      </div>
    </div>
  )
}

