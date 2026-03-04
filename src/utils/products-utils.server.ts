import { db } from '@/db'
import { productsTable } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { count, sql } from 'drizzle-orm'
import { z } from 'zod'

export const getProdsPagQuerySchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(5),
})

export const getProductsFn = createServerFn({ method: 'GET' })
  .inputValidator(getProdsPagQuerySchema)
  .handler(async ({ data }) => {
    const [{ totalItems }] = await db
      .select({
        totalItems: count(),
      })
      .from(productsTable)

    const pageSize = Math.ceil(totalItems / data.limit)

    const page = Math.max(1, Math.min(data.page, pageSize))

    const offset = (page - 1) * data.limit

    const products = await db.query.productsTable.findMany({
      offset: offset,
      limit: data.limit,
      with: {
        category: true,
      },
    })

    let allProducts = products.map((prod, _) => {
      return {
        ...prod,
        imageName: `${process.env.CLOUDFRONT_CDN_HOST}/${prod.imageName}`,
      }
    })

    return {
      products: allProducts,
      totalItems,
      pageSize,
      currentPage: data.page,
    }
  })
