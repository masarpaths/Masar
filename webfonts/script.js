// Products data
const products = [{
  id: 1,
  name: 'حزام رجالي جلد سكاي',
  price: 60,
  desc: 'حزام جلد سكاي مريح ومتين، مثالي للإطلالة اليومية.',
  emoji: `<img src="img/belt.png" alt="Masar" style="padding: 1px; border-radius: 9px;" />`,
  gradient: 'from-stone-800 to-stone-900',
  icon: `<img src="img/belt.png" alt="Masar" style="border-radius: 10px;" />`
},
  {
    id: 2,
    name: '3 شربات كعب رجالي',
    price: 60,
    desc: 'مجموعة من 3 شربات كعب مريحة وأنيقة، لإطلالة مميزة.',
    emoji: `<img src="img/sock.png" alt="Masar" style="padding: 1px; border-radius: 9px;" />`,
    gradient: 'from-slate-700 to-slate-800',
    icon: `<img src="img/sock.png" alt="Masar" style="border-radius: 10px;" />`
  },
  {
    id: 3,
    name: 'محفظة جلد سكاي رجالي',
    price: 40,
    desc: 'محفظة جلد سكاي عملية لنقودك وبطاقاتك، تصميم كلاسيكي.',
    emoji: `<img src="img/wallet.png" alt="Masar" style="padding: 1px; border-radius: 9px;" />`,
    gradient: 'from-amber-800 to-amber-900',
    icon: `<img src="img/wallet.png" alt="Masar" style="border-radius: 10px;" />`,
  },
  {
    id: 4,
    name: '6 أقلام جاف',
    price: 30,
    desc: 'مجموعة 6 أقلام جاف عالية الجودة، مثالية للكتابة.',
    emoji: `<img src="img/pen.png" alt="Masar" style="padding: 1px; border-radius: 9px;" />`,
    gradient: 'from-blue-800 to-blue-900',
    icon: `<img src="img/pen.png" alt="Masar" style="border-radius: 10px;" />`,
  }];

let cart = [];
let cartOpen = false;

// Default config
const defaultConfig = {
  store_name: 'مسار',
  store_slogan: 'جودة في كل خطوة',
  promo_text: '🎉 تسوق الآن واحصل على خصم 10% على أول طلب!',
  about_text: 'مسار تقدم منتجات جلدية ومكتبية بأسعار تنافسية وجودة عالية، توصيل سريع في مصر. نحرص على اختيار أفضل الخامات لنوفر لعملائنا تجربة تسوق مميزة تجمع بين الأناقة والعملية.',
  background_color: '#ffffff',
  surface_color: '#f0f4f8',
  text_color: '#1a3a5c',
  primary_action_color: '#8B5E3C',
  secondary_action_color: '#153050',
  font_family: 'Tajawal',
  font_size: 16
};

// Render products
function renderProducts() {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = products.map((p, i) => `
    <div class="product-card bg-white rounded-2xl border border-navy-100 overflow-hidden hover:shadow-xl transition-all duration-300 anim-fade-up anim-d${i+1} flex flex-col">
    <div class="bg-gradient-to-br ${p.gradient} p-8 flex items-center justify-center min-h-[180px]">
    <div class="product-img">${p.icon}</div>
    </div>
    <div class="p-5 flex flex-col flex-1">
    <h4 class="font-bold text-navy-500 text-base mb-1">${p.name}</h4>
    <p class="text-navy-300 text-xs leading-relaxed mb-4 flex-1">${p.desc}</p>
    <div class="flex items-center justify-between">
    <span class="text-leather-500 font-extrabold text-xl">${p.price} <span class="text-xs font-medium">ج.م</span></span>
    <button onclick="addToCart(${p.id})" class="bg-navy-500 hover:bg-navy-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95">
    اشترِ الآن
    </button>
    </div>
    </div>
    </div>
    `).join('');
}

// Cart
function addToCart(id) {
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id, qty: 1
    });
  }
  updateCart();
  showToast('✅ تمت الإضافة إلى السلة');
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCart();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }
  updateCart();
}

function updateCart() {
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cart-items');
  const emptyEl = document.getElementById('cart-empty');
  const footerEl = document.getElementById('cart-footer');
  const total = cart.reduce((s, c) => s + c.qty, 0);

  if (total > 0) {
    countEl.style.display = 'flex'; countEl.textContent = total;
  } else {
    countEl.style.display = 'none';
  }

  if (cart.length === 0) {
    emptyEl.style.display = 'block';
    footerEl.classList.add('hidden');
    // clear non-empty items
    [...itemsEl.children].forEach(c => {
      if (c !== emptyEl) c.remove();
    });
    return;
  }

  emptyEl.style.display = 'none';
  footerEl.classList.remove('hidden');

  // rebuild cart items
  const existingIds = new Set();
  [...itemsEl.children].forEach(c => {
    if (c !== emptyEl) c.remove();
  });

  cart.forEach(c => {
    const p = products.find(pr => pr.id === c.id);
    const div = document.createElement('div');
    div.className = 'flex items-center gap-3 bg-navy-50 rounded-xl p-3';
    div.innerHTML = `
    <div class="w-12 h-12 rounded-lg bg-navy-500/10 flex items-center justify-center text-xl flex-shrink-0">${p.emoji}</div>
    <div class="flex-1 min-w-0">
    <p class="text-sm font-bold text-navy-500 truncate">${p.name}</p>
    <p class="text-xs text-leather-500 font-bold">${p.price} ج.م</p>
    </div>
    <div class="flex items-center gap-1.5">
    <button onclick="changeQty(${p.id},-1)" class="w-7 h-7 rounded-lg bg-white border border-navy-100 flex items-center justify-center text-navy-400 hover:bg-navy-100 transition text-sm font-bold">−</button>
    <span class="w-7 text-center text-sm font-bold text-navy-500">${c.qty}</span>
    <button onclick="changeQty(${p.id},1)" class="w-7 h-7 rounded-lg bg-white border border-navy-100 flex items-center justify-center text-navy-400 hover:bg-navy-100 transition text-sm font-bold">+</button>
    </div>
    <button onclick="removeFromCart(${p.id})" class="p-1.5 hover:bg-red-50 rounded-lg transition"><i data-lucide="trash-2" class="w-4 h-4 text-red-400"></i></button>
    `;
    itemsEl.appendChild(div);
  });

  const subtotal = cart.reduce((s, c) => s + c.qty * products.find(p => p.id === c.id).price,
    0);
  const shipping = subtotal >= 500 ? 0: 60;
  document.getElementById('subtotal').textContent = subtotal + ' ج.م';
  document.getElementById('shipping-cost').textContent = shipping === 0 ? 'مجاني': '60 ج.م';
  document.getElementById('shipping-cost').className = shipping === 0 ? 'text-green-600 font-bold': 'text-navy-400';
  document.getElementById('free-shipping-note').classList.toggle('hidden',
    subtotal < 500);
  document.getElementById('total').textContent = (subtotal + shipping) + ' ج.م';

  lucide.createIcons();
}

