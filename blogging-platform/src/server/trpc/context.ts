// src/trpc/context.ts
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { db } from '../../server/db'; // Import the db instance

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  // You can add authentication/user data here later if needed
  return {
    db, // Make the Drizzle DB instance available
    // For a multi-user platform, you'd add user authentication here
    // user: null, // Placeholder for authenticated user
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
