# CreatorKit

**CreatorKit** is an agency-focused campaign operations platform designed to unify creator workflows, campaign briefs, approvals, and cross-platform performance analytics into a single internal tool.

It was built as a **portfolio project** to demonstrate how modern agencies can rapidly ship internal systems that combine API integrations, clean UX, and AI-native features—without overengineering.

---

## Why CreatorKit Exists

Creator and influencer agencies often rely on:
- Spreadsheets for campaign tracking
- Docs for briefs
- Slack for approvals
- Platform dashboards for analytics

CreatorKit explores what happens when those workflows are **intentionally unified** into a single, purpose-built system.

The focus is not scale-at-all-costs, but:
- Clear data boundaries
- Fast internal iteration
- Practical AI usage
- Agency-first UX decisions

---

## Core Capabilities

### Campaign Operations
- Centralized campaign and creator tracking
- Structured campaign briefs and deliverables
- Simple approval states (draft → review → approved)

### AI-Native Workflows
- AI-generated creator briefs based on campaign inputs
- Automated performance summaries from engagement metrics
- Designed to augment—not replace—human decision-making

### Cross-Platform Analytics
- Live YouTube Data API integration
- Mock TikTok and Instagram pipelines for demonstration
- Normalized metrics for easier comparison across platforms

---

## Technical Overview

### Frontend
- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**

Focused on:
- Fast internal UIs
- Clear information hierarchy
- Minimal cognitive load for operators

### Backend
- **Fastify**
- **PostgreSQL**
- Modular REST APIs

Designed for:
- Clean separation of concerns
- Easy extension to additional platforms
- Internal tooling, not public-facing traffic

### Integrations & AI
- OpenAI (brief generation & performance summaries)
- YouTube Data API
- Mock TikTok / Instagram APIs for system design demonstration

---

## Architecture Philosophy

CreatorKit favors:
- Explicit boundaries over magic
- Readable business logic over abstractions
- Internal velocity over premature optimization

The system is structured so that:
- Campaign logic is platform-agnostic
- Analytics ingestion can scale independently
- AI services are replaceable, not core dependencies

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or pnpm

![License](https://img.shields.io/badge/license-MIT-green)

### Setup

```bash
git clone https://github.com/your-username/creator-kit.git
cd creator-kit
npm install
```

### Environment Variables

Copy the API environment template and update the database connection as needed:

```bash
cp apps/api/.env.example apps/api/.env
```

### PostgreSQL (Docker)

Start Postgres with Docker:

```bash
docker run --name creatorkit-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=creatorkit \
  -p 5432:5432 \
  -d postgres:16
```

Load schema + seed (using the container's psql):

```bash
docker exec -i creatorkit-postgres psql -U postgres -d creatorkit < packages/db/schema.sql
docker exec -i creatorkit-postgres psql -U postgres -d creatorkit < packages/db/seed.sql
```


### Running the Apps

Start the API server:

```bash
cd apps/api
npm install
npm run dev
```

Start the web app (in another terminal):

```bash
cd apps/web
npm install
npm run dev
```
