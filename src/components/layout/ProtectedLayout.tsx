import { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import Header from './Header'
import AppSidebar from './Sidebar'
import { Spinner } from '@/components/ui/spinner'

export default function ProtectedLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
