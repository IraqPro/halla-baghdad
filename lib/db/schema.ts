import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  text,
  jsonb,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

// Admin role enum
export const adminRoleEnum = pgEnum("admin_role", ["super_admin", "admin", "moderator"]);

// Admins table - for authentication
export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  role: adminRoleEnum("role").default("admin").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  loginAttempts: varchar("login_attempts", { length: 10 }).default("0"),
  lockedUntil: timestamp("locked_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Participants table - marathon participants
export const participants = pgTable("participants", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  residence: varchar("residence", { length: 255 }).notNull(),
  healthCondition: varchar("health_condition", { length: 255 }).notNull(),
  sportLevel: varchar("sport_level", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Social link type for celebrities
export type SocialLink = {
  type: "instagram" | "facebook" | "twitter" | "youtube" | "tiktok";
  url: string;
};

// Celebrities table - for voting
export const celebrities = pgTable("celebrities", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  image: varchar("image", { length: 500 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(), // influencer, artist, athlete, etc.
  socialLinks: jsonb("social_links").$type<SocialLink[]>().default([]),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Votes table - stores all votes with device fingerprint
export const votes = pgTable("votes", {
  id: uuid("id").defaultRandom().primaryKey(),
  celebrityId: uuid("celebrity_id")
    .references(() => celebrities.id)
    .notNull(),
  deviceFingerprint: varchar("device_fingerprint", { length: 64 }).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  screenResolution: varchar("screen_resolution", { length: 20 }),
  timezone: varchar("timezone", { length: 50 }),
  language: varchar("language", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Type exports
export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;

export type Celebrity = typeof celebrities.$inferSelect;
export type NewCelebrity = typeof celebrities.$inferInsert;

export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
