import { RouterProvider } from 'react-router-dom'
import ReactQueryProvider from '@/components/providers/QueryProvider'
import { router } from './router'

console.log('[v0] App module loading')

export default function App() {
  console.log('[v0] App component rendering')
  return (
    <ReactQueryProvider>
      <RouterProvider router={router} />
    </ReactQueryProvider>
  )
}
