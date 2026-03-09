import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Create from './pages/Create'
import AR from './pages/AR'
import Expression from './pages/Expression'

export default function App() {
  return (
    <BrowserRouter>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>Feed</Link>
        <Link to="/create" style={linkStyle}>Create</Link>
        <Link to="/ar" style={linkStyle}>AR View</Link>
      </nav>
      <main style={{ padding: '1rem', maxWidth: 720, margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/ar" element={<AR />} />
          <Route path="/expression/:id" element={<Expression />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

const navStyle = {
  background: '#1a1a20',
  padding: '0.75rem 1rem',
  display: 'flex',
  gap: '1.5rem',
  borderBottom: '1px solid #2a2a35',
}
const linkStyle = { color: '#7c5cff', fontWeight: 600 }
