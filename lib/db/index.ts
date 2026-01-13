import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Create the Neon connection
const sql = neon(process.env.DATABASE_URL!);

// Create the Drizzle database instance
export const db = drizzle(sql, { schema });

// Export types for use in the app
export type Database = typeof db;
