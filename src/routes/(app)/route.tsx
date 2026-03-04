import GlobalNavbar from '@/components/navbars/global-navbar'
import { getCurrentUser } from '@/utils/auth-utils.server'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)')({
  loader: async () => {
    const user = await getCurrentUser()

    return {
      user,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useLoaderData()
  return (
    <div>
      <GlobalNavbar user={user} />
      <Outlet />
    </div>
  )
}
