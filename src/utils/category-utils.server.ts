import { db } from '@/db'
import { categoriesTable } from '@/db/schema/categories'
import { adminMiddleware } from '@/middlewares/admin-only-middleware'
import { createServerFn } from '@tanstack/react-start'
import { count, type InferSelectModel } from 'drizzle-orm'
import { z } from 'zod'
type Category = InferSelectModel<typeof categoriesTable>

const getCategoriesPaginationSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(5),
})

// get all categories
export const getAllCategoriesFn = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .inputValidator(getCategoriesPaginationSchema)
  .handler(async ({ data }) => {
    // const pageSize = Math.ceil()

    const [{ totalItems }] = await db
      .select({
        totalItems: count(),
      })
      .from(categoriesTable)

    const pageSize = Math.ceil(totalItems / data.limit)

    const offset = (data.page - 1) * pageSize

    const categories = await db
      .select()
      .from(categoriesTable)
      .offset(offset)
      .orderBy(categoriesTable.created_at)
      .limit(data.limit)

    const categoryList: Category[] = categories.map((category) => ({
      ...category,
      imageName: `${process.env.CLOUDFRONT_CDN_HOST}/${category.imageName}`,
    }))

    return {
      categories: categoryList,
      pageSize: pageSize,
      currentPage: data.page,
    }
  })
