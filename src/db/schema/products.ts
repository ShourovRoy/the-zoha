import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
  decimal,
} from 'drizzle-orm/pg-core'
import { usersTable } from './users'
import { categoriesTable } from './categories'
import { relations } from 'drizzle-orm'
import { cartsTable } from './carts'

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
}

export const productsTable = pgTable('products', {
  id: uuid().primaryKey().unique().defaultRandom(),
  userId: uuid().references(() => usersTable.id),
  productName: varchar({ length: 255 }).notNull(),
  shortDesc: varchar({ length: 255 }).notNull(),
  desc: varchar({ length: 700 }).notNull(),
  isFeatured: boolean().default(false),
  categoryId: uuid().references(() => categoriesTable.id),

  imageName: varchar().notNull(),
  price: decimal({ mode: 'number' }).default(0.0),
  ...timestamps,
})

export const productRelation = relations(productsTable, ({ one, many }) => ({
  category: one(categoriesTable, {
    fields: [productsTable.categoryId],
    references: [categoriesTable.id],
  }),
  cart: many(cartsTable),
}))
