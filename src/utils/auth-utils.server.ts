import { createServerFn } from '@tanstack/react-start'
import { useAppSession } from './session-utils'
import { redirect } from '@tanstack/react-router'
import { db } from '@/db'
import { usersTable } from '@/db/schema/users'
import { and, eq } from 'drizzle-orm'

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await useAppSession()
    const userDetails = session.data

    if (!userDetails.userId) {
      return null
    }

    return {
      ...userDetails,
    }
  },
)

// check admin role
export const checkAdminUserAuth = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await useAppSession()
    const user = session.data

    // handle unauthenticated
    if (!user.userId) {
      throw redirect({
        to: '/auth/login',
      })
    }

    // check admin role
    const adminUserRes = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.id, user.userId!),
          eq(usersTable.email, user.email!),
          eq(usersTable.isAdmin, true),
        ),
      )
      .limit(1)

    if (adminUserRes.length === 0) {
      throw redirect({
        to: '/',
      })
    }

    return {
      adminUser: adminUserRes[0],
    }
  },
)
