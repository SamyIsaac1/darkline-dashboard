
import { supabase } from '@/lib/supabase/client'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'
import { useUIStore } from '@/lib/store/uiStore'

export default function Header() {
  const navigate = useNavigate()
  const { setSidebarOpen, sidebarOpen } = useUIStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/auth/login')
  }

  return (
    <header className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 hover:bg-accent rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">DarkLine</h1>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent text-sm font-medium transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  )
}
