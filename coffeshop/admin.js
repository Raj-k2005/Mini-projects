// ── Auth guard ──────────────────────────────────────────────────
if (!CoffeeStore.isAdminLoggedIn()) {
  window.location.href = 'index.html';
}

// ── Tab switching ────────────────────────────────────────────────
const navBtns   = document.querySelectorAll('.nav-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    navBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + target).classList.add('active');
    if (target === 'dashboard') renderDashboard();
    if (target === 'orders')    renderOrders();
    if (target === 'menu')      renderCustomMenu();
    if (target === 'history')   renderHistory();
  });
});

// ── Sidebar mobile toggle ────────────────────────────────────────
const sidebar       = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
document.addEventListener('click', e => {
  if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// ── Logout ───────────────────────────────────────────────────────
function doLogout() {
  CoffeeStore.clearAdminSession();
  window.location.href = 'index.html';
}
document.getElementById('logoutBtn').addEventListener('click', doLogout);
document.getElementById('topbarLogout').addEventListener('click', doLogout);

// ── Helpers ──────────────────────────────────────────────────────
function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function statusColor(s) {
  return { Pending: 'orange', Preparing: 'blue', Ready: 'green', Done: 'gray' }[s] || 'gray';
}

// ── DASHBOARD ────────────────────────────────────────────────────
// Chart instances — kept so we can destroy before re-creating
const _charts = {};

function destroyChart(id) {
  if (_charts[id]) { _charts[id].destroy(); delete _charts[id]; }
}

function getDashOrders() {
  const all    = CoffeeStore.getOrders();
  const period = document.getElementById('dashPeriod').value;
  if (period === 'all') return all;
  const days   = parseInt(period, 10);
  const cutoff = new Date(Date.now() - days * 86400000);
  return all.filter(o => new Date(o.timestamp) >= cutoff);
}

function parsePriceD(str) {
  return parseFloat((str || '0').replace(/[^0-9.]/g, '')) || 0;
}

function toLocalDateStr(iso) {
  const d = new Date(iso);
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function renderDashboard() {
  const orders = getDashOrders();
  // Only count Ready + Done orders as "sold"
  const sold   = orders.filter(o => o.status === 'Ready' || o.status === 'Done');
  const period = document.getElementById('dashPeriod').value;

  // ── KPIs ──────────────────────────────────────────────────────
  const totalRevenue = sold.reduce((s, o) => s + parsePriceD(o.total), 0);
  const totalOrders  = sold.length;
  const totalItems   = sold.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.qty, 0), 0);
  const avgOrder     = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const periodLabel = period === 'all' ? 'all time'
    : `last ${period} day${period > 1 ? 's' : ''}`;

  document.getElementById('dashKpis').innerHTML = `
    <div class="dash-kpi">
      <div class="dash-kpi-icon revenue"><i class="fas fa-dollar-sign"></i></div>
      <div class="dash-kpi-body">
        <div class="dash-kpi-label">Total Revenue</div>
        <div class="dash-kpi-value">$${totalRevenue.toFixed(2)}</div>
        <div class="dash-kpi-sub">${periodLabel}</div>
      </div>
    </div>
    <div class="dash-kpi">
      <div class="dash-kpi-icon orders"><i class="fas fa-receipt"></i></div>
      <div class="dash-kpi-body">
        <div class="dash-kpi-label">Orders Completed</div>
        <div class="dash-kpi-value">${totalOrders}</div>
        <div class="dash-kpi-sub">${periodLabel}</div>
      </div>
    </div>
    <div class="dash-kpi">
      <div class="dash-kpi-icon items"><i class="fas fa-box-open"></i></div>
      <div class="dash-kpi-body">
        <div class="dash-kpi-label">Items Sold</div>
        <div class="dash-kpi-value">${totalItems}</div>
        <div class="dash-kpi-sub">${periodLabel}</div>
      </div>
    </div>
    <div class="dash-kpi">
      <div class="dash-kpi-icon avg"><i class="fas fa-chart-line"></i></div>
      <div class="dash-kpi-body">
        <div class="dash-kpi-label">Avg Order Value</div>
        <div class="dash-kpi-value">$${avgOrder.toFixed(2)}</div>
        <div class="dash-kpi-sub">per order</div>
      </div>
    </div>`;

  if (!sold.length) {
    // Show empty state for charts
    ['chartRevenue','chartStatus','chartCategory'].forEach(id => {
      destroyChart(id);
      const canvas = document.getElementById(id);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    document.getElementById('dashItemCards').innerHTML = `
      <div class="dash-empty">
        <i class="fas fa-chart-bar"></i>
        <p>No completed orders yet. Data will appear here once orders are marked Ready.</p>
      </div>`;
    return;
  }

  // ── Revenue over time (line chart) ────────────────────────────
  // Group by date
  const revenueByDate = {};
  sold.forEach(o => {
    const ds = toLocalDateStr(o.timestamp);
    revenueByDate[ds] = (revenueByDate[ds] || 0) + parsePriceD(o.total);
  });

  // Fill in missing dates for a continuous line
  const sortedDates = Object.keys(revenueByDate).sort();
  const allDates    = [];
  if (sortedDates.length > 1) {
    const start = new Date(sortedDates[0]);
    const end   = new Date(sortedDates[sortedDates.length - 1]);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      allDates.push(toLocalDateStr(d.toISOString()));
    }
  } else {
    allDates.push(...sortedDates);
  }

  const revenueValues = allDates.map(d => revenueByDate[d] || 0);
  const dateLabels    = allDates.map(d => {
    const [y, m, day] = d.split('-');
    return new Date(+y, +m - 1, +day).toLocaleDateString('en-US', { month:'short', day:'numeric' });
  });

  destroyChart('chartRevenue');
  _charts['chartRevenue'] = new Chart(document.getElementById('chartRevenue'), {
    type: 'line',
    data: {
      labels: dateLabels,
      datasets: [{
        label: 'Revenue ($)',
        data: revenueValues,
        borderColor: '#f3a01c',
        backgroundColor: 'rgba(243,160,28,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#f3a01c',
        pointRadius: revenueValues.length > 20 ? 2 : 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ' $' + ctx.parsed.y.toFixed(2)
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { font: { size: 11 }, maxTicksLimit: 10 }
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: {
            font: { size: 11 },
            callback: v => '$' + v.toFixed(0)
          },
          beginAtZero: true
        }
      }
    }
  });

  // ── Orders by status (doughnut) ───────────────────────────────
  const allPeriod = orders; // all orders in period (including pending)
  const statusCounts = {
    Pending:   allPeriod.filter(o => o.status === 'Pending').length,
    Preparing: allPeriod.filter(o => o.status === 'Preparing').length,
    Ready:     allPeriod.filter(o => o.status === 'Ready').length,
    Done:      allPeriod.filter(o => o.status === 'Done').length,
  };

  destroyChart('chartStatus');
  _charts['chartStatus'] = new Chart(document.getElementById('chartStatus'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#f97316','#3b82f6','#22c55e','#9ca3af'],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 11 }, padding: 12, usePointStyle: true }
        },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed} order${ctx.parsed !== 1 ? 's' : ''}`
          }
        }
      }
    }
  });

  // ── Sales by category (horizontal bar) ───────────────────────
  const catQty = {};
  const catRev = {};
  sold.forEach(o => {
    o.items.forEach(item => {
      // Determine category from item name by checking static menu
      const menuEntry = STATIC_MENU_DASH.find(m => m.name === item.name);
      const cat = menuEntry ? menuEntry.category : 'Other';
      catQty[cat] = (catQty[cat] || 0) + item.qty;
      catRev[cat] = (catRev[cat] || 0) + parsePriceD(item.price) * item.qty;
    });
  });

  const catLabels = Object.keys(catQty).sort((a, b) => catQty[b] - catQty[a]);
  const catColors = ['#f3a01c','#3b82f6','#22c55e','#8b5cf6','#f97316','#ec4899'];

  destroyChart('chartCategory');
  _charts['chartCategory'] = new Chart(document.getElementById('chartCategory'), {
    type: 'bar',
    data: {
      labels: catLabels,
      datasets: [
        {
          label: 'Items Sold',
          data: catLabels.map(c => catQty[c]),
          backgroundColor: catLabels.map((_, i) => catColors[i % catColors.length] + 'cc'),
          borderColor:     catLabels.map((_, i) => catColors[i % catColors.length]),
          borderWidth: 2,
          borderRadius: 6,
          yAxisID: 'yQty',
        },
        {
          label: 'Revenue ($)',
          data: catLabels.map(c => catRev[c]),
          backgroundColor: 'rgba(34,197,94,0.15)',
          borderColor: '#22c55e',
          borderWidth: 2,
          borderRadius: 6,
          type: 'line',
          yAxisID: 'yRev',
          tension: 0.3,
          pointBackgroundColor: '#22c55e',
          pointRadius: 5,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { size: 11 }, usePointStyle: true }
        },
        tooltip: {
          callbacks: {
            label: ctx => ctx.dataset.label === 'Revenue ($)'
              ? ` Revenue: $${ctx.parsed.y.toFixed(2)}`
              : ` Sold: ${ctx.parsed.y} items`
          }
        }
      },
      scales: {
        yQty: {
          type: 'linear', position: 'left',
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { font: { size: 11 }, stepSize: 1 },
          title: { display: true, text: 'Items Sold', font: { size: 11 } }
        },
        yRev: {
          type: 'linear', position: 'right',
          beginAtZero: true,
          grid: { drawOnChartArea: false },
          ticks: { font: { size: 11 }, callback: v => '$' + v.toFixed(0) },
          title: { display: true, text: 'Revenue', font: { size: 11 } }
        },
        x: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { font: { size: 11 } }
        }
      }
    }
  });

  // ── Item sales cards ──────────────────────────────────────────
  const itemQty = {};
  const itemRev = {};
  sold.forEach(o => {
    o.items.forEach(item => {
      itemQty[item.name] = (itemQty[item.name] || 0) + item.qty;
      itemRev[item.name] = (itemRev[item.name] || 0) + parsePriceD(item.price) * item.qty;
    });
  });

  const sortedItems = Object.keys(itemQty).sort((a, b) => itemQty[b] - itemQty[a]);
  const maxQty      = itemQty[sortedItems[0]] || 1;
  const half        = Math.ceil(sortedItems.length / 2);

  const rankClass = i => i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-n';
  const rankLabel = i => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;

  document.getElementById('dashItemCards').innerHTML = sortedItems.map((name, i) => {
    const qty     = itemQty[name];
    const rev     = itemRev[name];
    const pct     = Math.round((qty / maxQty) * 100);
    const isLow   = i >= half;

    return `
      <div class="dash-item-card">
        <div class="dash-rank ${rankClass(i)}">${rankLabel(i)}</div>
        <div class="dash-item-body">
          <div class="dash-item-name">${escHtml(name)}</div>
          <div class="dash-item-bar-wrap">
            <div class="dash-item-bar ${isLow ? 'low' : ''}" style="width:${pct}%"></div>
          </div>
        </div>
        <div class="dash-item-stats">
          <div class="dash-item-qty">${qty}</div>
          <div class="dash-item-qty-label">sold</div>
          <div class="dash-item-revenue">$${rev.toFixed(2)}</div>
        </div>
      </div>`;
  }).join('');
}

// Static menu for category lookup in dashboard
const STATIC_MENU_DASH = [
  { name:'Coffee Brew',            category:'Hot Coffee' },
  { name:'Americano',              category:'Hot Coffee' },
  { name:'Cappuccino',             category:'Hot Coffee' },
  { name:'Irish Coffee',           category:'Hot Coffee' },
  { name:'Vienna Coffee',          category:'Hot Coffee' },
  { name:'Mazagran',               category:'Hot Coffee' },
  { name:'Latte',                  category:'Hot Coffee' },
  { name:'Macchiato',              category:'Hot Coffee' },
  { name:'Café au Lait',           category:'Hot Coffee' },
  { name:'Iced Coffee',            category:'Cold Beverage' },
  { name:'Cold Brew',              category:'Cold Beverage' },
  { name:'Nitro Cold Brew',        category:'Cold Beverage' },
  { name:'Vietnamese Iced Coffee', category:'Cold Beverage' },
  { name:'Iced Mocha',             category:'Cold Beverage' },
  { name:'Affogato al Caffè',      category:'Cold Beverage' },
  { name:'Dalgona Iced Coffee',    category:'Cold Beverage' },
  { name:'Shakerato',              category:'Cold Beverage' },
  { name:'Cappuccino Freddo',      category:'Cold Beverage' },
  { name:'Chicken Doritto',        category:'Snack' },
  { name:'Taaco Pork',             category:'Snack' },
  { name:'Afghani Salsa',          category:'Snack' },
  { name:'Tottia Taco',            category:'Snack' },
  { name:'Special Taco Bell',      category:'Snack' },
  { name:'Mexican Comboa',         category:'Snack' },
  { name:'Fish Taco',              category:'Snack' },
  { name:'Meriana Roll',           category:'Snack' },
  { name:'Salood',                 category:'Snack' },
  { name:'Spicy Pizza',            category:'Snack' },
  { name:'Cheesy Burst',           category:'Snack' },
  { name:'Solo Slice',             category:'Snack' },
  { name:'Classic Cheeseburger',   category:'Snack' },
  { name:'Bacon Cheeseburger',     category:'Snack' },
  { name:'BBQ Burger',             category:'Snack' },
  { name:'Jucy Lucy',              category:'Snack' },
  { name:'Teriyaki Burger',        category:'Snack' },
  { name:'Ramen Burger',           category:'Snack' },
];

// ── ORDERS ───────────────────────────────────────────────────────
const clearDoneBtn  = document.getElementById('clearDoneBtn');
const pendingBadge  = document.getElementById('pendingBadge');

let currentSubtab = 'pending';

function switchSubtab(tab) {
  currentSubtab = tab;
  document.getElementById('subtab-pending').classList.toggle('active', tab === 'pending');
  document.getElementById('subtab-ready').classList.toggle('active',   tab === 'ready');
  document.getElementById('panel-pending').style.display = tab === 'pending' ? 'block' : 'none';
  document.getElementById('panel-ready').style.display   = tab === 'ready'   ? 'block' : 'none';
}

clearDoneBtn.addEventListener('click', () => {
  const orders = CoffeeStore.getOrders().filter(o => o.status !== 'Done');
  localStorage.setItem('cb_orders', JSON.stringify(orders));
  renderOrders();
});

function renderOrders() {
  const all = CoffeeStore.getOrders();

  const pending   = all.filter(o => o.status === 'Pending').length;
  const preparing = all.filter(o => o.status === 'Preparing').length;
  const ready     = all.filter(o => o.status === 'Ready').length;
  const total     = all.length;

  // Sidebar badge — pending count
  pendingBadge.textContent = pending;
  pendingBadge.classList.toggle('show', pending > 0);

  // Sub-tab counters
  const pendingTotal = pending + preparing;
  document.getElementById('pendingCount').textContent = pendingTotal;
  document.getElementById('readyCount').textContent   = ready;

  // Stats row
  document.getElementById('ordersStats').innerHTML = `
    <div class="stat-card pending">
      <span class="stat-label">Pending</span>
      <span class="stat-value">${pending}</span>
    </div>
    <div class="stat-card preparing">
      <span class="stat-label">Preparing</span>
      <span class="stat-value">${preparing}</span>
    </div>
    <div class="stat-card ready">
      <span class="stat-label">Ready</span>
      <span class="stat-value">${ready}</span>
    </div>
    <div class="stat-card total">
      <span class="stat-label">Total</span>
      <span class="stat-value">${total}</span>
    </div>
  `;

  renderPendingGrid(all);
  renderReadyGrid(all);
}

// ── Pending grid (Pending + Preparing) ──────────────────────────
function renderPendingGrid(all) {
  const orders = all.filter(o => o.status === 'Pending' || o.status === 'Preparing');
  const grid   = document.getElementById('pendingGrid');

  if (!orders.length) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><p>No pending orders.</p></div>`;
    return;
  }

  grid.innerHTML = orders.map(order => buildOrderCard(order, ['Pending','Preparing','Ready'])).join('');
}

// ── Ready grid (Ready only) ──────────────────────────────────────
function renderReadyGrid(all) {
  const orders = all.filter(o => o.status === 'Ready');
  const grid   = document.getElementById('readyGrid');

  if (!orders.length) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-bell"></i><p>No ready orders yet.</p></div>`;
    return;
  }

  grid.innerHTML = orders.map(order => {
    const card = buildOrderCard(order, ['Ready','Done']);
    // Inject the ready banner inside the card body
    return card.replace(
      '<div class="order-card-body">',
      `<div class="ready-order-banner"><i class="fas fa-bell"></i> This order is ready for customer pickup</div><div class="order-card-body">`
    );
  }).join('');
}

