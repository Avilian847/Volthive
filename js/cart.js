/* ============================================================
   VOLTHIVE — cart.js
   Cart page rendering, quantity controls, totals
   ============================================================ */

const SHIPPING_THRESHOLD = 75; // Free shipping above this
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08;

// ── Render full cart page ─────────────────────────────────────
function renderCartPage() {
  const cart = getCart();
  const cartItemsEl = document.getElementById('cartItems');
  const emptyMsg = document.getElementById('cartEmpty');
  const cartContent = document.getElementById('cartContent');

  if (!cartItemsEl) return;

  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.classList.remove('hidden');
    if (cartContent) cartContent.classList.add('hidden');
    return;
  }

  if (emptyMsg) emptyMsg.classList.add('hidden');
  if (cartContent) cartContent.classList.remove('hidden');

  cartItemsEl.innerHTML = cart.map(item => buildCartItem(item)).join('');
  wireCartItemEvents();
  updateCartSummary();
}

// ── Build a single cart item row ─────────────────────────────
function buildCartItem(item) {
  const subtotal = item.price * item.qty;
  return `
    <div class="cart-item" id="cart-item-${item.id}">
      <div class="cart-item__image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item__info">
        <div class="cart-item__category">${item.category}</div>
        <a href="product-detail.html?id=${item.id}">
          <div class="cart-item__name">${item.name}</div>
        </a>
        <div class="cart-item__price mt-1">${formatPrice(item.price)}</div>
      </div>
      <div class="cart-item__actions">
        <div class="quantity-control">
          <button class="qty-btn qty-dec" data-id="${item.id}" aria-label="Decrease">−</button>
          <input class="qty-input" type="number" value="${item.qty}" min="1" max="99"
                 data-id="${item.id}" id="qty-${item.id}" aria-label="Quantity">
          <button class="qty-btn qty-inc" data-id="${item.id}" aria-label="Increase">+</button>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-display);font-weight:700;color:var(--accent)">
            ${formatPrice(subtotal)}
          </div>
          <button class="btn btn-danger btn-sm mt-1 remove-cart-btn" data-id="${item.id}">
            🗑 Remove
          </button>
        </div>
      </div>
    </div>
  `;
}

// ── Wire cart item controls ───────────────────────────────────
function wireCartItemEvents() {
  // Decrement
  document.querySelectorAll('.qty-dec').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const input = document.getElementById(`qty-${id}`);
      const newQty = Math.max(1, parseInt(input.value) - 1);
      input.value = newQty;
      updateCartQty(id, newQty);
      updateItemSubtotal(id, newQty);
      updateCartSummary();
    });
  });

  // Increment
  document.querySelectorAll('.qty-inc').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const input = document.getElementById(`qty-${id}`);
      const newQty = parseInt(input.value) + 1;
      input.value = newQty;
      updateCartQty(id, newQty);
      updateItemSubtotal(id, newQty);
      updateCartSummary();
    });
  });

  // Manual input
  document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', () => {
      const id = parseInt(input.dataset.id);
      const newQty = Math.max(1, parseInt(input.value) || 1);
      input.value = newQty;
      updateCartQty(id, newQty);
      updateItemSubtotal(id, newQty);
      updateCartSummary();
    });
  });

  // Remove
  document.querySelectorAll('.remove-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const item = document.getElementById(`cart-item-${id}`);
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
      item.style.transition = 'all 0.3s';
      setTimeout(() => {
        removeFromCart(id);
        renderCartPage();
        showToast('Item removed from cart', 'info');
      }, 300);
    });
  });
}

// ── Update item subtotal display ─────────────────────────────
function updateItemSubtotal(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  const row = document.getElementById(`cart-item-${id}`);
  if (!row) return;
  const subtotalEl = row.querySelector('[style*="color:var(--accent)"]');
  if (subtotalEl) subtotalEl.textContent = formatPrice(item.price * qty);
}

// ── Calculate and update summary panel ───────────────────────
function updateCartSummary() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set('summary-subtotal', formatPrice(subtotal));
  set('summary-shipping', shipping === 0 ? '🎉 FREE' : formatPrice(shipping));
  set('summary-tax', formatPrice(tax));
  set('summary-total', formatPrice(total));

  const shippingEl = document.getElementById('summary-shipping');
  if (shippingEl && shipping === 0) shippingEl.style.color = 'var(--success)';

  // Shipping progress bar
  const progressEl = document.getElementById('shipping-progress');
  const progressBarEl = document.getElementById('shipping-bar');
  if (progressEl && progressBarEl) {
    const pct = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);
    progressBarEl.style.width = pct + '%';
    if (subtotal >= SHIPPING_THRESHOLD) {
      progressEl.textContent = '🎉 You qualify for free shipping!';
    } else {
      const remaining = formatPrice(SHIPPING_THRESHOLD - subtotal);
      progressEl.textContent = `Add ${remaining} more for free shipping`;
    }
  }

  // Save checkout summary to localStorage
  localStorage.setItem('volthive_checkout_summary', JSON.stringify({
    subtotal, shipping, tax, total, items: cart.length
  }));
}

// ── Promo code handler ────────────────────────────────────────
const promoBtn = document.getElementById('applyPromo');
const promoCodes = {
  'VOLT10': 0.10,
  'LAUNCH20': 0.20,
  'GADGET15': 0.15
};

if (promoBtn) {
  promoBtn.addEventListener('click', () => {
    const code = document.getElementById('promoCode')?.value.trim().toUpperCase();
    const discount = promoCodes[code];
    if (discount) {
      const cart = getCart();
      const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
      const savings = subtotal * discount;
      showToast(`Code applied! You saved ${formatPrice(savings)} 🎉`, 'success');
      // Visual indicator
      const codeInput = document.getElementById('promoCode');
      if (codeInput) {
        codeInput.style.borderColor = 'var(--success)';
        codeInput.disabled = true;
        promoBtn.textContent = '✓ Applied';
        promoBtn.disabled = true;
      }
    } else {
      showToast('Invalid promo code', 'error');
    }
  });
}

// ── Checkout button ───────────────────────────────────────────
const checkoutBtn = document.getElementById('goToCheckout');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }
    window.location.href = 'checkout.html';
  });
}

// ── Initialize cart page ──────────────────────────────────────
if (document.getElementById('cartItems')) {
  renderCartPage();
}
