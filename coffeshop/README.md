# ☕ Coffee Brew — Full-Stack Coffee Shop Web App

A complete, fully client-side coffee shop web application with a customer-facing storefront, live order tracking, and a feature-rich admin panel — all built with vanilla HTML, CSS, and JavaScript. No backend, no database, no build tools required.

---

## 🔐 Admin Credentials

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin123` |

> You can change these anytime from the **Settings** tab inside the admin panel.

---

## 🚀 Quick Start

No installation or build step needed. Just open the files in a browser.

### Option 1 — VS Code Live Server (recommended)
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code
2. Open the `coffeshop` folder in VS Code
3. Right-click `index.html` → **Open with Live Server**

### Option 2 — VS Code Debugger
1. Open the `coffeshop` folder in VS Code
2. Press **F5** — the `launch.json` is already configured to open `index.html` in Chrome

### Option 3 — Direct file open
1. Navigate to the project folder
2. Double-click `index.html` to open it in your default browser

> **Entry point is always `index.html`** — do not open `coffeshop.html` or `admin.html` directly.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Page structure and semantic markup |
| **CSS3** | Styling, animations, responsive layout, CSS Grid & Flexbox |
| **Vanilla JavaScript (ES6+)** | All interactivity, routing, data management |
| **localStorage / sessionStorage** | Client-side data persistence (orders, menu, credentials) |
| **Chart.js v4.4.0** | Dynamic sales charts in the admin dashboard (loaded via CDN) |
| **Swiper.js v11** | Testimonials carousel on the main site (loaded via CDN) |
| **Font Awesome 6.5.1** | Icons throughout the app (loaded via CDN) |
| **Google Fonts** | Poppins, Miniver, Fira Sans typefaces (loaded via CDN) |
| **SVG** | Animated logo on the landing page |

> **Zero dependencies to install.** All external libraries are loaded from CDN at runtime.

---

## 📁 Project Structure

```
coffeshop/
│
├── index.html          ← Landing page (entry point — Customer / Admin selection)
├── index.css           ← Landing page styles
│
├── coffeshop.html      ← Customer storefront (menu, hero, gallery, contact)
├── coffeshop.css       ← Main site styles
├── coffe.js            ← Main site JS (navbar, swiper, order buttons)
│
├── orderpage.html      ← Place order page (cart, item search, checkout)
├── order.css           ← Order page + modal styles
├── order.js            ← Order logic (cart, search, custom menu injection)
│
├── myorders.html       ← Customer live order tracking (Pending / Preparing)
├── completed.html      ← Customer completed orders (Ready status)
│
├── product.html        ← Individual product detail page
├── product.css         ← Product detail styles
├── product.js          ← Product data + detail page rendering
│
├── admin.html          ← Admin panel
├── admin.css           ← Admin panel styles
├── admin.js            ← Admin logic (orders, menu, history, dashboard)
│
├── store.js            ← Shared data layer (localStorage read/write)
│
├── .vscode/
│   └── launch.json     ← VS Code debug config (opens index.html in Chrome)
│
├── *.png / *.jpg       ← Product and gallery images
└── README.md           ← This file
```

---

## ✨ Features

### 🏠 Landing Page (`index.html`)
- Animated SVG coffee cup logo with glowing ring and steam animation
- Floating particle background
- Two entry points: **Customer** and **Admin**
- Admin login modal with username/password validation
- Show/hide password toggle

---

### 🛒 Customer Storefront (`coffeshop.html`)
- Full responsive navbar with mobile hamburger menu
- Hero section with Order Now CTA
- About section
- **Menu** — Hot Coffees, Cold Beverages, Snacks Counter (36 items)
  - Each card links to a product detail page
  - Quick **🛒 Order** button on every card
  - Admin-added items appear automatically in their correct category
- Testimonials carousel (Swiper.js)
- Gallery with zoom-on-hover
- Contact section with form
- Footer

---

### 📋 Product Detail Page (`product.html`)
- Large product image, category badge, price, serve time
- Full description and ingredients list
- **Order widget** — quantity +/− controls with live total calculation
- "Order Now" redirects to order page with item pre-filled
- "You May Also Like" related products section

---

### 🧾 Order Page (`orderpage.html`)
- Item search with autocomplete dropdown (arrow key navigation)
- Cart with quantity controls and live line totals
- Grand total updates in real time
- Customer name + special note fields
- On submit → saves to localStorage → redirects to My Orders

---

### 📦 My Orders (`myorders.html`)
- Shows all **Pending** and **Preparing** orders live
- Polls localStorage every 2 seconds — updates without page refresh
- Status banners: 🟠 Pending / 🔵 Preparing
- When admin marks **Ready** → popup notification appears with 10-second countdown
- After countdown → order disappears from My Orders (visible in Completed)

---

### ✅ Completed Orders (`completed.html`)
- Shows all orders with status **Ready**
- Live refresh every 2 seconds
- Full order details: items, quantities, prices, total, note, timestamp
- Clear history button

---

### 🔧 Admin Panel (`admin.html`)

#### Dashboard Tab
- Period filter: Last 7 / 30 / 90 Days / All Time
- **4 KPI cards**: Total Revenue, Orders Completed, Items Sold, Avg Order Value
- **Revenue Over Time** — line chart (Chart.js)
- **Orders by Status** — doughnut chart
- **Sales by Category** — combo bar + line chart with dual Y-axis
- **Item Sales Report** — cards sorted most → least sold with progress bars, rank medals, revenue per item

#### Orders Tab
- **Pending Orders** sub-tab — Pending + Preparing orders with status dropdown
- **Ready Orders** sub-tab — Ready orders with green banner; clicking Done removes from this tab
- Stats row: Pending / Preparing / Ready / Total counts
- View detail modal, delete order

#### History Tab
- All Ready + Done orders (never removed when marked Done)
- Filter: All Time / Today / This Week / This Month / specific date picker
- Revenue summary card: orders found, items sold, total revenue for period
- Orders grouped by date with per-day revenue shown
- Each order shows: customer, time, items as chips, note, total

#### Menu Items Tab
- Add new items with: name, price, category, description, ingredients, serve time
- Image upload via **gallery file picker** or **device camera**
- Images stored as base64 — no server needed
- Added items appear in their correct category section on the customer menu

#### Settings Tab
- Change admin username and password
- Clear all orders (danger zone)

---

## 🔄 Data Flow

```
Customer places order (orderpage.html)
        ↓
  localStorage (cb_orders)
        ↓
