/* ============================================================
   VOLTHIVE — cart.js
   Cart page rendering, quantity controls, totals
   Guests: localStorage | Logged in: server-side API
   ============================================================ */

   const SHIPPING_THRESHOLD = 75;
   const SHIPPING_COST = 9.99;
   const TAX_RATE = 0.08;
   
   // ── Determine if user is logged in ────────────────────────────
   function isLoggedIn() {
     return !!getCurrentUser();
   }
   
   // ── Get cart (server or local) ────────────────────────────────
   async function getCartItems() {
     if (isLoggedIn()) {
       try {
         const items = await apiFetch('/cart');
         return items.map(item => ({
           id: item.product_id,
           cartItemId: item.id,
           name: item.name,
           price: parseFloat(item.price),
           image: item.image_url,
           qty: item.quantity,
           stock: item.stock
         }));
       } catch (err) {
         console.error('Failed to fetch server cart:', err.message);
         return getCart();
       }
     }
     return getCart();
   }
   
   // ── Add to cart (server or local) ────────────────────────────
   async function addToCartSmart(product) {
     if (isLoggedIn()) {
       try {
         await apiFetch('/cart', {
           method: 'POST',
           body: JSON.stringify({
             product_id: product.id,
             quantity: product.qty || 1
           })
         });
         showToast(`${product.name} added to cart`, 'success');
         updateCartBadge();
       } catch (err) {
         showToast(err.message || 'Failed to add to cart', 'error');
       }
     } else {
       addToCart(product);
     }
   }
   
   // ── Render full cart page ─────────────────────────────────────
   async function renderCartPage() {
     const cartItemsEl = document.getElementById('cartItems');
     const emptyMsg    = document.getElementById('cartEmpty');
     const cartContent = document.getElementById('cartContent');
   
     if (!cartItemsEl) return;
   
     const cart = await getCartItems();
   
     if (cart.length === 0) {
       if (emptyMsg)    emptyMsg.classList.remove('hidden');
       if (cartContent) cartContent.classList.add('hidden');
       return;
     }
   
     if (emptyMsg)    emptyMsg.classList.add('hidden');
     if (cartContent) cartContent.classList.remove('hidden');
   
     cartItemsEl.innerHTML = cart.map(item => buildCartItem(item)).join('');
     wireCartItemEvents(cart);
     updateCartSummary(cart);
   }
   
   // ── Build a single cart item row ──────────────────────────────
   function buildCartItem(item) {
     const subtotal = item.price * item.qty;
     return `
       <div class="cart-item" id="cart-item-${item.id}">
         <div class="cart-item__image">
           <img src="${item.image}" alt="${item.name}">
         </div>
         <div class="cart-item__info">
           <a href="product-detail.html?id=${item.id}">
             <div class="cart-item__name">${item.name}</div>
           </a>
           <div class="cart-item__price mt-1">${formatPrice(item.price)}</div>
         </div>
         <div class="cart-item__actions">
           <div class="quantity-control">
             <button class="qty-btn qty-dec" data-id="${item.id}" data-cart-id="${item.cartItemId || ''}" aria-label="Decrease">−</button>
             <input class="qty-input" type="number" value="${item.qty}" min="1" max="99"
                    data-id="${item.id}" id="qty-${item.id}" aria-label="Quantity">
             <button class="qty-btn qty-inc" data-id="${item.id}" data-cart-id="${item.cartItemId || ''}" aria-label="Increase">+</button>
           </div>
           <div style="text-align:right">
             <div id="subtotal-${item.id}" style="font-family:var(--font-display);font-weight:700;color:var(--accent)">
               ${formatPrice(subtotal)}
             </div>
             <button class="btn btn-danger btn-sm mt-1 remove-cart-btn"
                     data-id="${item.id}" data-cart-id="${item.cartItemId || ''}">
               🗑 Remove
             </button>
           </div>
         </div>
       </div>
     `;
   }
   
   // ── Wire cart item controls ───────────────────────────────────
   function wireCartItemEvents(cart) {
     document.querySelectorAll('.qty-dec').forEach(btn => {
       btn.addEventListener('click', async () => {
         const id     = parseInt(btn.dataset.id);
         const cartId = btn.dataset.cartId;
         const input  = document.getElementById(`qty-${id}`);
         const newQty = Math.max(1, parseInt(input.value) - 1);
         input.value  = newQty;
         await updateQty(id, cartId, newQty, cart);
       });
     });
   
     document.querySelectorAll('.qty-inc').forEach(btn => {
       btn.addEventListener('click', async () => {
         const id     = parseInt(btn.dataset.id);
         const cartId = btn.dataset.cartId;
         const input  = document.getElementById(`qty-${id}`);
         const newQty = parseInt(input.value) + 1;
         input.value  = newQty;
         await updateQty(id, cartId, newQty, cart);
       });
     });
   
     document.querySelectorAll('.qty-input').forEach(input => {
       input.addEventListener('change', async () => {
         const id     = parseInt(input.dataset.id);
         const btn    = document.querySelector(`.qty-dec[data-id="${id}"]`);
         const cartId = btn?.dataset.cartId;
         const newQty = Math.max(1, parseInt(input.value) || 1);
         input.value  = newQty;
         await updateQty(id, cartId, newQty, cart);
       });
     });
   
     document.querySelectorAll('.remove-cart-btn').forEach(btn => {
       btn.addEventListener('click', async () => {
         const id     = parseInt(btn.dataset.id);
         const cartId = btn.dataset.cartId;
         const item   = document.getElementById(`cart-item-${id}`);
         item.style.opacity   = '0';
         item.style.transform = 'translateX(20px)';
         item.style.transition = 'all 0.3s';
         setTimeout(async () => {
           if (isLoggedIn() && cartId) {
             await apiFetch(`/cart/${cartId}`, { method: 'DELETE' });
           } else {
             removeFromCart(id);
           }
           renderCartPage();
           showToast('Item removed from cart', 'info');
         }, 300);
       });
     });
   }
   
   // ── Update quantity ───────────────────────────────────────────
   async function updateQty(productId, cartId, qty, cart) {
     const item = cart.find(i => i.id === productId);
     if (!item) return;
   
     if (isLoggedIn() && cartId) {
       try {
         await apiFetch(`/cart/${cartId}`, {
           method: 'PUT',
           body: JSON.stringify({ quantity: qty })
         });
       } catch (err) {
         showToast('Failed to update quantity', 'error');
       }
     } else {
       updateCartQty(productId, qty);
     }
   
     const subtotalEl = document.getElementById(`subtotal-${productId}`);
     if (subtotalEl) subtotalEl.textContent = formatPrice(item.price * qty);
   
     const updatedCart = cart.map(i => i.id === productId ? { ...i, qty } : i);
     updateCartSummary(updatedCart);
   }
   
   // ── Calculate and update summary panel ───────────────────────
   function updateCartSummary(cart) {
     const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
     const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
     const tax      = subtotal * TAX_RATE;
     const total    = subtotal + shipping + tax;
   
     const set = (id, val) => {
       const el = document.getElementById(id);
       if (el) el.textContent = val;
     };
   
     set('summary-subtotal', formatPrice(subtotal));
     set('summary-shipping', shipping === 0 ? '🎉 FREE' : formatPrice(shipping));
     set('summary-tax',      formatPrice(tax));
     set('summary-total',    formatPrice(total));
   
     const shippingEl = document.getElementById('summary-shipping');
     if (shippingEl && shipping === 0) shippingEl.style.color = 'var(--success)';
   
     const progressEl   = document.getElementById('shipping-progress');
     const progressBarEl = document.getElementById('shipping-bar');
     if (progressEl && progressBarEl) {
       const pct = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);
       progressBarEl.style.width = pct + '%';
       progressEl.textContent = subtotal >= SHIPPING_THRESHOLD
         ? '🎉 You qualify for free shipping!'
         : `Add ${formatPrice(SHIPPING_THRESHOLD - subtotal)} more for free shipping`;
     }
   
     localStorage.setItem('volthive_checkout_summary', JSON.stringify({
       subtotal, shipping, tax, total, items: cart.length
     }));
   }
   
   // ── Promo code handler ────────────────────────────────────────
   const promoBtn = document.getElementById('applyPromo');
   const promoCodes = { 'VOLT10': 0.10, 'LAUNCH20': 0.20, 'GADGET15': 0.15 };
   
   if (promoBtn) {
     promoBtn.addEventListener('click', () => {
       const code     = document.getElementById('promoCode')?.value.trim().toUpperCase();
       const discount = promoCodes[code];
       if (discount) {
         showToast(`Code applied! You saved ${Math.round(discount * 100)}% 🎉`, 'success');
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
     checkoutBtn.addEventListener('click', async () => {
       const cart = await getCartItems();
       if (cart.length === 0) {
         showToast('Your cart is empty', 'error');
         return;
       }
       if (!isLoggedIn()) {
         localStorage.setItem('volthive_redirect', 'checkout.html');
         window.location.href = 'login.html';
         return;
       }
       window.location.href = 'checkout.html';
     });
   }
   
   // ── Initialize cart page ──────────────────────────────────────
   if (document.getElementById('cartItems')) {
     renderCartPage();
   }