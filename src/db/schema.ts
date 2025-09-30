import { 
  sqliteTable, 
  text, 
  integer, 
  blob,
  index 
} from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';

// Enums
export const cityEnum = ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'] as const;
export const propertyTypeEnum = ['Apartment', 'Villa', 'Plot', 'Office', 'Retail'] as const;
export const bhkEnum = ['1', '2', '3', '4', 'Studio'] as const;
export const purposeEnum = ['Buy', 'Rent'] as const;
export const timelineEnum = ['0-3m', '3-6m', '>6m', 'Exploring'] as const;
export const sourceEnum = ['Website', 'Referral', 'Walk-in', 'Call', 'Other'] as const;
export const statusEnum = ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'] as const;

export type City = typeof cityEnum[number];
export type PropertyType = typeof propertyTypeEnum[number];
export type BHK = typeof bhkEnum[number];
export type Purpose = typeof purposeEnum[number];
export type Timeline = typeof timelineEnum[number];
export type Source = typeof sourceEnum[number];
export type Status = typeof statusEnum[number];

// Users table for simple demo authentication
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  isAdmin: integer('is_admin', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
});

// Buyers table
export const buyers = sqliteTable('buyers', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  city: text('city', { enum: cityEnum }).notNull(),
  propertyType: text('property_type', { enum: propertyTypeEnum }).notNull(),
  bhk: text('bhk', { enum: bhkEnum }),
  purpose: text('purpose', { enum: purposeEnum }).notNull(),
  budgetMin: integer('budget_min'),
  budgetMax: integer('budget_max'),
  timeline: text('timeline', { enum: timelineEnum }).notNull(),
  source: text('source', { enum: sourceEnum }).notNull(),
  status: text('status', { enum: statusEnum }).default('New').notNull(),
  notes: text('notes'),
  tags: text('tags', { mode: 'json' }).$type<string[]>().default(sql`'[]'`),
  profileImage: text('profile_image'),
  documents: text('documents', { mode: 'json' }).$type<string[]>().default(sql`'[]'`),
  ownerId: text('owner_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
}, (table) => {
  return {
    ownerIdx: index('buyers_owner_idx').on(table.ownerId),
    statusIdx: index('buyers_status_idx').on(table.status),
    updatedAtIdx: index('buyers_updated_at_idx').on(table.updatedAt),
    cityIdx: index('buyers_city_idx').on(table.city),
    propertyTypeIdx: index('buyers_property_type_idx').on(table.propertyType),
  };
});

// Buyer history table for audit trail
export const buyerHistory = sqliteTable('buyer_history', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  buyerId: text('buyer_id').notNull().references(() => buyers.id),
  changedBy: text('changed_by').notNull().references(() => users.id),
  changedAt: integer('changed_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  diff: text('diff', { mode: 'json' }).$type<Record<string, { old: any; new: any }>>().notNull(),
}, (table) => {
  return {
    buyerIdx: index('buyer_history_buyer_idx').on(table.buyerId),
    changedAtIdx: index('buyer_history_changed_at_idx').on(table.changedAt),
  };
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Buyer = typeof buyers.$inferSelect;
export type NewBuyer = typeof buyers.$inferInsert;
export type BuyerHistory = typeof buyerHistory.$inferSelect;
export type NewBuyerHistory = typeof buyerHistory.$inferInsert;