import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getExpression, getExpressions } from '../data/api'

export default function AR() {
  const [params] = useSearchParams()
  const expressionId = params.get('expression')
  const [expressionsList, setExpressionsList] = useState([])
  const [expr, setExpr] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getExpressions().then((list) => {
      setExpressionsList(list)
      if (expressionId) {
        const found = list.find((item) => String(item.id) === String(expressionId))
        setExpr(found || list[0] || null)
      } else {
        setExpr(list[0] || null)
      }
      setLoading(false)
    })
  }, [expressionId])

  if (loading) {
    return (
      <div className="page-shell page-main ar-loading">
        <p className="loading-dots" style={{ textAlign: 'center', color: '#8888a0' }}>Loading AR portal…</p>
      </div>
    )
  }

  const exprId = expr ? String(expr.id) : ''
  const isPureMarkerless = exprId === '2' || (expr && expr.arViewerUrl === '/ar-mind.html')
  const overlayUrl = expr ? (expr.overlayImage || '/overlays/tree-birds.svg') : '/overlays/tree-birds.svg'
  const mood = expr ? expr.mood : 'calm'
  const caption = (expr && expr.caption) ? encodeURIComponent(expr.caption) : ''
  
  const arUrl = expr && expr.arViewerUrl 
    ? expr.arViewerUrl 
    : ('/ar.html?id=' + exprId + '&overlay=' + encodeURIComponent(overlayUrl) + '&mood=' + mood + (caption ? '&caption=' + caption : ''))

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
          {isPureMarkerless
            ? 'Point your phone camera directly at the clean Cosmic Butterfly artwork image on a laptop screen or printed media. No markers required!'
            : 'Point your phone camera at the physical printed Hiro marker on a flat surface or another screen. The animated 3D visual overlay will render instantly over the print.'
          }
        </p>

        {/* Expression Selector Tabs */}
        {expressionsList.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#7a7f90', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              Select AR Expression
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {expressionsList.map((item) => {
                const isActive = expr && String(expr.id) === String(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => setExpr(item)}
                    style={{
                      padding: '0.5rem 0.9rem',
                      borderRadius: '12px',
                      background: isActive ? '#7c5cff' : 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      border: isActive ? '1px solid #7c5cff' : '1px solid rgba(255,255,255,0.1)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.name} {String(item.id) === '2' ? '✨ Pure Markerless' : ''}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {expr && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              borderLeft: isPureMarkerless ? '3px solid #34d399' : '3px solid #7c5cff',
            }}
          >
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#7a7f90', fontWeight: 700 }}>
              Active Target & Engine
            </span>
            <p style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, margin: '2px 0 0' }}>
              {expr.name} ({expr.mood}) — {isPureMarkerless ? 'Pure Natural Feature Tracking' : 'Hiro Pattern Tracking'}
            </p>
          </div>
        )}

        <section className="ar-marker-section" aria-label="Target marker files" style={{ marginBottom: '1.75rem' }}>
          <p className="ar-marker-label" style={{ fontSize: '0.75rem', color: '#7a7f90', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            Target Image Artwork
          </p>
          <div className="ar-marker-rows" style={{ display: 'flex', flexDirection: 'column', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
            {isPureMarkerless ? (
              <a
                href="/overlays/cosmic-butterfly.svg"
                target="_blank"
                rel="noopener noreferrer"
                className="ar-marker-row"
                style={{ padding: '0.75rem 1rem', color: '#34d399', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}
              >
                🖼️ View Clean Cosmic Butterfly Target Image
              </a>
            ) : (
              <a
                href="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png"
                target="_blank"
                rel="noopener noreferrer"
                className="ar-marker-row"
                style={{ padding: '0.75rem 1rem', color: '#cabeff', textDecoration: 'none', fontSize: '0.9rem' }}
              >
                📥 Download Hiro Image Target
              </a>
            )}
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
            background: isPureMarkerless ? 'linear-gradient(135deg, #7c5cff, #34d399)' : '#7c5cff',
            color: '#fff',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 8px 24px rgba(124, 92, 255, 0.3)',
            textDecoration: 'none',
          }}
        >
          📷 Launch AR Camera View ({expr ? expr.name : 'AR'})
        </a>

        <p className="ar-footnote" style={{ marginTop: '1.5rem', color: '#7a7f90', fontSize: '0.75rem', textAlign: 'center', lineHeight: 1.4 }}>
          Requires camera permissions. Works on iOS, Android, and webcams.
        </p>
      </div>
    </div>
  )
}

