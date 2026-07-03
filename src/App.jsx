import { BrowserRouter, Routes, Route, Link, Navigate, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Create from './pages/Create'
import AR from './pages/AR'
import Expression from './pages/Expression'

function navLinkClass({ isActive }) {
  return 'nav-link' + (isActive ? ' nav-link-active' : '')
}

export default function App() {
  return (
    <BrowserRouter>
      <nav style={navStyle} className="nav-bar">
        <Link to="/ar" className="nav-link nav-brand">
          WearWave
        </Link>
        <NavLink to="/feed" className={navLinkClass}>
          Feed
        </NavLink>
        <NavLink to="/create" className={navLinkClass}>
          Create
        </NavLink>
        <NavLink to="/ar" className={navLinkClass}>
          AR View
        </NavLink>
      </nav>
      <main className="page-shell page-main">
        <Routes>
          <Route path="/" element={<Navigate to="/ar" replace />} />
          <Route path="/feed" element={<Home />} />
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
  borderBottom: '1px solid #2a2a35',
}
