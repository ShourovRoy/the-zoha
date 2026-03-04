import { createMiddleware } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getCurrentUser } from '@/utils/auth-utils'

export const publicOnlyMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next }) => {
  // check session
  const userDetails = await getCurrentUser()

  if (userDetails?.userId) {
    throw redirect({
      to: '/',
    })
  }

  return next()
})
