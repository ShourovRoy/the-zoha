import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { z } from 'zod'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { usersTable } from '@/db/schema/users'
import { db } from '@/db'
import { toast } from 'sonner'
import { eq, or } from 'drizzle-orm'
import { hashPassword } from '@/utils/hash-utils'

// signup user schema
const signupSchema = z.object({
  firstName: z
    .string({ error: 'Invalid data!' })
    .nonempty({ error: 'First name required!' }),
  lastName: z
    .string({ error: 'Invalid data!' })
    .nonempty({ error: 'Last name required!' }),
  email: z
    .email({ error: 'Invalid email!' })
    .nonempty({ error: 'Email required!' }),
  phone: z.string().min(10).max(18).nonempty({ error: 'Phone is required!' }),
  address: z.string().min(8).max(255),
  password: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100),
  postCode: z.string().min(4).max(10),
})

const signupUserFn = createServerFn({ method: 'POST' })
  .inputValidator(signupSchema)
  .handler(async ({ data }) => {
    // check password and confirm password

    if (data.password !== data.confirmPassword) {
      return { errorMessage: "Password didn't match!" }
    }

    const signupData: typeof usersTable.$inferInsert = {
      ...data,
      password: await hashPassword(data.password),
      isAdmin: false,
    }
    try {
      // check if user already exist
      const isExist = await db
        .select()
        .from(usersTable)
        .where(
          or(
            eq(usersTable.email, data.email),
            eq(usersTable.phone, data.phone),
          ),
        )

      if (isExist.length > 0) {
        return {
          errorMessage: 'User already exist!',
        }
      }

      // create new user
      await db.insert(usersTable).values(signupData)

      return {
        message: 'Signup successful!',
      }
    } catch (error: any) {
      return {
        errorMessage: error?.message || error,
      }
    }
  })

