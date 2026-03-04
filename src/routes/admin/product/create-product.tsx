import { getAllCategoriesFn } from '@/utils/category-utils.server'
import { useForm } from '@tanstack/react-form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { z } from 'zod'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { adminMiddleware } from '@/middlewares/admin-only-middleware'
import { toast } from 'sonner'
import { createPresignedUrlWithClient } from '@/utils/media-uploader-utils.server'
import { productsTable } from '@/db/schema/products'
import { db } from '@/db'
import { categoriesTable } from '@/db/schema'

const createProductSchema = z.object({
  productName: z.string().nonempty(),
  description: z.string().nonempty(),
  shortDesc: z.string().nonempty(),
  productImage: z.object({
    base64: z.string(),
    name: z.string(),
    type: z.string(),
  }),
  productCategory: z.string(),
  isFeatured: z.boolean(),
  price: z.float64(),
})

const getCategoriesFn = createServerFn({ method: 'GET' }).handler(async () => {
  const categories = await db
    .select()
    .from(categoriesTable)
    .orderBy(categoriesTable.id)
  return {
    categories,
  }
})

const createProductFn = createServerFn({ method: 'POST' })
  .inputValidator(createProductSchema)
  .middleware([adminMiddleware])
  .handler(async ({ data, context }) => {
    const base64Data = data.productImage.base64.split(',')[1]
    const buffer = Buffer.from(base64Data, 'base64')

    const presignedUrl = await createPresignedUrlWithClient({
      bucket: process.env.S3_BUCKET_NAME!,
      key: `products/${data.productImage.name.replace(/\s+/g, '').trim()}`,
      region: process.env.S3_BUCKET_REGION!,
    })

    const imageUploadRes = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': data.productImage.type,
      },
      body: buffer,
    })

    if (imageUploadRes.status !== 200) {
      return {
        errorMessage: 'Invalid or corrupted image!',
      }
    }

    const productValue: typeof productsTable.$inferInsert = {
      productName: data.productName,
      desc: data.description,
      shortDesc: data.shortDesc,
      imageName: `products/${data.productImage.name.replace(/\s+/g, '').trim()}`,
      categoryId: data.productCategory,
      isFeatured: data.isFeatured,
      userId: context.adminUser.id,
      price: data.price,
    }

    await db.insert(productsTable).values(productValue)

    return {
      message: 'Created product',
    }
  })

export const Route = createFileRoute('/admin/product/create-product')({
  beforeLoad: async () => {
    const categories = await getCategoriesFn()
    return {
      categories,
    }
  },
  loader: async ({ context }) => {
    return {
      categories: context.categories,
    }
  },
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
  const createProductAction = useServerFn(createProductFn)
  const { categories } = Route.useLoaderData()

  const formC = useForm({
    defaultValues: {
      productName: '',
      productImage: undefined as File | undefined,
      productDescription: '',
      productShortDesc: '',
      isFetured: false,
      category: '',
      price: 0.0,
    },
    onSubmit: async ({ value }) => {
      const base64 = await fileToBase64(value.productImage!)
      const { message } = await createProductAction({
        data: {
          productName: value.productName,
          description: value.productDescription,
          shortDesc: value.productShortDesc,
          isFeatured: value.isFetured,
          productCategory: value.category,
          productImage: {
            base64: base64,
            name: value.productImage?.name!,
            type: value.productImage?.type!,
          },
          price: value.price,
        },
      })

      toast.success(message)
    },
  })

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.stopPropagation()
          e.preventDefault()

          formC.handleSubmit()
        }}
        method="post"
      >
        <formC.Field
          name="productName"
          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Product Name</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  name={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )
          }}
        />

        <formC.Field
          name="productShortDesc"
          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Product Description
                </FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  name={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )
          }}
        />

        <formC.Field
          name="productDescription"
          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Product Description
                </FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  name={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )
          }}
        />

        {/* price */}
        <formC.Field
          name="price"
          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  name={field.name}
                  type="number"
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              </Field>
            )
          }}
        />

        {/* category */}
        <formC.Field
          name="category"
          children={(field) => {
            return (
              <Field>
                <FieldLabel>Select Category</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => {
                    field.handleChange(value)
                  }}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {categories.categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )
          }}
        />

        {/* product image */}
        <formC.Field
          name="productImage"
          children={(field) => {
            return (
              <Field>
                <FieldLabel>Select Image</FieldLabel>
                <Input
                  name={field.name}
                  id={field.name}
                  type="file"
                  onChange={(e) => field.handleChange(e.target.files?.[0])}
                />
              </Field>
            )
          }}
        />

        {/* is featured */}
        <formC.Field
          name="isFetured"
          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Product Description
                </FieldLabel>
                <Checkbox
                  checked={field.state.value}
                  onCheckedChange={(value) => {
                    field.handleChange(Boolean(value))
                  }}
                />
              </Field>
            )
          }}
        />

        <Button type="submit">Create product</Button>
      </form>
    </div>
  )
}
