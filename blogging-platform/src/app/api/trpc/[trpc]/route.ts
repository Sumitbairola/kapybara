// src/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/trpc/routers'; // Correct path to your appRouter
import { createContext } from '@/server/trpc/context'; // Correct path to your createContext

const handler = (req: Request) =>
  fetchRequestHandler({
  endpoint: '/api/trpc',
  req,
  router: appRouter,
  createContext: () => createContext(),
  onError: ({ path, error }) => {
    console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
  },
});

// tRPC uses both GET and POST for queries and mutations
export { handler as GET, handler as POST };
