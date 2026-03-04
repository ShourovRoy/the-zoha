import { pgTable, timestamp, uuid, varchar, boolean } from 'drizzle-orm/pg-core'

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
}

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().unique().defaultRandom(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  phone: varchar({ length: 17 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  address: varchar({ length: 255 }).notNull(),
  postCode: varchar({ length: 10 }).notNull(),
  isAdmin: boolean().default(false),
  ...timestamps,
})
