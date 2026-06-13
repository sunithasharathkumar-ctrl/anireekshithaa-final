# Anireekshithaa – Psychological Thriller Short Film

Official promotional and ticketing website for **Anireekshithaa** by Aantharya Creations.

## 🎬 Features

- **Movie Promotion** — Hero section, synopsis, cast & crew showcase
- **Video Teaser Player** — Custom cinematic player with controls
- **Review Corner** — Written + voice note review submission
- **Ticket Booking** — 3-step booking wizard (Seats → Details → UPI Payment)
- **UPI-Only Payment** — QR code + UPI ID (9986048332@ybl) — no Razorpay
- **Manual Approval** — Organizer reviews & approves/rejects bookings via dashboard
- **Supabase Backend** — All bookings, reviews stored in Supabase
- **WhatsApp Confirmation** — Auto-sent to attendees after organizer approval
- **Organizer Dashboard** — Password-protected admin panel with stats & booking management
- **Mobile Responsive** — Fully optimized for Android, iPhone, and tablets

## 🚀 Vercel Deployment

1. Import this repository into [Vercel](https://vercel.com)
2. Set **Root Directory** to `Anirikshitha` (if repo root is the parent folder)
3. Set **Framework Preset** → `Other`
4. **Build Command** → *(leave empty)*
5. **Output Directory** → `.` *(or leave empty)*
6. Click **Deploy**

> The `vercel.json` file in this folder handles all routing automatically.

## 🗄️ Supabase Setup

The app connects to Supabase for storing bookings and reviews.

### Required Tables

**`bookings`** table:
```sql
create table bookings (
  id uuid default gen_random_uuid() primary key,
  booking_id text unique not null,
  name text not null,
  phone text not null,
  email text,
  tickets integer not null,
  amount numeric not null,
  booking_status text default 'pending',
  payment_status text default 'pending',
  created_at timestamptz default now()
);
```

**`reviews`** table:
```sql
create table reviews (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null,
  rating integer,
  content text,
  audio_url text,
  created_at timestamptz default now()
);
```

### Required RLS Policies
```sql
-- Allow public insert to bookings
create policy "Allow public insert to bookings"
on bookings for insert using (true) with check (true);

-- Allow public select to bookings
create policy "Allow public select to bookings"
on bookings for select using (true);

-- Allow public update to bookings
create policy "Allow public update to bookings"
on bookings for update using (true) with check (true);

-- Allow public delete to bookings (for reset)
create policy "Allow public delete to bookings"
on bookings for delete using (true);

-- Allow public insert to reviews
create policy "Allow public insert to reviews"
on reviews for insert using (true) with check (true);

-- Allow public select to reviews
create policy "Allow public select to reviews"
on reviews for select using (true);
```

## 📁 Project Structure

```
Anirikshitha/
├── index.html          # Main HTML (all pages in one)
├── app.js              # All JavaScript logic
├── styles.css          # All CSS styles (responsive)
├── vercel.json         # Vercel deployment config
├── package.json        # Project metadata
├── assets/
│   ├── poster.png              # Movie poster
│   ├── char_glow.jpg           # Hero backdrop
│   ├── char_face.jpg           # Teaser thumbnail
│   ├── payment_qr.png          # UPI QR code image
│   ├── sharath_raj.jpg         # Cast photo
│   ├── sughosh_ram.jpg         # Cast photo
│   ├── swaroop.jpg             # Cast photo
│   ├── swathi_gurudath.jpg     # Cast photo
│   ├── director_adarsh.jpg     # Crew photo
│   ├── dop_ajay.jpg            # Crew photo
│   ├── editor_ankith.jpg       # Crew photo
│   ├── music_shashikumar.jpg   # Crew photo
│   ├── bts1.png                # Behind the scenes
│   ├── bts2.png                # Behind the scenes
│   ├── synopsis_still.png      # Synopsis image
│   ├── char_full.jpg           # Character photo
│   └── char_turnaround.jpg     # Character photo
```

## 🔐 Organizer Panel

Access the organizer dashboard via the **"Organizer Panel"** button in the footer.

**Default Password:** `Anirikshitha@2026`

---

© 2026 Aantharya Creations. All rights reserved.
