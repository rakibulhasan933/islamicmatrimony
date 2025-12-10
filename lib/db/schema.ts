import { pgTable, serial, varchar, text, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core"

// Enums
export const genderEnum = pgEnum("gender", ["male", "female"])
export const maritalStatusEnum = pgEnum("marital_status", ["unmarried", "divorced", "widow", "widower"])
export const biodataTypeEnum = pgEnum("biodata_type", ["bride", "groom"])
export const membershipTypeEnum = pgEnum("membership_type", ["free", "silver", "gold"])
export const membershipStatusEnum = pgEnum("membership_status", ["active", "expired", "cancelled"])

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(), // Clerk user ID
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Memberships table
export const memberships = pgTable("memberships", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .references(() => users.clerkId, { onDelete: "cascade" })
    .notNull(),
  type: membershipTypeEnum("type").notNull().default("free"),
  status: membershipStatusEnum("status").notNull().default("active"),
  contactViewsRemaining: integer("contact_views_remaining").default(0),
  contactViewsTotal: integer("contact_views_total").default(0),
  startsAt: timestamp("starts_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Biodata profiles
export const biodatas = pgTable("biodatas", {
  id: serial("id").primaryKey(),
  biodataNo: varchar("biodata_no", { length: 20 }).notNull().unique(),
  userId: varchar("user_id", { length: 255 })
    .references(() => users.clerkId, { onDelete: "cascade" })
    .notNull(),
  type: biodataTypeEnum("type").notNull(),
  photo: text("photo"),

  // Personal Info
  fullName: varchar("full_name", { length: 255 }).notNull(),
  gender: genderEnum("gender").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  age: integer("age"),
  height: varchar("height", { length: 20 }),
  weight: varchar("weight", { length: 20 }),
  bloodGroup: varchar("blood_group", { length: 10 }),
  complexion: varchar("complexion", { length: 50 }),

  // Marital Info
  maritalStatus: maritalStatusEnum("marital_status").notNull(),

  // Location
  permanentDistrict: varchar("permanent_district", { length: 100 }),
  permanentAddress: text("permanent_address"),
  currentDistrict: varchar("current_district", { length: 100 }),
  currentAddress: text("current_address"),

  // Education
  education: varchar("education", { length: 255 }),
  educationDetails: text("education_details"),

  // Occupation
  occupation: varchar("occupation", { length: 255 }),
  occupationDetails: text("occupation_details"),
  monthlyIncome: varchar("monthly_income", { length: 50 }),

  // Family Info
  fatherName: varchar("father_name", { length: 255 }),
  fatherOccupation: varchar("father_occupation", { length: 255 }),
  motherName: varchar("mother_name", { length: 255 }),
  motherOccupation: varchar("mother_occupation", { length: 255 }),
  siblings: text("siblings"),

  // Religious Info
  religiousPractice: varchar("religious_practice", { length: 100 }),
  prayerHabit: varchar("prayer_habit", { length: 100 }),
  wearsHijab: boolean("wears_hijab"),
  hasBeard: boolean("has_beard"),

  // Partner Preferences
  expectedAge: varchar("expected_age", { length: 50 }),
  expectedHeight: varchar("expected_height", { length: 50 }),
  expectedEducation: varchar("expected_education", { length: 255 }),
  expectedDistrict: varchar("expected_district", { length: 100 }),
  expectedMaritalStatus: varchar("expected_marital_status", { length: 100 }),
  partnerQualities: text("partner_qualities"),

  // Contact
  guardianPhone: varchar("guardian_phone", { length: 20 }),
  guardianRelation: varchar("guardian_relation", { length: 50 }),

  // Status
  isApproved: boolean("is_approved").default(true),
  isPublished: boolean("is_published").default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Contact views table
export const contactViews = pgTable("contact_views", {
  id: serial("id").primaryKey(),
  viewerUserId: varchar("viewer_user_id", { length: 255 })
    .references(() => users.clerkId, { onDelete: "cascade" })
    .notNull(),
  biodataId: integer("biodata_id")
    .references(() => biodatas.id, { onDelete: "cascade" })
    .notNull(),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
})

// Shortlist table
export const shortlists = pgTable("shortlists", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .references(() => users.clerkId, { onDelete: "cascade" })
    .notNull(),
  biodataId: integer("biodata_id")
    .references(() => biodatas.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Biodata = typeof biodatas.$inferSelect
export type NewBiodata = typeof biodatas.$inferInsert
export type Membership = typeof memberships.$inferSelect
export type NewMembership = typeof memberships.$inferInsert
export type ContactView = typeof contactViews.$inferSelect
export type Shortlist = typeof shortlists.$inferSelect
