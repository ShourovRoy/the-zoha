import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useForm } from '@tanstack/react-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '@/db'
import { usersTable } from '@/db/schema/users'
import { eq } from 'drizzle-orm'
import { verifyPassword } from '@/utils/hash-utils'
import { useAppSession } from '@/utils/session-utils'
import { toast } from 'sonner'
import { publicOnlyMiddleware } from '@/middlewares/public-only-middleware'
import { useQueryClient } from '@tanstack/react-query'

// login schema
const loginSchema = z.object({
  email: z
    .email({ error: 'Invalid email address!' })
    .nonempty({ error: 'Email is required!' }),
  password: z.string().nonempty({ error: 'Password is required!' }),
})

const loginUserFn = createServerFn({ method: 'POST' })
  .middleware([publicOnlyMiddleware])
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email))
      .limit(1)

    if (users.length < 1) {
      return { errorMessage: 'Invalid credientials!' }
    }

    const userDetails = users[0]

    // verify password
    const isVerified = await verifyPassword(userDetails.password, data.password)

    if (!isVerified) {
      return {
        errorMessage: 'Invalid credientials!',
      }
    }

    // create session
    const session = await useAppSession()
    await session.update({
      email: data.email,
      lastName: userDetails.lastName,
      firstName: userDetails.firstName,
      userId: userDetails.id,
      phone: userDetails.phone,
    })

    return { message: 'Login success' }
  })

export const Route = createFileRoute('/(auth)/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const loginAction = useServerFn(loginUserFn)
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const { errorMessage, message } = await loginAction({
        data: {
          ...value,
        },
      })

      console.log(errorMessage, message, value)

      if (message) {
        toast.success(message)
        queryClient.invalidateQueries({ queryKey: ['cart'] })
        router.invalidate({ sync: true })
      }

      if (errorMessage) {
        toast.error(errorMessage)
      }
    },
  })

  return (
    <div className="flex-1">
      <div className="container mx-auto flex items-center justify-center h-full">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Link className="cursor-pointer" to="/auth/signup">
                <Button variant="link">Sign Up</Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.stopPropagation()
                e.preventDefault()

                form.handleSubmit()
              }}
              method="POST"
              action={loginUserFn.url}
            >
              <div className="flex flex-col gap-6">
                <form.Field
                  name="email"
                  children={(field) => {
                    return (
                      <Field className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          type="email"
                          name={field.name}
                          placeholder="m@example.com"
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                        />
                        {!field.state.meta.isValid && (
                          <FieldError role="alert">
                            {field.state.meta.errors.join(', ')}
                          </FieldError>
                        )}
                      </Field>
                    )
                  }}
                />

                <form.Field
                  name="password"
                  children={(field) => {
                    return (
                      <Field className="grid gap-2">
                        <div className="flex items-center">
                          <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                          <Link
                            to="/"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <Input
                          id={field.name}
                          type="password"
                          name={field.name}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                        />
                        {!field.state.meta.isValid && (
                          <FieldError role="alert">
                            {field.state.meta.errors.join(', ')}
                          </FieldError>
                        )}
                      </Field>
                    )
                  }}
                />
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => {
                    return (
                      <Button
                        disabled={!canSubmit}
                        type="submit"
                        className="w-full"
                      >
                        {isSubmitting ? 'Logging in' : 'Login'}
                      </Button>
                    )
                  }}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Link
              className="text-sm underline-offset-4 hover:underline"
              to="/auth/signup"
            >
              Don't have an account? Create new
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
