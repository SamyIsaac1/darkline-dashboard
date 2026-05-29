
import { supabase } from '@/lib/supabase/client'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function Header() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/auth/login')
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <SidebarTrigger className="-ml-1" />
      <h1 className="text-lg font-semibold text-foreground">DarkLine</h1>

      <div className="ml-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
