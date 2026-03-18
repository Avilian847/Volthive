/* ============================================================
   VOLTHIVE — products.js
   Product data, rendering, filtering, search
   ============================================================ */

// ── Product Catalog ──────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: 'Sony WH-1000XM5 Headphones',
    category: 'Audio',
    price: 349.99,
    oldPrice: 399.99,
    rating: 4.8,
    reviews: 1240,
    stock: 15,
    badge: 'Bestseller',
    badgeType: 'accent',
    image: 'https://placehold.co/400x400/0f1117/00d4ff?text=Sony+WH5',
    images: [
      'https://placehold.co/600x600/0f1117/00d4ff?text=Sony+WH5',
      'https://placehold.co/600x600/161a24/00d4ff?text=Side+View',
      'https://placehold.co/600x600/0f1117/7b5cff?text=Detail',
      'https://placehold.co/600x600/161a24/7b5cff?text=Case'
    ],
    desc: 'Industry-leading noise cancellation with Auto NC Optimizer. 30-hour battery life with quick charge. Multipoint connection — connect to two devices simultaneously.',
    specs: {
      'Driver': '30mm',
      'Frequency': '4Hz–40,000Hz',
      'Battery': '30 hours',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.2',
      'Noise Cancellation': 'Active (ANC)'
    }
  },
  {
    id: 2,
    name: 'Apple AirPods Pro 2nd Gen',
    category: 'Audio',
    price: 249.00,
    oldPrice: 279.00,
    rating: 4.7,
    reviews: 3820,
    stock: 30,
    badge: 'Hot',
    badgeType: 'danger',
    image: 'https://placehold.co/400x400/0f1117/ffffff?text=AirPods+Pro',
    images: [
      'https://placehold.co/600x600/0f1117/ffffff?text=AirPods+Pro',
      'https://placehold.co/600x600/161a24/ffffff?text=Case',
      'https://placehold.co/600x600/0f1117/00d4ff?text=In+Ear',
      'https://placehold.co/600x600/161a24/00d4ff?text=Controls'
    ],
    desc: 'H2 chip delivers twice the noise cancellation of AirPods Pro 1st gen. Adaptive Audio combines Transparency and ANC. Personalized Spatial Audio with dynamic head tracking.',
    specs: {
      'Chip': 'Apple H2',
      'Battery (Buds)': '6 hours ANC on',
      'Battery (Case)': '30 hours total',
      'Water Resistance': 'IPX4',
      'Connectivity': 'Bluetooth 5.3',
      'Noise Cancellation': 'Active (ANC)'
    }
  },
  {
    id: 3,
    name: 'Samsung Galaxy Tab S9 Ultra',
    category: 'Tablets',
    price: 1199.99,
    oldPrice: 1299.99,
    rating: 4.6,
    reviews: 892,
    stock: 8,
    badge: 'New',
    badgeType: 'purple',
    image: 'https://placehold.co/400x400/0f1117/7b5cff?text=Tab+S9',
    images: [
      'https://placehold.co/600x600/0f1117/7b5cff?text=Tab+S9+Ultra',
      'https://placehold.co/600x600/161a24/7b5cff?text=Side',
      'https://placehold.co/600x600/0f1117/00d4ff?text=S+Pen',
      'https://placehold.co/600x600/161a24/00d4ff?text=Keyboard'
    ],
    desc: '14.6" Dynamic AMOLED 2X display with 120Hz. Snapdragon 8 Gen 2 for Galaxy. S Pen included. IP68 water resistance. Quad speakers tuned by AKG.',
    specs: {
      'Display': '14.6" AMOLED 120Hz',
      'Processor': 'Snapdragon 8 Gen 2',
      'RAM': '12GB',
      'Storage': '256GB',
      'Battery': '11,200mAh',
      'Camera': '13MP + 12MP Ultra'
    }
  },
  {
    id: 4,
    name: 'Logitech MX Master 3S',
    category: 'Accessories',
    price: 99.99,
    oldPrice: 119.99,
    rating: 4.9,
    reviews: 5200,
    stock: 50,
    badge: 'Top Rated',
    badgeType: 'success',
    image: 'https://placehold.co/400x400/0f1117/00e676?text=MX+Master',
    images: [
      'https://placehold.co/600x600/0f1117/00e676?text=MX+Master+3S',
      'https://placehold.co/600x600/161a24/00e676?text=Bottom',
      'https://placehold.co/600x600/0f1117/00d4ff?text=Scroll+Wheel',
      'https://placehold.co/600x600/161a24/00d4ff?text=Receiver'
    ],
    desc: 'MagSpeed electromagnetic scroll wheel. 8K DPI tracking on any surface including glass. Quiet clicks. 70 days battery life. Works on up to 3 computers with Easy-Switch.',
    specs: {
      'DPI': 'Up to 8,000',
      'Buttons': '7',
      'Battery': '70 days',
      'Connection': 'USB-C, Logi Bolt, BT',
      'OS': 'Win/Mac/Linux/ChromeOS',
      'Dimensions': '124.9 × 84.3 × 51mm'
    }
  },
  {
    id: 5,
    name: 'ASUS ROG Zephyrus G14',
    category: 'Laptops',
    price: 1649.99,
    oldPrice: 1799.99,
    rating: 4.7,
    reviews: 634,
    stock: 6,
    badge: 'Sale',
    badgeType: 'warning',
    image: 'https://placehold.co/400x400/0f1117/ffab00?text=ROG+G14',
    images: [
      'https://placehold.co/600x600/0f1117/ffab00?text=ROG+Zephyrus+G14',
      'https://placehold.co/600x600/161a24/ffab00?text=AniMe+Matrix',
      'https://placehold.co/600x600/0f1117/00d4ff?text=Keyboard',
      'https://placehold.co/600x600/161a24/00d4ff?text=Ports'
    ],
    desc: 'AMD Ryzen 9 7940HS + NVIDIA RTX 4060. 14" QHD+ 165Hz display. 76Wh battery. Iconic AniMe Matrix LED lid. Weighs only 1.65kg.',
    specs: {
      'CPU': 'AMD Ryzen 9 7940HS',
      'GPU': 'NVIDIA RTX 4060',
      'RAM': '16GB DDR5',
      'Storage': '1TB NVMe SSD',
      'Display': '14" QHD+ 165Hz',
      'Battery': '76Wh'
    }
  },
  {
    id: 6,
    name: 'DJI Mini 4 Pro Drone',
    category: 'Drones',
    price: 759.00,
    oldPrice: 799.00,
    rating: 4.8,
    reviews: 318,
    stock: 12,
    badge: 'New',
    badgeType: 'purple',
    image: 'https://placehold.co/400x400/0f1117/7b5cff?text=DJI+Mini+4',
    images: [
      'https://placehold.co/600x600/0f1117/7b5cff?text=DJI+Mini+4+Pro',
      'https://placehold.co/600x600/161a24/7b5cff?text=Folded',
      'https://placehold.co/600x600/0f1117/00d4ff?text=Controller',
      'https://placehold.co/600x600/161a24/00d4ff?text=Camera'
    ],
    desc: 'Under 249g, no FAA registration needed in the US. 4K/60fps video, 48MP photos. Omnidirectional obstacle sensing. 34 min max flight time. ActiveTrack 360°.',
    specs: {
      'Weight': '< 249g',
      'Camera': '48MP, 1/1.3" CMOS',
      'Video': '4K/60fps HDR',
      'Flight Time': '34 min',
      'Range': '20 km (O4)',
      'Obstacle Sensing': 'Omnidirectional'
    }
  },
  {
    id: 7,
    name: 'iPad Air M2 11-inch',
    category: 'Tablets',
    price: 599.00,
    oldPrice: null,
    rating: 4.8,
    reviews: 2140,
    stock: 25,
    badge: null,
    badgeType: null,
    image: 'https://placehold.co/400x400/0f1117/00d4ff?text=iPad+Air',
    images: [
      'https://placehold.co/600x600/0f1117/00d4ff?text=iPad+Air+M2',
      'https://placehold.co/600x600/161a24/00d4ff?text=With+Pencil',
      'https://placehold.co/600x600/0f1117/7b5cff?text=Colors',
      'https://placehold.co/600x600/161a24/7b5cff?text=Keyboard'
    ],
    desc: 'Supercharged by M2 chip. Stunning 11-inch Liquid Retina display. Works with Apple Pencil Pro. Magic Keyboard support. Wi-Fi 6E for ultra-fast connectivity.',
    specs: {
      'Chip': 'Apple M2',
      'Display': '11" Liquid Retina',
      'Storage Options': '128GB–1TB',
      'Front Camera': '12MP Ultra Wide',
      'Rear Camera': '12MP',
      'Battery': 'Up to 10 hours'
    }
  },
  {
    id: 8,
    name: 'Anker 240W GaN Charger',
    category: 'Accessories',
    price: 79.99,
    oldPrice: 99.99,
    rating: 4.6,
    reviews: 1890,
    stock: 60,
    badge: 'Sale',
    badgeType: 'warning',
    image: 'https://placehold.co/400x400/0f1117/ffab00?text=Anker+GaN',
    images: [
      'https://placehold.co/600x600/0f1117/ffab00?text=Anker+240W',
      'https://placehold.co/600x600/161a24/ffab00?text=Ports',
      'https://placehold.co/600x600/0f1117/00d4ff?text=Size+Compare',
      'https://placehold.co/600x600/161a24/00d4ff?text=Cable'
    ],
    desc: '4-port GaN charger with a combined 240W. Charges a MacBook Pro 16" at full speed. PowerIQ 4.0 detects and delivers optimal power for every device.',
    specs: {
      'Total Power': '240W',
      'Ports': '3× USB-C, 1× USB-A',
      'Technology': 'GaN, PowerIQ 4.0',
      'Compatibility': 'Universal',
      'Dimensions': '68 × 68 × 32mm',
      'Safety': 'MultiProtect'
    }
  },
  {
    id: 9,
    name: 'Samsung 49" Odyssey G9',
    category: 'Monitors',
    price: 1299.99,
    oldPrice: 1499.99,
    rating: 4.5,
    reviews: 427,
    stock: 4,
    badge: 'Low Stock',
    badgeType: 'danger',
    image: 'https://placehold.co/400x400/0f1117/ff3d71?text=Odyssey+G9',
    images: [
      'https://placehold.co/600x600/0f1117/ff3d71?text=Odyssey+G9',
      'https://placehold.co/600x600/161a24/ff3d71?text=Curve',
      'https://placehold.co/600x600/0f1117/00d4ff?text=Ports',
      'https://placehold.co/600x600/161a24/00d4ff?text=RGB+Back'
    ],
    desc: 'DQHD (5120×1440) resolution. 240Hz refresh rate. 1ms response time. Quantum Mini LED with 2048 dimming zones. 1000R curved — matches the human eye curvature.',
    specs: {
      'Resolution': '5120 × 1440 (DQHD)',
      'Refresh Rate': '240Hz',
      'Response Time': '1ms GtG',
      'Panel': 'VA Quantum Mini LED',
      'Curve': '1000R',
      'HDR': 'HDR2000'
    }
  },
  {
    id: 10,
    name: 'Elgato Stream Deck MK.2',
    category: 'Accessories',
    price: 149.99,
    oldPrice: 169.99,
    rating: 4.7,
    reviews: 2350,
    stock: 20,
    badge: null,
    badgeType: null,
    image: 'https://placehold.co/400x400/0f1117/00d4ff?text=Stream+Deck',
    images: [
      'https://placehold.co/600x600/0f1117/00d4ff?text=Stream+Deck+MK2',
      'https://placehold.co/600x600/161a24/00d4ff?text=Keys',
      'https://placehold.co/600x600/0f1117/7b5cff?text=Side',
      'https://placehold.co/600x600/161a24/7b5cff?text=Software'
    ],
    desc: '15 LCD keys. Customizable layout. One-touch actions for streaming, editing, and productivity. Works with OBS, Twitch, YouTube, Spotify, and thousands of apps.',
    specs: {
      'Keys': '15 LCD',
      'Connection': 'USB-C',
      'Compatibility': 'Windows, macOS',
      'Key Resolution': '72 × 72px',
      'App Integrations': '100+',
      'Dimensions': '118 × 84 × 21mm'
    }
  },
  {
    id: 11,
    name: 'Apple MacBook Air M3',
    category: 'Laptops',
    price: 1099.00,
    oldPrice: null,
    rating: 4.9,
    reviews: 3120,
    stock: 18,
    badge: 'Bestseller',
    badgeType: 'accent',
    image: 'https://placehold.co/400x400/0f1117/00d4ff?text=MacBook+Air',
    images: [
      'https://placehold.co/600x600/0f1117/00d4ff?text=MacBook+Air+M3',
      'https://placehold.co/600x600/161a24/00d4ff?text=Open',
      'https://placehold.co/600x600/0f1117/7b5cff?text=Keyboard',
      'https://placehold.co/600x600/161a24/7b5cff?text=Colors'
    ],
    desc: 'M3 chip with 8-core CPU and 10-core GPU. 18-hour battery life. 13.6" Liquid Retina display. Fanless design — absolutely silent. First Air to support dual external displays.',
    specs: {
      'Chip': 'Apple M3',
      'RAM': '8GB unified',
      'Storage': '256GB SSD',
      'Display': '13.6" Liquid Retina',
      'Battery': '18 hours',
      'Weight': '1.24kg'
    }
  },
  {
    id: 12,
    name: 'JBL Flip 6 Speaker',
    category: 'Audio',
    price: 129.95,
    oldPrice: 149.95,
    rating: 4.5,
    reviews: 4120,
    stock: 45,
    badge: null,
    badgeType: null,
    image: 'https://placehold.co/400x400/0f1117/7b5cff?text=JBL+Flip+6',
    images: [
      'https://placehold.co/600x600/0f1117/7b5cff?text=JBL+Flip+6',
      'https://placehold.co/600x600/161a24/7b5cff?text=Angle',
      'https://placehold.co/600x600/0f1117/00d4ff?text=Buttons',
      'https://placehold.co/600x600/161a24/00d4ff?text=Colors'
    ],
    desc: 'Racetrack-shaped woofer and a separate tweeter. IP67 dustproof and waterproof. 12 hours of playtime. JBL PartyBoost to link multiple speakers.',
    specs: {
      'Output Power': '30W',
      'Battery': '12 hours',
      'Water Rating': 'IP67',
      'Connectivity': 'Bluetooth 5.1',
      'Frequency': '63Hz–20kHz',
      'Dimensions': '178 × 68 × 68mm'
    }
  }
];

