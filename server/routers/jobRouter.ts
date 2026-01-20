import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { jobListings, businesses, businessSubscriptions } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const jobRouter = router({
    create: protectedProcedure
        .input(z.object({
            title: z.string(),
            description: z.string(),
            netSalaryMin: z.number().optional(),
            netSalaryMax: z.number().optional(),
            contractType: z.enum(["full-time", "part-time", "contract", "internship", "seasonal"]),
            workingHours: z.string().optional(),
            startDate: z.string().or(z.date()).transform(val => new Date(val)).optional(),
            contactEmail: z.string().email(),
            contactPhone: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            // 1. Find the user's business
            const business = await db.query.businesses.findFirst({
                where: eq(businesses.ownerId, ctx.user.id),
                with: { subscriptions: true }
            });

            if (!business) {
                // User must have a business profile
                throw new TRPCError({
                    code: "PRECONDITION_FAILED",
                    message: "You must register a business profile first."
                });
            }

            // 2. Check Subscription & Limits
            const activeSub = business.subscriptions.find(s => s.status === 'active');
            const plan = activeSub?.plan || 'free';

            const activeJobsCount = await db.query.jobListings.findMany({
                where: and(
                    eq(jobListings.businessId, business.id),
                    eq(jobListings.status, 'active')
                )
            });

            if (plan === 'free' && activeJobsCount.length >= 1) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Free plan allows only 1 active job listing. Upgrade to Premium for more."
                });
            }

            // 3. Create the job
            await db.insert(jobListings).values({
                ...input,
                businessId: business.id, // Linked automatically
                status: "active",
                createdAt: new Date(),
            });
            return { success: true };
        }),

    listMine: protectedProcedure
        .query(async ({ ctx }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            const business = await db.query.businesses.findFirst({
                where: eq(businesses.ownerId, ctx.user.id),
            });

            if (!business) return [];

            return await db.query.jobListings.findMany({
                where: eq(jobListings.businessId, business.id),
                orderBy: (listings, { desc }) => [desc(listings.createdAt)],
            });
        }),

    list: publicProcedure
        .query(async () => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            return await db.query.jobListings.findMany({
                where: eq(jobListings.status, "active"),
                orderBy: (listings, { desc }) => [desc(listings.createdAt)],
                with: { business: true },
                limit: 50
            });
        }),

    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const db = await getDb();
            if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            return await db.query.jobListings.findFirst({
                where: eq(jobListings.id, input.id),
                with: { business: true }
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
