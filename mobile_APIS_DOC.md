# Fuel Guard — Mobile App UI & API Reference

> **Purpose of this document:** Guide the mobile UI developer on what data is available per screen, how each field maps to a UI element, what states to handle, and the full API reference for every mobile-facing endpoint.
>
> **Base URL:** `https://your-api-domain.com/api/v1`
> **Auth Header:** `Authorization: Bearer <access_token>` (on all protected endpoints)
> **Content-Type:** `application/json`
> **Currency:** PKR throughout
> **Timestamps:** UTC, ISO 8601 format → `"2026-04-09T10:00:00Z"`

---

# PART 1 — SCREEN-BY-SCREEN DATA MAPPING

---

## AUTHENTICATION FLOW

---

### Screen: Splash / Welcome
No API call. Show logo + tagline. Check if `access_token` exists in secure storage:
- Token found → go to **Home**
- No token → go to **Login**

---

### Screen: Sign Up

**API:** `POST /auth/signup`

#### Form Fields to Build

| Field | Input Type | Required | Validation | Placeholder |
|-------|-----------|----------|------------|-------------|
| `full_name` | Text | Yes | Min 2 chars | "Full Name" |
| `email` | Email | Yes | Valid email format | "Email Address" |
| `phone` | Phone | No | E.164 format | "Phone Number (+92...)" |
| `password` | Password | Yes | Min 8 chars | "Password" |
| `role` | Hidden | — | Fixed: `"customer"` | — |

#### On Success Response — What to Store & Do

```
access_token   → store in Secure Storage
refresh_token  → store in Secure Storage
uid            → store in Secure Storage (used for profile lookups)
role           → store in Secure Storage (used for conditional UI)
```
→ Navigate to **Home**

#### Error States

| `detail` value | Show to user |
|----------------|-------------|
| `"Email already registered"` | "An account with this email already exists" |
| `422` Unprocessable | Highlight the invalid field inline |

---

### Screen: Login

**API:** `POST /auth/login`

#### Form Fields to Build

| Field | Input Type | Required | Placeholder |
|-------|-----------|----------|-------------|
| `email` | Email | Yes | "Email Address" |
| `password` | Password | Yes | "Password" |

#### On Success — What to Store & Do
Same as Sign Up. → Navigate to **Home**

#### Error States

| HTTP | Show to user |
|------|-------------|
| `401` | "Invalid email or password" |
| `403` | "Your account has been deactivated. Contact support." |

#### Navigation Links on Screen
- "Forgot Password?" → **Forgot Password Screen**
- "Don't have an account? Sign Up" → **Sign Up Screen**

---

### Screen: Forgot Password (Step 1 — Enter Email)

**API:** `POST /auth/forgot-password`

#### Form Fields
| Field | Input Type | Required | Placeholder |
|-------|-----------|----------|-------------|
| `email` | Email | Yes | "Enter your registered email" |

#### On Success
→ Navigate to **OTP Verification Screen** (pass `email` as route param)

> **UI Note:** Always show success message regardless of whether email exists (security). Don't say "email not found".

---

### Screen: OTP Verification (Step 2)

**API:** `POST /auth/verify-otp`

#### Fields
| Field | Input Type | Notes |
|-------|-----------|-------|
| `email` | Hidden | Passed from previous screen |
| `otp` | 6-digit OTP input | Show 6 individual boxes |

#### States
- **Resend OTP** button → calls `POST /auth/forgot-password` again with same email
- Show countdown timer (e.g. 2:00 minutes) before allowing resend
- On success → navigate to **Reset Password Screen** (pass `email` + `otp`)

#### Error States
| `detail` | Show |
|----------|------|
| `"Invalid or expired OTP"` | "OTP is incorrect or has expired. Please try again." |

---

### Screen: Reset Password (Step 3)

**API:** `POST /auth/reset-password`

#### Fields
| Field | Input Type | Notes |
|-------|-----------|-------|
| `email` | Hidden | From route params |
| `otp` | Hidden | From route params |
| `new_password` | Password | Min 8 chars |
| Confirm Password | Local only | Match validation — not sent to API |

#### On Success → Navigate to **Login Screen** with success toast "Password reset successfully"

---

## HOME / DASHBOARD

---

### Screen: Home Dashboard

**APIs called on load:**
1. `GET /users/me` — to show user greeting
2. `GET /transactions/my?limit=3` — to show recent transactions
3. `GET /transactions/prices/current` — to show live fuel prices

#### Data Fields & UI Mapping

**User greeting bar (top of screen)**

| Field | From | UI Element |
|-------|------|-----------|
| `full_name` | `/users/me` | "Hello, Ali 👋" greeting text |
| `avatar_url` | `/users/me` | Circular avatar image. If `null` → show initials from `full_name` |
| `role` | local storage | Show badge/chip: "Customer" / "Driver" |

**Live Fuel Prices section**

Response from `GET /transactions/prices/current`:
```json
[
  { "fuel_type": "petrol",  "price_per_litre": 280.0, "effective_from": "2026-04-01T00:00:00Z" },
  { "fuel_type": "diesel",  "price_per_litre": 265.0, "effective_from": "2026-04-01T00:00:00Z" },
  { "fuel_type": "premium", "price_per_litre": 310.0, "effective_from": "2026-04-01T00:00:00Z" }
]
```

| Field | UI Element |
|-------|-----------|
| `fuel_type` | Label chip: "Petrol" / "Diesel" / "Premium" / "CNG" / "LPG" |
| `price_per_litre` | Large number: "PKR 280.00 / L" |
| `effective_from` | Small text: "Updated Apr 1" |

**Recent Transactions section** (latest 3)

| Field | UI Element |
|-------|-----------|
| `fuel_type` | Icon + label |
| `total_amount` | "PKR 5,740" — right aligned, bold |
| `litres_dispensed` | "20.5 L" subtitle |
| `status` | Status badge (see enum table below) |
| `created_at` | "Today, 9:00 AM" — formatted relative time |

**`status` field enum values:**

| Value | Badge Color | Label |
|-------|------------|-------|
| `"completed"` | Green | Completed |
| `"pending"` | Yellow | Pending |
| `"failed"` | Red | Failed |
| `"refunded"` | Blue | Refunded |

