import { eq } from "drizzle-orm";
import { getDb, upsertUser } from "../db";
import {
    users,
    businesses,
    businessSubscriptions,
    jobListings,
    products,
    events
} from "../../drizzle/schema";
import { sdk } from "../_core/sdk";

export async function seedDemoData() {
    const demoOpenId = "demo-user-001";
    const demoName = "Demo Business User";
    const demoEmail = "demo@coffeecraft.app";

    const db = await getDb();
    if (!db) throw new Error("Database not initialized");

    console.log("[DemoSeeder] Starting seed process...");

    // 1. Create or update demo user
    await upsertUser({
        openId: demoOpenId,
        name: demoName,
        email: demoEmail,
        loginMethod: "demo",
        lastSignedIn: new Date(),
    });

    const user = await db.query.users.findFirst({
        where: eq(users.openId, demoOpenId)
    });

    if (!user) throw new Error("Failed to create demo user");

    // 2. Check/Create Business Profile
    let business = await db.query.businesses.findFirst({
        where: eq(businesses.ownerId, user.id)
    });

    if (!business) {
        console.log("[DemoSeeder] Creating premium business profile...");
        await db.insert(businesses).values({
            ownerId: user.id,
            name: "Kávé Műhely",
            type: "roaster",
            email: "info@kavemuhely.hu",
            phone: "+36 30 123 4567",
            description: "Budapest szívében található kézműves pörkölő és oktatóközpont. Célunk a specialty kávé kultúra népszerűsítése és a legmagasabb minőségű dűlőszelektált tételek bemutatása.",
            isVerified: true,
            address: {
                street: "Bartók Béla út 12.",
                city: "Budapest",
                postalCode: "1111",
                country: "Hungary"
            },
            openingHours: {
                week: "H-P: 08:00 - 18:00",
                weekend: "Szo-V: 09:00 - 16:00"
            },
            socialMedia: {
                instagram: "@kavemuhely",
                facebook: "KaveMuhelyBP"
            },
            services: {
                wifi: true,
                terrace: true,
                specialty: true,
                oatMilk: true
            },
            createdAt: new Date(),
        });

        business = await db.query.businesses.findFirst({
            where: eq(businesses.ownerId, user.id)
        });
    }

    if (!business) throw new Error("Failed to create business");

    // 3. Ensure Premium Subscription
    const sub = await db.query.businessSubscriptions.findFirst({
        where: eq(businessSubscriptions.businessId, business.id)
    });

    if (!sub) {
        console.log("[DemoSeeder] Activating premium subscription...");
        await db.insert(businessSubscriptions).values({
            businessId: business.id,
            plan: "premium",
            status: "active",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            createdAt: new Date(),
        });
    }

    // 4. Seed Products (if empty)
    const existingProducts = await db.query.products.findMany({
        where: eq(products.businessId, business.id)
    });

    if (existingProducts.length === 0) {
        console.log("[DemoSeeder] Seeding products...");
        await db.insert(products).values([
            {
                businessId: business.id,
                type: "coffee",
                name: "Ethiopia Yirgacheffe Halo Beriti",
                description: "Világos pörkölésű, mosott feldolgozású kávé különlegesség. Jázminos illat, bergamott és citromhéj ízjegyekkel.",
                price: 4800,
                currency: "HUF",
                roastLevel: "light",
                processMethod: "washed",
                origin: { country: "Ethiopia", region: "Gedeo", farm: "Halo Beriti Coop" },
                flavorNotes: ["Jasmine", "Bergamot", "Lemon Zest", "Black Tea"],
                weight: 250,
                isAvailable: true,
                createdAt: new Date(),
            },
            {
                businessId: business.id,
                type: "coffee",
                name: "Colombia Pink Bourbon",
                description: "Anaerob fermentált tétel. Intenzív gyümölcsösség, eper és trópusi gyümölcsök dominálnak.",
                price: 6500,
                currency: "HUF",
                roastLevel: "medium",
                processMethod: "anaerobic",
                origin: { country: "Colombia", region: "Huila", farm: "Finca El Paraiso" },
                flavorNotes: ["Strawberry", "Papaya", "Dark Chocolate"],
                weight: 200,
                isAvailable: true,
                createdAt: new Date(),
            },
            {
                businessId: business.id,
                type: "coffee",
                name: "Brasil Cerrado Mineiro",
                description: "Klasszikus profil, csokoládés-mogyorós ízvilág, alacsony savasság. Eszpresszónak tökéletes.",
                price: 3900,
                currency: "HUF",
                roastLevel: "medium-dark",
                processMethod: "natural",
                origin: { country: "Brazil", region: "Cerrado", farm: "Daterra" },
                flavorNotes: ["Hazelnut", "Milk Chocolate", "Caramel"],
                weight: 1000,
                isAvailable: true,
                createdAt: new Date(),
            },
            {
                businessId: business.id,
                type: "equipment",
                name: "Hario V60 Starter Kit",
                description: "Minden ami a filterkávé készítéshez kell: 02-es műanyag tölcsér, üveg kiöntő, 100db papír.",
                price: 12500,
                currency: "HUF",
                isAvailable: true,
                createdAt: new Date(),
            },
            {
                businessId: business.id,
                type: "equipment",
                name: "Comandante C40 MK4",
                description: "A világ legjobb kéziőrlője. Nitro Blade kések, precíz őrlésbeállítás.",
                price: 110000,
                currency: "HUF",
                isAvailable: true, // Out of stock simulation could be fun but keep simple
                createdAt: new Date(),
            }
        ]);
    }

    // 5. Seed Events
    const existingEvents = await db.query.events.findMany({
        where: eq(events.businessId, business.id)
    });

    if (existingEvents.length === 0) {
        console.log("[DemoSeeder] Seeding events...");
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(17, 0, 0, 0);

        const nextMonth = new Date();
        nextMonth.setDate(nextMonth.getDate() + 25);
        nextMonth.setHours(9, 0, 0, 0);

        await db.insert(events).values([
            {
                businessId: business.id,
                name: "Community Cupping - Africa",
                description: "Nyílt kóstoló eseményünkön most Kelet-Afrika legizgalmasabb kávéit kóstoljuk végig. Etiópia, Kenya és Ruanda legjobbjai.",
                date: nextWeek,
                location: "Kávé Műhely - Showroom",
                price: 0, // Free
                maxAttendees: 15,
                isPublished: true,
                createdAt: new Date(),
            },
            {
                businessId: business.id,
                name: "Home Barista Workshop",
                description: "Szeretnél otthon is kávéházi minőséget készíteni? Ezen a 4 órás kurzuson megtanulod az őrlő beállítását, a tömörítést és a tejhabosítást.",
                date: nextMonth,
                location: "Kávé Műhely - Training Lab",
                price: 35000,
                currency: "HUF",
                maxAttendees: 6,
                isPublished: true,
                createdAt: new Date(),
            }
        ]);
    }

    // 6. Seed Jobs
    const existingJobs = await db.query.jobListings.findMany({
        where: eq(jobListings.businessId, business.id)
    });

    if (existingJobs.length === 0) {
        console.log("[DemoSeeder] Seeding jobs...");
        await db.insert(jobListings).values([
            {
                businessId: business.id,
                title: "Head Barista",
                description: "Keressük szakmailag elhivatott vezető baristákunkat. Feladatok: pult vezetése, QC, új baristák betanítása, rendelések kezelése.",
                netSalaryMin: 500000,
                netSalaryMax: 650000,
                contractType: "full-time",
                workingHours: "40 óra/hét",
                contactEmail: "karrier@kavemuhely.hu",
                status: "active",
                createdAt: new Date(),
            },
            {
                businessId: business.id,
                title: "Pörkölősegéd",
                description: "Érdekel a kávépörkölés világa? Csatlakozz hozzánk! Feladatok: zöldkávé mozgatása, pörkölőgép tisztítása, csomagolás, minták előkészítése.",
                netSalaryMin: 350000,
                netSalaryMax: 400000,
                contractType: "part-time",
                workingHours: "20 óra/hét",
                contactEmail: "porkoles@kavemuhely.hu",
                status: "active",
                createdAt: new Date(),
            }
        ]);
    }

    // Generate token
    const sessionToken = await sdk.createSessionToken(demoOpenId, { name: demoName });

    return {
        success: true,
        token: sessionToken,
        user: { openId: demoOpenId, name: demoName }
    };
}