Admin sees it in Pending Orders tab
        ↓
Admin changes status: Pending → Preparing → Ready
        ↓
Customer My Orders page polls every 2s → updates live
        ↓
Admin marks Ready → Customer gets popup notification
        ↓
Order appears in Customer Completed page
Order appears in Admin Ready Orders tab + History tab
        ↓
Admin marks Done → removed from Ready Orders, stays in History
```

---

## 💾 localStorage Keys

| Key | Contents |
|---|---|
| `cb_orders` | All active orders (array of order objects) |
| `cb_completed_orders` | Legacy — not actively used (history reads from `cb_orders`) |
| `cb_custom_menu` | Admin-added menu items |
| `cb_admin_creds` | Admin username + password (JSON) |
| `cb_admin_session` | Session flag in `sessionStorage` |

---

## 📱 Responsive Design

| Breakpoint | Layout |
|---|---|
| `> 1024px` | Full desktop layout |
| `≤ 1024px` | Menu cards 3-column → adjusted gaps |
| `≤ 900px` | Mobile navbar, stacked sections, 2-column menu |
| `≤ 640px` | Single column menu, hidden swiper buttons |
| `≤ 480px` | Compact order page, hidden line prices |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary color | `#3b141c` (deep maroon) |
| Secondary color | `#f3a01c` (amber/gold) |
| Dark background | `#252525` / `#1a0a0e` |
| Light background | `#faf4f5` |
| Font | Poppins (body), Miniver (display/logo) |
| Border radius S | `8px` |
| Border radius M | `30px` (pills) |

---

## 🧩 External CDN Dependencies

```html
<!-- Font Awesome 6.5.1 — Icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<!-- Swiper 11 — Testimonials carousel -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<!-- Chart.js 4.4.0 — Admin dashboard charts -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<!-- Google Fonts — Poppins, Miniver, Fira Sans -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Miniver&display=swap" rel="stylesheet">
```

> An internet connection is required for CDN resources. For offline use, download these libraries locally and update the `<link>` / `<script>` paths.

---

## ⚠️ Known Limitations

- **No backend** — all data lives in the browser's `localStorage`. Clearing browser data will erase all orders and custom menu items.
- **Single device** — admin and customer must be on the same browser/device for live sync to work (both read from the same `localStorage`).
- **No authentication security** — credentials are stored in `localStorage` in plain JSON. This is a demo/prototype, not production-ready.
- **Image storage** — uploaded images are stored as base64 strings in `localStorage`. Large images may hit the ~5MB storage limit.

---

## 👤 Author

Built as a mini project — a fully functional coffee shop web app demonstrating client-side data management, real-time UI updates via polling, dynamic charting, and a complete customer-to-admin order workflow.

---

## 📄 License

This project is for educational and portfolio purposes.
