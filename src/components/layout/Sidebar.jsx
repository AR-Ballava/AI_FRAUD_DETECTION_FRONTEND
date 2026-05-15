import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Search, FileText,
  Shield, LogOut, Radar
} from 'lucide-react'
import { motion } from 'framer-motion'

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/analyze',   icon: Search,          label: 'Analyze'    },
  { to: '/history',   icon: FileText,        label: 'History'    },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0,   opacity: 1 }}
      className="fixed left-0 top-0 h-full w-16 lg:w-56
                 bg-bg-secondary border-r border-bg-border
                 flex flex-col z-50"
    >
      {/* Logo */}
      <div className="p-4 border-b border-bg-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30
                        flex items-center justify-center flex-shrink-0">
          <Shield size={16} className="text-accent-cyan" />
        </div>
        <span className="hidden lg:block font-display text-sm text-accent-cyan tracking-wider">
          FRAUDSHIELD
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg
               transition-all duration-200 group
               ${isActive
                 ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                 : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
               }`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            <span className="hidden lg:block text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="p-3 border-t border-bg-border">
        <div className="hidden lg:block px-3 py-2 mb-1">
          <p className="text-xs text-text-secondary truncate">{user?.name}</p>
          <p className="text-xs text-text-muted truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                     text-text-secondary hover:text-accent-red hover:bg-accent-red/5
                     transition-all duration-200"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span className="hidden lg:block text-sm">Logout</span>
        </button>
      </div>
    </motion.aside>
  )
}