import { z } from "zod";
import { publicProcedure, router } from "../index";
import { categories } from "../../../../drizzle/schema"; // Correct path
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server"; // Import TRPCError

export const categoryRouter = router({
  // 1. CREATE Category
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Category name cannot be empty"),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const slug = input.name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      const [newCategory] = await ctx.db
        .insert(categories)
        .values({
          name: input.name,
          slug: slug,
          description: input.description,
        })
        .returning();
      return newCategory;
    }),

  // 2. READ All Categories
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.categories.findMany();
  }),

  // 3. READ Single Category by Slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1, "Slug is required") }))
    .query(async ({ input, ctx }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.slug, input.slug),
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return category;
    }),

  // 4. UPDATE Category
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1, "Category name cannot be empty").optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;
      const slug = updateData.name
        ? updateData.name
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "")
        : undefined;

      const [updatedCategory] = await ctx.db
        .update(categories)
        .set({
          ...updateData,
          slug: slug, // Update slug if name changed
        })
        .where(eq(categories.id, id))
        .returning();

      if (!updatedCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",      
          message: "Category not found",
        });
      }
      return updatedCategory;
    }),

  // 5. DELETE Category
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Drizzle's onDelete: 'cascade' in schema handles deleting entries in postsToCategories
      const [deletedCategory] = await ctx.db
        .delete(categories)
        .where(eq(categories.id, input.id))
        .returning();

      if (!deletedCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }
      return deletedCategory;
    }),
});