export const Route = createFileRoute('/(auth)/auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const signupAction = useServerFn(signupUserFn)

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: '',
      postCode: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const { errorMessage, message } = await signupAction({
          data: {
            ...value,
          },
        })

        if (errorMessage) {
          toast.error(errorMessage)
        }

        if (message) {
          toast.success(message)
          router.navigate({
            to: '/auth/login',
          })
        }
      } catch (err: any) {
        if (JSON.parse(err.message)) {
          const errors = JSON.parse(err.message)
          errors.forEach((issue: any) => {
            const field = issue.path[0]
            form.setFieldMeta(field, (prev) => ({
              ...prev,
              errors: [issue.message],
            }))

            toast.error(`${field} - ${issue.message}`)
          })
        }
      }
    },
  })
  return (
    <div className="flex-1">
      <div className="container mx-auto flex items-center justify-center h-full">
        <form
          action={signupUserFn.url}
          onSubmit={(e) => {
            e.stopPropagation()
            e.preventDefault()
            form.handleSubmit()
          }}
          className="w-2xl"
        >
          <Card className="w-full max-w-2xl">
            {/* Increased max-width for side-by-side layout */}
            <CardHeader>
              <CardTitle>The Zoha account creation</CardTitle>
              <CardDescription>
                Enter your information below to signup your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Using a grid to make the form compact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* first name */}
                <form.Field
                  name="firstName"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'First name is required!'
                      if (value.length < 2) return 'Min 2 chars required!'
                    },
                  }}
                  children={(field) => (
                    <Field className="grid gap-2">
                      <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                      <Input
                        id={field.name}
                        type="text"
                        placeholder="Shourov"
                        onChange={(e) => field.handleChange(e.target.value)}
                        value={field.state.value}
                        required
                      />
                      {!field.state.meta.isValid && (
                        <FieldError role="alert">
                          {field.state.meta.errors.join(', ')}
                        </FieldError>
                      )}
                    </Field>
                  )}
                />

                {/* last name */}
                <form.Field
                  name="lastName"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Last name is required!'
                      if (value.length < 2) return 'Min 2 chars required!'
                    },
                  }}
                  children={(field) => (
                    <Field className="grid gap-2">
                      <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                      <Input
                        id={field.name}
                        type="text"
                        placeholder="Roy"
                        onChange={(e) => field.handleChange(e.target.value)}
                        value={field.state.value}
                        required
                      />
                      {!field.state.meta.isValid && (
                        <FieldError role="alert">
                          {field.state.meta.errors.join(', ')}
                        </FieldError>
                      )}
                    </Field>
                  )}
                />

                {/* email - Full Width */}
                <div className="md:col-span-2">
                  <form.Field
                    name="email"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'Email is required!'
                        if (!value.includes('@')) return 'Invalid email address'
                      },
                    }}
                    children={(field) => (
                      <Field className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          type="email"
                          placeholder="esp@example.com"
                          onChange={(e) => field.handleChange(e.target.value)}
                          value={field.state.value}
                          required
                        />
                        {!field.state.meta.isValid && (
                          <FieldError role="alert">
                            {field.state.meta.errors.join(', ')}
                          </FieldError>
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* phone number */}
                <form.Field
                  name="phone"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Phone is required!'
                      if (value.length < 10) return 'Invalid phone number'
                    },
                  }}
                  children={(field) => (
                    <Field className="grid gap-2">
                      <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                      <Input
                        id={field.name}
                        type="tel"
                        placeholder="+8801628..."
                        onChange={(e) => field.handleChange(e.target.value)}
                        value={field.state.value}
                        required
                      />
                      {!field.state.meta.isValid && (
                        <FieldError role="alert">
                          {field.state.meta.errors.join(', ')}
                        </FieldError>
                      )}
                    </Field>
                  )}
                />

                {/* post code */}
                <form.Field
                  name="postCode"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Post code is required!'
                      if (value.length < 4) return 'Invalid post code!'
                    },
                  }}
                  children={(field) => (
                    <Field className="grid gap-2">
                      <FieldLabel htmlFor={field.name}>Post Code</FieldLabel>
                      <Input
                        id={field.name}
                        type="text"
                        placeholder="7200"
                        onChange={(e) => field.handleChange(e.target.value)}
                        value={field.state.value}
                        required
                      />
                      {!field.state.meta.isValid && (
                        <FieldError role="alert">
                          {field.state.meta.errors.join(', ')}
                        </FieldError>
                      )}
                    </Field>
                  )}
                />

                {/* password */}
                <form.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Password is required!'
                      if (value.length < 8) return 'At least 8 characters!'
                    },
                  }}
                  children={(field) => (
                    <Field className="grid gap-2">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        id={field.name}
                        type="password"
                        placeholder="••••••••"
                        onChange={(e) => field.handleChange(e.target.value)}
                        value={field.state.value}
                        required
                      />
                      {!field.state.meta.isValid && (
                        <FieldError role="alert">
                          {field.state.meta.errors.join(', ')}
                        </FieldError>
                      )}
                    </Field>
                  )}
                />

                {/* confirm password */}
                <form.Field
                  name="confirmPassword"
                  validators={{
                    onChange: ({ value, fieldApi }) => {
                      if (!value) return 'Confirm password is required!'
                      if (value !== fieldApi.form.getFieldValue('password'))
                        return 'Passwords do not match'
                    },
                  }}
                  children={(field) => (
                    <Field className="grid gap-2">
                      <FieldLabel htmlFor={field.name}>
                        Re-type Password
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="password"
                        placeholder="••••••••"
                        onChange={(e) => field.handleChange(e.target.value)}
                        value={field.state.value}
                        required
                      />
                      {!field.state.meta.isValid && (
                        <FieldError role="alert">
                          {field.state.meta.errors.join(', ')}
                        </FieldError>
                      )}
                    </Field>
                  )}
                />

                {/* address - Full Width */}
                <div className="md:col-span-2">
                  <form.Field
                    name="address"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'Address is required!'
                        if (value.length < 10) return 'Invalid address!'
                      },
                    }}
                    children={(field) => (
                      <Field className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                        <Textarea
                          id={field.name}
                          className="min-h-20"
                          placeholder="Noapara, Abhaynagar, Jessore"
                          onChange={(e) => field.handleChange(e.target.value)}
                          value={field.state.value}
                          required
                        />
                        {!field.state.meta.isValid && (
                          <FieldError role="alert">
                            {field.state.meta.errors.join(', ')}
                          </FieldError>
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full cursor-pointer"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Signup'}
                  </Button>
                )}
              />
              <Link to="/auth/login">
                <Button variant="link" className="w-full cursor-pointer">
                  Already have an account? Login now
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
