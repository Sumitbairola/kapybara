import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import superjson from "superjson"; // Recommended for tRPC to handle dates, etc.

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" &&
          error.cause &&
          typeof error.cause === "object" &&
          "data" in error.cause &&
          error.cause.data &&
          typeof error.cause.data === "object" &&
          "zodError" in error.cause.data
            ? (error.cause.data as { zodError: unknown }).zodError
            : null,
      },
    };
  },
});

/**
 * Reusable procedures
 **/
export const router = t.router;
export const publicProcedure = t.procedure;
// For later: if you implement authentication, you'd create a protectedProcedure
// export const protectedProcedure = t.procedure.use(isAuthed);
