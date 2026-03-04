import { checkAdminUserAuth } from '@/utils/auth-utils.server'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const { adminUser } = await checkAdminUserAuth()
    return {
      adminUser,
    }
  },
  loader: async ({ context }) => {
    return {
      admin: context.adminUser,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { admin } = Route.useLoaderData()

  return (
    <div>
      <SidebarProvider>
        <AppSidebar user={admin} />
        <main className="w-full">
          <SidebarTrigger />
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}
