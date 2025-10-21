import { z } from "zod";
import { publicProcedure, router } from "../index";
import {
  posts,
  categories,
  postsToCategories,
  postStatusEnum,
} from "../../../../drizzle/schema";
import { eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

type PostRecord = {
  id: number;
  title: string;
  content: string;
  slug: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type CategoryRecord = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

type PostToCategoryRecord = {
  postId: number;
  categoryId: number;
};

export const postRouter = router({
  // 1. CREATE Post
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title cannot be empty"),
        content: z.string().min(1, "Content cannot be empty"),
        categoryIds: z.array(z.number()).optional(),
        status: z.enum(postStatusEnum.enumValues).default("draft"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const slug = input.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

      const newPost = await ctx.db.transaction(async (tx) => {
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
          const postCategoryRelations = input.categoryIds.map((categoryId) => ({
            postId: (post as PostRecord).id,
            categoryId: categoryId,
          }));
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
          categoryId: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const { categoryId } = input || {};

      let fetchedPosts: PostRecord[];

      if (categoryId) {
        const postIdsResult = await ctx.db
          .select({ postId: postsToCategories.postId })
          .from(postsToCategories)
          .where(eq(postsToCategories.categoryId, categoryId))
          .execute();

        const postIds = postIdsResult.map((row) => row.postId);

        if (postIds.length === 0) {
          return [];
        }

        fetchedPosts = await ctx.db.query.posts.findMany({
          where: inArray(posts.id, postIds),
        });
      } else {
        fetchedPosts = await ctx.db.query.posts.findMany();
      }

      const postIdsInResult = fetchedPosts.map((post) => post.id);
      let fetchedPostsToCategories: PostToCategoryRecord[] = [];
      if (postIdsInResult.length > 0) {
        fetchedPostsToCategories =
          await ctx.db.query.postsToCategories.findMany({
            where: inArray(postsToCategories.postId, postIdsInResult),
          });
      }

      const allCategories = await ctx.db.query.categories.findMany();
      const categoryMap = new Map(allCategories.map((cat) => [cat.id, cat]));

      return fetchedPosts.map((post) => {
        const postCategories = fetchedPostsToCategories
          .filter((ptc) => ptc.postId === post.id)
          .map((ptc) => categoryMap.get(ptc.categoryId))
          .filter((cat): cat is CategoryRecord => cat !== undefined);

        return {
          ...post,
          categories: postCategories,
        };
      });
    }),

  // 3. READ Single Post by Slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const { slug } = input;

      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.slug, slug),
      });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      const postCategoryRelations =
        await ctx.db.query.postsToCategories.findMany({
          where: eq(postsToCategories.postId, post.id),
        });

      const categoryIds = postCategoryRelations.map((ptc) => ptc.categoryId);

      let categoriesForPost: CategoryRecord[] = [];
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
    .mutation(async ({ input, ctx }) => {
      const { id, categoryIds, ...updateData } = input;
      const slug = updateData.title
        ? updateData.title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "")
        : undefined;

      const updatedPost = await ctx.db.transaction(async (tx) => {
        const [post] = await tx
          .update(posts)
          .set({
            ...updateData,
            slug: slug,
            updatedAt: new Date(),
          })
          .where(eq(posts.id, id))
          .returning();

        if (!post) {
          throw new Error("Post not found");
        }

        if (categoryIds !== undefined) {
          await tx
            .delete(postsToCategories)
            .where(eq(postsToCategories.postId, id));
          if (categoryIds.length > 0) {
            const newRelations = categoryIds.map((categoryId) => ({
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

      const postCategoryRelations =
        await ctx.db.query.postsToCategories.findMany({
          where: eq(postsToCategories.postId, post.id),
        });

      const categoryIds = postCategoryRelations.map((ptc) => ptc.categoryId);
      let categoriesForPost: CategoryRecord[] = [];
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
    .mutation(async ({ input, ctx }) => {
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
