// Products data
const products = [{
    id: 1,
    name: 'حزام رجالي جلد سكاي',
    price: 60,
    desc: 'حزام جلدي سكاي مريح ومتين، مثالي للإطلالة اليومية.',
    emoji: '👔',
    gradient: 'from-gray-800 to-gray-900'
},
    {
        id: 2,
        name: '3 شربات كعب رجالي',
        price: 60,
        desc: 'مجموعة من 3 شربات كعب مريحة وأنيقة، لإطلالة مميزة.',
        emoji: '🧦',
        gradient: 'from-leather-400 to-leather-600'
    },
    {
        id: 3,
        name: 'محفظة جلد سكاي رجالي',
        price: 40,
        desc: 'محفظة جلد سكاي عملية لنقودك وبطاقاتك، تصميم كلاسيكي.',
        emoji: '👛',
        gradient: 'from-amber-700 to-amber-900'
    },
    {
        id: 4,
        name: '6 أقلام جاف',
        price: 30,
        desc: 'مجموعة 6 أقلام جاف عالية الجودة، مثالية للكتابة.',
        emoji: '🖊️',
        gradient: 'from-navy-400 to-navy-600'
    }];

let cart = [];

// Render product cards
function renderProducts(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = products.map(p => `
        <div class="product-card fade-in bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl cursor-pointer group">
        <div class="bg-gradient-to-br ${p.gradient} h-40 md:h-48 flex items-center justify-center relative overflow-hidden">
        <span class="text-5xl md:text-6xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">${p.emoji}</span>
        <div class="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">${p.price} ج.م</div>
        </div>
        <div class="p-4">
        <h4 class="font-bold text-sm text-gray-800 mb-1 leading-snug">${p.name}</h4>
        <p class="text-[11px] text-gray-400 mb-3 leading-relaxed line-clamp-2">${p.desc}</p>
        <div class="flex items-center justify-between">
        <span class="font-extrabold text-navy-500 text-base">${p.price} <span class="text-xs font-normal">ج.م</span></span>
        <button onclick="addToCart(${p.id})" class="bg-navy-500 hover:bg-navy-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95">
        اشترِ الآن
        </button>
        </div>
        </div>
        </div>
        `).join('');
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(c => c.id === productId);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            ...product, qty: 1
        });
    }
    updateCartUI();
    showToast(`تمت إضافة "${product.name}" للسلة ✓`);
}

function removeFromCart(productId) {
    cart = cart.filter(c => c.id !== productId);
    updateCartUI();
}

function changeQty(productId, delta) {
    const item = cart.find(c => c.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(productId); return;
    }
    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((s, c) => s + c.qty, 0);
    const badge = document.getElementById('cart-count');
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
    if (count > 0) {
        badge.classList.remove('hidden'); badge.classList.add('flex');
    }

    const empty = document.getElementById('cart-empty');
    const list = document.getElementById('cart-list');
    const footer = document.getElementById('cart-footer');

    if (cart.length === 0) {
        empty.classList.remove('hidden');
        list.classList.add('hidden');
        footer.classList.add('hidden');
        return;
    }

    empty.classList.add('hidden');
    list.classList.remove('hidden');
    footer.classList.remove('hidden');

    list.innerHTML = cart.map(item => `
        <div class="flex items-center gap-3 bg-cream rounded-xl p-3">
        <div class="w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center flex-shrink-0">
        <span class="text-xl">${item.emoji}</span>
        </div>
        <div class="flex-1 min-w-0">
        <p class="text-xs font-bold text-gray-800 truncate">${item.name}</p>
        <p class="text-xs text-leather-500 font-bold">${item.price * item.qty} ج.م</p>
        </div>
        <div class="flex items-center gap-1">
        <button onclick="changeQty(${item.id}, -1)" class="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-sm font-bold">−</button>
        <span class="w-7 text-center text-xs font-bold">${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)" class="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-sm font-bold">+</button>
        </div>
        <button onclick="removeFromCart(${item.id})" class="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400">
        <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
        </div>
        `).join('');

    const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const shipping = subtotal >= 500 ? 0: 60;
    document.getElementById('cart-subtotal').textContent = subtotal + ' ج.م';
    document.getElementById('cart-shipping').textContent = shipping === 0 ? 'مجاني!': '60 ج.م';
    document.getElementById('cart-shipping').className = shipping === 0 ? 'font-bold text-green-600': 'font-bold text-gray-700';
    document.getElementById('free-shipping-note').classList.toggle('hidden', subtotal >= 500);
    document.getElementById('cart-total').textContent = (subtotal + shipping) + ' ج.م';

    lucide.createIcons();
}

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    const isOpen = !drawer.classList.contains('-translate-x-full');
    if (isOpen) {
        drawer.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    } else {
        drawer.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    }
}

