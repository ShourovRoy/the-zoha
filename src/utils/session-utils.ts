import { useSession } from '@tanstack/react-start/server'

export type SessionData = {
  userId?: string
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
}

export function useAppSession() {
  return useSession<SessionData>({
    // Session configuration
    name: 'app-session',
    password: process.env.SESSION_SECRET!, // At least 32 characters
    // Optional: customize cookie settings
    cookie: {
      secure: process.env.APP_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      path: '/',
    },
  })
}