**Quick Action buttons on Home:**
- "Scan QR" → navigate to **QR Scanner Screen**
- "Find Stations" → navigate to **Stations Map Screen**
- "My Vehicles" → navigate to **My Vehicles Screen**
- "Price Compare" → navigate to **Price Compare Screen**

---

## QR CODE & FUELING FLOW

---

### Screen: QR Scanner

**API:** `POST /sessions/scan`

This screen opens the device camera. When QR is decoded, extract the string (e.g. `fuelguard://session/uuid-here`) and immediately call the API.

#### Request sent automatically after scan:
```json
{ "qr_data": "fuelguard://session/uuid-here" }
```

#### On Success → Navigate to **Active Session Screen** with `session_id`

#### Error States

| `detail` | Show |
|----------|------|
| `"Invalid QR code"` | "This QR code is not valid. Please scan again." |
| `"Session is not available (status: completed)"` | "This session has already been used." |
| `"QR code has expired"` | "This QR code has expired. Ask the attendant for a new one." |

---

### Screen: Active Session (Live Fueling)

**API (polling):** `GET /sessions/{session_id}` — poll every 3–5 seconds while `status === "active"`

#### Full Response Structure

```json
{
  "id": "uuid",
  "nozzle_id": "uuid",
  "user_id": "uuid",
  "status": "active",
  "qr_data": "fuelguard://session/uuid",
  "started_at": "2026-04-09T10:05:00Z",
  "ended_at": null,
  "expires_at": "2026-04-09T10:10:00Z",
  "total_litres": 12.4,
  "total_amount": 3472.0,
  "transaction_id": null
}
```

#### UI Mapping

| Field | UI Element | Notes |
|-------|-----------|-------|
| `status` | Status indicator dot | `active` = green pulsing, `completed` = static green, `timed_out` = red |
| `total_litres` | Large live counter: "12.40 L" | Updates each poll |
| `total_amount` | Large live counter: "PKR 3,472" | Updates each poll |
| `started_at` | "Started at 10:05 AM" | Show elapsed time |
| `expires_at` | Countdown timer | Show "Session expires in X:XX" |
| `transaction_id` | When not `null` → session complete | Stop polling, show completion state |
| `nozzle_id` | "Nozzle ID: ..." | Small info text |

**`status` enum values for this screen:**

| Value | UI State |
|-------|----------|
| `"active"` | Green pulsing dot. Show live counters. Show "End Session" button |
| `"completed"` | Green checkmark. Show "View Receipt" button. Stop polling |
| `"timed_out"` | Red. Show "Session expired" message |
| `"cancelled"` | Grey. Show "Session was cancelled" |

**"End Session" button** → calls `POST /sessions/{session_id}/close` with `{ "reason": "manual" }` → then navigate to **Transaction Detail Screen** using `transaction_id`

---

## TRANSACTION HISTORY

---

### Screen: Transaction History List

**API:** `GET /transactions/my?limit=20&offset=0`

#### Full Response Structure

```json
{
  "total": 47,
  "items": [
    {
      "id": "uuid",
      "session_id": "uuid",
      "nozzle_id": "uuid",
      "user_id": "uuid",
      "vehicle_id": "uuid-or-null",
      "fuel_type": "petrol",
      "litres_dispensed": 20.5,
      "price_per_litre": 280.0,
      "total_amount": 5740.0,
      "payment_method": "cash",
      "status": "completed",
      "employee_id": "uuid-or-null",
      "station_id": "uuid-or-null",
      "receipt_url": "https://...-or-null",
      "evidence_url": "https://...-or-null",
      "is_flagged": false,
      "created_at": "2026-04-09T09:00:00Z"
    }
  ]
}
```

#### List Item UI Mapping

| Field | UI Element | Notes |
|-------|-----------|-------|
| `fuel_type` | Icon (petrol = flame, diesel = barrel, etc.) + label | Capitalize |
| `litres_dispensed` | "20.50 L" | Show 2 decimal places |
| `total_amount` | "PKR 5,740" | Bold, right-aligned |
| `status` | Badge | See status enum table in Home section |
| `is_flagged` | Orange warning icon | Only show if `true` |
| `created_at` | "Apr 9 · 9:00 AM" | Formatted date |
| `payment_method` | Small label under amount | "Cash" / "Card" / "Wallet" |

**`payment_method` enum values:**

| Value | Display Label |
|-------|--------------|
| `"cash"` | Cash |
| `"card"` | Card |
| `"wallet"` | Wallet |
| `"qr_pay"` | QR Pay |

**`fuel_type` enum values:**

| Value | Display Label |
|-------|--------------|
| `"petrol"` | Petrol |
| `"diesel"` | Diesel |
| `"premium"` | Premium |
| `"cng"` | CNG |
| `"lpg"` | LPG |

**Pagination:** Use `total` field to know if more pages exist. Load more on scroll.
`total=47`, showing 20 → show "Load More" when `items.length < total`

Tap any item → **Transaction Detail Screen** passing `transaction.id`

---

### Screen: Transaction Detail

**API:** `GET /transactions/{transaction_id}`

#### Full Response Structure

```json
{
  "id": "uuid",
  "session_id": "uuid",
  "nozzle_id": "uuid",
  "user_id": "uuid",
  "vehicle_id": "uuid-or-null",
  "fuel_type": "petrol",
  "litres_dispensed": 20.5,
  "price_per_litre": 280.0,
  "total_amount": 5740.0,
  "payment_method": "cash",
  "status": "completed",
  "employee_id": "uuid-or-null",
  "station_id": "uuid-or-null",
  "receipt_url": null,
  "evidence_url": "https://storage.url/img.jpg-or-null",
  "is_flagged": false,
  "created_at": "2026-04-09T09:00:00Z"
}
```

#### UI Mapping