// ── Get product by ID ─────────────────────────────────────────
function getProductById(id) {
  return PRODUCTS.find(p => p.id === parseInt(id));
}

// ── Get products by category ──────────────────────────────────
function getProductsByCategory(cat) {
  if (!cat || cat === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.category.toLowerCase() === cat.toLowerCase());
}

// ── Build product card HTML ───────────────────────────────────
function buildProductCard(product) {
  const wishlisted = isWishlisted(product.id);
  const badge = product.badge
    ? `<span class="badge badge-${product.badgeType}">${product.badge}</span>`
    : '';
  const oldPrice = product.oldPrice
    ? `<div class="product-card__price-old">${formatPrice(product.oldPrice)}</div>`
    : '';

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-card__image-wrap">
        <img class="product-card__image"
             src="${product.image}"
             alt="${product.name}"
             loading="lazy">
        <div class="product-card__badges">${badge}</div>
        <div class="product-card__actions">
          <button class="product-card__action-btn wishlist-btn ${wishlisted ? 'wishlisted' : ''}"
                  data-id="${product.id}"
                  title="Wishlist"
                  aria-label="Toggle wishlist">
            ${wishlisted ? '❤️' : '🤍'}
          </button>
          <a href="product-detail.html?id=${product.id}"
             class="product-card__action-btn"
             title="Quick view"
             aria-label="View product">👁️</a>
        </div>
      </div>
      <div class="product-card__body">
        <span class="product-card__category">${product.category}</span>
        <a href="product-detail.html?id=${product.id}">
          <h3 class="product-card__name">${product.name}</h3>
        </a>
        <div class="product-card__rating">
          <span class="stars">${renderStars(product.rating)}</span>
          <span class="text-muted rating-count">(${product.reviews.toLocaleString()})</span>
        </div>
        <div class="product-card__footer">
          <div>
            <div class="product-card__price">${formatPrice(product.price)}</div>
            ${oldPrice}
          </div>
          <button class="product-card__add-btn add-to-cart-btn"
                  id="add-btn-${product.id}"
                  data-id="${product.id}">
            Add +
          </button>
        </div>
      </div>
    </article>
  `;
}

// ── Wire card events after rendering ─────────────────────────
function wireProductCardEvents(container) {
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const product = getProductById(id);
      if (product) {
        addToCart(product);
        btn.textContent = '✓ Added';
        btn.classList.add('added');
        setTimeout(() => {
          btn.textContent = 'Add +';
          btn.classList.remove('added');
        }, 1500);
      }
    });
  });

  container.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const now = toggleWishlist(id);
      btn.textContent = now ? '❤️' : '🤍';
      btn.classList.toggle('wishlisted', now);
    });
  });
}

// ── Render product grid into a container ─────────────────────
function renderProductGrid(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = products.map(buildProductCard).join('');
  wireProductCardEvents(container);
}

// ── Filter + Sort products ────────────────────────────────────
function filterAndSort(products, { search, category, minPrice, maxPrice, sort }) {
  let result = [...products];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') {
    result = result.filter(p => p.category === category);
  }

  if (minPrice != null) result = result.filter(p => p.price >= minPrice);
  if (maxPrice != null) result = result.filter(p => p.price <= maxPrice);

  switch (sort) {
    case 'price-asc':  result.sort((a, b) => a.price - b.price); break;
    case 'price-desc': result.sort((a, b) => b.price - a.price); break;
    case 'rating':     result.sort((a, b) => b.rating - a.rating); break;
    case 'newest':     result.sort((a, b) => b.id - a.id); break;
    default: break;
  }

  return result;
}

// ── Category list for filters ─────────────────────────────────
const CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))];

// ── Featured products (homepage) ─────────────────────────────
const FEATURED_PRODUCTS = PRODUCTS.filter(p => p.badge !== null).slice(0, 4);
const DEAL_PRODUCTS = PRODUCTS.filter(p => p.oldPrice !== null).slice(0, 4);
