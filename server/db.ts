import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";
import { FallbackDatabase } from "./fallbackDb";

let _db: any = null;
let isFallback = false;

async function testConnection(url: string): Promise<boolean> {
  let connection;
  try {
    connection = await mysql.createConnection(url);
    await connection.ping();
    await connection.end();
    return true;
  } catch (error) {
    console.warn("[Database] MySQL connection check failed:", error);
    if (connection) {
      try {
        await connection.end();
      } catch (_) {}
    }
    return false;
  }
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb(): Promise<any> {
  if (!_db) {
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      try {
        console.log("[Database] Testing connection to MySQL...");
        const isConnected = await testConnection(dbUrl);
        if (isConnected) {
          console.log("[Database] Connecting to MySQL using Drizzle...");
          _db = drizzle(dbUrl, { schema, mode: "default" });
          isFallback = false;
        }
      } catch (error) {
        console.warn("[Database] Failed to initialize MySQL client:", error);
        _db = null;
      }
    }
    if (!_db) {
      console.warn("[Database] MySQL not available. Using local JSON fallback database...");
      _db = new FallbackDatabase();
      isFallback = true;
    }
  }
  return _db;
}

export async function migrateDb() {
  const db = await getDb();
  if (!db) {
    console.error("[Database] Cannot migrate: database not available");
    return;
  }

  if (isFallback) {
    console.log("[Database] Fallback database active. Bypassing schema migrations.");
    return;
  }

  if (process.env.NODE_ENV === "production" || true) { // Always try to migrate for now to fix state
    try {
      console.log("[Database] Running migrations...");
      const { migrate } = await import("drizzle-orm/mysql2/migrator");
      const path = await import("path");
      const migrationsFolder = path.join(process.cwd(), "drizzle");

      await migrate(db, { migrationsFolder });
      console.log("[Database] Migrations completed successfully");
    } catch (error) {
      console.error("[Database] Migration failed:", error);
      // In production, effective schema mismatch is fatal, but we don't want to crash 
      // if it's just a lock issue or transient. Warn for now.
    }
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.
