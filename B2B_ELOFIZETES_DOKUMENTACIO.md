# Coffee Craft - B2B Előfizetési Rendszer

**Verzió:** v31  
**Dátum:** 2026. január 12.  
**Szerző:** Manus AI

---

## Tartalomjegyzék

1. [Előfizetési Szintek Áttekintése](#1-előfizetési-szintek-áttekintése)
2. [Ingyenes Csomag Részletei](#2-ingyenes-csomag-részletei)
3. [Prémium Csomag Részletei](#3-prémium-csomag-részletei)
4. [Kiemelési Rendszer és Árazás](#4-kiemelési-rendszer-és-árazás)
5. [Álláshirdetés (Job Board) Rendszer](#5-álláshirdetés-job-board-rendszer)
6. [Statisztikák és Analitika](#6-statisztikák-és-analitika)
7. [Fizetési Folyamat](#7-fizetési-folyamat)
8. [Technikai Implementáció](#8-technikai-implementáció)

---

## 1. Előfizetési Szintek Áttekintése

### 1.1 Csomag Összehasonlító Táblázat

| Funkció | Ingyenes | Prémium | Prémium+ (Jövőbeli) |
|---------|----------|---------|---------------------|
| **Havi díj** | 0 Ft | 9.900 Ft | 24.900 Ft |
| **Éves díj (20% kedvezmény)** | 0 Ft | 95.000 Ft | 239.000 Ft |
| | | | |
| **PROFIL ÉS MEGJELENÉS** | | | |
| Alapadatok (név, cím, telefon) | ✅ | ✅ | ✅ |
| Nyitvatartás | ✅ | ✅ | ✅ |
| Header kép | 1 db | 5 db (galéria) | 10 db + videó |
| Logó megjelenítés | ✅ | ✅ | ✅ |
| Leírás hossza | 500 karakter | 2000 karakter | Korlátlan |
| Social media linkek | ❌ | ✅ | ✅ |
| Weboldal link | ❌ | ✅ | ✅ |
| | | | |
| **MENÜ ÉS TERMÉKEK** | | | |
| Menü feltöltés | Max 20 tétel | Korlátlan | Korlátlan |
| Kávék feltöltése | Max 5 db | Korlátlan | Korlátlan |
| Termék képek | 1 kép/termék | 5 kép/termék | 10 kép/termék |
| Kávégépek/kiegészítők | ❌ | Max 20 db | Korlátlan |
| Termék videók | ❌ | ❌ | ✅ |
| | | | |
| **ÁLLÁSHIRDETÉS (JOB BOARD)** | | | |
| Álláshirdetés | ❌ | 5 db/hó | 15 db/hó |
| Hirdetés időtartam | - | 30 nap | 60 nap |
| Kiemelt álláshirdetés | ❌ | ❌ | 3 db/hó |
| Jelentkezők kezelése | ❌ | ✅ | ✅ + CRM |
| | | | |
| **KIEMELÉS ÉS PROMÓCIÓ** | | | |
| Termék kiemelés | ❌ | ✅ (külön díj) | 5 ingyenes/hó |
| Keresési prioritás | Alap | +20% boost | +50% boost |
| "Kiemelt partner" badge | ❌ | ❌ | ✅ |
| Heti hírlevelben megjelenés | ❌ | ❌ | ✅ |
| | | | |
| **STATISZTIKÁK** | | | |
| Profil megtekintések | ✅ (összesített) | ✅ (napi bontás) | ✅ (óránkénti) |
| Termék kattintások | ❌ | ✅ | ✅ |
| Konverziós adatok | ❌ | ✅ | ✅ + A/B teszt |
| Exportálás (CSV/PDF) | ❌ | ✅ | ✅ |
| | | | |
| **TÁMOGATÁS** | | | |
| Email támogatás | 72 óra válaszidő | 24 óra válaszidő | 4 óra válaszidő |
| Chat támogatás | ❌ | ❌ | ✅ |
| Dedikált account manager | ❌ | ❌ | ✅ |

---

## 2. Ingyenes Csomag Részletei

### 2.1 Ki Számára Ajánlott?

Az ingyenes csomag ideális:
- Újonnan nyíló kávézóknak, akik szeretnék kipróbálni a platformot
- Kis forgalmú, családi vállalkozásoknak
- Pörkölőknek, akik csak alapszintű jelenlétet szeretnének

### 2.2 Funkciók Részletezése

#### 2.2.1 Profil Beállítások

| Mező | Limit | Megjegyzés |
|------|-------|------------|
| Kávézó neve | 100 karakter | Kötelező |
| Cím | 200 karakter | Kötelező |
| Telefonszám | 1 db | Kötelező |
| Email | 1 db | Kötelező |
| Leírás | 500 karakter | Rövid bemutatkozás |
| Header kép | 1 db, max 5MB | JPG/PNG/WebP |
| Logó | 1 db, max 2MB | Négyzet formátum ajánlott |

#### 2.2.2 Menü Feltöltés

```typescript
interface FreeMenuLimits {
  maxItems: 20;
  maxCategories: 5;
  imagePerItem: 1;
  maxImageSize: '2MB';
  allowedFormats: ['jpg', 'png', 'webp'];
}
```

**Elérhető kategóriák:**
- Kávé italok (espresso, cappuccino, latte stb.)
- Tea
- Üdítők
- Sütemények
- Egyéb

#### 2.2.3 Kávé Termékek

Maximum **5 kávé termék** tölthető fel az alábbi mezőkkel:

| Mező | Kötelező | Leírás |
|------|----------|--------|
| Név | ✅ | Termék neve |
| Pörkölési szint | ✅ | Világos/Közép/Sötét |
| Eredet | ✅ | Ország |
| Ár | ✅ | HUF-ban |
| Leírás | ❌ | Max 200 karakter |
| Kép | ❌ | 1 db, max 2MB |

### 2.3 Korlátozások

> **FONTOS:** Az ingyenes csomagban a következő funkciók NEM elérhetők:
> - Álláshirdetés
> - Termék kiemelés
> - Részletes statisztikák
> - Kávégépek/kiegészítők értékesítése
> - Social media és weboldal linkek

---

## 3. Prémium Csomag Részletei

### 3.1 Ki Számára Ajánlott?

A Prémium csomag ideális:
- Aktívan növekvő kávézóknak
- Specialty kávézóknak, akik széles kínálatot szeretnének bemutatni
- Pörkölőknek, akik online is értékesítenek
- Munkaerőt kereső vállalkozásoknak

### 3.2 Árazás és Számlázás

| Időszak | Ár | Megtakarítás |
|---------|-----|--------------|
| Havi | 9.900 Ft/hó | - |
| Negyedéves | 8.900 Ft/hó | 10% |
| Féléves | 8.400 Ft/hó | 15% |
| Éves | 7.900 Ft/hó | 20% |

**Fizetési módok:**
- Bankkártya (Visa, Mastercard)
- Apple Pay / Google Pay
- Banki átutalás (csak éves előfizetésnél)
- Stripe előfizetés

### 3.3 Funkciók Részletezése

#### 3.3.1 Korlátlan Termékfeltöltés

```typescript
interface PremiumProductLimits {
  coffeeProducts: 'unlimited';
  menuItems: 'unlimited';
  equipmentProducts: 20;
  imagesPerProduct: 5;
  maxImageSize: '10MB';
  videoSupport: false;
}
```

#### 3.3.2 Galéria és Média

| Típus | Limit | Specifikáció |
|-------|-------|--------------|
| Header képek | 5 db | Min 1920x600px, max 10MB |
| Termék képek | 5/termék | Min 800x800px, max 10MB |
| Logó | 1 db | Min 512x512px, max 5MB |
| Menü PDF | 1 db | Max 20MB |

#### 3.3.3 Bővített Profil

| Mező | Limit |
|------|-------|
| Leírás | 2000 karakter |
| Social media | Instagram, Facebook, TikTok |
| Weboldal | 1 URL |
| Foglalási link | 1 URL (pl. Booksy, Reservio) |

### 3.4 Álláshirdetés Funkció

A Prémium csomag tartalmazza a **Job Board** hozzáférést:

| Paraméter | Érték |
|-----------|-------|
| Hirdetések száma | 5 db/hónap |
| Hirdetés időtartama | 30 nap |
| Meghosszabbítás | +1.500 Ft/30 nap |
| Kiemelt hirdetés | +2.500 Ft/hirdetés |

**Álláshirdetés mezők:**

```typescript
interface JobListing {
  // Kötelező mezők
  title: string;                    // Pozíció neve
  netSalaryMin: number;             // Minimum nettó bér
  netSalaryMax: number;             // Maximum nettó bér
  contractType: ContractType;       // Szerződés típusa
  workingHours: string;             // Munkaidő
  startDate: Date;                  // Kezdés dátuma
  description: string;              // Leírás (min 100 karakter)
  contactEmail: string;             // Kapcsolattartó email
  
  // Opcionális mezők
  contactName?: string;             // Kapcsolattartó neve
  contactPhone?: string;            // Telefonszám
  requirements?: string[];          // Követelmények
  benefits?: string[];              // Juttatások
  location?: 'onsite' | 'hybrid' | 'remote';
}

type ContractType = 
  | 'full-time'      // Teljes munkaidő
  | 'part-time'      // Részmunkaidő
  | 'contract'       // Megbízási szerződés
  | 'internship'     // Gyakornoki pozíció
  | 'seasonal';      // Szezonális
```

### 3.5 Statisztikák

A Prémium előfizetők részletes analitikát kapnak:

| Metrika | Leírás | Frissítés |
|---------|--------|-----------|
| Profil megtekintések | Napi bontásban | Valós idejű |
| Egyedi látogatók | Deduplikált | Napi |
| Termék kattintások | Termékenként | Valós idejű |
| Menü letöltések | PDF letöltések száma | Napi |
| Álláshirdetés megtekintések | Hirdetésenként | Valós idejű |
| Jelentkezések | Állásonként | Valós idejű |
| Konverziós arány | Megtekintés → akció | Heti |

**Dashboard elemek:**

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Heti Összesítő                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Profil megtekintések    ████████████░░░░  1,247 (+12%)    │
│  Termék kattintások      ██████████░░░░░░    892 (+8%)     │
│  Álláshirdetés nézetek   ████░░░░░░░░░░░░    156 (-3%)     │
│  Jelentkezések           ██░░░░░░░░░░░░░░     12 (+50%)    │
│                                                             │
│  📈 Legnépszerűbb termékek:                                 │
│  1. Ethiopia Yirgacheffe - 234 kattintás                   │
│  2. Colombia Huila - 189 kattintás                         │
│  3. Brazil Santos - 156 kattintás                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Kiemelési Rendszer és Árazás

### 4.1 Kiemelés Típusok

A Prémium előfizetők külön díj ellenében kiemelhetik termékeiket:

| Típus | Leírás | Napi ár | Heti ár | Havi ár |
|-------|--------|---------|---------|---------|
| **Egyedi termék** | 1 konkrét termék | 500 Ft | 2.500 Ft | 8.000 Ft |
| **Kategória** | Pl. összes világos pörkölés | 1.500 Ft | 7.500 Ft | 25.000 Ft |
| **Összes termék** | Minden termék kiemelése | 3.000 Ft | 15.000 Ft | 50.000 Ft |

### 4.2 Kiemelés Működése

#### 4.2.1 Relevancia Szabály

> **KRITIKUS:** A kiemelt termékek CSAK akkor jelennek meg, ha megfelelnek a felhasználó keresési feltételeinek. A kiemelés NEM írja felül a relevancia szűrőket.

**Példa:**
- Felhasználó keres: "világos pörkölésű etióp kávé"
- Kiemelt termék: "Brazil Santos - sötét pörkölés" → NEM jelenik meg
- Kiemelt termék: "Ethiopia Sidamo - világos pörkölés" → MEGJELENIK "Kiemelt" badge-dzsel

#### 4.2.2 Megjelenítési Sorrend

```
1. Kiemelt + Releváns termékek (Promoted badge)
2. Normál releváns termékek (relevancia szerint)
3. Kevésbé releváns termékek
```

#### 4.2.3 Kiemelés Beállítása

```typescript
interface ProductPromotion {
  id: string;
  businessId: string;
  
  // Kiemelés típusa
  type: 'single' | 'category' | 'all';
  
  // Ha single típus
  productIds?: string[];
  
  // Ha category típus
  categoryFilter?: {
    roastLevel?: 'light' | 'medium' | 'dark';
    origin?: string;
    processMethod?: 'washed' | 'natural' | 'honey';
  };
  
  // Időszak
  startDate: Date;
  endDate: Date;
  
  // Budget
  dailyBudget?: number;        // Napi költségkeret
  totalBudget: number;         // Teljes költségkeret
  
  // Statisztikák
  impressions: number;         // Megjelenések
  clicks: number;              // Kattintások
  spent: number;               // Elköltött összeg
  
  // Státusz
  status: 'active' | 'paused' | 'exhausted' | 'expired';
}
```

### 4.3 Kiemelés ROI Kalkulátor

A rendszer automatikusan számolja a kiemelés megtérülését:

| Metrika | Számítás |
|---------|----------|
| CPM (Cost per Mille) | (Költség / Megjelenések) × 1000 |
| CPC (Cost per Click) | Költség / Kattintások |
| CTR (Click-through Rate) | (Kattintások / Megjelenések) × 100% |
| Konverziós arány | (Vásárlások / Kattintások) × 100% |

---

## 5. Álláshirdetés (Job Board) Rendszer

### 5.1 Álláshirdetés Létrehozása

#### Lépések:

1. **Pozíció kiválasztása** - Előre definiált vagy egyedi
2. **Alapadatok megadása** - Bér, szerződés, munkaidő
3. **Leírás írása** - Min. 100 karakter
4. **Követelmények** - Opcionális lista
5. **Elérhetőség** - Email kötelező, telefon opcionális
6. **Előnézet és publikálás**

#### Előre Definiált Pozíciók:

| Kategória | Pozíciók |
|-----------|----------|
| **Kiszolgálás** | Barista, Felszolgáló, Pincér, Hostess |
| **Konyha** | Szakács, Cukrász, Konyhai kisegítő, Mosogató |
| **Menedzsment** | Üzletvezető, Műszakvezető, Raktáros |
| **Egyéb** | Takarító, Karbantartó, Futár |

### 5.2 Álláshirdetés Életciklusa

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Vázlat  │ ──▶ │ Aktív   │ ──▶ │ Lejárt  │ ──▶ │ Archív  │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
                    │
                    ▼
               ┌─────────┐
               │ Betöltve│
               └─────────┘
```

### 5.3 Jelentkezések Kezelése

A Prémium előfizetők kezelhetik a beérkező jelentkezéseket:

```typescript
interface JobApplication {
  id: string;
  jobId: string;
  
  // Jelentkező adatai
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  coverLetter?: string;
  cvUrl?: string;
  
  // Státusz
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  
  // Időbélyegek
  appliedAt: Date;
  reviewedAt?: Date;
  
  // Belső jegyzetek
  internalNotes?: string;
}
```

---

## 6. Statisztikák és Analitika

### 6.1 Ingyenes vs Prémium Statisztikák

| Metrika | Ingyenes | Prémium |
|---------|----------|---------|
| Profil megtekintések | Összesített szám | Napi/heti/havi bontás |
| Időszak | Utolsó 30 nap | Utolsó 12 hónap |
| Termék statisztikák | ❌ | ✅ |
| Exportálás | ❌ | CSV, PDF |
| Összehasonlítás | ❌ | Előző időszakkal |
| Heatmap | ❌ | Látogatási csúcsidők |

### 6.2 Prémium Dashboard Elemek

#### 6.2.1 Áttekintő Kártyák

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 👁️ Nézetek   │  │ 👆 Kattintás │  │ 💼 Jelentkező│  │ ⭐ Értékelés │
│    1,247     │  │     892      │  │      12      │  │    4.8/5     │
│   +12% ▲     │  │    +8% ▲     │  │   +50% ▲     │  │   +0.2 ▲     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

#### 6.2.2 Grafikonok

- **Vonaldiagram:** Napi megtekintések trendje
- **Oszlopdiagram:** Legnépszerűbb termékek
- **Kördiagram:** Látogatók forrása (keresés, közvetlen, ajánlás)
- **Heatmap:** Heti látogatási mintázat (nap × óra)

### 6.3 Exportálási Formátumok

| Formátum | Tartalom |
|----------|----------|
| **CSV** | Nyers adatok, Excel-kompatibilis |
| **PDF** | Formázott jelentés, grafikonokkal |
| **JSON** | API integráció, automatizálás |

---

## 7. Fizetési Folyamat

### 7.1 Stripe Integráció

A fizetések Stripe-on keresztül történnek:

```typescript
interface SubscriptionPayment {
  // Stripe azonosítók
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  
  // Előfizetés részletei
  plan: 'free' | 'premium' | 'premium_plus';
  billingCycle: 'monthly' | 'quarterly' | 'biannual' | 'annual';
  
  // Összegek
  amount: number;
  currency: 'HUF';
  
  // Státusz
  status: 'active' | 'past_due' | 'canceled' | 'unpaid';
  
  // Dátumok
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}
```

### 7.2 Fizetési Módok

| Mód | Támogatott | Megjegyzés |
|-----|------------|------------|
| Bankkártya | ✅ | Visa, Mastercard, Amex |
| Apple Pay | ✅ | iOS eszközökön |
| Google Pay | ✅ | Android eszközökön |
| Banki átutalás | ✅ | Csak éves előfizetésnél |
| PayPal | ❌ | Nem támogatott |

### 7.3 Számlázás

- **Automatikus számlázás:** Minden fizetésről automatikus számla
- **NAV kompatibilis:** Online számla beküldés
- **Email értesítés:** Számla küldése emailben

### 7.4 Lemondás és Visszatérítés

| Időszak | Visszatérítés |
|---------|---------------|
| 14 napon belül | 100% (EU fogyasztóvédelmi jog) |
| 14-30 nap | 50% (arányos) |
| 30 nap után | Nincs visszatérítés |

> **Megjegyzés:** Lemondás esetén az előfizetés a számlázási időszak végéig aktív marad.

---

## 8. Technikai Implementáció

### 8.1 Adatbázis Séma

```sql
-- Előfizetések tábla
CREATE TABLE business_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  plan VARCHAR(20) NOT NULL DEFAULT 'free',
  billing_cycle VARCHAR(20),
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Álláshirdetések tábla
CREATE TABLE job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  net_salary_min INTEGER NOT NULL,
  net_salary_max INTEGER NOT NULL,
  contract_type VARCHAR(20) NOT NULL,
  working_hours VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_name VARCHAR(100),
  contact_phone VARCHAR(20),
  requirements JSONB,
  benefits JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  is_promoted BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  filled_at TIMESTAMP
);

-- Termék kiemelések tábla
CREATE TABLE product_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  promotion_type VARCHAR(20) NOT NULL,
  product_ids UUID[],
  category_filter JSONB,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  daily_budget INTEGER,
  total_budget INTEGER NOT NULL,
  spent INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 8.2 API Endpoint-ok

```typescript
// Előfizetés kezelés
POST   /api/business/subscription/create
GET    /api/business/subscription/current
PUT    /api/business/subscription/upgrade
DELETE /api/business/subscription/cancel

// Álláshirdetések
POST   /api/business/jobs
GET    /api/business/jobs
GET    /api/business/jobs/:id
PUT    /api/business/jobs/:id
DELETE /api/business/jobs/:id
GET    /api/business/jobs/:id/applications

// Kiemelések
POST   /api/business/promotions
GET    /api/business/promotions
PUT    /api/business/promotions/:id
DELETE /api/business/promotions/:id
GET    /api/business/promotions/:id/stats

// Statisztikák
GET    /api/business/analytics/overview
GET    /api/business/analytics/products
GET    /api/business/analytics/jobs
GET    /api/business/analytics/export
```

### 8.3 Webhook-ok

```typescript
// Stripe webhook események
interface StripeWebhookEvents {
  'customer.subscription.created': () => void;
  'customer.subscription.updated': () => void;
  'customer.subscription.deleted': () => void;
  'invoice.payment_succeeded': () => void;
  'invoice.payment_failed': () => void;
}
```

---

## Összefoglaló

A B2B előfizetési rendszer három szintből áll:

1. **Ingyenes** - Alapszintű jelenlét, korlátozott funkciók
2. **Prémium (9.900 Ft/hó)** - Teljes funkcionalitás, Job Board, statisztikák
3. **Prémium+ (24.900 Ft/hó)** - Jövőbeli, enterprise szintű funkciók

A rendszer Stripe integrációval működik, automatikus számlázással és NAV-kompatibilis számlákkal.

---

**Készítette:** Manus AI  
**Projekt:** Coffee Craft v31  
**Utolsó frissítés:** 2026. január 12.
