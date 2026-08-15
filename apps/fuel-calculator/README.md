# Fuel Hisab Pro PWA

React + TypeScript + Vite progressive web app for one-day fuel totalizer and payment reconciliation.

## Production route

`/tools/fuel-calculator/`

## Features

- Mode 1: HSD / HSD / HSD / HSD
- Mode 2: MS / HSD / MS / HSD
- Evening minus Morning live differences
- Testing deductions and editable HSD/MS rates
- Extra plus/minus adjustment
- Udhari, Paytm, F-Card, PhonePe, bank, expenses and cash reconciliation
- Balance/Fault and Match/Check result
- Local draft persistence
- Installable scoped PWA with offline runtime cache

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The Vite build writes deployable files directly to `../../tools/fuel-calculator/`, which the existing GitHub Pages workflow publishes with the rest of the repository.
