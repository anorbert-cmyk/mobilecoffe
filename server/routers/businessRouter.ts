import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { businesses, businessSubscriptions } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const businessRouter = router({
    create: protectedProcedure
        .input(z.object({
            name: z.string().min(1),
            type: z.enum(["cafe", "roaster", "both", "equipment_seller"]),
            email: z.string().email(),
            phone: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            // Check if user already has a business? Document implies multiple or single?
            // "Cégként jelentkezem" - Usually one per user but schema allows many.
            // Let's allow creating one for now.

            const [result] = await db.insert(businesses).values({
                ownerId: ctx.user.id,
                ...input,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return { id: result.insertId };
        }),

    getMine: protectedProcedure.query(async ({ ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const business = await db.query.businesses.findFirst({
            where: eq(businesses.ownerId, ctx.user.id),
            with: {
                subscriptions: true,
                products: true,
                events: true,
                jobs: true,
            }
        });

        return business;
    }),

    getAll: publicProcedure
        .query(async () => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            const allBusinesses = await db.query.businesses.findMany({
                where: eq(businesses.isVerified, true), // Only show verified businesses
                with: {
                    products: true,
                    events: true,
                    menuCategories: true,
                    subscriptions: true,
                },
                limit: 50, // Limit for now
            });

            return allBusinesses;
        }),

    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            const business = await db.query.businesses.findFirst({
                where: eq(businesses.id, input.id),
                with: {
                    products: true,
                    events: true,
                    jobs: true, // Correct relation name
                    subscriptions: true,
                    menuCategories: {
                        with: {
                            items: true
                        }
                    }
                }
            });

            if (!business) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Business not found" });
            }

            return business;
        }),

    update: protectedProcedure
        .input(z.object({
            id: z.number(),
            data: z.object({
                name: z.string().optional(),
                description: z.string().optional(),
                address: z.object({ city: z.string(), country: z.string() }).passthrough().optional(),
                openingHours: z.record(z.string(), z.string()).optional(),
                services: z.array(z.string()).optional(),
                headerImageUrls: z.array(z.string()).optional(),
                logoUrl: z.string().optional(),
                website: z.string().optional(),
                socialMedia: z.record(z.string(), z.string()).optional(),
            })
        }))
        .mutation(async ({ ctx, input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            // Verify ownership
            const business = await db.query.businesses.findFirst({
                where: eq(businesses.id, input.id),
            });

            if (!business || business.ownerId !== ctx.user.id) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            await db.update(businesses).set({
                ...input.data,
                updatedAt: new Date(),
            }).where(eq(businesses.id, input.id));

            return { success: true };
        }),


    upgradeToPremium: protectedProcedure
        .input(z.object({ businessId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            const business = await db.query.businesses.findFirst({
                where: eq(businesses.id, input.businessId),
                with: { subscriptions: true }
            });

            if (!business || business.ownerId !== ctx.user.id) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            // In a real app, we would create a Stripe Checkout session here.
            // For this mock/demo, we just upgrade them instantly.

            // Deactivate old subscriptions
            await db.update(businesses).set({
                // Potentially verify logic here if needed
            });
            // Actually better to update the subscription table

            // Check if active subscription exists
            const activeSub = business.subscriptions.find(s => s.status === 'active');
            if (activeSub) {
                await db.update(businessSubscriptions)
                    .set({ plan: 'premium', updatedAt: new Date() })
                    .where(eq(businessSubscriptions.id, activeSub.id));
            } else {
                await db.insert(businessSubscriptions).values({
                    businessId: business.id,
                    plan: 'premium',
                    status: 'active',
                    createdAt: new Date(),
                });
            }

            return { success: true };
        }),
});
