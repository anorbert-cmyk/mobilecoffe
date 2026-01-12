import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { businesses } from "../../drizzle/schema";
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
            }
        });

        return business;
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
                    menuCategories: {
                        with: {
                            items: true
                        }
                    }
                }
            });

            return business;
        }),

    update: protectedProcedure
        .input(z.object({
            id: z.number(),
            data: z.object({
                name: z.string().optional(),
                description: z.string().optional(),
                address: z.any().optional(), // typed as json in db
                openingHours: z.any().optional(),
                services: z.any().optional(),
                headerImageUrls: z.array(z.string()).optional(),
                logoUrl: z.string().optional(),
                website: z.string().optional(),
                socialMedia: z.any().optional(),
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
});