function toggleCart() {
  cartOpen = !cartOpen;
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (cartOpen) {
    overlay.classList.remove('hidden');
    setTimeout(() => {
      overlay.style.opacity = '1'; drawer.style.transform = 'translateX(0)';
    }, 10);
  } else {
    overlay.style.opacity = '0';
    drawer.style.transform = 'translateX(-100%)';
    setTimeout(() => overlay.classList.add('hidden'), 300);
  }
}

function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('hidden');
}

function navigate(page) {
  ['home',
    'about',
    'contact'].forEach(p => {
      document.getElementById('page-' + p).classList.toggle('hidden', p !== page);
    });
  if (page === 'products') {
    document.getElementById('page-home').classList.remove('hidden');
    document.getElementById('page-about').classList.add('hidden');
    document.getElementById('page-contact').classList.add('hidden');
    setTimeout(() => {
      document.getElementById('products-section').scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  } else {
    document.getElementById('app').scrollTo({
      top: 0, behavior: 'smooth'
    });
  }
}

function submitOrder() {
  if (cart.length === 0) return;
  const subtotal = cart.reduce((s, c) => s + c.qty * products.find(p => p.id === c.id).price, 0);
  const shipping = subtotal >= 500 ? 0: 60;
  const total = subtotal + shipping;

  let msg = '🛒 *طلب جديد من متجر مسار*\n\n';
  cart.forEach(c => {
    const p = products.find(pr => pr.id === c.id);
    msg += `• ${p.name} × ${c.qty} = ${p.price * c.qty} ج.م\n`;
  });
  msg += `\n💰 المجموع الفرعي: ${subtotal} ج.م`;
  msg += `\n🚚 التوصيل: ${shipping === 0 ? 'مجاني': '60 ج.م'}`;
  msg += `\n💵 *الإجمالي: ${total} ج.م*`;

  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/201289012841?text=${encoded}`, '_blank');
}

function showToast(text) {
  const t = document.getElementById('toast');
  t.textContent = text;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// Element SDK
async function initApp() {
  renderProducts();
  lucide.createIcons();

  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      async onConfigChange(config) {
        const c = key => config[key] || defaultConfig[key];

        document.getElementById('store-name-header').textContent = c('store_name');
        document.getElementById('store-slogan-header').textContent = c('store_slogan');
        document.getElementById('store-name-footer').textContent = c('store_name');
        document.getElementById('promo-text').textContent = c('promo_text');
        document.getElementById('about-text').textContent = c('about_text');

        // Colors
        document.body.style.backgroundColor = c('background_color');
        document.querySelectorAll('.bg-navy-50, [class*="bg-navy-50"]').forEach(el => {
          if (!el.closest('header') && !el.closest('#cart-drawer')) {
            // surface color applied via CSS variable approach
          }
        });

        // Font
        const font = c('font_family');
        document.body.style.fontFamily = `${font}, sans-serif`;

        // Font size
        const size = c('font_size');
        document.body.style.fontSize = `${size}px`;
      },
      mapToCapabilities(config) {
        const c = key => config[key] || defaultConfig[key];
        function colorMutable(key) {
          return {
            get: () => c(key),
            set: (v) => {
              config[key] = v; window.elementSdk.setConfig({
                [key]: v
              });
            }
          };
        }
        return {
          recolorables: [
            colorMutable('background_color'),
            colorMutable('surface_color'),
            colorMutable('text_color'),
            colorMutable('primary_action_color'),
            colorMutable('secondary_action_color')
          ],
          borderables: [],
          fontEditable: {
            get: () => c('font_family'),
            set: (v) => {
              config.font_family = v; window.elementSdk.setConfig({
                font_family: v
              });
            }
          },
          fontSizeable: {
            get: () => c('font_size'),
            set: (v) => {
              config.font_size = v; window.elementSdk.setConfig({
                font_size: v
              });
            }
          }
        };
      },
      mapToEditPanelValues(config) {
        const c = key => config[key] || defaultConfig[key];
        return new Map([
          ['store_name',
            c('store_name')],
          ['store_slogan',
            c('store_slogan')],
          ['promo_text',
            c('promo_text')],
          ['about_text',
            c('about_text')]
        ]);
      }
    });
  }
}

initApp();
