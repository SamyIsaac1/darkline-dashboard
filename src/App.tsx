import { RouterProvider } from 'react-router-dom'
import ReactQueryProvider from '@/components/providers/QueryProvider'
import DeleteConfirmDialog from '@/components/shared/DeleteConfirmDialog'
import { Toaster } from '@/components/ui/sonner'
import { router } from './router'

export default function App() {
  return (
    <ReactQueryProvider>
      <RouterProvider router={router} />
      <DeleteConfirmDialog />
      <Toaster richColors duration={3000} closeButton theme='dark' />
    </ReactQueryProvider>
  )
}