// ── Shared card builder ──────────────────────────────────────────
function buildOrderCard(order, statusOptions) {
  const itemsHtml = order.items.map(item =>
    `<div class="order-item-row">
      <span class="order-item-name">${escHtml(item.name)}</span>
      <span class="order-item-qty">x${item.qty}</span>
    </div>`
  ).join('');

  const noteHtml = order.note
    ? `<div class="order-note"><i class="fas fa-sticky-note"></i> ${escHtml(order.note)}</div>`
    : '';

  const options = statusOptions.map(s =>
    `<option value="${s}" ${s === order.status ? 'selected' : ''}>${s}</option>`
  ).join('');

  return `
    <div class="order-card status-${order.status}" id="order-${order.id}">
      <div class="order-card-header">
        <div>
          <div class="order-customer-name">👤 ${escHtml(order.customerName)}</div>
          <div class="order-time">${formatTime(order.timestamp)}</div>
        </div>
        <span class="status-badge ${order.status}">${order.status}</span>
      </div>
      <div class="order-card-body">
        ${itemsHtml}
        ${noteHtml}
      </div>
      <div class="order-card-footer">
        <div class="order-total-chip">Total: <strong>${escHtml(order.total || '—')}</strong></div>
        <select class="status-select" onchange="changeStatus(${order.id}, this.value)">
          ${options}
        </select>
        <button class="btn-icon view" onclick="viewOrder(${order.id})" title="View details">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn-icon delete" onclick="deleteOrder(${order.id})" title="Delete order">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>`;
}

