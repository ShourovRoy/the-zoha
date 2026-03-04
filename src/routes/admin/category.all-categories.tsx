import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { getAllCategoriesFn } from '@/utils/category-utils'

import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/category/all-categories')({
  validateSearch: (search) => {
    return {
      page: search.page as number,
      limit: search.limit as number,
    }
  },
  beforeLoad: async ({ search }) => {
    const { categories, currentPage, pageSize } = await getAllCategoriesFn({
      data: {
        limit: search.limit || 5,
        page: search.page || 1,
      },
    })
    return {
      categoryList: categories,
      currentPage,
      pageSize,
    }
  },
  loader: async ({ context }) => {
    return {
      categories: context.categoryList,
      currentPage: context.currentPage,
      pageSize: context.pageSize,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { categories, currentPage, pageSize } = Route.useLoaderData()

  return (
    <div className="container mx-auto py-10">
      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
          >
            {/* Image */}
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src={category.imageName}
                alt={category.categoryName}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Content */}
            <CardHeader className="flex-1">
              <CardTitle className="text-lg">{category.categoryName}</CardTitle>
              <CardDescription className="line-clamp-2">
                {category.description}
              </CardDescription>
            </CardHeader>

            {/* Footer */}
            <CardFooter className="flex flex-col items-start gap-1 text-xs text-muted-foreground border-t pt-3">
              <span>
                Created: {new Date(category.created_at).toLocaleDateString()}
              </span>
              <span>Creator: {category.userId}</span>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination (Outside Grid) */}
      <div className="mt-10 flex justify-center">
        <Pagination>
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <Link
                to="/admin/category/all-categories"
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
                    to="/admin/category/all-categories"
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
                to="/admin/category/all-categories"
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
