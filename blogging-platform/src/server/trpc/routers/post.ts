// src/server/trpc/routers/post.ts
import { z } from "zod";
import { publicProcedure, router } from "../index";
import {
  posts,
  categories,
  postsToCategories,
  postStatusEnum,
} from "../../../../drizzle/schema"; // Correct path
import { eq, and, inArray, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server"; // Import TRPCError

export const postRouter = router({
  // 1. CREATE Post
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title cannot be empty"),
        content: z.string().min(1, "Content cannot be empty"),
        categoryIds: z.array(z.number()).optional(), // Optional array of category IDs
        status: z.enum(postStatusEnum.enumValues).default("draft"),
      })
    )
    .mutation(async ({ input, ctx }: { input: any; ctx: any }) => {
      const slug = input.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

      const newPost = await ctx.db.transaction(async (tx: any) => {
        const [post] = await tx
          .insert(posts)
          .values({
            title: input.title,
            content: input.content,
            slug: slug,
            status: input.status,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        if (input.categoryIds && input.categoryIds.length > 0) {
          const postCategoryRelations = input.categoryIds.map(
            (categoryId: any) => ({
              postId: post.id,
              categoryId: categoryId,
            })
          );
          await tx.insert(postsToCategories).values(postCategoryRelations);
        }
        return post;
      });
      return newPost;
    }),

  // 2. READ All Posts (with optional category filtering)
  getAll: publicProcedure
    .input(
      z
        .object({
          categoryId: z.number().optional(), // Optional filter by category
        })
        .optional()
    )
    .query(async ({ input, ctx }: { input: any; ctx: any }) => {
      const { categoryId } = input || {};

      let fetchedPosts;

      if (categoryId) {
        // Step 1: If categoryId is provided, first find all post IDs linked to this category
        const postIdsResult = await ctx.db
          .select({ postId: postsToCategories.postId })
          .from(postsToCategories)
          .where(eq(postsToCategories.categoryId, categoryId))
          .execute();

        const postIds = postIdsResult.map((row: any) => row.postId);

        if (postIds.length === 0) {
          // If no posts are found for this category, return an empty array early
          return [];
        }

        // Step 2: Fetch the actual posts that match these IDs (no nested 'with' here)
        fetchedPosts = await ctx.db.query.posts.findMany({
          where: inArray(posts.id, postIds),
        });
      } else {
        // Step 1 (if no categoryId): Get all posts (no nested 'with' here)
        fetchedPosts = await ctx.db.query.posts.findMany();
      }

      // Step 2: Fetch all postsToCategories relations for the fetched posts
      const postIdsInResult = fetchedPosts.map((post: any) => post.id);
      let fetchedPostsToCategories: any[] = [];
      if (postIdsInResult.length > 0) {
        fetchedPostsToCategories =
          await ctx.db.query.postsToCategories.findMany({
            where: inArray(postsToCategories.postId, postIdsInResult),
          });
      }

      // Step 3: Fetch all categories in a single, efficient query
      const allCategories = await ctx.db.query.categories.findMany();
      const categoryMap = new Map(
        allCategories.map((cat: any) => [cat.id, cat])
      );

      // Step 4: Manually combine the data
      return fetchedPosts.map((post: any) => {
        const postCategories = fetchedPostsToCategories
          .filter((ptc: any) => ptc.postId === post.id) // Get relations specific to this post
          .map((ptc: any) => categoryMap.get(ptc.categoryId)) // Get the full category object from the map
          .filter(Boolean); // Filter out any undefined if a category ID wasn't found

        return {
          ...post,
          categories: postCategories,
        };
      });
    }),

  // 3. READ Single Post by Slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }: { input: any; ctx: any }) => {
      const { slug } = input;

      // Step 1: Fetch the post by slug
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.slug, slug),
      });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      // Step 2: Fetch its associated categories from the join table
      const postCategoryRelations =
        await ctx.db.query.postsToCategories.findMany({
          where: eq(postsToCategories.postId, post.id),
        });

      // Step 3: Get the IDs of the categories for this post
      const categoryIds = postCategoryRelations.map(
        (ptc: any) => ptc.categoryId
      );

      let categoriesForPost: any[] = [];
      if (categoryIds.length > 0) {
        // Step 4: Fetch the full category objects for these IDs
        categoriesForPost = await ctx.db.query.categories.findMany({
          where: inArray(categories.id, categoryIds),
        });
      }

      // Step 5: Combine the post with its categories
      return {
        ...post,
        categories: categoriesForPost,
      };
    }),

  // 4. UPDATE Post
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1, "Title cannot be empty").optional(),
        content: z.string().min(1, "Content cannot be empty").optional(),
        categoryIds: z.array(z.number()).optional(),
        status: z.enum(postStatusEnum.enumValues).optional(),
      })
    )
    .mutation(async ({ input, ctx }: { input: any; ctx: any }) => {
      const { id, categoryIds, ...updateData } = input;
      const slug = updateData.title
        ? updateData.title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "")
        : undefined;

      const updatedPost = await ctx.db.transaction(async (tx: any) => {
        const [post] = await tx
          .update(posts)
          .set({
            ...updateData,
            slug: slug, // Update slug if title changed
            updatedAt: new Date(),
          })
          .where(eq(posts.id, id))
          .returning();

        if (!post) {
          throw new Error("Post not found");
        }

        // Handle category updates (delete existing, insert new)
        if (categoryIds !== undefined) {
          await tx
            .delete(postsToCategories)
            .where(eq(postsToCategories.postId, id));
          if (categoryIds.length > 0) {
            const newRelations = categoryIds.map((categoryId: any) => ({
              postId: id,
              categoryId: categoryId,
            }));
            await tx.insert(postsToCategories).values(newRelations);
          }
        }
        return post;
      });
      return updatedPost;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      const postCategoryRelations = await ctx.db.query.postsToCategories.findMany({
        where: eq(postsToCategories.postId, post.id),
      });

      const categoryIds = postCategoryRelations.map((ptc: any) => ptc.categoryId);
      let categoriesForPost: any[] = [];
      if (categoryIds.length > 0) {
        categoriesForPost = await ctx.db.query.categories.findMany({
          where: inArray(categories.id, categoryIds),
        });
      }

      return {
        ...post,
        categories: categoriesForPost,
      };
    }),

  // 5. DELETE Post
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }: { input: any; ctx: any }) => {
      const [deletedPost] = await ctx.db
        .delete(posts)
        .where(eq(posts.id, input.id))
        .returning();

      if (!deletedPost) {
        throw new Error("Post not found");
      }
      return deletedPost;
    }),
});
