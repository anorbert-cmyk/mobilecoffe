# Coffee Craft - Fejlesztési Dokumentáció

**Verzió:** v31  
**Dátum:** 2026. január 12.  
**Szerző:** Manus AI

---

## Tartalomjegyzék

1. [Kávézó Részletes Oldal](#1-kávézó-részletes-oldal)
2. [B2B Platform - Céges Felhasználók](#2-b2b-platform---céges-felhasználók)
3. [Álláshirdetés Rendszer (Job Board)](#3-álláshirdetés-rendszer-job-board)
4. [Termék Katalógus és Kiemelés](#4-termék-katalógus-és-kiemelés)
5. [Pörkölő Adatbázis](#5-pörkölő-adatbázis)
6. [Előfizetési Csomagok (B2B)](#6-előfizetési-csomagok-b2b)
7. [GitHub Feltöltés Útmutató](#7-github-feltöltés-útmutató)

---

## 1. Kávézó Részletes Oldal

### 1.1 Áttekintés

A kávézó részletes oldala egy dedikált képernyő, ahol a felhasználók megtekinthetik egy adott kávézó teljes információit. Ez az oldal szolgál a B2C (felhasználó → kávézó) és B2B (kávézó → felhasználó) kapcsolat fő interfészeként.

### 1.2 Kötelező Elemek

| Szekció | Leírás | Adattípus |
|---------|--------|-----------|
| **Header Kép** | Nagy, látványos kép a kávézóról (min. 1920x600px) | URL/Asset |
| **Alapadatok** | Név, cím, telefonszám, email, weboldal | String |
| **Nyitvatartás** | Hétfő-Vasárnap nyitás/zárás időpontok | Object |
| **Menü** | Italok, ételek, árak kategóriánként | Array |
| **Kávék** | Elérhető kávéfajták részletes leírással | Array |
| **Szolgáltatások** | Reggeli, menü, alkohol, WiFi, kutyabarát stb. | Boolean flags |
| **Térkép** | Interaktív térkép a helyszínnel | Coordinates |

### 1.3 Header Kép Specifikáció

A header képnek a következő követelményeknek kell megfelelnie:

- **Méret:** Minimum 1920x600 pixel, 16:5 képarány
- **Formátum:** JPEG vagy WebP (optimalizált)
- **Tartalom:** A kávézó belső tere, homlokzata, vagy jellegzetes eleme
- **Fallback:** Ha nincs kép, egy placeholder gradient + kávézó neve

### 1.4 Menü Struktúra

```typescript
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: 'HUF' | 'EUR';
  category: 'coffee' | 'tea' | 'food' | 'breakfast' | 'alcohol' | 'other';
  isVegan?: boolean;
  isGlutenFree?: boolean;
  allergens?: string[];
  image?: string;
}

interface CafeMenu {
  categories: {
    id: string;
    name: string;
    items: MenuItem[];
  }[];
  hasBreakfast: boolean;
  hasDailyMenu: boolean;
  hasAlcohol: boolean;
}
```

### 1.5 Nyitvatartás Struktúra

```typescript
interface OpeningHours {
  monday: { open: string; close: string; isClosed: boolean };
  tuesday: { open: string; close: string; isClosed: boolean };
  wednesday: { open: string; close: string; isClosed: boolean };
  thursday: { open: string; close: string; isClosed: boolean };
  friday: { open: string; close: string; isClosed: boolean };
  saturday: { open: string; close: string; isClosed: boolean };
  sunday: { open: string; close: string; isClosed: boolean };
  specialHours?: {
    date: string;
    open: string;
    close: string;
    note?: string;
  }[];
}
```

### 1.6 Szolgáltatások Badge-ek

| Badge | Ikon | Leírás |
|-------|------|--------|
| Reggeli | 🍳 | Reggeli menü elérhető |
| Napi menü | 🍽️ | Napi menü elérhető |
| Alkohol | 🍷 | Alkoholos italok elérhetők |
| WiFi | 📶 | Ingyenes WiFi |
| Kutyabarát | 🐕 | Kutyák beengedve |
| Terasz | ☀️ | Terasz/kültéri ülőhely |
| Parkolás | 🅿️ | Parkolási lehetőség |
| Akadálymentes | ♿ | Akadálymentes bejárat |

### 1.7 "Munkát Keresünk" Szekció (Opcionális/Statikus)

Ha a kávézó aktívan keres munkaerőt, egy külön szekció jelenik meg:

```typescript
interface JobListing {
  id: string;
  title: string; // pl. "Barista", "Konyhai kisegítő"
  description: string;
  netSalary: { min: number; max: number; currency: 'HUF' };
  contractType: 'full-time' | 'part-time' | 'contract' | 'internship';
  startDate: string;
  workingHours: string; // pl. "Heti 40 óra"
  requirements: string[];
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
}
```

**Megjegyzés:** Ez a funkció jelenleg statikus placeholder-ként kerül implementálásra. A teljes Job Board funkció a B2B platform részét képezi (lásd 3. fejezet).

---

## 2. B2B Platform - Céges Felhasználók

### 2.1 Regisztráció és Bejelentkezés

Az alkalmazás indításakor a felhasználó választhat:

| Opció | Leírás |
|-------|--------|
| **Felhasználóként folytatom** | Normál B2C felhasználói élmény |
| **Cégként jelentkezem** | B2B platform, kávézó/pörkölő tulajdonosoknak |

### 2.2 Céges Bejelentkezési Módok

1. **Apple Sign-In** - iOS natív integráció
2. **Google Sign-In** - OAuth 2.0
3. **Email + Jelszó** - Hagyományos regisztráció

### 2.3 Céges Profil Adatok

```typescript
interface BusinessProfile {
  id: string;
  businessName: string;
  businessType: 'cafe' | 'roaster' | 'both' | 'equipment_seller';
  taxNumber: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contact: {
    ownerName: string;
    email: string;
    phone: string;
  };
  subscription: 'free' | 'premium';
  createdAt: string;
  verifiedAt?: string;
}
```

---

## 3. Álláshirdetés Rendszer (Job Board)

### 3.1 Funkció Leírás

A Job Board funkció **csak Premium előfizetéssel** érhető el. Havonta maximum **5 álláshirdetés** tölthető fel.

### 3.2 Álláshirdetés Mezők

| Mező | Típus | Kötelező | Leírás |
|------|-------|----------|--------|
| Pozíció neve | String | ✅ | pl. "Barista", "Szakács" |
| Nettó bér | Number range | ✅ | Min-max nettó bér HUF-ban |
| Szerződés típusa | Enum | ✅ | Teljes/részmunkaidő/megbízás/gyakornok |
| Kezdés időpontja | Date | ✅ | Mikor kezdődne a munka |
| Elvárt munkaidő | String | ✅ | pl. "Heti 40 óra, műszakban" |
| Leírás | Text | ✅ | Részletes munkakör leírás |
| Követelmények | Array | ❌ | Elvárások listája |
| Elérhetőség | Object | ✅ | Kapcsolattartó neve, email, telefon |

### 3.3 Álláshirdetés Státuszok

```typescript
type JobStatus = 
  | 'draft'      // Piszkozat
  | 'pending'    // Jóváhagyásra vár
  | 'active'     // Aktív, látható
  | 'paused'     // Szüneteltetve
  | 'expired'    // Lejárt
  | 'filled';    // Betöltve
```

### 3.4 Implementációs Lépések

1. **Adatbázis séma létrehozása** - `job_listings` tábla
2. **API endpoint-ok** - CRUD műveletek álláshirdetésekhez
3. **Admin felület** - Álláshirdetések kezelése
4. **Felhasználói nézet** - Álláshirdetések böngészése
5. **Szűrők** - Pozíció, hely, bér, szerződés típus szerint
6. **Értesítések** - Email értesítés új hirdetésekről

---

## 4. Termék Katalógus és Kiemelés

### 4.1 Termék Típusok

A cégek a következő termékeket tölthetik fel:

| Típus | Leírás | Mezők |
|-------|--------|-------|
| **Kávé** | Őrölt vagy szemes kávé | Név, pörkölés, feldolgozás, eredet, ár, leírás, kép |
| **Kávégép** | Espresso gépek, filteres gépek | Név, típus, ár, specifikációk, kép |
| **Kiegészítők** | Őrlők, tamperek, kannák | Név, kategória, ár, leírás, kép |

### 4.2 Kávé Termék Struktúra

```typescript
interface CoffeeProduct {
  id: string;
  name: string;
  roastLevel: 'light' | 'medium' | 'medium-dark' | 'dark';
  processMethod: 'washed' | 'natural' | 'honey' | 'anaerobic';
  origin: {
    country: string;
    region?: string;
    farm?: string;
    altitude?: number;
  };
  flavorNotes: string[]; // pl. ["csokoládé", "dió", "citrus"]
  roaster: {
    id: string;
    name: string;
  };
  price: number;
  currency: 'HUF';
  weight: number; // grammban
  description: string;
  images: string[];
  isAvailable: boolean;
  createdAt: string;
}
```

### 4.3 Kiemelés Rendszer

A cégek kiemelhetik termékeiket, hogy azok a keresési találatok tetején jelenjenek meg.

#### Kiemelési Opciók

| Opció | Leírás | Ár (példa) |
|-------|--------|------------|
| **Egyedi termék** | Egy konkrét termék kiemelése | 500 Ft/nap |
| **Kategória** | Összes világos/sötét pörkölés | 2000 Ft/nap |
| **Összes termék** | Minden termék kiemelése | 5000 Ft/nap |

#### Kiemelés Szabályok

> **FONTOS:** A kiemelt termékek csak akkor jelennek meg, ha relevánsak a felhasználó keresésére. Ha valaki csak sötét pörkölésű kávékat keres, a kiemelt világos pörkölésű kávék NEM jelennek meg, függetlenül a kiemelés státuszától.

```typescript
interface ProductPromotion {
  id: string;
  businessId: string;
  promotionType: 'single' | 'category' | 'all';
  targetProducts?: string[]; // termék ID-k
  targetCategory?: string; // kategória szűrő
  startDate: string;
  endDate: string;
  dailyBudget: number;
  totalSpent: number;
  impressions: number;
  clicks: number;
  isActive: boolean;
}
```

### 4.4 Kiemelt Termék Megjelenítés

A kiemelt termékek a találati listában egy **"Promoted"** vagy **"Kiemelt"** badge-dzsel jelennek meg:

```
┌─────────────────────────────────────┐
│ [KIEMELT]                           │
│ ☕ Ethiopia Yirgacheffe              │
│ ⭐ 4.8 | Világos pörkölés           │
│ Íz: Citrus, virágos, tea-szerű      │
│ 4.500 Ft / 250g                     │
│ 📍 Roaster: Kávémanufaktúra         │
└─────────────────────────────────────┘
```

---

## 5. Pörkölő Adatbázis

### 5.1 Áttekintés

A rendszernek tartalmaznia kell egy előre feltöltött adatbázist a Magyarországon elérhető top 50 pörkölőről.

### 5.2 Pörkölő Adatok

```typescript
interface Roaster {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  website?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
  };
  contact?: {
    email: string;
    phone?: string;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
  };
  isVerified: boolean;
  isPartner: boolean; // Ha regisztrált a platformon
  createdAt: string;
}
```

### 5.3 Javasolt Pörkölők Listája (Kezdeti Adatbázis)

| # | Pörkölő Neve | Város |
|---|--------------|-------|
| 1 | Casino Mocca | Budapest |
| 2 | Kávémanufaktúra | Budapest |
| 3 | Gardelli Specialty Coffees | Forlì (IT) - elérhető HU |
| 4 | Laczkó Kávépörkölő | Budapest |
| 5 | Mókuska Kávé | Budapest |
| 6 | Röstbar | Budapest |
| 7 | Fekete Kávéműhely | Budapest |
| 8 | Warm Cup | Budapest |
| 9 | Kelet Kávépörkölő | Budapest |
| 10 | Madal Café | Budapest |
| ... | ... | ... |

### 5.4 Pörkölő Választás Logika

Amikor egy cég terméket tölt fel:

1. **Keresés az adatbázisban** - Autocomplete a meglévő pörkölők között
2. **Saját pörkölő hozzáadása** - Ha nem található, új pörkölő létrehozása
3. **"Saját pörkölés"** - Ha a cég maga pörköl

---

## 6. Előfizetési Csomagok (B2B)

### 6.1 Csomag Összehasonlítás

| Funkció | Ingyenes | Prémium |
|---------|----------|---------|
| Alapadatok megjelenítése | ✅ | ✅ |
| Nyitvatartás | ✅ | ✅ |
| Menü feltöltés | ✅ | ✅ |
| Kávék feltöltése | Max 5 | Korlátlan |
| Képek feltöltése | Max 3 | Korlátlan |
| Álláshirdetés | ❌ | 5/hó |
| Termék kiemelés | ❌ | ✅ |
| Statisztikák | Alap | Részletes |
| Prioritás a keresésben | ❌ | ✅ |
| Ár | 0 Ft | 9.900 Ft/hó |

### 6.2 Prémium Előnyök Részletesen

1. **Álláshirdetés (Job Board)** - Havonta 5 álláshirdetés
2. **Termék kiemelés** - Promoted badge a találatokban
3. **Korlátlan feltöltés** - Kávék, képek, termékek
4. **Részletes statisztikák** - Megtekintések, kattintások, konverziók
5. **Prioritás** - Magasabb helyezés a keresési találatokban

---

## 7. GitHub Feltöltés Útmutató

### 7.1 Előkészületek

A projekt GitHub-ra való feltöltéséhez a következő lépéseket kell végrehajtani:

#### 7.1.1 .gitignore Fájl Létrehozása

A `node_modules` és egyéb generált fájlok kizárása:

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
.expo/
web-build/

# Environment files
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Testing
coverage/
```

#### 7.1.2 Repository Létrehozása

```bash
# 1. GitHub CLI bejelentkezés (ha még nincs)
gh auth login

# 2. Repository klónozása
gh repo clone anorbert-cmyk/mobilecoffe

# 3. Projekt fájlok másolása (node_modules nélkül)
rsync -av --exclude='node_modules' /home/ubuntu/coffee-craft/ ./mobilecoffe/

# 4. Git inicializálás és commit
cd mobilecoffe
git add .
git commit -m "Initial commit: Coffee Craft v31"

# 5. Push a GitHub-ra
git push origin main
```

### 7.2 Alternatív Módszer (Manuális)

Ha a CLI nem működik, manuálisan is feltölthető:

1. **Projekt exportálása** - A Manus platformon a "Download" gombbal
2. **ZIP kicsomagolása** - Helyi gépen
3. **node_modules törlése** - Manuálisan törölni a mappát
4. **GitHub Desktop** - Drag & drop a repository-ba
5. **Commit és Push** - GitHub Desktop-ból

### 7.3 Fontos Megjegyzések

> **FIGYELEM:** A `node_modules` mappa mérete ~500MB+, ezért NEM szabad feltölteni a GitHub-ra. A `.gitignore` fájl biztosítja, hogy ez automatikusan kizárásra kerüljön.

A projekt futtatásához a következő parancs szükséges a klónozás után:

```bash
pnpm install
```

---

## Összefoglaló

Ez a dokumentáció tartalmazza a Coffee Craft alkalmazás következő fejlesztési fázisának terveit:

1. **Kávézó részletes oldal** - Header kép, menü, szolgáltatások, nyitvatartás
2. **B2B platform** - Céges regisztráció, bejelentkezés
3. **Job Board** - Álláshirdetések (Premium funkció)
4. **Termék katalógus** - Kávék, kiegészítők feltöltése és kiemelése
5. **Pörkölő adatbázis** - Top 50 magyar pörkölő
6. **Előfizetési csomagok** - Ingyenes vs Prémium

A GitHub feltöltés útmutatója biztosítja a projekt verziókezelését és megosztását.

---

**Készítette:** Manus AI  
**Projekt:** Coffee Craft v31  
**Utolsó frissítés:** 2026. január 12.