| Field | UI Element | Notes |
|-------|-----------|-------|
| `id` | "TXN #uuid" — truncate to last 8 chars | e.g. "TXN #a3f2b1c0" |
| `fuel_type` | Large fuel type label with icon | |
| `litres_dispensed` | "20.50 Litres" | Large display |
| `price_per_litre` | "PKR 280.00 / L" | Secondary text |
| `total_amount` | "PKR 5,740.00" | Hero amount — largest text |
| `payment_method` | Icon + label row | Cash icon / Card icon |
| `status` | Coloured badge | See enum table |
| `station_id` | If not `null` → show station name (fetch separately if needed) | Optional |
| `vehicle_id` | If not `null` → show reg. number | Optional |
| `evidence_url` | If not `null` → show snapshot image thumbnail | Tap to fullscreen |
| `is_flagged` | If `true` → show yellow banner "You reported this transaction" | |
| `created_at` | "Wednesday, April 9 2026 · 9:00 AM" | Full formatted |

**Action Buttons:**
- "Download Receipt" → calls `GET /transactions/{id}/receipt` → open PDF viewer
- "Report Issue" → only show if `is_flagged === false` → opens **Report Fraud Bottom Sheet**

---

### Screen: Report Fraud (Bottom Sheet from Transaction Detail)

**API:** `POST /fraud/flag`

#### Form Fields

| Field | Input Type | Notes |
|-------|-----------|-------|
| `transaction_id` | Hidden | Passed from Transaction Detail |
| `reason` | Multi-line text area | "Describe what went wrong..." |
| `severity` | Dropdown or radio | Options: Low / Medium / High |

**`severity` display values:**

| Value sent | Display label |
|-----------|--------------|
| `"low"` | Low — Minor discrepancy |
| `"medium"` | Medium — Suspicious activity |
| `"high"` | High — Clear tampering |

On success → close bottom sheet, update `is_flagged` to `true` on parent screen, show toast "Report submitted"

---

## PROFILE

---

### Screen: My Profile

**API:** `GET /users/me`

#### Full Response Structure

```json
{
  "uid": "uuid",
  "email": "ali@example.com",
  "full_name": "Ali Hassan",
  "phone": "+923001234567",
  "role": "customer",
  "avatar_url": null,
  "is_active": true,
  "created_at": "2026-01-15T08:30:00Z"
}
```

#### UI Mapping

| Field | UI Element | Notes |
|-------|-----------|-------|
| `avatar_url` | Large circular avatar | If `null` → show colored circle with initials from `full_name` |
| `full_name` | Name below avatar, large bold | |
| `email` | Info row | Non-editable, show lock icon |
| `phone` | Info row | Show "Not set" if `null` |
| `role` | Badge chip | Capitalize: "Customer" / "Driver" / "Employee" |
| `created_at` | "Member since January 2026" | |

**Action Buttons:**
- "Edit Profile" → **Edit Profile Screen**
- "Change Password" → **Change Password Screen**
- "Logout" → call `POST /auth/logout` → clear Secure Storage → go to Login

---

### Screen: Edit Profile

**API:** `PUT /users/me`

#### Form Fields

| Field | Input Type | Pre-fill from | Required |
|-------|-----------|--------------|----------|
| `full_name` | Text | `users/me.full_name` | Yes |
| `phone` | Phone | `users/me.phone` | No |
| `avatar_url` | Image picker → upload → paste URL | `users/me.avatar_url` | No |

On success → go back to Profile, show toast "Profile updated"

---

### Screen: Change Password

**API:** `PUT /users/me/password`

#### Form Fields

| Field | Input Type | Required |
|-------|-----------|----------|
| `current_password` | Password | Yes |
| `new_password` | Password (min 8) | Yes |
| Confirm new password | Password (local match only) | Yes |

#### Error States

| `detail` | Show |
|----------|------|
| `"Current password is incorrect"` | Highlight current password field red |

---

## STATIONS & DISCOVERY

---

### Screen: Stations Map

**API:** `GET /stations/nearby?latitude=X&longitude=Y&radius_km=10`

Uses device GPS. Renders stations as map pins.

#### Full Response Structure (array of station objects)

```json
[
  {
    "id": "uuid",
    "name": "Shell Gulberg",
    "address": "Main Boulevard Gulberg",
    "city": "Lahore",
    "latitude": 31.5204,
    "longitude": 74.3587,
    "fuel_types_available": ["petrol", "diesel", "premium"],
    "operating_hours": "24/7",
    "contact_phone": "+9242111000",
    "is_active": true,
    "distance_km": 1.3,
    "current_prices": null
  }
]
```

#### Map Pin UI Mapping

| Field | UI Element |
|-------|-----------|
| `latitude` + `longitude` | Pin position on map |
| `name` | Pin label / bottom sheet title |
| `distance_km` | "1.3 km away" |
| `fuel_types_available` | Small chips on bottom sheet preview |
| `is_active` | If `false` → grey pin, show "Closed" |

Tap a pin → **Station Detail Screen** passing `station.id`

**Filter bar** above map:
- Fuel type filter → appends `?fuel_type=petrol` to query
- Radius slider → adjusts `radius_km`

**Toggle view:** Map ↔ List (same data, different layout)

---

### Screen: Station Detail

**API:** `GET /stations/{station_id}`

#### Full Response Structure

```json
{
  "id": "uuid",
  "name": "Shell Gulberg",
  "address": "Main Boulevard Gulberg",
  "city": "Lahore",
  "latitude": 31.5204,
  "longitude": 74.3587,
  "fuel_types_available": ["petrol", "diesel", "premium"],
  "operating_hours": "24/7",
  "contact_phone": "+9242111000",
  "is_active": true,
  "distance_km": 1.3,
  "current_prices": null
}
```

#### UI Mapping

| Field | UI Element | Notes |
|-------|-----------|-------|
| `name` | Page title / hero text | |
| `address` | Address row with location icon | |
| `city` | Inline with address | |
| `operating_hours` | "Open · 24/7" or "Mon–Sat 8AM–10PM" | If `null` → hide row |
| `contact_phone` | Tap to call | If `null` → hide row |
| `fuel_types_available` | Row of coloured chips | |
| `is_active` | Status dot — green "Open" / red "Closed" | |
| `latitude` + `longitude` | Embedded mini-map + "Get Directions" button | Opens Google Maps |
| `distance_km` | "1.3 km from you" | Only if returned |

