import { getCurrentUser } from '@/utils/auth-utils.server'
import { createMiddleware } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const user = await getCurrentUser()

    if (!user) {
      throw redirect({
        to: '/auth/login',
      })
    }

    return next({
      context: {
        user,
      },
    })
  },
)
