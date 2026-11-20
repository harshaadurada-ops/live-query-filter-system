const express = require('express');
const path = require('path');
const catalog = require('./data/catalog.json');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', records: catalog.length }));
app.get('/api/catalog', (req, res) => {
  const search = String(req.query.search || '').trim().toLowerCase();
  const categories = String(req.query.category || '').split(',').map(x => x.trim()).filter(Boolean);
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
  const sort = String(req.query.sort || 'title-asc');
  let results = catalog.filter(item => {
    const matchesSearch = !search || `${item.title} ${item.category} ${item.level} ${item.description}`.toLowerCase().includes(search);
    const matchesCategory = categories.length === 0 || categories.includes(item.category);
    return matchesSearch && matchesCategory;
  });
  const sorters = {
    'title-asc': (a,b) => a.title.localeCompare(b.title),
    'title-desc': (a,b) => b.title.localeCompare(a.title),
    'rating-desc': (a,b) => b.rating - a.rating,
    'duration-asc': (a,b) => a.durationMinutes - b.durationMinutes,
    'duration-desc': (a,b) => b.durationMinutes - a.durationMinutes
  };
  results.sort(sorters[sort] || sorters['title-asc']);
  const total = results.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * limit;
  res.json({ data: results.slice(start, start + limit), pagination: { total, page: safePage, limit, pages }, filters: { search, categories, sort } });
});
app.get(/.*/, (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`Live Query Filter System running at http://localhost:${PORT}`));