**Action buttons:**
- "Get Directions" → open maps app with lat/lng
- "Call Station" → `tel:contact_phone` (hide if null)
- Heart icon → add/remove favorite → `POST` or `DELETE /stations/me/favorites/{station_id}`
- "View Prices" → fetch `GET /prices/{station_id}/history` and show inline

---

### Screen: Favorites

**API:** `GET /stations/me/favorites`

Returns array of full station objects (same structure as Station Detail above).

**Empty state:** "No favorite stations yet. Tap ♡ on any station to save it."

Each item → tap → **Station Detail Screen**
Each item → swipe left → "Remove" → `DELETE /stations/me/favorites/{station_id}`

---

### Screen: Route Stations

**API:** `GET /stations/route?origin_lat=X&origin_lng=Y&dest_lat=A&dest_lng=B`

Returns same station array structure with extra field `distance_from_route_km`.

#### Additional Field

| Field | UI Element |
|-------|-----------|
| `distance_from_route_km` | "0.8 km off route" subtitle |

---

## PRICE MONITORING

---

### Screen: Price Compare

**API:** `GET /prices/compare?fuel_type=petrol&latitude=X&longitude=Y`

#### Full Response Structure (array)

```json
[
  {
    "station_id": "uuid",
    "station_name": "Shell Gulberg",
    "fuel_type": "petrol",
    "price_per_litre": 278.0,
    "distance_km": 1.3,
    "last_updated": "2026-04-08T12:00:00Z"
  },
  {
    "station_id": "uuid",
    "station_name": "PSO Model Town",
    "fuel_type": "petrol",
    "price_per_litre": 275.0,
    "distance_km": 3.2,
    "last_updated": "2026-04-08T09:00:00Z"
  }
]
```

#### List Item UI Mapping

| Field | UI Element | Notes |
|-------|-----------|-------|
| `station_name` | Station name bold | |
| `price_per_litre` | "PKR 278.00 / L" — prominent | Lowest price gets a green "Cheapest" badge |
| `distance_km` | "1.3 km" | Show if not `null` |
| `last_updated` | "Updated 2h ago" | Relative time |
| `fuel_type` | Filter chip at top of screen | Selected type |

**Sorted by:** `price_per_litre` ascending (cheapest first — already sorted by API)

**Fuel type selector tabs:** Petrol / Diesel / Premium / CNG / LPG → changes `fuel_type` param

Tap item → **Station Detail Screen**

---

### Screen: Cheapest Fuel Finder

**API:** `GET /prices/cheapest?fuel_type=petrol&latitude=X&longitude=Y&radius_km=20`

#### Full Response Structure

```json
{
  "station_id": "uuid",
  "station_name": "PSO Model Town",
  "fuel_type": "petrol",
  "price_per_litre": 275.0,
  "distance_km": 3.2,
  "address": "Model Town Link Road, Lahore"
}
```

#### UI Mapping — Hero Card Style

| Field | UI Element |
|-------|-----------|
| `station_name` | Large title |
| `price_per_litre` | Hero number "PKR 275.00 / L" with green color |
| `distance_km` | "3.2 km away" |
| `address` | Address row |

**Button:** "Get Directions" → open maps with `station.latitude/longitude` (fetch from station detail if needed)

**Error state (404):** "No stations found within 20 km for this fuel type."

---

### Screen: Price History (for a Station)

**API:** `GET /prices/{station_id}/history?fuel_type=petrol`

#### Full Response Structure (array, latest first)

```json
[
  {
    "id": "uuid",
    "station_id": "uuid",
    "fuel_type": "petrol",
    "price_per_litre": 280.0,
    "updated_by": "uuid",
    "effective_from": "2026-04-01T00:00:00Z",
    "created_at": "2026-04-01T00:00:00Z"
  }
]
```

#### UI — Line Chart + List

| Field | Chart Use | List UI |
|-------|----------|---------|
| `effective_from` | X-axis label | "Apr 1, 2026" |
| `price_per_litre` | Y-axis value | "PKR 280.00" — big |
| `fuel_type` | Chart title | Shown in chip |

Show last 10 records. Render as line chart + scrollable list below.

---

### Screen: Price Alerts

**API:** `GET /prices/alerts`

