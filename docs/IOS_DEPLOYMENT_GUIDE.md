# iOS Deployment Guide - CoffeeCraft 7-napos Build

Ez a dokumentum leírja, hogyan kell telepíteni az appot fizikai iPhone-ra ingyenes Apple ID-vel.

## Előfeltételek

### Szoftver

- **macOS** (legújabb verzió ajánlott)
- **Xcode** 15+ telepítve és beállítva (App Store-ból)
- **Node.js** 18+ és npm
- **watchman**: `brew install watchman`

### Fiókok

- **Apple ID** (ingyenes is jó) - Xcode-ban bejelentkezve
- A telefon **Developer Mode** engedélyezve: Beállítások → Adatvédelem és biztonság → Fejlesztői mód

### Csatlakoztatott eszközök

- iPhone USB kábellel csatlakoztatva
- A telefonon "Trust this computer" elfogadva

## Gyors Telepítés (1 parancs)

```bash
# Projekt mappájában:
npx expo run:ios --configuration Release --device "Norbert iPhone-ja"
```

Ha hiba jön a provisioning profile miatt, lásd a Hibaelhárítás részt.

## Teljes Telepítési Folyamat

### 1. Függőségek telepítése

```bash
npm install
```

### 2. iOS natív mappa generálás

```bash
npx expo prebuild --platform ios --clean
```

### 3. Push Notifications entitlement eltávolítása

Ha az Xcode panaszkodik a "Push Notifications capability" miatt:

```bash
# Üres entitlements fájl létrehozása (nincs Push Notifications)
cat > ios/CoffeeCraft/CoffeeCraft.entitlements << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
  </dict>
</plist>
EOF
```

### 4. Release build és telepítés

```bash
npx expo run:ios --configuration Release --device "Norbert iPhone-ja"
```

### 5. Manuális telepítés (ha az előző lépés sikertelen)

```bash
# Eszköz ID lekérése
xcrun xctrace list devices

# App telepítése
xcrun devicectl device install app --device <DEVICE_ID> \
  /Users/norbertbarna/Library/Developer/Xcode/DerivedData/CoffeeCraft-*/Build/Products/Release-iphoneos/CoffeeCraft.app
```

## Hibaelhárítás

### "Personal development teams do not support Push Notifications"

**Megoldás:** A `CoffeeCraft.entitlements` fájlból töröld az `aps-environment` kulcsot (lásd 3. lépés).

### "No profiles for bundle ID were found"

**Megoldás:**

1. Nyisd meg az Xcode-ot: `open ios/CoffeeCraft.xcworkspace`
2. Signing & Capabilities → "Automatically manage signing" bekapcsolása
3. Team kiválasztása (a saját Apple ID-d)

### "Untrusted Developer" a telefonon

**Megoldás:** Beállítások → Általános → VPN és Eszközkezelés → Trust "[A te neved]"

### Az app 7 nap után leáll

**Ok:** Ingyenes Apple ID-vel a provisioning profile 7 napig érvényes.
**Megoldás:** Futtasd újra a `npx expo run:ios --configuration Release --device` parancsot.

## Fontos Konfigurációs Beállítások

### app.config.ts

```typescript
ios: {
  supportsTablet: true,
  bundleIdentifier: "space.manus.coffee.craft.t20260107163042",
  // NE add hozzá: appleTeamId - ez megakadályozza a personal team használatát
}
```

### expo-video plugin (app.config.ts)

```typescript
plugins: [
  "expo-video", // Egyszerű forma, nincs background playback
  // NE használd ezt: ["expo-video", { supportsBackgroundPlayback: true }]
]
```

## Build Info

- **Bundle ID:** `space.manus.coffee.craft.t20260107163042`
- **App Name:** Coffee Craft
- **Production API:** `https://mobilecoffe-production.up.railway.app`
- **Érvényesség:** 7 nap (ingyenes Apple ID-vel)

## Kapcsolódó Fájlok

- `app.config.ts` - Expo konfiguráció
- `ios/CoffeeCraft/CoffeeCraft.entitlements` - iOS entitlements
- `constants/oauth.ts` - API URL beállítások (hardcoded fallback)
