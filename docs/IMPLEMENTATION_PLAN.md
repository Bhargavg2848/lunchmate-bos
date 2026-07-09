# Implementation Plan (Fast, Low-Budget)

## Goals
- Deliver a usable POS MVP quickly
- Keep costs near zero using free tiers and GitHub Student-friendly tools
- Build foundations that scale from 5–10 to 50+ clients

## Delivery Phases

### Phase 1 (MVP Core)
1. Foundation setup (repo structure, env docs, coding conventions)
2. Auth + Roles
3. Customer Module
4. Catalog Module
5. Orders Module
6. Billing Module

### Phase 2 (Operations)
1. Kitchen workflow board
2. Search and filters
3. Print-friendly KOT/Invoice
4. Settings

### Phase 3 (Reliability)
1. Reports
2. Audit logs
3. Backup and recovery baseline
4. Security hardening + performance pass

## Recommended Timeline
- Week 1: Foundation + Auth + Customer
- Week 2: Catalog + Orders
- Week 3: Billing + Kitchen basics
- Week 4: Reports + hardening

## Engineering Rules
- Type-safe APIs and schema validation
- One module at a time
- No breaking changes to completed flows
- Keep screens mobile-first and action-fast
