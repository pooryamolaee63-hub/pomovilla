const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const DATA_PATH = path.join(__dirname, 'data', 'store.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

function ensureDataFile() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(DATA_PATH)) {
    const seed = {
      health: 'ok',
      properties: [
        {
          id: 'p-1001',
          code: 'MSH-1101',
          city: 'آمل',
          region: 'بلوار هراز',
          type: 'آپارتمان',
          status: 'active',
          price: 3200000000,
          land: 0,
          built: 110,
          beds: 2,
          location: 'شهری',
          structure: 'فلت',
          pool: 'ندارد',
          view: 'شهر',
          createdAt: new Date().toISOString(),
          advisor: 'a-1001'
        },
        {
          id: 'p-1002',
          code: 'MSH-1102',
          city: 'محمودآباد',
          region: 'ساحل',
          type: 'ویلایی',
          status: 'active',
          price: 9400000000,
          land: 280,
          built: 170,
          beds: 3,
          location: 'ساحلی',
          structure: 'دوبلکس',
          pool: 'روباز',
          view: 'دریا',
          createdAt: new Date().toISOString(),
          advisor: 'a-1002'
        }
      ],
      leads: [
        {
          id: 'l-2001',
          name: 'آقای رضایی',
          phone: '09123334441',
          city: 'آمل',
          source: 'تماس تلفنی',
          status: 'new',
          createdAt: new Date().toISOString()
        }
      ],
      transactions: [
        { id: 't-1', type: 'deposit', userId: 'u-1', amount: 2000000, createdAt: new Date().toISOString() }
      ],
      users: [
        { id: 'a-1001', role: 'manager', name: 'رضا کریمی', city: 'آمل', phone: '09110000101' },
        { id: 'a-1002', role: 'sub', name: 'سارا نوری', city: 'آمل', phone: '09110000102' },
        { id: 'u-1', role: 'buyer', name: 'شما', city: 'آمل', phone: '09120000000' }
      ]
    };

    fs.writeFileSync(DATA_PATH, JSON.stringify(seed, null, 2));
  }
}

function readStore() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function writeStore(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

app.get('/api/health', (req, res) => {
  const data = readStore();
  res.json({
    status: 'ok',
    health: data.health || 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/summary', (req, res) => {
  const data = readStore();
  res.json({
    totalProperties: data.properties.length,
    totalLeads: data.leads.length,
    totalUsers: data.users.length,
    revenue: data.transactions.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  });
});

app.get('/api/properties', (req, res) => {
  const data = readStore();
  res.json(data.properties);
});

app.get('/api/properties/:id', (req, res) => {
  const data = readStore();
  const item = data.properties.find((p) => p.id === req.params.id || p.code === req.params.id);
  if (!item) return res.status(404).json({ error: 'Property not found' });
  return res.json(item);
});

app.post('/api/properties', (req, res) => {
  const data = readStore();
  const payload = req.body || {};
  const property = {
    id: payload.id || `p-${Date.now()}`,
    code: payload.code || `MSH-${Math.floor(1100 + Math.random() * 500)}`,
    city: payload.city || 'آمل',
    region: payload.region || 'مرکز شهر',
    type: payload.type || 'آپارتمان',
    status: 'active',
    price: Number(payload.price || 0),
    land: Number(payload.land || 0),
    built: Number(payload.built || 0),
    beds: Number(payload.beds || 0),
    location: payload.location || 'شهری',
    structure: payload.structure || 'فلت',
    pool: payload.pool || 'ندارد',
    view: payload.view || 'شهر',
    createdAt: new Date().toISOString(),
    advisor: payload.advisor || 'a-1001'
  };

  data.properties.unshift(property);
  writeStore(data);
  res.status(201).json(property);
});

app.get('/api/leads', (req, res) => {
  const data = readStore();
  res.json(data.leads);
});

app.post('/api/leads', (req, res) => {
  const data = readStore();
  const payload = req.body || {};
  const lead = {
    id: payload.id || `l-${Date.now()}`,
    name: payload.name || 'مشتری جدید',
    phone: payload.phone || '09120000000',
    city: payload.city || 'آمل',
    source: payload.source || 'فرم سایت',
    status: payload.status || 'new',
    createdAt: new Date().toISOString()
  };

  data.leads.unshift(lead);
  writeStore(data);
  res.status(201).json(lead);
});

app.get('/api/users', (req, res) => {
  const data = readStore();
  res.json(data.users);
});

app.post('/api/contact', (req, res) => {
  const payload = req.body || {};
  res.status(200).json({
    success: true,
    message: 'درخواست شما ثبت شد. در نسخه‌ی واقعی پیامک و CRM به آن ارسال می‌شود.',
    data: {
      name: payload.name || 'بدون نام',
      phone: payload.phone || '---',
      message: payload.message || 'بدون پیام',
      createdAt: new Date().toISOString()
    }
  });
});

app.get('/api/config', (req, res) => {
  res.json({
    siteName: 'پومو ویلا',
    region: 'مازندران',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use(express.static(PUBLIC_DIR));
app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Pomo Villa server running on http://localhost:${PORT}`);
});
