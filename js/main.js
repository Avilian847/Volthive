/* ============================================================
   VOLTHIVE — main.js
   Shared utilities: nav, toast, dark mode, helpers
   ============================================================ */

// ── Sticky Nav ──────────────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ── Mobile Menu ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileNav.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

// ── Dark Mode Toggle ─────────────────────────────────────────
const darkToggle = document.getElementById('darkToggle');
const DARK_KEY = 'volthive_dark';

function applyTheme() {
  const isLight = localStorage.getItem(DARK_KEY) === 'light';
  document.body.classList.toggle('light-mode', isLight);
  if (darkToggle) darkToggle.textContent = isLight ? '🌙' : '☀️';
}

applyTheme();

if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem(DARK_KEY, isLight ? 'light' : 'dark');
    darkToggle.textContent = isLight ? '🌙' : '☀️';
  });
}

// ── Toast Notifications ──────────────────────────────────────
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

/**
 * showToast(message, type, duration)
 * type: 'success' | 'error' | 'info'
 */
function showToast(message, type = 'info', duration = 3000) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span class="toast__icon">${icons[type]}</span><span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

// ── Cart Badge Update ────────────────────────────────────────
function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

updateCartBadge();

// ── Cart Helpers ─────────────────────────────────────────────
const CART_KEY = 'volthive_cart';
const WISHLIST_KEY = 'volthive_wishlist';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += product.qty || 1;
  } else {
    cart.push({ ...product, qty: product.qty || 1 });
  }
  saveCart(cart);
  showToast(`${product.name} added to cart`, 'success');
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    if (qty <= 0) {
      removeFromCart(productId);
    } else {
      item.qty = qty;
      saveCart(cart);
    }
  }
}

// ── Wishlist Helpers ─────────────────────────────────────────
function getWishlist() {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; }
  catch { return []; }
}

function toggleWishlist(productId) {
  const list = getWishlist();
  const idx = list.indexOf(productId);
  if (idx === -1) {
    list.push(productId);
    showToast('Added to wishlist', 'success');
  } else {
    list.splice(idx, 1);
    showToast('Removed from wishlist', 'info');
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  return idx === -1;
}

function isWishlisted(productId) {
  return getWishlist().includes(productId);
}

// ── Recently Viewed ──────────────────────────────────────────
const RECENT_KEY = 'volthive_recent';

function addRecentlyViewed(productId) {
  let recent = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  recent = [productId, ...recent.filter(id => id !== productId)].slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
}

function getRecentlyViewed() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; }
  catch { return []; }
}

// ── Stars Renderer ───────────────────────────────────────────
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ── Format Currency ───────────────────────────────────────────
function formatPrice(num) {
  return '$' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ── Active Nav Link ───────────────────────────────────────────
(function highlightActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });
})();

// ── Deals Countdown Timer ─────────────────────────────────────
function startCountdown(targetHours = 10) {
  const end = new Date();
  end.setHours(end.getHours() + targetHours);

  function update() {
    const diff = end - Date.now();
    if (diff <= 0) return;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const hEl = document.getElementById('timer-h');
    const mEl = document.getElementById('timer-m');
    const sEl = document.getElementById('timer-s');
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// ── Quantity Stepper Wiring ───────────────────────────────────
function wireQuantitySteppers() {
  document.querySelectorAll('.quantity-control').forEach(ctrl => {
    const input = ctrl.querySelector('.qty-input');
    ctrl.querySelector('.qty-dec')?.addEventListener('click', () => {
      if (input.value > 1) input.value = parseInt(input.value) - 1;
      input.dispatchEvent(new Event('change'));
    });
    ctrl.querySelector('.qty-inc')?.addEventListener('click', () => {
      input.value = parseInt(input.value) + 1;
      input.dispatchEvent(new Event('change'));
    });
  });
}

// ── Nav Search ────────────────────────────────────────────────
const navSearchInput = document.getElementById('navSearch');
if (navSearchInput) {
  navSearchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && navSearchInput.value.trim()) {
      window.location.href = `products.html?q=${encodeURIComponent(navSearchInput.value.trim())}`;
    }
  });
}