#### Full Response Structure (array)

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "station_id": "uuid",
    "fuel_type": "petrol",
    "target_price": 270.0,
    "is_active": true,
    "created_at": "2026-04-09T10:00:00Z"
  }
]
```

#### List Item UI Mapping

| Field | UI Element | Notes |
|-------|-----------|-------|
| `fuel_type` | Chip label | |
| `target_price` | "Alert when price ≤ PKR 270.00" | |
| `station_id` | Fetch station name for display | |
| `is_active` | Toggle switch | |
| `created_at` | "Set on Apr 9" | |

Swipe to delete → `DELETE /prices/alerts/{alert_id}`
"+" button → **Set Price Alert Bottom Sheet**

**Empty state:** "No price alerts set. We'll notify you when fuel drops to your target price."

---

### Screen: Set Price Alert (Bottom Sheet)

**API:** `POST /prices/alerts`

#### Form Fields

| Field | Input Type | Notes |
|-------|-----------|-------|
| `station_id` | Station picker / dropdown | Show station name |
| `fuel_type` | Segmented control | Petrol / Diesel / Premium / CNG / LPG |
| `target_price` | Number input | "Alert me when price drops to PKR ___" |

---

## FLEET & EXPENSE TRACKING

---

### Screen: My Vehicles List

**API:** `GET /fleet/vehicles`

#### Full Response Structure (array)

```json
[
  {
    "id": "uuid",
    "registration_number": "LEA-1234",
    "make": "Toyota",
    "model": "Corolla",
    "year": 2022,
    "fuel_type": "petrol",
    "tank_capacity": 50.0,
    "owner_uid": "uuid",
    "assigned_driver_uid": "uuid-or-null",
    "is_active": true,
    "total_fuel_consumed": 340.5,
    "total_expense": 95340.0,
    "created_at": "2026-01-10T00:00:00Z"
  }
]
```

#### List Card UI Mapping

| Field | UI Element | Notes |
|-------|-----------|-------|
| `registration_number` | Card title — bold | "LEA-1234" |
| `make` + `model` + `year` | Subtitle | "Toyota Corolla 2022" |
| `fuel_type` | Small chip | |
| `total_fuel_consumed` | "340.5 L consumed total" | |
| `total_expense` | "PKR 95,340 total spent" | |
| `is_active` | If `false` → show grey "Inactive" badge | |
| `assigned_driver_uid` | If not `null` → show driver icon | Fetch driver name if needed |

Tap → **Vehicle Detail Screen**
"+" FAB → **Add Vehicle Screen**
**Empty state:** "No vehicles added yet. Add your first vehicle to start tracking fuel expenses."

---

### Screen: Vehicle Detail

**API 1:** `GET /fleet/vehicles/{vehicle_id}`
**API 2:** `GET /fleet/vehicles/{vehicle_id}/consumption`

#### Consumption Response Structure

```json
{
  "vehicle_id": "uuid",
  "registration_number": "LEA-1234",
  "total_fuel_consumed": 340.5,
  "monthly_breakdown": {
    "2026-03": { "litres": 120.0, "amount": 33600.0 },
    "2026-04": { "litres": 45.0,  "amount": 12600.0 }
  }
}
```

#### UI Mapping

| Field | UI Element | Notes |
|-------|-----------|-------|
| `registration_number` | Page title | |
| `make` + `model` + `year` | Hero subtitle | |
| `fuel_type` | Info row | |
| `tank_capacity` | "Tank: 50L" | |
| `assigned_driver_uid` | "Driver: [name]" or "No driver assigned" | |
| `total_fuel_consumed` | Stat card | |
| `total_expense` | Stat card | |
| `monthly_breakdown` | Bar chart — month on X, litres on Y | Each bar tap shows amount |

`monthly_breakdown` chart data:
- Keys like `"2026-03"` → format as "Mar 2026" for X-axis label
- `litres` → bar height
- `amount` → tooltip on tap: "PKR 33,600"

**Tabs on this screen:**
1. Overview (vehicle info + chart)
2. Expenses (→ loads `GET /fleet/expenses?vehicle_id=X`)
3. Budget (→ loads `GET /fleet/budget?vehicle_id=X`)

---

### Screen: Add Vehicle

**API:** `POST /fleet/vehicles`

#### Form Fields

| Field | Input Type | Required | Notes |
|-------|-----------|----------|-------|
| `registration_number` | Text (CAPS) | Yes | "LEA-1234" |
| `make` | Text | Yes | "Toyota" |
| `model` | Text | Yes | "Corolla" |
| `year` | Number / year picker | Yes | 1990–2026 |
| `fuel_type` | Dropdown | Yes | Petrol / Diesel / Premium / CNG / LPG |
| `tank_capacity` | Number | Yes | In litres |

---

### Screen: Expenses List

**API:** `GET /fleet/expenses?vehicle_id=X&month=4&year=2026`

#### Full Response Structure

```json
{
  "total": 12,
  "items": [
    {
      "id": "uuid",
      "vehicle_id": "uuid",
      "user_id": "uuid",
      "category": "fuel",
      "amount": 5600.0,
      "litres": 20.0,
      "station_id": "uuid-or-null",
      "description": "Morning refuel",
      "expense_date": "2026-04-09",
      "created_at": "2026-04-09T09:30:00Z"
    }
  ]
}
```

#### List Item UI Mapping

| Field | UI Element | Notes |
|-------|-----------|-------|
| `category` | Icon + label | See category enum table below |
| `amount` | "PKR 5,600" bold, right-aligned | |
| `litres` | "20.0 L" | Only show if category = `"fuel"` |
| `description` | Subtitle text | If `null` → hide |
| `expense_date` | "Apr 9" | Formatted |

**`category` enum values:**

| Value | Icon | Display Label |
|-------|------|--------------|
| `"fuel"` | Fuel pump | Fuel |
| `"maintenance"` | Wrench | Maintenance |
| `"toll"` | Barrier | Toll |
| `"parking"` | P sign | Parking |
| `"other"` | Dots | Other |

**Filter chips at top:** All / Fuel / Maintenance / Toll / Parking / Other

"+" FAB → **Log Expense Screen**

---

### Screen: Log Expense

**API:** `POST /fleet/expenses`

#### Form Fields

| Field | Input Type | Required | Notes |
|-------|-----------|----------|-------|
| `vehicle_id` | Vehicle picker | Yes | Show reg. number |
| `category` | Segmented / Dropdown | Yes | Fuel / Maintenance / Toll / Parking / Other |
| `amount` | Number (PKR) | Yes | |
| `litres` | Number | Only if category = fuel | Show/hide conditionally |
| `station_id` | Station picker | No | Show only if category = fuel |
| `description` | Text area | No | Optional note |
| `expense_date` | Date picker | No | Defaults to today |

---

### Screen: Budget

**API GET:** `GET /fleet/budget?vehicle_id=X&month=4&year=2026`
**API SET:** `PUT /fleet/budget`

#### Full Response Structure

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "vehicle_id": "uuid-or-null",
  "month": 4,
  "year": 2026,
  "budget_amount": 50000.0,
  "spent_amount": 22400.0,
  "remaining": 27600.0
}
```

#### UI Mapping

| Field | UI Element | Notes |
|-------|-----------|-------|
| `budget_amount` | "Budget: PKR 50,000" | |
| `spent_amount` | "Spent: PKR 22,400" | |
| `remaining` | "Remaining: PKR 27,600" | Green if positive, Red if negative (overspent) |
| `spent_amount / budget_amount` | Progress bar | e.g. 44.8% filled |
| `month` + `year` | Month/year selector at top | "April 2026" |

**Overspent state:** If `remaining < 0` → show red "Over budget by PKR X" warning

**"Set Budget" button** → bottom sheet with `amount` input + month/year picker

**Month/year selector** → changes query params and refetches

---

### Screen: Drivers

**API:** `GET /fleet/drivers`

#### Full Response Structure (array)

```json
[
  {
    "id": "uuid",
    "full_name": "Usman Raza",
    "phone": "+923331234567",
    "license_number": "PB-123456",
    "uid": "uuid-or-null",
    "assigned_vehicle_id": "uuid-or-null",
    "is_active": true,
    "created_at": "2026-02-01T00:00:00Z"
  }
]
```