function changeStatus(orderId, status) {
  CoffeeStore.updateOrderStatus(orderId, status);
  renderOrders();
  // If marked Ready, switch to the Ready sub-tab so admin sees it immediately
  if (status === 'Ready') {
    switchSubtab('ready');
  }
}

function deleteOrder(orderId) {
  if (confirm('Delete this order?')) {
    CoffeeStore.deleteOrder(orderId);
    renderOrders();
  }
}

// ── Order detail modal ───────────────────────────────────────────
const orderDetailModal   = document.getElementById('orderDetailModal');
const closeOrderDetail   = document.getElementById('closeOrderDetail');

closeOrderDetail.addEventListener('click', () => orderDetailModal.classList.remove('active'));
orderDetailModal.addEventListener('click', e => {
  if (e.target === orderDetailModal) orderDetailModal.classList.remove('active');
});

function viewOrder(orderId) {
  const order = CoffeeStore.getOrders().find(o => o.id === orderId);
  if (!order) return;

  const itemsHtml = order.items.map(item =>
    `<div class="detail-item-row">
      <span>${escHtml(item.name)}</span>
      <span><strong>x${item.qty}</strong></span>
    </div>`
  ).join('');

  document.getElementById('orderDetailContent').innerHTML = `
    <div class="detail-row">
      <span class="detail-label">Customer</span>
      <span class="detail-value">${escHtml(order.customerName)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Order ID</span>
      <span class="detail-value">#${order.id}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Placed At</span>
      <span class="detail-value">${formatTime(order.timestamp)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Status</span>
      <span class="detail-value"><span class="status-badge ${order.status}">${order.status}</span></span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Order Total</span>
      <span class="detail-value" style="color:#f3a01c;font-size:1.1rem;">${escHtml(order.total || '—')}</span>
    </div>
    <div class="detail-items-title">Items Ordered</div>
    ${itemsHtml}
    ${order.note ? `<div class="detail-note-box"><strong>Customer Note:</strong> ${escHtml(order.note)}</div>` : ''}
  `;

  orderDetailModal.classList.add('active');
}

