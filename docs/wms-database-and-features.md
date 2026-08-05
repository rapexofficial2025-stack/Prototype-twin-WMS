# Frost WMS — Database Schema & Module Feature Spec

Source: legacy Antarctica Cold Storage WMS screenshots/spec, adapted for Frost WMS.
3D Digital Twin replaces the old 2D Storage Status map.

**Stack (no Xano):**
- **React + Vite** — frontend (this repo, `client/`)
- **Django** — REST API + all business logic (receiving/withdrawal/transfer/adjustment
  posting rules, ledger writes, ageing calculation, permissions)
- **Supabase (Postgres)** — the actual database. Django's ORM connects to Supabase's
  Postgres connection string like any other Postgres host; Supabase's own client-side
  SDK/RLS is not used from the frontend — all writes go through Django.
- **Firebase** — auth session/token handling and realtime notifications only (e.g. "2
  rooms need attention" pushes, live occupancy ticks). No business data lives in
  Firebase, matching the RAPEX rule that Firebase stays infra-only.

Navigation groups: **Dashboard · Storage · Listing · Inquiry · Reports · Admin**

---

## 1. Database Schema (PostgreSQL via Supabase, owned by Django models)

### Core Master Data

**customers**
| field | type | notes |
|---|---|---|
| id | pk | |
| customer_no | text, unique | legacy code |
| customer_name | text | |
| contact_person | text | |
| status | enum(active, inactive) | |

**items**
| field | type | notes |
|---|---|---|
| id | pk | |
| customer_id | fk → customers | items are customer-owned |
| item_name | text | |
| item_group | text | for ageing filters |
| packaging | text | e.g. box, sack |
| default_avg_weight | decimal | |

**rooms**
| field | type | notes |
|---|---|---|
| id | pk | |
| room_name | text | e.g. "Cold Room 01" |
| wing | enum(left, right) | matches legacy Storage Status |
| room_type | enum(dry, anti/frozen, chilled) | |
| capacity_locations | int | |
| target_temp_c | decimal | |

**locations**
| field | type | notes |
|---|---|---|
| id | pk | |
| room_id | fk → rooms | |
| location_code | text | rack/lane/level address |
| status | enum(empty, occupied, reserved, blocked) | drives digital-twin color |

**batches**
| field | type | notes |
|---|---|---|
| id | pk | |
| item_id | fk → items | |
| batch_no | text | |
| production_date | date | |
| expiration_date | date | |

**tags** (pallet tags — one row per physical pallet)
| field | type | notes |
|---|---|---|
| id | pk | |
| tag_no | text, unique | |
| batch_id | fk → batches | |
| location_id | fk → locations, nullable | |
| customer_id | fk → customers | denormalized for fast filtering |
| quantity | decimal | |
| avg_weight | decimal | |
| total_weight | decimal | quantity × avg_weight |
| received_date | date | |
| status | enum(in_storage, withdrawn, transferred, adjusted) | |

### Transactions

**receiving_docs** (Stock Acceptance header)
| field | type | notes |
|---|---|---|
| id | pk | |
| slip_number | text | |
| reference_no | text | |
| customer_id | fk → customers | |
| container_no | text | |
| container_size | text | |
| charge_unloading | decimal | |
| charge_ot_facility | decimal | |
| datetime_from | timestamp | |
| datetime_to | timestamp | |
| status | enum(draft, saved, posted) | |
| total_pallets | int | computed |
| total_quantity | decimal | computed |
| total_weight | decimal | computed |

**receiving_lines**
| field | type | notes |
|---|---|---|
| id | pk | |
| receiving_doc_id | fk → receiving_docs | |
| tag_id | fk → tags | created here |
| item_id | fk → items | |
| batch_id | fk → batches | |
| room_id | fk → rooms | |
| location_id | fk → locations | |
| quantity | decimal | |
| avg_weight | decimal | |
| total_weight | decimal | |
| notes | text | |

**withdrawal_docs** (Stock Withdrawal header)
| field | type | notes |
|---|---|---|
| id | pk | |
| withdrawal_no | text | |
| reference_no | text | |
| customer_id | fk → customers | |
| plate_number | text | |
| charge_ot_facility | decimal | |
| datetime | timestamp | |
| status | enum(draft, saved, posted) | |
| total_pallets / total_quantity / total_weight | computed | |

**withdrawal_lines**
| field | type | notes |
|---|---|---|
| id | pk | |
| withdrawal_doc_id | fk → withdrawal_docs | |
| tag_id | fk → tags | |
| location_id | fk → locations | source |
| quantity | decimal | |
| avg_weight / weight | decimal | |
| remarks | text | |

**transfer_docs** (Stock Transfer header)
| field | type | notes |
|---|---|---|
| id | pk | |
| transfer_no | text | |
| customer_id | fk → customers | |
| date | date | |
| status | enum(draft, saved, posted) | |

**transfer_lines**
| field | type | notes |
|---|---|---|
| id | pk | |
| transfer_doc_id | fk → transfer_docs | |
| tag_id | fk → tags | |
| current_location_id | fk → locations | |
| new_room_id | fk → rooms | |
| new_location_id | fk → locations | |
| new_tag_no | text, nullable | if split/re-tagged |
| quantity | decimal | |

**adjustment_docs**
| field | type | notes |
|---|---|---|
| id | pk | |
| reference | text | |
| customer_id | fk → customers | |
| reason | enum(damaged, missing, recount, wrong_encoding, weight_correction) | |
| date | date | |

**adjustment_lines**
| field | type | notes |
|---|---|---|
| id | pk | |
| adjustment_doc_id | fk → adjustment_docs | |
| tag_id | fk → tags | |
| item_id | fk → items | |
| location_id | fk → locations | |
| quantity_delta | decimal | |
| weight_delta | decimal | |
| remarks | text | |

**stock_ledger** (append-only, immutable — mirrors RAPEX ledger pattern)
| field | type | notes |
|---|---|---|
| id | pk | |
| doc_type | enum(acceptance, withdrawal, transfer, adjustment) | |
| doc_id | uuid | polymorphic ref to source doc |
| tag_id | fk → tags | |
| batch_id | fk → batches | |
| location_id | fk → locations | |
| item_id | fk → items | |
| customer_id | fk → customers | |
| quantity | decimal | signed (+in / -out) |
| packing | text | |
| avg_weight | decimal | |
| weight | decimal | signed |
| running_balance | decimal | computed, per item+customer |
| production_date / expiration_date | date | |
| created_at | timestamp | never updated after insert |

**users** / **roles** / **role_permissions** — role-based access (Admin module).

---

## 2. Features per Module (mapped to nav groups)

### Dashboard
- Live KPI tiles: Total Capacity, Occupancy %, Inbound Today, Outbound Today
- "N rooms need attention" alert banner (threshold-driven, e.g. >90% full or blocked locations)
- Cold Room Status cards → clicking opens the 3D Digital Twin for that room
- Per-room live temp reading (feeds from Django API, pushed live via Firebase; later IoT sensor integration)

### Storage → Stock Acceptance (Receiving)
- Header form (customer, reference/batch/slip no., container info, charges, date range)
- Line-item grid: item, batch, tag, room, location, dates, packaging, qty, avg weight, total weight
- Auto-generated `tag_no` per pallet on save
- Bottom summary auto-totals (pallets/qty/weight)
- Draft save, Duplicate, Copy actions
- On post: creates `tags` + `receiving_lines` + `stock_ledger` entries, updates `locations.status`

### Listing → Receiving List
- Table of all receiving docs with expandable line-item detail
- Filters: customer, date, status
- Status badges (draft/saved/posted)

### Storage → Stock Withdrawal
- "Select Stocks" picker (search by tag/batch/location/item) instead of manual entry
- Header + grid same shape as receiving, minus item creation (references existing tags)
- On post: frees `locations`, updates `tags.status = withdrawn`, writes ledger

### Storage → Stock Transfer
- "Select Stocks" + destination room/location picker
- Split function: partial-quantity transfer creates a new tag, reduces source tag qty
- On post: updates `tags.location_id`, writes ledger with 2 entries (out of old loc, in to new)

### Storage → Stock Adjustment
- Reason-coded correction form (damaged/missing/recount/wrong encoding/weight correction)
- Requires remarks; writes signed delta to `stock_ledger`
- Should be permission-gated (Admin/Supervisor role only)

### Inquiry / Reports → Stock Ledger
- Full transaction history, filterable by batch/tag/location/customer/item/date/production/expiration/age
- Running balance column, per item+customer
- Export to CSV/PDF

### Storage → Storage Status **(replaced by 3D Digital Twin)**
- Per-customer summary: pallets, capacity, current load, available %
- Legacy 2D wing/room map → replaced by the existing `DigitalTwinRoom` / `DriveInRack` / `DriveLane` 3D components
- Location color state (Occupied/Empty/Reserved/Blocked) drives both the legacy-style minimap AND the 3D twin materials — single source of truth from `locations.status`

### Reports → Stock Ageing
- FEFO report bucketed by age: 0–3, 3–6, 6–9, 9–12, 12+ months (computed from `production_date`)
- Filters: batch/tag/location/customer/item/production/expiration/age date
- Columns: customer, quantity, kg per bucket

### Admin
- Users & role-based access (roles: Admin, Warehouse Manager, Encoder, Viewer)
- Audit trail (who posted/edited/voided which document — separate `audit_log` table, append-only)
- Customer & Item master maintenance
- Room/Location master maintenance (defines the digital twin's physical layout)

---

## 3. Suggested build order

1. Core masters: customers, items, rooms, locations, batches, tags
2. Stock Acceptance → Receiving List (get inbound working end-to-end, writes ledger)
3. Storage Status / Digital Twin wired to `locations.status` (visual payoff early)
4. Stock Withdrawal
5. Stock Ledger report (depends on 2 & 4 existing)
6. Stock Transfer, Stock Adjustment
7. Stock Ageing report
8. Admin (users/roles/audit) — needed before going multi-user, can build in parallel