#### List Item UI Mapping

| Field | UI Element | Notes |
|-------|-----------|-------|
| `full_name` | Name bold | |
| `phone` | Tap to call | |
| `license_number` | "License: PB-123456" | |
| `assigned_vehicle_id` | "Vehicle: LEA-1234" (fetch reg. number) or "Unassigned" | |
| `is_active` | Green dot / grey dot | |

**"Assign Vehicle" button** → dropdown of vehicles → calls `PUT /fleet/vehicles/{vehicle_id}/driver`

"+" FAB → **Add Driver Screen**

---

### Screen: Add Driver

**API:** `POST /fleet/drivers`

#### Form Fields

| Field | Input Type | Required |
|-------|-----------|----------|
| `full_name` | Text | Yes |
| `phone` | Phone | Yes |
| `license_number` | Text | Yes |

---

## AI SUPPORT CHATBOT

---

### Screen: Support Chat

**API:** `POST /auth/chatbot`

#### UI Pattern

Standard chat UI — user bubble on right, bot bubble on left.

#### Request (sent on each message)
```json
{ "message": "How do I reset my password?" }
```

#### Full Response Structure
```json
{ "reply": "To reset your password, tap Forgot Password on the Login screen..." }
```

| Field | UI Element |
|-------|-----------|
| User's `message` | Right-aligned chat bubble |
| `reply` | Left-aligned bot bubble with Fuel Guard avatar |

**States:**
- Typing indicator (3-dot animation) while awaiting response
- Error state: "Unable to reach support. Please try again."
- Offline state: "You appear to be offline"

---

# PART 2 — COMPLETE API REFERENCE

> All endpoints below are mobile-facing. Admin-only endpoints are excluded.

---

## AUTH ENDPOINTS

---

### `POST /auth/signup`
Register new user.

**Request:**
```json
{
  "email": "string (email)",
  "password": "string (min 8 chars)",
  "full_name": "string (min 2 chars)",
  "phone": "string | null",
  "role": "customer"
}
```
**Response `201`:**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer",
  "uid": "string (uuid)",
  "role": "string"
}
```

---

### `POST /auth/login`
Login with credentials.

**Request:**
```json
{
  "email": "string (email)",
  "password": "string"
}
```
**Response `200`:**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer",
  "uid": "string (uuid)",
  "role": "string"
}
```

---

### `POST /auth/logout`
**Auth:** Required

**Response `200`:**
```json
{ "message": "Logged out successfully" }
```

---

### `POST /auth/refresh-token`
Obtain a new access token.