// ── CUSTOM MENU ──────────────────────────────────────────────────
const openAddItemBtn = document.getElementById('openAddItemBtn');
const addItemModal   = document.getElementById('addItemModal');
const closeAddItem   = document.getElementById('closeAddItem');
const cancelAddItem  = document.getElementById('cancelAddItem');
const addItemForm    = document.getElementById('addItemForm');
const addItemError   = document.getElementById('addItemError');

// ── Image upload handling ──
const imgFileInput   = document.getElementById('imgFileInput');
const imgCameraInput = document.getElementById('imgCameraInput');
const imgPreview     = document.getElementById('imgPreview');
const imgPreviewWrap = document.getElementById('imgPreviewWrap');
const imgPlaceholder = document.getElementById('imgPlaceholder');
const imgClearBtn    = document.getElementById('imgClearBtn');
const itemImageData  = document.getElementById('itemImageData');

function handleImageFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const dataUrl = e.target.result;
    imgPreview.src       = dataUrl;
    itemImageData.value  = dataUrl;
    imgPreviewWrap.style.display = 'block';
    imgPlaceholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

imgFileInput.addEventListener('change',   () => handleImageFile(imgFileInput.files[0]));
imgCameraInput.addEventListener('change', () => handleImageFile(imgCameraInput.files[0]));

