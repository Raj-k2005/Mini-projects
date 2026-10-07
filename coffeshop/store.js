/**
 * store.js — Shared data layer using localStorage
 * Used by: index.html, coffeshop.html, admin.html
 */
const CoffeeStore = (() => {

  const KEYS = {
    ORDERS:           'cb_orders',
    COMPLETED_ORDERS: 'cb_completed_orders',
    CUSTOM_MENU:      'cb_custom_menu',
    ADMIN_CREDS:      'cb_admin_creds',
    ADMIN_SESSION:    'cb_admin_session',
  };

  // ── Admin credentials ──────────────────────────────────────────
  function getAdminCredentials() {
    const stored = localStorage.getItem(KEYS.ADMIN_CREDS);
    if (stored) return JSON.parse(stored);
    // Default credentials
    return { username: 'admin', password: 'admin123' };
  }

  function setAdminCredentials(username, password) {
    localStorage.setItem(KEYS.ADMIN_CREDS, JSON.stringify({ username, password }));
  }

  // ── Admin session ──────────────────────────────────────────────
  function setAdminSession() {
    sessionStorage.setItem(KEYS.ADMIN_SESSION, 'true');
  }

  function isAdminLoggedIn() {
    return sessionStorage.getItem(KEYS.ADMIN_SESSION) === 'true';
  }

  function clearAdminSession() {
    sessionStorage.removeItem(KEYS.ADMIN_SESSION);
  }

  // ── Orders ─────────────────────────────────────────────────────
  function getOrders() {
    const raw = localStorage.getItem(KEYS.ORDERS);
    return raw ? JSON.parse(raw) : [];
  }

  function saveOrders(orders) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  }

  function addOrder(order) {
    const orders = getOrders();
    order.id        = Date.now();
    order.timestamp = new Date().toISOString();
    order.status    = 'Pending';
    orders.unshift(order);
    saveOrders(orders);
    return order;   // ← return so callers can read the assigned id
  }

  function updateOrderStatus(orderId, status) {
    const orders = getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      if (status === 'Ready') {
        orders[idx].readyAt = new Date().toISOString();
      }
      saveOrders(orders);
    }
  }

  function deleteOrder(orderId) {
    const orders = getOrders().filter(o => o.id !== orderId);
    saveOrders(orders);
  }

  // ── Completed orders ───────────────────────────────────────────
  function getCompletedOrders() {
    const raw = localStorage.getItem(KEYS.COMPLETED_ORDERS);
    return raw ? JSON.parse(raw) : [];
  }

  function archiveOrder(orderId) {
    // Only archive orders that admin has marked as Ready
    const orders = getOrders();
    const idx    = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return;
    const order  = orders[idx];
    // Guard: only move to completed if status is Ready
    if (order.status !== 'Ready') return;
    order.completedAt = new Date().toISOString();
    const completed   = getCompletedOrders();
    completed.unshift(order);
    localStorage.setItem(KEYS.COMPLETED_ORDERS, JSON.stringify(completed));
    orders.splice(idx, 1);
    saveOrders(orders);
  }

  // ── Custom menu items (added by admin) ────────────────────────
  function getCustomMenuItems() {
    const raw = localStorage.getItem(KEYS.CUSTOM_MENU);
    return raw ? JSON.parse(raw) : [];
  }

  function saveCustomMenuItems(items) {
    localStorage.setItem(KEYS.CUSTOM_MENU, JSON.stringify(items));
  }

  function addCustomMenuItem(item) {
    const items = getCustomMenuItems();
    item.id        = 'custom_' + Date.now();
    item.isCustom  = true;
    items.push(item);
    saveCustomMenuItems(items);
    return item;
  }

  function deleteCustomMenuItem(itemId) {
    const items = getCustomMenuItems().filter(i => i.id !== itemId);
    saveCustomMenuItems(items);
  }

  return {
    getAdminCredentials,
    setAdminCredentials,
    setAdminSession,
    isAdminLoggedIn,
    clearAdminSession,
    getOrders,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    archiveOrder,
    getCompletedOrders,
    getCustomMenuItems,
    addCustomMenuItem,
    deleteCustomMenuItem,
  };
})();
