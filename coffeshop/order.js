// ===== All menu items (static + dynamic) for search =====
const STATIC_MENU = [
  // Hot Coffees
  { name: 'Coffee Brew',            price: '$6.99', category: 'Hot Coffee' },
  { name: 'Americano',              price: '$5.99', category: 'Hot Coffee' },
  { name: 'Cappuccino',             price: '$6.99', category: 'Hot Coffee' },
  { name: 'Irish Coffee',           price: '$7.99', category: 'Hot Coffee' },
  { name: 'Vienna Coffee',          price: '$2.99', category: 'Hot Coffee' },
  { name: 'Mazagran',               price: '$4.99', category: 'Hot Coffee' },
  { name: 'Latte',                  price: '$5.99', category: 'Hot Coffee' },
  { name: 'Macchiato',              price: '$8.99', category: 'Hot Coffee' },
  { name: 'Café au Lait',           price: '$3.99', category: 'Hot Coffee' },
  // Cold Beverages
  { name: 'Iced Coffee',            price: '$4.05', category: 'Cold Beverage' },
  { name: 'Cold Brew',              price: '$7.99', category: 'Cold Beverage' },
  { name: 'Nitro Cold Brew',        price: '$4.99', category: 'Cold Beverage' },
  { name: 'Vietnamese Iced Coffee', price: '$3.99', category: 'Cold Beverage' },
  { name: 'Iced Mocha',             price: '$4.47', category: 'Cold Beverage' },
  { name: 'Affogato al Caffè',      price: '$5.99', category: 'Cold Beverage' },
  { name: 'Dalgona Iced Coffee',    price: '$7.34', category: 'Cold Beverage' },
  { name: 'Shakerato',              price: '$6.88', category: 'Cold Beverage' },
  { name: 'Cappuccino Freddo',      price: '$3.00', category: 'Cold Beverage' },
  // Snacks
  { name: 'Chicken Doritto',        price: '$6.99', category: 'Snack' },
  { name: 'Taaco Pork',             price: '$6.99', category: 'Snack' },
  { name: 'Afghani Salsa',          price: '$6.99', category: 'Snack' },
  { name: 'Tottia Taco',            price: '$6.99', category: 'Snack' },
  { name: 'Special Taco Bell',      price: '$6.99', category: 'Snack' },
  { name: 'Mexican Comboa',         price: '$6.99', category: 'Snack' },
  { name: 'Fish Taco',              price: '$6.99', category: 'Snack' },
  { name: 'Meriana Roll',           price: '$6.99', category: 'Snack' },
  { name: 'Salood',                 price: '$6.99', category: 'Snack' },
  { name: 'Spicy Pizza',            price: '$6.99', category: 'Snack' },
  { name: 'Cheesy Burst',           price: '$6.99', category: 'Snack' },
  { name: 'Solo Slice',             price: '$6.99', category: 'Snack' },
  { name: 'Classic Cheeseburger',   price: '$8.99', category: 'Snack' },
  { name: 'Bacon Cheeseburger',     price: '$8.99', category: 'Snack' },
  { name: 'BBQ Burger',             price: '$9.99', category: 'Snack' },
  { name: 'Jucy Lucy',              price: '$8.99', category: 'Snack' },
  { name: 'Teriyaki Burger',        price: '$9.99', category: 'Snack' },
  { name: 'Ramen Burger',           price: '$9.99', category: 'Snack' },
];

function getAllMenuItems() {
  const custom = CoffeeStore.getCustomMenuItems().map(i => ({
    name: i.name, price: i.price, category: i.category
  }));
  return [...STATIC_MENU, ...custom];
}