function checkout() {
    if (cart.length === 0) return;
    const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const shipping = subtotal >= 500 ? 0: 60;
    const total = subtotal + shipping;
    let msg = '🛒 *طلب جديد من متجر مسار*\n\n';
    cart.forEach(item => {
        msg += `• ${item.name} × ${item.qty} = ${item.price * item.qty} ج.م\n`;
    });
    msg += `\n💰 المجموع: ${subtotal} ج.م`;
    msg += `\n🚚 التوصيل: ${shipping === 0 ? 'مجاني': '60 ج.م'}`;
    msg += `\n💵 الإجمالي: ${total} ج.م`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/201289012841?text=${encoded}`, '_blank');
}

// Navigation
function navigate(page) {
    document.querySelectorAll('[id^="page-"]').forEach(el => el.classList.add('hidden'));
    document.getElementById('page-' + page).classList.remove('hidden');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`[data-nav="${page}"]`)?.classList.add('active');
    window.scrollTo({
        top: 0, behavior: 'smooth'
    });
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-enter bg-navy-500 text-white px-4 py-2.5 rounded-xl text-xs font-medium shadow-lg';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Default config
const defaultConfig = {
    store_name: 'مسار',
    store_slogan: 'جودة في كل خطوة',
    promo_banner: '🎉 تسوق الآن واحصل على خصم 10% على أول طلب!',
    about_text: 'مسار تقدم منتجات جلدية ومكتبية بأسعار تنافسية وجودة عالية، توصيل سريع في مصر. نسعى لتقديم أفضل المنتجات التي تجمع بين الأناقة والعملية، لنكون رفيقك في كل خطوة.',
    phone_number: '01289012841',
    email_address: 'masarpaths@gmail.com',
    background_color: '#FAF7F2',
    surface_color: '#FFFFFF',
    text_color: '#1E406E',
    primary_action_color: '#1E406E',
    secondary_action_color: '#8B5E3C'
};

function applyConfig(config) {
    document.getElementById('logo-name').textContent = config.store_name || defaultConfig.store_name;
    document.getElementById('logo-slogan').textContent = config.store_slogan || defaultConfig.store_slogan;
    document.getElementById('promo-text').textContent = config.promo_banner || defaultConfig.promo_banner;
    document.getElementById('about-content').textContent = config.about_text || defaultConfig.about_text;

    const phone = config.phone_number || defaultConfig.phone_number;
    const email = config.email_address || defaultConfig.email_address;
    document.getElementById('contact-phone').textContent = phone;
    document.getElementById('contact-email').textContent = email;
    document.getElementById('footer-phone').textContent = '📞 ' + phone;
    document.getElementById('footer-email').textContent = '📧 ' + email;

    // Colors
    const bg = config.background_color || defaultConfig.background_color;
    const surface = config.surface_color || defaultConfig.surface_color;
    const textC = config.text_color || defaultConfig.text_color;
    const primary = config.primary_action_color || defaultConfig.primary_action_color;
    const secondary = config.secondary_action_color || defaultConfig.secondary_action_color;

    document.body.style.backgroundColor = bg;
    document.querySelectorAll('.product-card, #cart-drawer, .bg-white').forEach(el => {
        if (!el.closest('footer')) el.style.backgroundColor = surface;
    });

    const font = config.font_family || defaultConfig.font_family || 'Tajawal';
    document.body.style.fontFamily = `${font}, Tajawal, sans-serif`;

    const baseSize = config.font_size || 16;
    document.querySelectorAll('h2').forEach(el => el.style.fontSize = `${baseSize * 2}px`);
    document.querySelectorAll('h3').forEach(el => el.style.fontSize = `${baseSize * 1.5}px`);
    document.querySelectorAll('p, span, button').forEach(el => {
        if (!el.style.fontSize || el.closest('[data-no-resize]')) return;
    });
}

// Init Element SDK
if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        onConfigChange: async (config) => {
            applyConfig(config);
        },
        mapToCapabilities: (config) => ({
            recolorables: [{
                get: () => config.background_color || defaultConfig.background_color, set: (v) => {
                    config.background_color = v; window.elementSdk.setConfig({
                        background_color: v
                    });
                }
            },
                {
                    get: () => config.surface_color || defaultConfig.surface_color, set: (v) => {
                        config.surface_color = v; window.elementSdk.setConfig({
                            surface_color: v
                        });
                    }
                },
                {
                    get: () => config.text_color || defaultConfig.text_color, set: (v) => {
                        config.text_color = v; window.elementSdk.setConfig({
                            text_color: v
                        });
                    }
                },
                {
                    get: () => config.primary_action_color || defaultConfig.primary_action_color, set: (v) => {
                        config.primary_action_color = v; window.elementSdk.setConfig({
                            primary_action_color: v
                        });
                    }
                },
                {
                    get: () => config.secondary_action_color || defaultConfig.secondary_action_color, set: (v) => {
                        config.secondary_action_color = v; window.elementSdk.setConfig({
                            secondary_action_color: v
                        });
                    }
                }],
            borderables: [],
            fontEditable: {
                get: () => config.font_family || defaultConfig.font_family || 'Tajawal',
                set: (v) => {
                    config.font_family = v; window.elementSdk.setConfig({
                        font_family: v
                    });
                }
            },
            fontSizeable: {
                get: () => config.font_size || 16,
                set: (v) => {
                    config.font_size = v; window.elementSdk.setConfig({
                        font_size: v
                    });
                }
            }
        }),
        mapToEditPanelValues: (config) => new Map([
            ['store_name', config.store_name || defaultConfig.store_name],
            ['store_slogan', config.store_slogan || defaultConfig.store_slogan],
            ['promo_banner', config.promo_banner || defaultConfig.promo_banner],
            ['about_text', config.about_text || defaultConfig.about_text],
            ['phone_number', config.phone_number || defaultConfig.phone_number],
            ['email_address', config.email_address || defaultConfig.email_address]
        ])
    });
}

// Init
renderProducts('products-grid-home');
renderProducts('products-grid-full');
lucide.createIcons();