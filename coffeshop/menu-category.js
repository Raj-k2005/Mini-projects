/**
 * menu-category.js
 * Shared logic for all category pages (menu-hot, menu-cold, menu-snacks, menu-special).
 * Injects admin-added custom items into the correct page's grid,
 * and adds the 🛒 Order button to every card.
 */

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Inject custom items that belong to `category` into `listEl`.
 * Also attaches 🛒 Order buttons to ALL existing static cards in the list.
 *
 * @param {string}      category  - e.g. 'Hot Coffee', 'Cold Beverage', 'Snack', 'Special'
 * @param {HTMLElement} listEl    - the <ul class="menu-list"> to append into
 */
function injectCustomItems(category, listEl) {
  if (!listEl) return;

  // ── 1. Inject admin-added items for this category ──────────────
  const customItems = CoffeeStore.getCustomMenuItems()
    .filter(item => item.category === category);

  customItems.forEach(item => {
    // Avoid duplicates
    if (listEl.querySelector(`[data-custom-id="${CSS.escape(item.id)}"]`)) return;

    const li = document.createElement('li');
    li.className = 'menu-item';
    li.dataset.customId = item.id;
    li.innerHTML = `
      <a href="product.html?id=${escHtml(item.id)}" class="menu-item-link">
        <img src="${escHtml(item.image)}" alt="${escHtml(item.name)}"
             class="menu-image" onerror="this.src='hot5.png.png'">
        <h3 class="name">${escHtml(item.name)}: <span style="color:yellow;font-size:larger;">${escHtml(item.price)}</span></h3>
        <p class="text">${escHtml(item.description)}</p>
        <div class="card-btn-row">
          <span class="view-details-btn">View Details &#8594;</span>
        </div>
      </a>`;
    listEl.appendChild(li);
  });

  // ── 2. Add 🛒 Order button to every card (static + custom) ─────
  listEl.querySelectorAll('.menu-item-link').forEach(link => {
    // Skip if already has an order button
    if (link.querySelector('.menu-item-order-btn')) return;

    const nameEl  = link.querySelector('.name');
    const priceEl = link.querySelector('.name span');
    if (!nameEl) return;

    const rawName = nameEl.childNodes[0]?.textContent?.replace(/^[-\s:]+/, '').trim() || '';
    const price   = priceEl ? priceEl.textContent.trim() : '';

    const btn = document.createElement('button');
    btn.className   = 'menu-item-order-btn';
    btn.innerHTML   = '🛒 Order';
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const params = new URLSearchParams({ order: rawName, price, qty: 1 });
      window.location.href = 'orderpage.html?' + params.toString();
    });

    // Put both buttons in a row — move existing view-details-btn if needed
    let row = link.querySelector('.card-btn-row');
    if (!row) {
      row = document.createElement('div');
      row.className = 'card-btn-row';
      const existingBtn = link.querySelector('.view-details-btn');
      if (existingBtn) {
        existingBtn.parentNode.removeChild(existingBtn);
        row.appendChild(existingBtn);
      }
      link.appendChild(row);
    }
    row.appendChild(btn);
  });
}