// ===== Custom menu items — inject into their category sections =====
function renderCustomMenuSection() {
  const items = CoffeeStore.getCustomMenuItems();

  // Hide the old standalone section (no longer used)
  const oldSection = document.getElementById('custom-menu');
  if (oldSection) oldSection.style.display = 'none';

  if (!items.length) return;

  // Map category name → the <ul class="menu-list"> that belongs to it
  // We identify each list by the heading text that precedes it
  const categoryMap = {
    'Hot Coffee':     0,   // first  .menu-list
    'Cold Beverage':  1,   // second .menu-list
    'Snack':          2,   // third  .menu-list
    'Special':        2,   // fallback → snacks list
  };

  const menuLists = document.querySelectorAll('.menu-section .menu-list');

  items.forEach(item => {
    const listIdx = categoryMap[item.category] ?? 2;
    const list    = menuLists[listIdx];
    if (!list) return;

    // Avoid duplicates on re-render
    if (list.querySelector(`[data-custom-id="${CSS.escape(item.id)}"]`)) return;

    const li = document.createElement('li');
    li.className = 'menu-item';
    li.dataset.customId = item.id;
    li.innerHTML = `
      <a href="product.html?id=${escHtml(item.id)}" class="menu-item-link">
        <img src="${escHtml(item.image)}" alt="${escHtml(item.name)}" class="menu-image"
             onerror="this.src='hot5.png.png'">
        <h3 class="name">${escHtml(item.name)}: <span style="color:yellow;font-size:larger;">${escHtml(item.price)}</span></h3>
        <p class="text">${escHtml(item.description)}</p>
        <div class="card-btn-row">
          <span class="view-details-btn">View Details &#8594;</span>
        </div>
      </a>`;
    list.appendChild(li);

    // Add the 🛒 Order button into the card-btn-row
    const link    = li.querySelector('.menu-item-link');
    const nameEl  = li.querySelector('.name');
    const priceEl = li.querySelector('.name span');
    const rawName = nameEl.childNodes[0]?.textContent?.replace(/[-:]/g, '').trim() || item.name;
    const price   = priceEl ? priceEl.textContent.trim() : item.price;

    const row = li.querySelector('.card-btn-row');
    const btn = document.createElement('button');
    btn.className   = 'menu-item-order-btn';
    btn.innerHTML   = '🛒 Order';
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const params = new URLSearchParams({ order: rawName, price, qty: 1 });
      window.location.href = 'orderpage.html?' + params.toString();
    });
    if (row) row.appendChild(btn);
    else link.appendChild(btn);
  });
}

// ===== Order Modal =====
const orderModal      = document.getElementById('orderModal');
const orderModalClose = document.getElementById('orderModalClose');
const heroOrderBtn    = document.getElementById('heroOrderBtn');
const itemSearch      = document.getElementById('itemSearch');
const itemSuggestions = document.getElementById('itemSuggestions');
const addItemToOrder  = document.getElementById('addItemToOrder');
const orderCart       = document.getElementById('orderCart');
const placeOrderBtn   = document.getElementById('placeOrderBtn');
const orderError      = document.getElementById('orderError');
const orderToast      = document.getElementById('orderToast');
const orderToastMsg   = document.getElementById('orderToastMsg');

let cart = [];           // [{ name, price, qty }]
let selectedItem = null; // currently highlighted suggestion

// Open modal
function openOrderModal(preloadName, preloadPrice) {
  cart = [];
  orderError.textContent = '';
  document.getElementById('customerName').value = '';
  document.getElementById('orderNote').value = '';
  itemSearch.value = '';
  itemSuggestions.classList.remove('show');
  renderCart();
  orderModal.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (preloadName) {
    addToCart(preloadName, preloadPrice || '');
  }
}

function closeOrderModal() {
  orderModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Hero "Order Now" button
if (heroOrderBtn) {
  heroOrderBtn.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = 'orderpage.html';
  });
}

orderModalClose.addEventListener('click', closeOrderModal);
orderModal.addEventListener('click', e => {
  if (e.target === orderModal) closeOrderModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeOrderModal();
});

// Quick order from menu item card — go to order page with item pre-loaded
function quickOrder(name, price) {
  const params = new URLSearchParams({ order: name, price: price, qty: 1 });
  window.location.href = 'orderpage.html?' + params.toString();
}

// ── Item search / suggestions ──
itemSearch.addEventListener('input', () => {
  const q = itemSearch.value.trim().toLowerCase();
  if (!q) { itemSuggestions.classList.remove('show'); return; }

  const matches = getAllMenuItems().filter(i => i.name.toLowerCase().includes(q)).slice(0, 8);
  if (!matches.length) { itemSuggestions.classList.remove('show'); return; }

  itemSuggestions.innerHTML = matches.map(i =>
    `<li data-name="${escHtml(i.name)}" data-price="${escHtml(i.price)}">
      <span>${escHtml(i.name)}</span>
      <span class="sug-price">${escHtml(i.price)}</span>
    </li>`
  ).join('');

  itemSuggestions.classList.add('show');
  selectedItem = null;
});

