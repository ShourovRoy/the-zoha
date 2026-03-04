import { ProductCard } from '@/components/admin/products/product-card'
import { db } from '@/db'
import { adminMiddleware } from '@/middlewares/admin-only-middleware'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getAllAdminProductsFn = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    const products = await db.query.productsTable.findMany({
      with: {
        category: true,
      },
    })

    const productList = products.map((category) => ({
      ...category,
      imageName: `${process.env.CLOUDFRONT_CDN_HOST}/${category.imageName}`,
    }))

    return {
      productList,
    }
  })

export const Route = createFileRoute('/admin/product/all-products')({
  beforeLoad: async () => {
    const products = await getAllAdminProductsFn()
    return {
      products: products.productList,
    }
  },
  loader: async ({ context }) => {
    const products = context.products

    return {
      products,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { products } = Route.useLoaderData()

  return (
    <div>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
