'use client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/trpc/routers/index';

export const trpc = createTRPCReact<AppRouter>();
