import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { usersTable } from '@/db/schema/users'

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: typeof usersTable.$inferSelect | null | undefined
}

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Quick Access',
      url: '#',
      items: [
        {
          title: 'Dashboard',
          url: '/admin/',
        },
      ],
    },
    {
      title: 'Action Based',
      url: '#',
      items: [
        {
          title: 'Create Product',
          url: '/admin/product/create-product/',
        },
        {
          title: 'All Products',
          url: '/admin/product/all-products/',
          isActive: true,
        },
        {
          title: 'Create Category',
          url: '/admin/category/create-new-category/',
        },
        {
          title: 'All Categories',
          url: '/admin/category/all-categories/',
        },
      ],
    },
    {
      title: 'Analysis Board',
      url: '#',
      items: [
        {
          title: 'Admins',
          url: '#',
        },
        {
          title: 'Customers',
          url: '#',
          isActive: true,
        },
      ],
    },
    {
      title: 'Finance and Orders',
      url: '#',
      items: [
        {
          title: 'New Orders',
          url: '#',
        },
        {
          title: 'Completed Orders',
          url: '#',
          isActive: true,
        },
        {
          title: 'Canceled Orders',
          url: '#',
          isActive: false,
        },
        {
          title: 'Financial Board',
          url: '#',
          isActive: false,
        },
      ],
    },
    {
      title: 'Support and Tracking',
      url: '#',
      items: [
        {
          title: 'Truck Orders',
          url: '#',
        },

        {
          title: 'Technical Support',
          url: '#',
          isActive: false,
        },
      ],
    },
  ],
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1 className="text-2xl font-semibold">The Zoha</h1>
        <p className="text-sm">Welcome, {user?.firstName}</p>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Button variant="secondary">LOGOUT</Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
