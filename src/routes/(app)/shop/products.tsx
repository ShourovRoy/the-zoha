import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { addToCartFn } from '@/utils/cart-utils'
import { getProductsFn } from '@/utils/products-utils.server'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { ArrowRight, Badge } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/(app)/shop/products')({
  validateSearch: (search) => {
    return {
      page: search.page,
      limit: search.limit,
    }
  },
  beforeLoad: async ({ search }) => {
    const { products, pageSize, totalItems, currentPage } = await getProductsFn(
      {
        data: {
          limit: (search.limit as number) || 5,
          page: (search.page as number) || 1,
        },
      },
    )

    return {
      products,
      pageSize,
      totalItems,
      currentPage,
    }
  },
  loader: async ({ context }) => {
    return {
      ...context,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const addToCartAction = useServerFn(addToCartFn)
  const queryClient = useQueryClient()

  const { products, pageSize, currentPage } = Route.useLoaderData()
  return (
    <div className="py-5">
      <div className="container mx-auto py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden rounded-xl border-zinc-200 bg-white transition-all hover:shadow-lg"
            >
              {/* 1. Square Aspect Ratio: Standard for e-commerce */}
              <div className="relative aspect-square overflow-hidden bg-zinc-100">
                <img
                  src={product.imageName}
                  alt={product.productName}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* 3. Removed flex-1 to prevent vertical stretching */}
              <div className="p-4 space-y-2">
                {product.category?.categoryName && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                    {product.category.categoryName}
                  </p>
                )}

                <h3 className="font-semibold leading-none tracking-tight text-zinc-900">
                  {product.productName}
                </h3>

                {/* 4. Limit the description to exactly 2 lines to keep cards uniform */}
                <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                  {product.shortDesc}
                </p>
              </div>

              <CardFooter className="flex items-center justify-between p-4 pt-0">
                <span className="text-lg font-bold text-zinc-900">
                  ${product.price?.toFixed(2)}
                </span>
                <Button
                  onClick={async () => {
                    const { message } = await addToCartAction({
                      data: {
                        category: product.category?.categoryName!,
                        productId: product.id,
                        productImage: product.imageName,
                        basePrice: product.price!,
                      },
                    })

                    if (message) {
                      queryClient.invalidateQueries({
                        queryKey: ['cart'],
                      })
                      toast.success(message)
                    }
                  }}
                  size="sm"
                  className="h-8 px-3 text-xs font-medium"
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-10 flex justify-center">
        <Pagination>
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <Link
                to="/shop/products"
                search={{
                  limit: 5,
                  page: Math.max(1, currentPage - 1),
                }}
              >
                <PaginationPrevious />
              </Link>
            </PaginationItem>

            {/* Page Numbers */}
            {Array.from({ length: pageSize }).map((_, index) => {
              const page = index + 1
              return (
                <PaginationItem key={page}>
                  <Link
                    to="/shop/products"
                    search={{
                      page,
                      limit: 5,
                    }}
                  >
                    <PaginationLink isActive={page === currentPage}>
                      {page}
                    </PaginationLink>
                  </Link>
                </PaginationItem>
              )
            })}

            {/* Next */}
            <PaginationItem>
              <Link
                to="/shop/products"
                search={{
                  limit: 5,
                  page: Math.min(pageSize, currentPage + 1),
                }}
              >
                <PaginationNext />
              </Link>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
