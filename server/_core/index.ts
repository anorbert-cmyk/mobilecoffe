import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Enable CORS for all routes - reflect the request origin to support credentials
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerOAuthRoutes(app);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now(), version: "fix-jwt-fallback-v2" });
  });

  // Demo login for testing (bypasses OAuth)
  app.post("/api/demo-login", async (_req, res) => {
    try {
      const { upsertUser, getDb } = await import("../db");
      const { eq } = await import("drizzle-orm");
      const { businesses, businessSubscriptions } = await import("../../drizzle/schema");
      const { sdk } = await import("./sdk");

      const demoOpenId = "demo-user-001";
      const demoName = "Demo Business User";

      const db = await getDb();
      if (!db) throw new Error("Database not initialized");

      // 1. Create or update demo user
      await upsertUser({
        openId: demoOpenId,
        name: demoName,
        email: "demo@coffeecraft.app",
        loginMethod: "demo",
        lastSignedIn: new Date(),
      });

      // Get the user ID
      const user = await db.query.users.findFirst({
        where: eq((await import("../../drizzle/schema")).users.openId, demoOpenId)
      });

      if (!user) throw new Error("Failed to create demo user");

      // 2. Check if business exists, if not create one
      let business = await db.query.businesses.findFirst({
        where: eq(businesses.ownerId, user.id)
      });

      if (!business) {
        console.log("Creating demo business...");
        await db.insert(businesses).values({
          ownerId: user.id,
          name: "Demo Coffee Roasters",
          type: "roaster",
          email: "contact@demoroasters.com",
          description: "Premium innovative specialty coffee roaster from Budapest.",
          isVerified: true,
          address: { city: "Budapest", country: "Hungary" },
          openingHours: { week: "9-5" },
          createdAt: new Date(),
        });

        business = await db.query.businesses.findFirst({
          where: eq(businesses.ownerId, user.id)
        });
      }

      // 3. Check subscription, if not create 'premium'
      if (business) {
        const sub = await db.query.businessSubscriptions.findFirst({
          where: eq(businessSubscriptions.businessId, business.id)
        });

        if (!sub) {
          console.log("Creating demo subscription...");
          await db.insert(businessSubscriptions).values({
            businessId: business.id,
            plan: "premium",
            status: "active",
            createdAt: new Date(),
          });
        }
        // 4. Seed Job Listings if empty
        if (business) {
          const jobs = await db.query.jobListings.findMany({
            where: eq((await import("../../drizzle/schema")).jobListings.businessId, business.id)
          });

          if (jobs.length === 0) {
            console.log("Seeding demo jobs...");
            const { jobListings } = await import("../../drizzle/schema");
            await db.insert(jobListings).values([
              {
                businessId: business.id,
                title: "Head Barista",
                description: "We are looking for an experienced Head Barista to lead our team. You will be responsible for QC, dialing in recipes, and training staff. Minimum 3 years specialty coffee experience required.",
                netSalaryMin: 450000,
                netSalaryMax: 550000,
                contractType: "full-time",
                workingHours: "40h/week",
                contactEmail: "jobs@demoroasters.com",
                status: "active",
                createdAt: new Date(),
              },
              {
                businessId: business.id,
                title: "Roastery Assistant",
                description: "Join our roasting team! Tasks include green coffee handling, packaging, and assisting with roast profiles. No prior roasting experience needed, but passion for coffee is a must.",
                netSalaryMin: 350000,
                netSalaryMax: 400000,
                contractType: "part-time",
                workingHours: "20h/week",
                contactEmail: "roast@demoroasters.com",
                status: "active",
                createdAt: new Date(),
              }
            ]);
          }
        }

        // 5. Seed Products if empty
        if (business) {
          const prods = await db.query.products.findMany({
            where: eq((await import("../../drizzle/schema")).products.businessId, business.id)
          });

          if (prods.length === 0) {
            console.log("Seeding demo products...");
            const { products } = await import("../../drizzle/schema");
            await db.insert(products).values([
              {
                businessId: business.id,
                type: "coffee",
                name: "Ethiopia Yirgacheffe",
                description: "Floral and citrus notes with a tea-like body. Washed process.",
                price: 4500,
                roastLevel: "light",
                processMethod: "washed",
                flavorNotes: ["Jasmine", "Bergamot", "Lemon"],
                weight: 250,
                createdAt: new Date(),
                isAvailable: true
              },
              {
                businessId: business.id,
                type: "coffee",
                name: "Colombia Pink Bourbon",
                description: "Complex acidity with red fruit sweetness. Anaerobic fermentation.",
                price: 5200,
                roastLevel: "medium",
                processMethod: "anaerobic",
                flavorNotes: ["Strawberry", "Vanilla", "Cacao"],
                weight: 250,
                createdAt: new Date(),
                isAvailable: true
              },
              {
                businessId: business.id,
                type: "equipment",
                name: "V60 Starter Kit",
                description: "Everything you need to start brewing pour-over coffee.",
                price: 12000,
                createdAt: new Date(),
                isAvailable: true
              }
            ]);
          }
        }
      }

      // Create session token
      const sessionToken = await sdk.createSessionToken(demoOpenId, { name: demoName });

      res.json({
        success: true,
        token: sessionToken,
        user: { openId: demoOpenId, name: demoName }
      });
    } catch (error) {
      console.error("[Demo Login] Error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}

startServer().catch(console.error);
