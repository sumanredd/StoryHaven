# StoryHaven - Book Exploration Platform

## Overview
StoryHaven is a production-minded book exploration platform that allows users to navigate from high-level headings → categories → products → product detail pages. The data is dynamically scraped from [World of Books](https://www.worldofbooks.com/). The platform is built with a **Next.js frontend** and a **NestJS backend**.

---

## Architecture Overview

my-app/
├─ src/ # Frontend
│ └─ app/
| |_about
| |_book
│ ├─ components/ # Reusable components
│ ├─ pages/ # Home, Book detail, About
│ └─ styles/ # CSS
├─ backend/ # Backend
│ ├─ src/
│ │ ├─ controllers/ # API controllers
│ │ ├─ services/ # Scraping logic (Crawlee + Playwright)
│ │ └─ main.ts # Entry point
│ └─ package.json
├─ .github/
│ └─ workflows/ # CI/CD pipeline
├─ README.md
└─ package.json

markdown
Copy code

- **Frontend**: Next.js (App Router, React, TypeScript, Tailwind CSS, MUI).  
- **Backend**: NestJS (Node + TypeScript).  
- **Scraping**: Crawlee + Playwright for World of Books.  
- **State Management**: `sessionStorage` to persist recently viewed books.  

---

## Design Decisions
- **Frontend structure** kept in `src/app` to follow Next.js App Router best practices.  
- **Recently viewed books** stored in sessionStorage to avoid requiring a DB for MVP.  
- **Caching** search results in sessionStorage to reduce repeated scraping.  
- **Separate jobs for frontend and backend** in CI/CD using GitHub Actions.  
- **Responsive design**: Mobile-first using Tailwind CSS.  

---

## Deployment Instructions

### Frontend
1. Navigate to frontend folder:  
```bash
cd my-app/src
Install dependencies:

bash
Copy code
npm install
Run locally (development mode):

bash
Copy code
npm run dev
Opens at http://localhost:3000 by default.

Build for production:

bash
Copy code
npm run build
Start production build:

bash
Copy code
npm start
---
Backend
Setup & Run

Open a new terminal and navigate to backend folder:

cd my-app/backend


Install dependencies:

npm install


Run locally (development mode):

npm run start:dev


The backend serves scraping APIs at http://localhost:3001 (check main.ts for exact port).

Running Frontend + Backend Together
# Terminal 1: Frontend
cd my-app/src
npm run dev

# Terminal 2: Backend
cd my-app/backend
npm run start:dev

### GitHub Actions CI/CD
- Workflow located at `.github/workflows/ci.yml`.
- Lints, tests, and builds both frontend and backend.

---

## Database (Optional for MVP)
Currently, database is **not implemented**.  
For production, recommended schema (PostgreSQL/MongoDB):

**Entities**
- `navigation` (id, title, slug, last_scraped_at)  
- `category` (id, navigation_id, parent_id, title, slug, product_count, last_scraped_at)  
- `product` (id, source_id, title, price, currency, image_url, source_url, last_scraped_at)  
- `product_detail` (product_id, description, specs JSON, ratings_avg, reviews_count)  
- `review` (id, product_id, author, rating, text, created_at)  
- `scrape_job` (id, target_url, target_type, status, started_at, finished_at, error_log)  
- `view_history` (id, user_id, session_id, path_json, created_at)  

**Sample Seed Script**
```js
// backend/src/seeds/seed.js
const products = [
  {
    source_id: "123",
    title: "Sample Book",
    author: "Author Name",
    price: "£10.99",
    image_url: "https://example.com/book.jpg",
    source_url: "https://www.worldofbooks.com/en-gb/product/123"
  }
];



API Documentation

Scraping API
Search Books
bash
Copy code
GET /scrape/search?q={keyword}
Response:
{
  products: [
    { title, author, price, image, link }
  ]
}
Category
bash
Copy code
GET /scrape/category?url={categoryUrl}
Response:
{
  products: [
    { title, author, price, image, link }
  ]
}
Book Detail
bash
Copy code
GET /scrape/book-detail?url={bookUrl}
Response:
{
  title,
  author,
  price,
  image,
  link,
  aboutBook,
  aboutAuthor,
  reviews,
  additionalInfoTable,
  youMightAlsoLike
}
Tests
Frontend: npm run test (React Testing Library)

Backend: npm run test (Jest)

CI/CD ensures both frontend and backend build and pass tests.
