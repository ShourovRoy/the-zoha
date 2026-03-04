import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export type ProductWithCategory = {
  id: string
  userId: string | null
  productName: string
  shortDesc: string
  desc: string
  isFeatured: boolean | null
  categoryId: string | null
  imageName: string
  price: number | null
  updated_at: Date | null
  created_at: Date
  category: {
    id: string
    userId: string | null
    categoryName: string
    description: string
    imageName: string
    updated_at: Date | null
    created_at: Date
  } | null
}

export function ProductCard({ product }: { product: ProductWithCategory }) {
  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
      <CardHeader className="p-0 relative">
        <img
          src={product.imageName}
          alt={product.productName}
          className="h-60 w-full object-cover rounded-t-2xl"
        />

        {product.isFeatured && (
          <Badge className="absolute top-3 left-3">Featured</Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{product.productName}</CardTitle>
          <span className="font-semibold text-base">৳ {product.price}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.shortDesc}
        </p>

        <Badge variant="secondary">{product.category?.categoryName}</Badge>
      </CardContent>

      <CardFooter>
        <Button className="w-full">Edit</Button>
      </CardFooter>
    </Card>
  )
}
