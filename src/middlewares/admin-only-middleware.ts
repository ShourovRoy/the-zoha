import { createMiddleware } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { checkAdminUserAuth } from '@/utils/auth-utils'

export const adminMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const { adminUser } = await checkAdminUserAuth()

    if (!adminUser) {
      throw redirect({
        to: '/auth/login',
      })
    }

    return next({
      context: {
        adminUser,
      },
    })
  },
)