**Request:**
```json
{ "refresh_token": "string" }
```
**Response `200`:**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer",
  "uid": "string",
  "role": "string"
}
```

---

### `POST /auth/forgot-password`
Send OTP to email.

**Request:**
```json
{ "email": "string (email)" }
```
**Response `200`:**
```json
{ "message": "If that email is registered, an OTP has been sent" }
```

---

### `POST /auth/verify-otp`
Verify OTP code.

**Request:**
```json
{
  "email": "string (email)",
  "otp": "string (6 digits)"
}
```
**Response `200`:**
```json
{ "message": "OTP verified", "email": "string" }
```

---

### `POST /auth/reset-password`
Reset password after OTP verified.

**Request:**
```json
{
  "email": "string (email)",
  "otp": "string",
  "new_password": "string (min 8 chars)"
}
```
**Response `200`:**
```json
{ "message": "Password reset successfully" }
```

---

### `POST /auth/chatbot`
**Auth:** Required

**Request:**
```json
{ "message": "string" }
```
**Response `200`:**
```json
{ "reply": "string" }
```

---

## USER ENDPOINTS

---

### `GET /users/me`
**Auth:** Required

**Response `200`:**
```json
{
  "uid": "string",
  "email": "string",
  "full_name": "string",
  "phone": "string | null",
  "role": "customer | driver | employee | admin | super_admin",
  "avatar_url": "string | null",
  "is_active": true,
  "created_at": "datetime"
}
```

---

### `PUT /users/me`
**Auth:** Required

**Request:** (all fields optional — send only what changed)
```json
{
  "full_name": "string | null",
  "phone": "string | null",
  "avatar_url": "string | null"
}
```
**Response `200`:** Full user profile object (same as `GET /users/me`)

---

### `PUT /users/me/password`
**Auth:** Required

**Request:**
```json
{
  "current_password": "string",
  "new_password": "string (min 8 chars)"
}
```
**Response `200`:**
```json
{ "message": "Password changed successfully" }
```

---

## SESSION ENDPOINTS

---

### `POST /sessions/scan`
**Auth:** Required

**Request:**
```json
{ "qr_data": "string (e.g. fuelguard://session/uuid)" }
```
**Response `200`:**
```json
{
  "session_id": "string",
  "status": "active",
  "nozzle_id": "string"
}
```

---

### `GET /sessions/{session_id}`
**Auth:** Required

**Response `200`:**
```json
{
  "id": "string",
  "nozzle_id": "string",
  "user_id": "string",
  "status": "pending | active | completed | timed_out | cancelled",
  "qr_data": "string",
  "started_at": "datetime | null",
  "ended_at": "datetime | null",
  "expires_at": "datetime | null",
  "total_litres": "number",
  "total_amount": "number",
  "transaction_id": "string | null"
}
```

---

### `POST /sessions/{session_id}/close`
**Auth:** Required

**Request:**
```json
{ "reason": "string (e.g. manual)" }
```
**Response `200`:**
```json
{ "message": "Session closed" }
```

---

## TRANSACTION ENDPOINTS

---

### `GET /transactions/my`
**Auth:** Required

**Query Params:** `limit` (int, default 20), `offset` (int, default 0)

**Response `200`:**
```json
{
  "total": "integer",
  "items": [
    {
      "id": "string",
      "session_id": "string",
      "nozzle_id": "string",
      "user_id": "string",
      "vehicle_id": "string | null",
      "fuel_type": "petrol | diesel | premium | cng | lpg",
      "litres_dispensed": "number",
      "price_per_litre": "number",
      "total_amount": "number",
      "payment_method": "cash | card | wallet | qr_pay",
      "status": "pending | completed | failed | refunded",
      "employee_id": "string | null",
      "station_id": "string | null",
      "receipt_url": "string | null",
      "evidence_url": "string | null",
      "is_flagged": "boolean",
      "created_at": "datetime"
    }
  ]
}
```

---

### `GET /transactions/{transaction_id}`
**Auth:** Required

**Response `200`:** Single transaction object (same structure as items above)

---

### `GET /transactions/{transaction_id}/receipt`
**Auth:** Required

**Response `200`:** `application/pdf` binary file

---

### `GET /transactions/prices/current`
**Auth:** Required

**Query Params:** `station_id` (optional string)

**Response `200`:**
```json
[
  {
    "fuel_type": "petrol | diesel | premium | cng | lpg",
    "price_per_litre": "number",
    "station_id": "string | null",
    "effective_from": "datetime"
  }
]
```

---

## STATION ENDPOINTS

---

### `GET /stations`
**Auth:** Required

**Query Params:** `city` (string), `fuel_type` (string), `is_active` (bool, default true)

**Response `200`:**
```json
[
  {
    "id": "string",
    "name": "string",
    "address": "string",
    "city": "string",
    "latitude": "number",
    "longitude": "number",
    "fuel_types_available": ["petrol", "diesel"],
    "operating_hours": "string | null",
    "contact_phone": "string | null",
    "is_active": "boolean",
    "distance_km": "number | null",
    "current_prices": "object | null",
    "created_at": "datetime"
  }
]
```

---

### `GET /stations/{station_id}`
**Auth:** Required

**Response `200`:** Single station object (same structure as above)

---

### `GET /stations/nearby`
**Auth:** Required

**Query Params:** `latitude`* (number), `longitude`* (number), `radius_km` (number, default 10), `fuel_type` (string)

**Response `200`:** Array of station objects. Each includes `distance_km` (number, sorted ascending).

---

### `GET /stations/route`
**Auth:** Required

**Query Params:** `origin_lat`*, `origin_lng`*, `dest_lat`*, `dest_lng`* (all numbers), `fuel_type` (string)

**Response `200`:** Array of station objects. Each includes `distance_from_route_km` (number, sorted ascending).

---

### `GET /stations/me/favorites`
**Auth:** Required

**Response `200`:** Array of station objects (same structure as `GET /stations`).

---

### `POST /stations/me/favorites/{station_id}`
**Auth:** Required

**Response `201`:**
```json
{ "message": "Added to favorites" }
```

---

### `DELETE /stations/me/favorites/{station_id}`
**Auth:** Required

**Response `204`:** No content.

---

## PRICE ENDPOINTS

---

### `GET /prices/compare`
**Auth:** Required

**Query Params:** `fuel_type`* (string), `latitude` (number), `longitude` (number), `radius_km` (number, default 20)

**Response `200`:**
```json
[
  {
    "station_id": "string",
    "station_name": "string",
    "fuel_type": "string",
    "price_per_litre": "number",
    "distance_km": "number | null",
    "last_updated": "datetime | null"
  }
]
```
Sorted by `price_per_litre` ascending.

---

### `GET /prices/cheapest`
**Auth:** Required

**Query Params:** `fuel_type`* (string), `latitude`* (number), `longitude`* (number), `radius_km` (number, default 20)

**Response `200`:**
```json
{
  "station_id": "string",
  "station_name": "string",
  "fuel_type": "string",
  "price_per_litre": "number",
  "distance_km": "number",
  "address": "string"
}
```
**`404`** if no station found in radius.

---

### `GET /prices/{station_id}/history`
**Auth:** Required

**Query Params:** `fuel_type` (string, optional)

**Response `200`:**
```json
[
  {
    "id": "string",
    "station_id": "string",
    "fuel_type": "string",
    "price_per_litre": "number",
    "updated_by": "string | null",
    "effective_from": "datetime",
    "created_at": "datetime"
  }
]
```
Sorted latest first. Max 100 records.

---

### `POST /prices/alerts`
**Auth:** Required

**Request:**
```json
{
  "station_id": "string",
  "fuel_type": "string",
  "target_price": "number (> 0)"
}
```
**Response `201`:**
```json
{
  "id": "string",
  "user_id": "string",
  "station_id": "string",
  "fuel_type": "string",
  "target_price": "number",
  "is_active": true,
  "created_at": "datetime"
}
```

---

### `GET /prices/alerts`
**Auth:** Required

**Response `200`:**
```json
[
  {
    "id": "string",
    "user_id": "string",
    "station_id": "string",
    "fuel_type": "string",
    "target_price": "number",
    "is_active": "boolean",
    "created_at": "datetime"
  }
]
```

---

### `DELETE /prices/alerts/{alert_id}`
**Auth:** Required

**Response `204`:** No content.

---

## FLEET ENDPOINTS

---

### `GET /fleet/vehicles`
**Auth:** Required

**Response `200`:**
```json
[
  {
    "id": "string",
    "registration_number": "string",
    "make": "string",
    "model": "string",
    "year": "integer",
    "fuel_type": "string",
    "tank_capacity": "number",
    "owner_uid": "string",
    "assigned_driver_uid": "string | null",
    "is_active": "boolean",
    "total_fuel_consumed": "number",
    "total_expense": "number",
    "created_at": "datetime"
  }
]
```

---

### `POST /fleet/vehicles`
**Auth:** Required

**Request:**
```json
{
  "registration_number": "string",
  "make": "string",
  "model": "string",
  "year": "integer",
  "fuel_type": "petrol | diesel | premium | cng | lpg",
  "tank_capacity": "number (> 0)"
}
```
**Response `201`:** Created vehicle object (same structure as GET).

---

### `GET /fleet/vehicles/{vehicle_id}`
**Auth:** Required

**Response `200`:** Single vehicle object.

---

### `PUT /fleet/vehicles/{vehicle_id}`
**Auth:** Required

**Request:** (all optional)
```json
{
  "make": "string | null",
  "model": "string | null",
  "fuel_type": "string | null",
  "tank_capacity": "number | null",
  "is_active": "boolean | null"
}
```
**Response `200`:** Updated vehicle object.

---

### `DELETE /fleet/vehicles/{vehicle_id}`
**Auth:** Required

**Response `204`:** No content.

---

### `GET /fleet/vehicles/{vehicle_id}/consumption`
**Auth:** Required

**Response `200`:**
```json
{
  "vehicle_id": "string",
  "registration_number": "string",
  "total_fuel_consumed": "number",
  "monthly_breakdown": {
    "YYYY-MM": {
      "litres": "number",
      "amount": "number"
    }
  }
}
```

---

### `GET /fleet/expenses`
**Auth:** Required

**Query Params:** `vehicle_id` (string), `category` (string), `month` (int 1–12), `year` (int)

**Response `200`:**
```json
{
  "total": "integer",
  "items": [
    {
      "id": "string",
      "vehicle_id": "string",
      "user_id": "string",
      "category": "fuel | maintenance | toll | parking | other",
      "amount": "number",
      "litres": "number | null",
      "station_id": "string | null",
      "description": "string | null",
      "expense_date": "date (YYYY-MM-DD)",
      "created_at": "datetime"
    }
  ]
}
```

---

### `POST /fleet/expenses`
**Auth:** Required

**Request:**
```json
{
  "vehicle_id": "string",
  "category": "fuel | maintenance | toll | parking | other",
  "amount": "number (> 0)",
  "litres": "number | null",
  "station_id": "string | null",
  "description": "string | null",
  "expense_date": "date YYYY-MM-DD | null"
}
```
**Response `201`:** Created expense object.

---

### `GET /fleet/budget`
**Auth:** Required

**Query Params:** `vehicle_id` (string), `month` (int), `year` (int)

**Response `200`:**
```json
{
  "id": "string",
  "user_id": "string",
  "vehicle_id": "string | null",
  "month": "integer (1-12)",
  "year": "integer",
  "budget_amount": "number",
  "spent_amount": "number",
  "remaining": "number"
}
```
**If no budget set:** `{ "message": "No budget set for this period" }`

---

### `PUT /fleet/budget`
**Auth:** Required

**Request:**
```json
{
  "vehicle_id": "string | null",
  "month": "integer (1-12)",
  "year": "integer",
  "amount": "number (> 0)"
}
```
**Response `200`:**
```json
{ "message": "Budget set", "budget_id": "string" }
```

---

### `GET /fleet/drivers`
**Auth:** Required

**Response `200`:**
```json
[
  {
    "id": "string",
    "full_name": "string",
    "phone": "string",
    "license_number": "string",
    "uid": "string | null",
    "assigned_vehicle_id": "string | null",
    "is_active": "boolean",
    "created_at": "datetime"
  }
]
```

---

### `POST /fleet/drivers`
**Auth:** Required

**Request:**
```json
{
  "full_name": "string",
  "phone": "string",
  "license_number": "string"
}
```
**Response `201`:** Created driver object.

---

### `PUT /fleet/vehicles/{vehicle_id}/driver`
**Auth:** Required

**Request:**
```json
{ "driver_uid": "string" }
```
**Response `200`:**
```json
{ "message": "Driver assigned to vehicle" }
```

---

## FRAUD ENDPOINT

---

### `POST /fraud/flag`
**Auth:** Required

**Request:**
```json
{
  "transaction_id": "string",
  "reason": "string",
  "severity": "low | medium | high"
}
```
**Response `201`:**
```json
{
  "alert_id": "string",
  "message": "Transaction flagged"
}
```

---

# PART 3 — GLOBAL REFERENCE

---

## Error Response Format

Every error from the API returns:
```json
{ "detail": "Human-readable error message" }
```

| HTTP Code | Meaning | UI Action |
|-----------|---------|-----------|
| `400` | Bad request | Show `detail` as inline error |
| `401` | Token expired / missing | Auto-refresh token, retry once. If fails → force logout |
| `403` | No permission | Show "Access denied" toast |
| `404` | Not found | Show empty state |
| `422` | Validation error | Highlight the field mentioned in response |
| `500` | Server error | Show "Something went wrong. Please try again." |

---

## Token Management

```
LOGIN / SIGNUP
  → Store access_token (expires 60 min) in Secure Storage
  → Store refresh_token (expires 30 days) in Secure Storage

