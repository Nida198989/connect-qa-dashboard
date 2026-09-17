# Connect QA Daily Reporting & Automation Dashboard

A client-ready **QA Command Center** for the Connect program. QA engineers enter daily automation and testing progress. The system calculates weekly, sprint, module, UI, API, team, and overall coverage from live data — nothing on the dashboard is hard-coded.

## Live URL

https://nida198989.github.io/connect-qa-dashboard/

Sign in with `nida.naaz@connect.qa` / `Connect@123`.

## Stack

- Frontend: React 18 + TypeScript + Vite + Material UI + Recharts + Day.js
- Backend: Node.js + Express
- Data: JSON file store (`server/data/db.json`) with baseline vs incremental daily progress
- Export: Excel (ExcelJS) and print-friendly PDF

## Quick start

From the `connect-qa-dashboard` folder:

```bash
npm install
npm install --prefix server
npm install --prefix client
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

The API runs on [http://localhost:4000](http://localhost:4000). Vite proxies `/api` to the server.

### Demo accounts

Password for every seeded user: `Connect@123`

| Role | Email | Can do |
| --- | --- | --- |
| QA Lead | `nida.naaz@connect.qa` | All dashboards, edit any daily update, manage modules/sprints, export |
| QA User | `priya.sharma@connect.qa` | Own daily updates + view dashboards |
| Admin | `admin@connect.qa` | Users, baseline scope, counting model, coverage thresholds |

Other QA users: `rahul.mehta@connect.qa`, `ananya.iyer@connect.qa`, `vikram.patel@connect.qa`.

QA names are editable:

- On **Daily Update**, type a new name or change the selected name. Saving applies it across reports.
- On **Administration → QA names**, double-click a name to rename it. Leads and admins can also add QA members there.

## How numbers work

Connect module totals are stored as **baseline / current scope**. Daily updates are **incremental**. Dashboards always compute:

`current = baseline + sum(daily updates)`

That keeps historical reporting accurate and prevents a daily save from overwriting the original Connect inventory.

Default counting model is **unique test cases**:

- UI Automated = cumulative UI automation
- API Automated = cumulative API automation
- Total Automated = UI Automated (API is a separate asset count)
- This avoids double-counting a test case automated at both UI and API levels

An administrator can switch the model to `unique_max` or `separate_assets` (UI + API) under Administration.

Automation cannot exceed a module’s Total TC, and API automated cannot exceed APIs recorded, unless an administrator explicitly allows it.

Daily uniqueness key:

`Date + QA + Module + User Story`

Saving again updates the same record and writes an audit entry.

## Screens

1. Dashboard — executive KPIs, daily trend, in-sprint vs backlog
2. Daily Update — QA data entry
3. Module Progress — coverage table + drill-down
4. Sprint Progress — Sprint 17 / 18 / 19
5. Team Progress — workload visibility, not ranking
6. API Automation
7. UI Automation
8. Reports — weekly status and bimonthly range
9. Client View — executive presentation (hides QA productivity, comments, admin)
10. Administration — users, modules, sprints, thresholds

Every dashboard supports Today, This Week, Last Week, Current Sprint, Last Sprint, This Month, Last Month, and a custom range. **Refresh Dashboard** reloads data without a browser restart. Saving a daily update also refreshes the shared dashboard state.

## Production build

```bash
npm run build
npm start --prefix server
```

The Express server serves `client/dist` when that folder exists.

## Reset sample data

Sign in as admin and `POST /api/seed`, or delete `server/data/db.json` and restart the server.
