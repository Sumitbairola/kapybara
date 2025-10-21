import { router } from '../index';
import { postRouter } from './post';
import { categoryRouter } from './category';

/**
 * This is the primary router for your server.
 * All procedures are added here.
 */
export const appRouter = router({
  post: postRouter,      // All post-related procedures are under 'trpc.post.<procedureName>'
  category: categoryRouter, // All category-related procedures are under 'trpc.category.<procedureName>'
});

// export type definition of API
export type AppRouter = typeof appRouter;
