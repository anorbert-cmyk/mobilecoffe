import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { products, menuCategories, menuItems, businesses } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const productRouter = router({
    // --- Products (Coffee, Equipment) ---
    createProduct: protectedProcedure
        .input(z.object({
            businessId: z.number(),
            type: z.enum(["coffee", "equipment", "accessory"]),
            name: z.string(),
            price: z.number(),
            description: z.string().optional(),
            images: z.array(z.string()).optional(),
            // Coffee props
            roastLevel: z.enum(["light", "medium", "medium-dark", "dark"]).optional(),
            processMethod: z.enum(["washed", "natural", "honey", "anaerobic"]).optional(),
            origin: z.any().optional(),
            flavorNotes: z.array(z.string()).optional(),
            weight: z.number().optional(),
            roasterId: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            // Verify ownership
            const business = await db.query.businesses.findFirst({
                where: eq(businesses.id, input.businessId),
                with: { subscriptions: true }
            });
            if (!business || business.ownerId !== ctx.user.id) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            // Check Limits
            const activeSub = business.subscriptions.find(s => s.status === 'active');
            const plan = activeSub?.plan || 'free';

            if (plan === 'free') {
                const productCount = await db.query.products.findMany({
                    where: eq(products.businessId, input.businessId)
                });

                if (productCount.length >= 3) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Free plan allows only 3 products. Upgrade to Premium for unlimited."
                    });
                }
            }

            await db.insert(products).values(input);
            return { success: true };
        }),

    listProducts: publicProcedure
        .input(z.object({ businessId: z.number() }))
        .query(async ({ input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            return await db.query.products.findMany({
                where: eq(products.businessId, input.businessId)
            });
        }),

    // --- Menu ---
    createCategory: protectedProcedure
        .input(z.object({ businessId: z.number(), name: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            const business = await db.query.businesses.findFirst({
                where: eq(businesses.id, input.businessId),
            });
            if (!business || business.ownerId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });

            await db.insert(menuCategories).values(input);
            return { success: true };
        }),

    addMenuItem: protectedProcedure
        .input(z.object({
            categoryId: z.number(),
            name: z.string(),
            price: z.number(),
            description: z.string().optional(),
            isVegan: z.boolean().optional(),
            isGlutenFree: z.boolean().optional(),
            allergens: z.array(z.string()).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            // Verify ownership via category -> business
            const category = await db.query.menuCategories.findFirst({
                where: eq(menuCategories.id, input.categoryId),
                with: { business: true }
            });

            if (!category || category.business.ownerId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });

            await db.insert(menuItems).values(input);
            return { success: true };
        }),
});
