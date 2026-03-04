import {
  integer,
  pgTable,
  uuid,
  decimal,
  timestamp,
  varchar,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { usersTable } from './users'
import { productsTable } from './products'
import { relations, type InferSelectModel } from 'drizzle-orm'

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
}

export const cartsTable = pgTable(
  'carts',
  {
    id: uuid().primaryKey().defaultRandom().unique(),
    userId: uuid().references(() => usersTable.id),
    productId: uuid().references(() => productsTable.id),
    quantity: integer(),
    totalPrice: decimal(),
    basePrice: decimal(),
    productImage: varchar({ length: 500 }),
    category: varchar({ length: 255 }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('cart_user_prod_unique').on(table.userId, table.productId),
  ],
)

// cart relation with product
export const cartRelation = relations(cartsTable, ({ one }) => ({
  product: one(productsTable, {
    fields: [cartsTable.productId],
    references: [productsTable.id],
  }),
}))

// Base row type (without relations)
type Cart = InferSelectModel<typeof cartsTable>

// With relation (manual extension)
export type CartWithProduct = Cart & {
  product: InferSelectModel<typeof productsTable>
}