EVERY API REQUEST
  → Attach: Authorization: Bearer <access_token>

ON 401 RESPONSE
  → Call POST /auth/refresh-token with { refresh_token }
  → Store new access_token
  → Retry original request once

IF REFRESH ALSO FAILS (401)
  → Clear all tokens from Secure Storage
  → Navigate to Login screen
```

---

## Field Type Quick Reference

| Type shown | Meaning |
|-----------|---------|
| `"string"` | Plain text |
| `"string (uuid)"` | Unique ID — don't display raw, use last 8 chars if needed |
| `"string \| null"` | May be absent — always check before rendering |
| `"number"` | Float/decimal |
| `"integer"` | Whole number |
| `"boolean"` | `true` or `false` |
| `"datetime"` | UTC ISO 8601 → `"2026-04-09T10:00:00Z"` — format for display |
| `"date"` | `"YYYY-MM-DD"` — no time component |

---

## Null Field Handling (UI Rules)

| Field | When `null` → Show |
|-------|-------------------|
| `avatar_url` | Colored circle with initials from `full_name` |
| `phone` | "Not provided" grey text |
| `vehicle_id` on transaction | Hide vehicle row entirely |
| `evidence_url` on transaction | Hide snapshot section |
| `assigned_driver_uid` on vehicle | "No driver assigned" |
| `distance_km` on station | Hide distance label |
| `operating_hours` on station | Hide hours row |
| `contact_phone` on station | Hide call button |
| `description` on expense | Hide description row |

---

## Enum Values — Complete Reference

### `role`
`customer` · `driver` · `employee` · `admin` · `super_admin`

### `fuel_type`
`petrol` · `diesel` · `premium` · `cng` · `lpg`

### `session.status`
`pending` · `active` · `completed` · `timed_out` · `cancelled`

### `transaction.status`
`pending` · `completed` · `failed` · `refunded`

### `payment_method`
`cash` · `card` · `wallet` · `qr_pay`

### `expense.category`
`fuel` · `maintenance` · `toll` · `parking` · `other`

### `fraud severity`
`low` · `medium` · `high`