imgClearBtn.addEventListener('click', () => {
  imgPreview.src       = '';
  itemImageData.value  = '';
  imgFileInput.value   = '';
  imgCameraInput.value = '';
  imgPreviewWrap.style.display = 'none';
  imgPlaceholder.style.display = 'flex';
});

openAddItemBtn.addEventListener('click', () => addItemModal.classList.add('active'));
closeAddItem.addEventListener('click',   () => closeAddItemModal());
cancelAddItem.addEventListener('click',  () => closeAddItemModal());
addItemModal.addEventListener('click', e => {
  if (e.target === addItemModal) closeAddItemModal();
});

function closeAddItemModal() {
  addItemModal.classList.remove('active');
  addItemForm.reset();
  addItemError.textContent = '';
  // Reset image preview
  imgPreview.src       = '';
  itemImageData.value  = '';
  imgPreviewWrap.style.display = 'none';
  imgPlaceholder.style.display = 'flex';
}

addItemForm.addEventListener('submit', e => {
  e.preventDefault();
  const name  = document.getElementById('itemName').value.trim();
  const price = document.getElementById('itemPrice').value.trim();
  const cat   = document.getElementById('itemCategory').value;
  const desc  = document.getElementById('itemDesc').value.trim();
  const time  = document.getElementById('itemTime').value.trim();
  const ings  = document.getElementById('itemIngredients').value.trim();
  const img   = itemImageData.value || 'hot5.png.png';

  if (!name || !price || !cat || !desc) {
    addItemError.textContent = 'Please fill in all required fields.';
    return;
  }

  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    addItemError.textContent = 'Please enter a valid price.';
    return;
  }

  CoffeeStore.addCustomMenuItem({
    name,
    price:       '$' + priceNum.toFixed(2),
    category:    cat,
    description: desc,
    time:        time || '—',
    ingredients: ings ? ings.split(',').map(s => s.trim()).filter(Boolean) : [],
    image:       img,
  });

  closeAddItemModal();
  renderCustomMenu();
});

