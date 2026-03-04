import { db } from '@/db'
import { cartsTable } from '@/db/schema/carts'
import { authMiddleware } from '@/middlewares/auth-middleware'
import { createServerFn } from '@tanstack/react-start'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'

export const addToCartInputSchema = z.object({
  productId: z.uuid(),
  basePrice: z.number().default(0.0),
  productImage: z.string(),
  category: z.string().min(3),
})

export const addToCartFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(addToCartInputSchema)
  .handler(async ({ context, data }) => {
    const userId = context.user.userId

    const cartData: typeof cartsTable.$inferInsert = {
      productId: data.productId,
      basePrice: String(data.basePrice),
      category: data.category,
      quantity: 1,
      productImage: data.productImage,
      userId: userId,
      totalPrice: String(0.0),
    }

    await db
      .insert(cartsTable)
      .values(cartData)
      .onConflictDoUpdate({
        target: [cartsTable.userId, cartsTable.productId],
        set: {
          quantity: sql`${cartsTable.quantity} + ${Number(1)}`,
          totalPrice: sql`${cartsTable.totalPrice} + ${data.basePrice}`,
        },
      })

    return {
      message: 'Added to cart.',
    }
  })

export const getCartItemsSchema = z.object({
  userId: z.uuid().nullable(),
})

// get all cart items
export const getCartItems = createServerFn({ method: 'GET' })
  .inputValidator(getCartItemsSchema)
  .handler(async ({ data }) => {
    const userId = data.userId

    if (!userId) {
      return {
        totalItems: 0,
        cartItems: [],
      }
    }

    const cartItems = await db.query.cartsTable.findMany({
      where(fields, operators) {
        operators.eq(fields.userId, userId!)
      },
      with: {
        product: true,
      },
    })

    return {
      totalItems: cartItems.length,
      cartItems: cartItems,
    }
  })

  
