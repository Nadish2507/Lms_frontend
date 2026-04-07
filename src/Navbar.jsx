import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const employeeLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
    { to: '/apply', label: 'Apply Leave', icon: '+' },
    { to: '/history', label: 'My Leaves', icon: '☰' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-0 flex items-center justify-between h-16 sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-black text-sm">L</span>
        </div>
        <span className="text-white font-bold text-lg tracking-tight">Leave<span className="text-indigo-400">MS</span></span>
      </Link>

      {user && (
        <div className="flex items-center gap-1">
          {user.role === 'admin' ? (
            <Link to="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition mx-1 ${isActive('/admin') ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              🛡️ Admin Panel
            </Link>
          ) : (
            employeeLinks.map(({ to, label, icon }) => (
              <Link key={to} to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition mx-0.5 ${isActive(to) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                <span className="mr-1.5 opacity-70">{icon}</span>{label}
              </Link>
            ))
          )}

          <div className="w-px h-6 bg-gray-700 mx-3" />

          <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-1.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-white text-xs font-semibold leading-none">{user.name}</p>
              <p className="text-gray-500 text-xs capitalize mt-0.5">{user.role}</p>
            </div>
          </div>

          <button onClick={handleLogout}
            className="ml-2 flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-800 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}
