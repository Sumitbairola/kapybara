import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export default {
  schema: './drizzle/schema.ts', // Points to your schema file
  out: './drizzle/migrations',   // Where Drizzle will put migration files
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Uses your database connection string
  },
  verbose: true,
  strict: true,
} satisfies Config;
