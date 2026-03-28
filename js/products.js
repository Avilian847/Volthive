/* ============================================================
   VOLTHIVE — products.js
   Fetch and render products from the API
   ============================================================ */

   let PRODUCTS = [];

   // ── Fetch all products from API ───────────────────────────────
   async function fetchProducts(params = {}) {
     const query = new URLSearchParams(params).toString();
     const endpoint = query ? `/products?${query}` : '/products';
     try {
       PRODUCTS = await apiFetch(endpoint);
       return PRODUCTS;
     } catch (err) {
       console.error('Failed to fetch products:', err.message);
       return [];
     }
   }
   
   // ── Get single product by ID ──────────────────────────────────
   async function fetchProductById(id) {
     try {
       return await apiFetch(`/products/${id}`);
     } catch (err) {
       console.error('Failed to fetch product:', err.message);
       return null;
     }
   }
   
   // ── Get product by ID from local cache ────────────────────────
   function getProductById(id) {
     return PRODUCTS.find(p => p.id === parseInt(id)) || null;
   }
   
   // ── Render product grid ───────────────────────────────────────
   function renderProductGrid(containerId, products) {
     const container = document.getElementById(containerId);
     if (!container) return;
   
     if (!products || products.length === 0) {
       container.innerHTML = `
         <div style="text-align:center;padding:3rem;color:var(--text-2);grid-column:1/-1">
           <div style="font-size:2.5rem;margin-bottom:1rem">📦</div>
           <p>No products found.</p>
         </div>`;
       return;
     }
   
     container.innerHTML = products.map(product => buildProductCard(product)).join('');
     wireProductCards();
   }
   
   // ── Build product card HTML ───────────────────────────────────
   function buildProductCard(product) {
     const badge = product.badge
       ? `<span class="product-card__badge">${product.badge}</span>` : '';
     const oldPrice = product.old_price
       ? `<span class="product-card__old-price">${formatPrice(parseFloat(product.old_price))}</span>` : '';
     const discount = product.old_price
       ? Math.round((1 - product.price / product.old_price) * 100) : null;
     const discountBadge = discount
       ? `<span class="product-card__discount">-${discount}%</span>` : '';
   
     return `
       <div class="product-card" data-id="${product.id}">
         <div class="product-card__image-wrap">
           <img src="${product.image_url}" alt="${product.name}" class="product-card__image" loading="lazy">
           ${badge}
           <button class="product-card__wishlist ${isWishlisted(product.id) ? 'active' : ''}"
                   data-id="${product.id}" aria-label="Wishlist">
             ${isWishlisted(product.id) ? '❤️' : '🤍'}
           </button>
         </div>
         <div class="product-card__body">
           <div class="product-card__category">${product.category || ''}</div>
           <a href="product-detail.html?id=${product.id}" class="product-card__name">${product.name}</a>
           <div class="product-card__rating">
             <span class="stars">${renderStars(parseFloat(product.rating))}</span>
             <span class="product-card__rating-count">(${product.reviews?.toLocaleString() || 0})</span>
           </div>
           <div class="product-card__footer">
             <div class="product-card__price-wrap">
               <span class="product-card__price">${formatPrice(parseFloat(product.price))}</span>
               ${oldPrice}
               ${discountBadge}
             </div>
             <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product.id}">
               + Cart
             </button>
           </div>
         </div>
       </div>
     `;
   }
   
   // ── Wire product card buttons ─────────────────────────────────
   function wireProductCards() {
     document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
       btn.addEventListener('click', (e) => {
         e.preventDefault();
         const id = parseInt(btn.dataset.id);
         const product = getProductById(id);
         if (product) {
           addToCart({ ...product, qty: 1 });
         }
       });
     });
   
     document.querySelectorAll('.product-card__wishlist').forEach(btn => {
       btn.addEventListener('click', (e) => {
         e.preventDefault();
         const id = parseInt(btn.dataset.id);
         const now = toggleWishlist(id);
         btn.textContent = now ? '❤️' : '🤍';
         btn.classList.toggle('active', now);
       });
     });
   }
   
   // ── Init products page ────────────────────────────────────────
   async function initProductsPage() {
     const grid = document.getElementById('productGrid');
     if (!grid) return;
   
     // Show loading state
     grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-2)">Loading products...</div>`;
   
     // Get URL params
     const params = new URLSearchParams(window.location.search);
     const query = {};
     if (params.get('q'))        query.q = params.get('q');
     if (params.get('category')) query.category = params.get('category');
     if (params.get('sort'))     query.sort = params.get('sort');
   
     const products = await fetchProducts(query);
     renderProductGrid('productGrid', products);
   }
   
   // ── Auto-init on products page ────────────────────────────────
   if (document.getElementById('productGrid')) {
     initProductsPage();
   }