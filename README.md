# Live Query Filter System — CatalogFlow

A full-stack catalog browser with debounced search, multi-category filters, sorting, pagination, responsive cards, loading and empty states.

## Features
- Express REST endpoint: `GET /api/catalog?search=&category=&page=&limit=&sort=`
- 250 synthetic learning-resource catalog records (JSON)
- Search title, category, level, and description
- Select one or more categories
- Sort by title A–Z/Z–A, rating, duration ascending/descending
- Pagination and selectable page size (9/12/24)
- 350 ms debounced search and abortable requests
- Responsive layout, accessible status updates, keyboard shortcut Ctrl/⌘ + K
- Health endpoint: `GET /api/health`

## Requirements
Node.js 18+ and npm.

## Run locally
```bash
npm install
npm run dev
```
Then open http://localhost:3000

## API examples
- `GET /api/catalog`
- `GET /api/catalog?search=python`
- `GET /api/catalog?category=Analytics,Development`
- `GET /api/catalog?search=security&category=Security&page=2&limit=9&sort=rating-desc`
- `GET /api/health`

The API response includes `data`, `pagination` (`total`, `page`, `limit`, `pages`) and echoed `filters`.

## Deploy to Render
1. Push this repository to GitHub.
2. In Render, choose **New → Web Service**, connect the repository.
3. Runtime: Node. Build command: `npm install`. Start command: `npm start`.
4. Deploy; Render assigns a public URL. Verify the URL and `/api/health`.

## Dataset note
The included `data/catalog.json` is a locally generated synthetic catalog of 250 records using the categories Analytics, Development, Security, and Design. It is shaped for this assignment and avoids relying on an external dataset URL during deployment.