function renderCustomMenu() {
  const items = CoffeeStore.getCustomMenuItems();
  const grid  = document.getElementById('customMenuGrid');

  if (items.length === 0) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-plus-circle"></i><p>No custom items added yet.</p></div>`;
    return;
  }

  grid.innerHTML = items.map(item => `
    <div class="menu-admin-card">
      <img src="${escHtml(item.image)}" alt="${escHtml(item.name)}" class="menu-admin-img"
           onerror="this.src='hot5.png.png'">
      <div class="menu-admin-body">
        <div class="menu-admin-name">${escHtml(item.name)}</div>
        <div class="menu-admin-meta">
          <span class="menu-admin-price">${escHtml(item.price)}</span>
          <span class="menu-admin-cat">${escHtml(item.category)}</span>
        </div>
        <p class="menu-admin-desc">${escHtml(item.description)}</p>
      </div>
      <div class="menu-admin-footer">
        <button class="btn-danger" onclick="deleteMenuItem('${item.id}')">
          <i class="fas fa-trash"></i> Remove
        </button>
      </div>
    </div>
  `).join('');
}

function deleteMenuItem(itemId) {
  if (confirm('Remove this item from the menu?')) {
    CoffeeStore.deleteCustomMenuItem(itemId);
    renderCustomMenu();
  }
}

