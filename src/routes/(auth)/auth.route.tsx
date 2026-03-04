import AuthNav from '@/components/navbars/auth-navbar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-screen flex flex-col">
      <AuthNav />
      <Outlet />
    </div>
  )
}
