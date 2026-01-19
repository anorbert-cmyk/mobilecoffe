import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { jobListings, businesses, businessSubscriptions } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const jobRouter = router({
    create: protectedProcedure
        .input(z.object({
            businessId: z.number(),
            title: z.string(),
            description: z.string(),
            netSalaryMin: z.number(),
            netSalaryMax: z.number(),
            contractType: z.enum(["full-time", "part-time", "contract", "internship", "seasonal"]),
            workingHours: z.string(),
            startDate: z.string().or(z.date()).transform(val => new Date(val)),
            contactEmail: z.string().email(),
            contactPhone: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            // Check ownership
            const business = await db.query.businesses.findFirst({
                where: eq(businesses.id, input.businessId),
                with: { subscriptions: true }
            });

            if (!business || business.ownerId !== ctx.user.id) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            // Check Subscription & Limits
            const activeSub = business.subscriptions.find(s => s.status === 'active');
            const plan = activeSub?.plan || 'free';

            const activeJobsCount = await db.query.jobListings.findMany({
                where: and(
                    eq(jobListings.businessId, input.businessId),
                    eq(jobListings.status, 'active')
                )
            });

            if (plan === 'free' && activeJobsCount.length >= 1) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Free plan allows only 1 active job listing. Upgrade to Premium for more."
                });
            }

            // Check Limit (5 per month)
            // simplified check for now

            await db.insert(jobListings).values({
                ...input,
                status: "active",
                createdAt: new Date(),
            });
            return { success: true };
        }),

    list: publicProcedure
        .query(async () => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            return await db.query.jobListings.findMany({
                where: eq(jobListings.status, "active"),
                orderBy: (listings, { desc }) => [desc(listings.createdAt)],
                with: { business: true }
            });
        }),

    listByBusiness: publicProcedure
        .input(z.object({ businessId: z.number() }))
        .query(async ({ input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            return await db.query.jobListings.findMany({
                where: eq(jobListings.businessId, input.businessId),
                orderBy: (listings, { desc }) => [desc(listings.createdAt)],
            });
        }),

    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            return await db.query.jobListings.findFirst({
                where: eq(jobListings.id, input.id),
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            const job = await db.query.jobListings.findFirst({
                where: eq(jobListings.id, input.id),
                with: { business: true }
            });

            if (!job || job.business.ownerId !== ctx.user.id) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            await db.delete(jobListings).where(eq(jobListings.id, input.id));
            return { success: true };
        }),

    update: protectedProcedure
        .input(z.object({
            id: z.number(),
            title: z.string().optional(),
            description: z.string().optional(),
            netSalaryMin: z.number().optional(),
            netSalaryMax: z.number().optional(),
            contractType: z.enum(["full-time", "part-time", "contract", "internship", "seasonal"]).optional(),
            workingHours: z.string().optional(),
            status: z.enum(["draft", "active", "paused", "expired", "filled"]).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            const job = await db.query.jobListings.findFirst({
                where: eq(jobListings.id, input.id),
                with: { business: true }
            });

            if (!job || job.business.ownerId !== ctx.user.id) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            const { id, ...updateData } = input;
            await db.update(jobListings).set(updateData).where(eq(jobListings.id, id));

            return { success: true };
        }),
});