// ── HISTORY ──────────────────────────────────────────────────────
let historyFilter     = 'all';   // 'all' | 'today' | 'week' | 'month' | 'date'
let historyDateValue  = '';      // specific date string YYYY-MM-DD

function setHistoryFilter(mode) {
  historyFilter    = mode;
  historyDateValue = '';
  document.getElementById('historyDatePicker').value = '';
  // Update quick button active state
  ['All','Today','Week','Month'].forEach(k => {
    document.getElementById('hq' + k).classList.toggle('active', mode === k.toLowerCase());
  });
  renderHistory();
}

// Date picker change
document.getElementById('historyDatePicker').addEventListener('change', function () {
  historyDateValue = this.value;
  historyFilter    = 'date';
  ['All','Today','Week','Month'].forEach(k =>
    document.getElementById('hq' + k).classList.remove('active')
  );
  renderHistory();
});

// Clear button
document.getElementById('historyClearDate').addEventListener('click', () => {
  setHistoryFilter('all');
});

function parsePrice(str) {
  return parseFloat((str || '0').replace(/[^0-9.]/g, '')) || 0;
}

function toDateStr(iso) {
  // Returns YYYY-MM-DD in local time
  const d = new Date(iso);
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function friendlyDate(dateStr) {
  // dateStr = YYYY-MM-DD
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  if (date.getTime() === today.getTime())     return 'Today — ' + date.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });
  if (date.getTime() === yesterday.getTime()) return 'Yesterday — ' + date.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });
  return date.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });
}

