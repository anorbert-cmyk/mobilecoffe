import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { events, businesses } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const eventRouter = router({
    create: protectedProcedure
        .input(z.object({
            businessId: z.number(),
            name: z.string().min(1),
            description: z.string().min(1),
            date: z.string().or(z.date()).transform(val => new Date(val)),
            location: z.string().min(1),
            price: z.number().min(0).default(0),
            currency: z.string().default("HUF"),
            imageUrl: z.string().optional(),
            maxAttendees: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            // Verify ownership
            const business = await db.query.businesses.findFirst({
                where: eq(businesses.id, input.businessId),
            });

            if (!business || business.ownerId !== ctx.user.id) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            await db.insert(events).values({
                ...input,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return { success: true };
        }),

    listByBusiness: publicProcedure
        .input(z.object({ businessId: z.number() }))
        .query(async ({ input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            return await db.query.events.findMany({
                where: and(
                    eq(events.businessId, input.businessId),
                    eq(events.isPublished, true)
                ),
                orderBy: [desc(events.date)]
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            const event = await db.query.events.findFirst({
                where: eq(events.id, input.id),
                with: { business: true }
            });

            if (!event || event.business.ownerId !== ctx.user.id) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            await db.delete(events).where(eq(events.id, input.id));
            return { success: true };
        }),
});
