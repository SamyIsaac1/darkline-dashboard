import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ListTodo, Users, Settings } from 'lucide-react'
import { useUIStore } from '@/lib/store/uiStore'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Orders',
    href: '/orders',
    icon: ListTodo,
  },
  {
    label: 'Clients',
    href: '/clients',
    icon: Users,
  },
]

export default function Sidebar() {
  const location = useLocation()
  const { sidebarOpen } = useUIStore()

  return (
    <aside
      className={cn(
        'w-64 border-r border-border bg-background transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full fixed left-0 top-0 h-screen z-50 lg:static'
      )}
    >
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <img src="/logo-horizontal.svg" alt="Logo" />
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          to="/settings"
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            location.pathname.startsWith('/settings')
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-accent'
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  )
}
