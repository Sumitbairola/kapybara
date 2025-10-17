import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../drizzle/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Configure the PostgreSQL client with connection pooling
const queryClient = postgres(process.env.DATABASE_URL, {
  ssl: 'require', // Enable SSL for secure connections
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
});

export const db = drizzle(queryClient, { 
  schema,
  logger: process.env.NODE_ENV === 'development', // Enable query logging in development
});
