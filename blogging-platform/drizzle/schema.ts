// drizzle/schema.ts
import { pgTable, serial, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define a status enum for posts (published/draft)
export const postStatusEnum = pgEnum('post_status', ['draft', 'published']);

// --- Posts Table ---
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  slug: text('slug').unique().notNull(), // Unique identifier for URL
  status: postStatusEnum('status').default('draft').notNull(), // Published or Draft
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(), // Automatically update this field
});

// --- Categories Table ---
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(), // Unique identifier for URL
  description: text('description'),
});

// --- Many-to-Many Relationship Table (Posts to Categories) ---
export const postsToCategories = pgTable('posts_to_categories', {
  postId: serial('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  categoryId: serial('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
});

// --- Define Relations for Drizzle ORM (Optional but highly recommended for easy querying) ---
export const postsRelations = relations(posts, ({ many }) => ({
  postsToCategories: many(postsToCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  postsToCategories: many(postsToCategories),
}));

export const postsToCategoriesRelations = relations(postsToCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postsToCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postsToCategories.categoryId],
    references: [categories.id],
  }),
}));
