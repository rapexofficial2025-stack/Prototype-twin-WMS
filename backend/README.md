# Frost WMS Backend (Django + Supabase Postgres + Firebase)

Django owns all business logic and is the only writer to the database.
Supabase is just the Postgres host — Django's ORM connects to it like any
other Postgres instance. Firebase Realtime Database is a one-way mirror used
only to push live status updates to the frontend (digital twin, dashboard
alerts); it holds no source-of-record data.

## Setup

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate      # .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env        # fill in your Supabase DATABASE_URL
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

To enable live Firebase pushes, also set `FIREBASE_CREDENTIALS_JSON` (path to
a service account key downloaded from Firebase Console) and
`FIREBASE_DATABASE_URL` in `.env`. Without them the app still runs — Firebase
pushes just silently no-op (see `apps/core/firebase.py`).

## What's live-connected right now

- `apps/warehouse` — `Room` / `Location` models, plus
  `GET /api/warehouse/rooms/<room_number>/twin/`, the endpoint the React 3D
  Digital Twin should call instead of its current fake hash-based occupancy.
- `apps/stock` — `Batch` / `Tag` / `StockLedger` models. Saving, moving, or
  deleting a `Tag` automatically recomputes its `Location.status`
  (`apps/stock/signals.py`), which in turn mirrors to Firebase
  (`apps/warehouse/signals.py`) — that's the "connects to inventory and
  ledger live" chain end to end.
- `GET /api/stock/ledger/` — feeds the Stock Ledger report page.
- Django admin (`/admin/`) is enabled so you can create Customers, Items,
  Rooms, Locations, Batches, and Tags by hand right now, before the custom
  entry forms (Stock Acceptance, Withdrawal, etc.) are built.

## Not built yet

- Receiving / Withdrawal / Transfer / Adjustment posting endpoints (the doc
  header+grid forms) — the models exist, the workflow logic that writes
  `StockLedger` rows from a posted document does not.
- Auth (Firebase ID token verification on the Django side).
- Seed data / fixtures for the 10 rooms × 30 columns × 7 levels × 4 depths
  layout the frontend's 3D twin currently hardcodes.
