import { getCurrentUser } from '@/utils/auth-utils.server'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
  beforeLoad: async () => {
    const user = await getCurrentUser()
    return {
      user,
    }
  },
  loader: async ({ context }) => {
    if (context.user?.email) {
      throw redirect({ to: '/' })
    }
    return {}
  },
  component: RouteComponent,
})

function RouteComponent() {
  Route.useLoaderData()
  return (
    <div>
      <Outlet />
    </div>
  )
}
