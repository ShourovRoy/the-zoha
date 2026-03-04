import { relations } from 'drizzle-orm'
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { usersTable } from './users'
import { productsTable } from './products'

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
}

export const categoriesTable = pgTable('categories', {
  id: uuid().primaryKey().unique().defaultRandom(),
  userId: uuid().references(() => usersTable.id),
  categoryName: varchar({ length: 255 }).notNull().unique(),
  description: varchar().notNull(),
  imageName: varchar().notNull(),
  ...timestamps,
})

// category relation with product
export const categoryRelation = relations(categoriesTable, ({ many }) => ({
  products: many(productsTable),
}))
