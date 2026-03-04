import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { db } from '@/db'
import { categoriesTable } from '@/db/schema/categories'
import { adminMiddleware } from '@/middlewares/admin-only-middleware'
import { createPresignedUrlWithClient } from '@/utils/media-uploader-utils'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'
import { z } from 'zod'

const createCategorySchema = z.object({
  categoryName: z.string().nonempty(),
  description: z.string().nonempty(),
  categoryImage: z.object({
    base64: z.string(),
    name: z.string(),
    type: z.string(),
  }),
})

const createCategoryFn = createServerFn({ method: 'POST' })
  .inputValidator(createCategorySchema)
  .middleware([adminMiddleware])
  .handler(async ({ data, context }) => {
    // Convert base64 back to a Buffer/File on the server
    const base64Data = data.categoryImage.base64.split(',')[1]
    const buffer = Buffer.from(base64Data, 'base64')

    // check if the category already exists
    const categoryList = await db
      .select({
        id: categoriesTable.id,
      })
      .from(categoriesTable)
      .where(eq(categoriesTable.categoryName, data.categoryName))
      .limit(1)

    if (categoryList.length > 0) {
      return {
        errorMessage: 'Category already exists!',
      }
    }

    // create presigned url with client
    const presignedUrl = await createPresignedUrlWithClient({
      bucket: process.env.S3_BUCKET_NAME!,
      key: `category/${data.categoryImage.name.replace(/\s+/g, '').trim()}`,
      region: process.env.S3_BUCKET_REGION!,
    })

    const imageUploadRes = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': data.categoryImage.type,
      },
      body: buffer,
    })

    if (imageUploadRes.status !== 200) {
      return {
        errorMessage: 'Invalid or corrupted image!',
      }
    }

    const categoryValue: typeof categoriesTable.$inferInsert = {
      imageName: `category/${data.categoryImage.name.replace(/\s+/g, '').trim()}`,
      categoryName: data.categoryName,
      description: data.description,
      userId: context.adminUser.id,
    }

    try {
      await db.insert(categoriesTable).values(categoryValue)
      return {
        message: 'Category has been created successfully.',
      }
    } catch (error) {
      return {
        errorMessage: 'Failed to create category!',
      }
    }
  })

export const Route = createFileRoute('/admin/category/create-new-category')({
  component: RouteComponent,
})

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function RouteComponent() {
  const categoryAction = useServerFn(createCategoryFn)

  const formC = useForm({
    defaultValues: {
      categoryName: '',
      description: '',
      categoryImage: undefined as File | undefined,
    },
    onSubmit: async ({ value }) => {
      const base64 = await fileToBase64(value.categoryImage!)

      const { message, errorMessage } = await categoryAction({
        data: {
          categoryImage: {
            base64,
            name: value.categoryImage!.name,
            type: value.categoryImage!.type,
          },
          categoryName: value.categoryName,
          description: value.description,
        },
      })

      if (errorMessage) {
        return toast.error(errorMessage)
      }

      toast.success(message)
    },
  })

  return (
    <div className="flex items-center justify-center">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Create new Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              formC.handleSubmit()
            }}
            method="post"
          >
            <formC.Field
              name="categoryName"
              validators={{
                onChange: ({ value }) => {
                  if (value.length < 5) {
                    return 'At least 5 characters!'
                  }
                },
              }}
              children={(field) => (
                <div className="pb-1">
                  <Field>
                    <FieldLabel htmlFor={field.name}>Category name</FieldLabel>
                    <Input
                      type="text"
                      name={field.name}
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter category name"
                    />
                    {!field.state.meta.isValid && (
                      <FieldError role="alert">
                        {field.state.meta.errors.join(', ')}
                      </FieldError>
                    )}
                  </Field>
                </div>
              )}
            />

            <formC.Field
              name="description"
              validators={{
                onChange: ({ value }) => {
                  if (value.length < 5) {
                    return 'At least 5 characters!'
                  }
                },
              }}
              children={(field) => (
                <div className="py-1">
                  <Field>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Input
                      type="text"
                      name={field.name}
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter description"
                    />
                    {!field.state.meta.isValid && (
                      <FieldError role="alert">
                        {field.state.meta.errors.join(', ')}
                      </FieldError>
                    )}
                  </Field>
                </div>
              )}
            />

            <formC.Field
              name="categoryImage"
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return 'Select a valid image file!'
                  }
                },
              }}
              children={(field) => (
                <div className="py-1">
                  <Field>
                    <FieldLabel htmlFor={field.name}>Select Image</FieldLabel>

                    <Input
                      type="file"
                      accept="image/*"
                      name={field.name}
                      id={field.name}
                      onChange={(e) => field.handleChange(e.target.files?.[0])}
                    />

                    {!field.state.meta.isValid && (
                      <FieldError role="alert">
                        {field.state.meta.errors.join(', ')}
                      </FieldError>
                    )}
                  </Field>
                </div>
              )}
            />
            <formC.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => {
                return (
                  <div className="py-1">
                    <Button
                      disabled={!canSubmit}
                      variant="outline"
                      type="submit"
                    >
                      {isSubmitting ? 'Creating...' : 'Create'}
                    </Button>
                  </div>
                )
              }}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
