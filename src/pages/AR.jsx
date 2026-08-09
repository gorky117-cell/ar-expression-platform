import { Link } from 'react-router-dom'

export default function AR() {
  return (
    <div className="page-shell page-main ar-hero ar-shell page-enter">
      <div
        className="ar-panel"
        style={{
          background: 'rgba(20, 20, 26, 0.65)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '28px',
          padding: '2.5rem 1.75rem',
          maxWidth: '460px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Link to="/feed" className="ar-back" style={{ color: '#8888a0', fontWeight: 600, display: 'inline-block', marginBottom: '1.5rem', fontSize: '0.85rem', textDecoration: 'none' }}>
          ← Back to Feed
        </Link>

        {/* Minimalist Apple-Style Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(124, 92, 255, 0.15)', border: '1px solid rgba(124, 92, 255, 0.3)', color: '#cabeff', padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          ✨ Pure Markerless AI Scanner
        </div>
        
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.75rem', lineHeight: 1.15 }}>
          AR Camera View
        </h1>
        
        <p style={{ fontSize: '0.95rem', color: '#9999b0', lineHeight: 1.5, marginBottom: '2rem' }}>
          Experience live 3D streetwear overlays instantly over any original artwork print.
        </p>

        {/* 3 Simple Apple-Style Micro Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.25rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '12px 16px', borderRadius: '16px' }}>
            <span style={{ fontSize: '1.2rem', background: 'rgba(124, 92, 255, 0.2)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c5cff', fontWeight: 800 }}>1</span>
            <div>
              <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>Aim Camera</strong>
              <span style={{ color: '#7a7f90', fontSize: '0.8rem' }}>Point at any artwork print on screen or fabric</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '12px 16px', borderRadius: '16px' }}>
            <span style={{ fontSize: '1.2rem', background: 'rgba(52, 211, 153, 0.2)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontWeight: 800 }}>2</span>
            <div>
              <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>Instant AI Scan</strong>
              <span style={{ color: '#7a7f90', fontSize: '0.8rem' }}>Pure markerless computer vision tracks target</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '12px 16px', borderRadius: '16px' }}>
            <span style={{ fontSize: '1.2rem', background: 'rgba(244, 114, 182, 0.2)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f472b6', fontWeight: 800 }}>3</span>
            <div>
              <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>Express & React</strong>
              <span style={{ color: '#7a7f90', fontSize: '0.8rem' }}>Watch 3D overlays & react live with community</span>
            </div>
          </div>
        </div>

        {/* Single Ultra-Clean Glowing Launch Button */}
        <a
          href={`/scanner?_t=${Date.now()}`}
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '1.15rem 1.5rem',
            background: 'linear-gradient(135deg, #7c5cff 0%, #34d399 100%)',
            color: '#fff',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '1.05rem',
            boxShadow: '0 10px 30px rgba(124, 92, 255, 0.45)',
            textDecoration: 'none',
            letterSpacing: '0.02em',
            transition: 'all 0.2s ease',
          }}
        >
          📷 Open AR Camera
        </a>

        <p style={{ marginTop: '1.5rem', color: '#7a7f90', fontSize: '0.75rem', textAlign: 'center', lineHeight: 1.4 }}>
          No app download required. Works on iOS, Android, and webcams.
        </p>
      </div>
    </div>
  )
}