function renderHistory() {
  // All Ready + Done orders (history = everything that was ever marked Ready)
  const allReady = CoffeeStore.getOrders().filter(o => o.status === 'Ready' || o.status === 'Done');

  // Apply filter
  const now   = new Date();
  const today = toDateStr(now.toISOString());

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0,0,0,0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let filtered = allReady;

  if (historyFilter === 'today') {
    filtered = allReady.filter(o => toDateStr(o.timestamp) === today);
  } else if (historyFilter === 'week') {
    filtered = allReady.filter(o => new Date(o.timestamp) >= startOfWeek);
  } else if (historyFilter === 'month') {
    filtered = allReady.filter(o => new Date(o.timestamp) >= startOfMonth);
  } else if (historyFilter === 'date' && historyDateValue) {
    filtered = allReady.filter(o => toDateStr(o.timestamp) === historyDateValue);
  }

  // Revenue summary
  const totalRevenue = filtered.reduce((sum, o) => sum + parsePrice(o.total), 0);
  const totalItems   = filtered.reduce((sum, o) =>
    sum + o.items.reduce((s, i) => s + i.qty, 0), 0);

  document.getElementById('historyOrderCount').textContent = filtered.length;
  document.getElementById('historyItemCount').textContent  = totalItems;
  document.getElementById('historyRevenue').textContent    = '$' + totalRevenue.toFixed(2);

  // Period label
  const periodLabels = {
    all:     'Showing all time',
    today:   'Showing today — ' + new Date().toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' }),
    week:    'Showing this week (from ' + startOfWeek.toLocaleDateString('en-US', { month:'short', day:'numeric' }) + ')',
    month:   'Showing this month — ' + new Date().toLocaleDateString('en-US', { month:'long', year:'numeric' }),
    date:    historyDateValue ? 'Showing ' + friendlyDate(historyDateValue) : 'Showing all time',
  };
  document.getElementById('revenuePeriod').textContent = periodLabels[historyFilter] || 'Showing all time';

  const listEl = document.getElementById('historyList');

  if (!filtered.length) {
    listEl.innerHTML = `
      <div class="history-empty">
        <i class="fas fa-search"></i>
        <p>No ready orders found for this period.</p>
      </div>`;
    return;
  }

  // Group by date (newest first)
  const groups = {};
  filtered.forEach(order => {
    const ds = toDateStr(order.timestamp);
    if (!groups[ds]) groups[ds] = [];
    groups[ds].push(order);
  });

  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  listEl.innerHTML = sortedDates.map(dateStr => {
    const dayOrders  = groups[dateStr];
    const dayRevenue = dayOrders.reduce((sum, o) => sum + parsePrice(o.total), 0);
    const dayItems   = dayOrders.reduce((sum, o) => sum + o.items.reduce((s,i) => s + i.qty, 0), 0);

    const cardsHtml = dayOrders
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(order => {
        const chipsHtml = order.items.map(item => {
          const unit = parsePrice(item.price);
          const line = unit * item.qty;
          return `<span class="history-item-chip">
            <span class="chip-qty">×${item.qty}</span>
            ${escHtml(item.name)}
            ${unit > 0 ? `<span class="chip-price">$${line.toFixed(2)}</span>` : ''}
          </span>`;
        }).join('');

        const timeStr = new Date(order.timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        });

        return `
          <div class="history-order-card">
            <div class="history-card-header">
              <div class="history-card-left">
                <div class="history-customer">👤 ${escHtml(order.customerName)}</div>
                <div class="history-order-id">Order #${order.id}</div>
                <div class="history-timestamp">
                  <i class="fas fa-clock"></i> ${timeStr}
                </div>
              </div>
              <div class="history-card-right">
                <span class="history-ready-badge" style="${order.status === 'Done' ? 'background:rgba(156,163,175,0.12);border-color:rgba(156,163,175,0.3);color:#6b7280;' : ''}">
                  <i class="fas fa-${order.status === 'Done' ? 'check-double' : 'check-circle'}"></i>
                  ${order.status === 'Done' ? 'Done' : 'Ready'}
                </span>
                <span class="history-total-badge">${escHtml(order.total || '—')}</span>
              </div>
            </div>
            <div class="history-card-body">
              <div class="history-items-grid">${chipsHtml}</div>
              ${order.note ? `<div class="history-note-row"><i class="fas fa-sticky-note"></i> ${escHtml(order.note)}</div>` : ''}
            </div>
          </div>`;
      }).join('');

    return `
      <div class="history-date-group">
        <div class="history-date-header">
          <div class="history-date-label">
            <i class="fas fa-calendar-day"></i>
            ${friendlyDate(dateStr)}
          </div>
          <div class="history-date-meta">
            <span class="history-date-count">${dayOrders.length} order${dayOrders.length !== 1 ? 's' : ''} · ${dayItems} item${dayItems !== 1 ? 's' : ''}</span>
            <span class="history-date-revenue">$${dayRevenue.toFixed(2)}</span>
          </div>
        </div>
        ${cardsHtml}
      </div>`;
  }).join('');
}

// ── SETTINGS ─────────────────────────────────────────────────────
document.getElementById('changePassForm').addEventListener('submit', e => {
  e.preventDefault();
  const user    = document.getElementById('newUsername').value.trim();
  const pass    = document.getElementById('newPassword').value;
  const confirm = document.getElementById('confirmPassword').value;
  const errEl   = document.getElementById('settingsError');
  const okEl    = document.getElementById('settingsSuccess');

  errEl.textContent = '';
  okEl.textContent  = '';

  if (!user || !pass) { errEl.textContent = 'Username and password are required.'; return; }
  if (pass !== confirm) { errEl.textContent = 'Passwords do not match.'; return; }
  if (pass.length < 6)  { errEl.textContent = 'Password must be at least 6 characters.'; return; }

  CoffeeStore.setAdminCredentials(user, pass);
  okEl.textContent = 'Credentials updated successfully!';
  document.getElementById('changePassForm').reset();
});

document.getElementById('clearAllOrdersBtn').addEventListener('click', () => {
  if (confirm('This will permanently delete ALL orders. Are you sure?')) {
    localStorage.setItem('cb_orders', JSON.stringify([]));
    renderOrders();
    alert('All orders cleared.');
  }
});

// ── XSS helper ───────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Auto-refresh orders every 10s ────────────────────────────────
setInterval(() => {
  const activeTab = document.querySelector('.nav-btn.active')?.dataset.tab;
  if (activeTab === 'orders') renderOrders();
}, 10000);

// ── Init ─────────────────────────────────────────────────────────
renderDashboard();
renderOrders();
renderCustomMenu();