itemSuggestions.addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;
  addToCart(li.dataset.name, li.dataset.price);
  itemSearch.value = '';
  itemSuggestions.classList.remove('show');
});

// Close suggestions on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.order-field')) {
    itemSuggestions.classList.remove('show');
  }
});

// Add button
addItemToOrder.addEventListener('click', () => {
  const q = itemSearch.value.trim();
  if (!q) return;
  const match = getAllMenuItems().find(i => i.name.toLowerCase() === q.toLowerCase());
  if (match) {
    addToCart(match.name, match.price);
    itemSearch.value = '';
    itemSuggestions.classList.remove('show');
  } else {
    // Add as custom typed item
    addToCart(q, '');
    itemSearch.value = '';
    itemSuggestions.classList.remove('show');
  }
});

// Enter key on search
itemSearch.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addItemToOrder.click();
  }
});

// ── Cart logic ──
function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  renderCart();
  orderError.textContent = '';
}

function renderCart() {
  if (!cart.length) {
    orderCart.innerHTML = '<p class="cart-empty">No items added yet.</p>';
    return;
  }

  let grandTotal = 0;

  const itemsHtml = cart.map((item, idx) => {
    const unit  = parseFloat((item.price || '0').replace(/[^0-9.]/g, '')) || 0;
    const line  = unit * item.qty;
    grandTotal += line;

    return `
    <div class="cart-item">
      <span class="cart-item-name">${escHtml(item.name)}</span>
      <span class="cart-item-price">${unit > 0 ? '$' + line.toFixed(2) : escHtml(item.price)}</span>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
      </div>
      <button class="cart-remove" onclick="removeFromCart(${idx})" title="Remove">
        <i class="fas fa-times"></i>
      </button>
    </div>`;
  }).join('');

  const totalHtml = `
    <div class="cart-total-row">
      <span class="cart-total-label">Total</span>
      <span class="cart-total-val">$${grandTotal.toFixed(2)}</span>
    </div>`;

  orderCart.innerHTML = itemsHtml + totalHtml;
}

function changeQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCart();
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  renderCart();
}

// ── Place order ──
placeOrderBtn.addEventListener('click', () => {
  const name = document.getElementById('customerName').value.trim();
  const note = document.getElementById('orderNote').value.trim();

  if (!name) {
    orderError.textContent = 'Please enter your name.';
    document.getElementById('customerName').focus();
    return;
  }
  if (!cart.length) {
    orderError.textContent = 'Please add at least one item.';
    itemSearch.focus();
    return;
  }

  CoffeeStore.addOrder({
    customerName: name,
    items: cart.map(i => ({ name: i.name, price: i.price, qty: i.qty })),
    note: note,
  });

  closeOrderModal();
  showToast(`Order placed! We'll get started on it right away, ${name} 😊`);
});

// ── Toast ──
function showToast(msg) {
  orderToastMsg.textContent = msg;
  orderToast.classList.add('show');
  setTimeout(() => orderToast.classList.remove('show'), 4000);
}

// ── XSS helper ──
function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Init ──
renderCustomMenuSection();

// Add "🛒 Order" quick-buttons to every static menu item card
document.querySelectorAll('.menu-section .menu-item:not([data-custom-id]) .menu-item-link').forEach(link => {
  const nameEl  = link.querySelector('.name');
  const priceEl = link.querySelector('.name span');
  if (!nameEl) return;

  const rawName = nameEl.childNodes[0]?.textContent?.replace(/[-:]/g, '').trim() || '';
  const price   = priceEl ? priceEl.textContent.trim() : '';

  // Wrap existing view-details-btn + new order btn in a row
  const existingBtn = link.querySelector('.view-details-btn');

  const row = document.createElement('div');
  row.className = 'card-btn-row';

  // Move the existing view-details-btn into the row
  if (existingBtn) {
    existingBtn.parentNode.removeChild(existingBtn);
    row.appendChild(existingBtn);
  }

  // Create order button
  const btn = document.createElement('button');
  btn.className = 'menu-item-order-btn';
  btn.innerHTML = '🛒 Order';
  btn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    const params = new URLSearchParams({ order: rawName, price: price, qty: 1 });
    window.location.href = 'orderpage.html?' + params.toString();
  });
  row.appendChild(btn);

  link.appendChild(row);
});
