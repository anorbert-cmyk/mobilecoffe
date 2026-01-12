import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, date, decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const businesses = mysqlTable("businesses", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").references(() => users.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["cafe", "roaster", "both", "equipment_seller"]).notNull(),
  taxNumber: varchar("taxNumber", { length: 50 }),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  address: json("address"), // { street, city, postalCode, country }
  description: text("description"),
  logoUrl: varchar("logoUrl", { length: 512 }),
  headerImageUrls: json("headerImageUrls"), // Array of strings
  website: varchar("website", { length: 512 }),
  socialMedia: json("socialMedia"), // { instagram, facebook, tiktok }
  openingHours: json("openingHours"), // Complex object
  services: json("services"), // Boolean flags { wifi, terrace, etc }
  isVerified: boolean("isVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const businessSubscriptions = mysqlTable("business_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  businessId: int("businessId").references(() => businesses.id).notNull(),
  plan: mysqlEnum("plan", ["free", "premium", "premium_plus"]).default("free").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  status: mysqlEnum("status", ["active", "past_due", "canceled", "unpaid", "incomplete"]).default("active"),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const roasters = mysqlTable("roasters", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  logoUrl: varchar("logoUrl", { length: 512 }),
  website: varchar("website", { length: 512 }),
  isPartner: boolean("isPartner").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  businessId: int("businessId").references(() => businesses.id).notNull(),
  type: mysqlEnum("type", ["coffee", "equipment", "accessory"]).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: int("price").notNull(), // Stored in minor units (e.g., HUF) or just plain HUF if unlikely to have cents. HUF has no decimals usually. 
  currency: varchar("currency", { length: 3 }).default("HUF"),
  images: json("images"),
  // Coffee specific
  roastLevel: mysqlEnum("roastLevel", ["light", "medium", "medium-dark", "dark"]),
  processMethod: mysqlEnum("processMethod", ["washed", "natural", "honey", "anaerobic"]),
  origin: json("origin"), // { country, region, farm }
  flavorNotes: json("flavorNotes"), // Array of strings
  weight: int("weight"), // grams
  roasterId: int("roasterId").references(() => roasters.id), 
  
  isAvailable: boolean("isAvailable").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const menuCategories = mysqlTable("menu_categories", {
  id: int("id").autoincrement().primaryKey(),
  businessId: int("businessId").references(() => businesses.id).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  order: int("order").default(0),
});

export const menuItems = mysqlTable("menu_items", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").references(() => menuCategories.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: int("price").notNull(),
  currency: varchar("currency", { length: 3 }).default("HUF"),
  image: varchar("image", { length: 512 }),
  isVegan: boolean("isVegan").default(false),
  isGlutenFree: boolean("isGlutenFree").default(false),
  allergens: json("allergens"),
  isAvailable: boolean("isAvailable").default(true),
});

export const jobListings = mysqlTable("job_listings", {
  id: int("id").autoincrement().primaryKey(),
  businessId: int("businessId").references(() => businesses.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  netSalaryMin: int("netSalaryMin"),
  netSalaryMax: int("netSalaryMax"),
  contractType: mysqlEnum("contractType", ["full-time", "part-time", "contract", "internship", "seasonal"]).notNull(),
  workingHours: varchar("workingHours", { length: 100 }),
  startDate: date("startDate"),
  contactEmail: varchar("contactEmail", { length: 255 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 50 }),
  requirements: json("requirements"),
  status: mysqlEnum("status", ["draft", "active", "paused", "expired", "filled"]).default("draft"),
  views: int("views").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export const productPromotions = mysqlTable("product_promotions", {
  id: int("id").autoincrement().primaryKey(),
  businessId: int("businessId").references(() => businesses.id).notNull(),
  type: mysqlEnum("type", ["single", "category", "all"]).notNull(),
  targetProductIds: json("targetProductIds"),
  targetCategory: json("targetCategory"),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  dailyBudget: int("dailyBudget"),
  totalBudget: int("totalBudget"),
  spent: int("spent").default(0),
  impressions: int("impressions").default(0),
  clicks: int("clicks").default(0),
  status: mysqlEnum("status", ["active", "paused", "exhausted", "expired"]).default("active"),
});

// Relations
export const businessRelations = relations(businesses, ({ one, many }) => ({
  owner: one(users, { fields: [businesses.ownerId], references: [users.id] }),
  products: many(products),
  jobs: many(jobListings),
  menuCategories: many(menuCategories),
  subscriptions: many(businessSubscriptions), // Should technically be one active, but history is good
}));

export const productRelations = relations(products, ({ one }) => ({
  business: one(businesses, { fields: [products.businessId], references: [businesses.id] }),
  roaster: one(roasters, { fields: [products.roasterId], references: [roasters.id] }),
}));

export const menuCategoryRelations = relations(menuCategories, ({ one, many }) => ({
  business: one(businesses, { fields: [menuCategories.businessId], references: [businesses.id] }),
  items: many(menuItems),
}));

export const menuItemRelations = relations(menuItems, ({ one }) => ({
  category: one(menuCategories, { fields: [menuItems.categoryId], references: [menuCategories.id] }),
}));

export const jobRelations = relations(jobListings, ({ one }) => ({
  business: one(businesses, { fields: [jobListings.businessId], references: [businesses.id] }),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
