import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

import { accountsRouter } from "~/server/api/routers/accounts";
import { categoriesRouter } from "~/server/api/routers/categories";
import { exampleRouter } from "~/server/api/routers/example";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  accounts: accountsRouter,
  categories: categoriesRouter,
  example: exampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
