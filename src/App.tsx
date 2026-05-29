import { RouterProvider } from 'react-router-dom'
import ReactQueryProvider from '@/components/providers/QueryProvider'
import { Toaster } from '@/components/ui/sonner'
import { router } from './router'

export default function App() {
  return (
    <ReactQueryProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ReactQueryProvider>
  )
}
