/**
 * ExcelPro Templates — main.js
 * ============================================================
 * Funcionalidades JavaScript (Requisitos EBAC):
 *  1. Menú lateral izquierdo (sidebar) — abre con hamburguesa, cierra con X
 *  2. Botón "Agregar al Carrito" en cada producto
 *  3. Badge numérico en el ícono del carrito — actualización en tiempo real
 *  4. Filtros de categoría, Modal preview, Toast, Búsqueda, Wishlist,
 *     Back-to-top, Newsletter, Animaciones de entrada
 * ============================================================
 */

'use strict';

// ============================================================
// ESTADO GLOBAL
// ============================================================
const AppState = {
  cart: [],
  wishlist: [],
  activeFilter: 'all'
};

// ============================================================
// DATOS DE PRODUCTOS
// ============================================================
const PRODUCTS_DATA = {
  '1': {
    id: '1', name: 'Gestor de Finanzas Personales', category: 'Finanzas',
    price: 29.99, originalPrice: 42.99, image: 'images/product-finanzas.jpg',
    description: 'Controla tus ingresos, gastos y ahorros con esta plantilla completa. Incluye gráficas automáticas, proyecciones y alertas de presupuesto.',
    features: ['Dashboard de finanzas en tiempo real', 'Seguimiento de ingresos y gastos', 'Gráficas automáticas con colores', 'Proyecciones de ahorro a 12 meses', 'Alertas de límite de presupuesto', 'Compatible con Excel 2016 y superior']
  },
  '2': {
    id: '2', name: 'Planificador de Negocios', category: 'Negocios',
    price: 39.99, originalPrice: 57.99, image: 'images/product-negocios.jpg',
    description: 'Plan de negocios profesional con análisis FODA, proyecciones financieras y seguimiento de KPIs. Ideal para startups y PYMES.',
    features: ['Canvas de modelo de negocio', 'Análisis FODA interactivo', 'Proyecciones financieras a 3 años', 'Seguimiento de KPIs clave', 'Análisis de punto de equilibrio', 'Plantilla de pitch para inversores']
  },
  '3': {
    id: '3', name: 'Dashboard de Ventas', category: 'Ventas',
    price: 49.99, originalPrice: 71.99, image: 'images/product-ventas.jpg',
    description: 'Dashboard ejecutivo de ventas con métricas en tiempo real, comparativas por período y análisis de rendimiento por vendedor.',
    features: ['Dashboard ejecutivo con KPIs', 'Análisis por vendedor y región', 'Comparativas mes a mes y año a año', 'Embudo de ventas visual', 'Pronóstico de ventas con tendencias', 'Exportación automática de reportes']
  },
  '4': {
    id: '4', name: 'Control de Inventario Pro', category: 'Inventario',
    price: 34.99, originalPrice: 49.99, image: 'images/product-inventario.jpg',
    description: 'Sistema completo de gestión de inventario con alertas de stock mínimo, control de entradas/salidas y valoración de inventario.',
    features: ['Control de stock en tiempo real', 'Alertas de stock mínimo automáticas', 'Registro de entradas y salidas', 'Valoración FIFO y LIFO', 'Código de barras y SKU', 'Reportes de rotación de inventario']
  },
  '5': {
    id: '5', name: 'Presupuesto Anual Empresarial', category: 'Finanzas',
    price: 44.99, originalPrice: 64.99, image: 'images/product-presupuesto.jpg',
    description: 'Planifica y controla el presupuesto anual de tu empresa con comparativas real vs. presupuestado y análisis de variaciones.',
    features: ['Presupuesto por departamento', 'Comparativa real vs. presupuestado', 'Análisis de variaciones automático', 'Proyecciones trimestrales', 'Consolidación multi-empresa', 'Gráficas de semáforo por área']
  },
  '6': {
    id: '6', name: 'Gestión de RRHH Completa', category: 'RRHH',
    price: 54.99, originalPrice: 79.99, image: 'images/product-rrhh.jpg',
    description: 'Sistema integral de recursos humanos con nómina, evaluaciones de desempeño, control de vacaciones y organigrama dinámico.',
    features: ['Cálculo automático de nómina', 'Control de vacaciones y ausencias', 'Evaluaciones de desempeño 360°', 'Organigrama dinámico', 'Indicadores de clima laboral', 'Historial de empleados completo']
  }
};

// ============================================================
// UTILIDADES
// ============================================================
const formatPrice = (amount) => '$' + Number(amount).toFixed(2);
const generateId  = () => 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);

// ============================================================
// MÓDULO: TOAST NOTIFICATIONS
// ============================================================
const Toast = (() => {
  const ICONS = {
    cart:    '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>',
    success: '<polyline points="20 6 9 17 4 12"/>',
    error:   '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    default: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
  };

  const show = ({ type = 'default', title, message, duration = 3500 }) => {
    const container = document.getElementById('js-toast-container');
    if (!container) return;
    const id   = generateId();
    const icon = ICONS[type] || ICONS.default;
    const toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    toast.id = id;
    toast.setAttribute('role', 'alert');
    toast.innerHTML =
      '<div class="toast__icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + icon + '</svg></div>' +
      '<div class="toast__content"><p class="toast__title">' + title + '</p>' +
      (message ? '<p class="toast__message">' + message + '</p>' : '') + '</div>' +
      '<button class="toast__close" aria-label="Cerrar notificacion"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
    toast.querySelector('.toast__close').addEventListener('click', () => dismiss(id));
    container.appendChild(toast);
    setTimeout(() => dismiss(id), duration);
  };

  const dismiss = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('toast--hiding');
    setTimeout(() => el.remove(), 350);
  };

  return { show };
})();

// ============================================================
// MÓDULO: SIDEBAR IZQUIERDO (Requisito 1 EBAC)
// Se abre con el icono hamburguesa del header izquierdo
// Se cierra con el icono X incluido dentro del menu
// ============================================================
const Sidebar = (() => {
  let sidebar, openBtn, closeBtn, overlay;

  const open = () => {
    sidebar.classList.add('sidebar--open');
    sidebar.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    overlay.classList.add('overlay--active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    sidebar.classList.remove('sidebar--open');
    sidebar.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    const cartEl = document.getElementById('js-cart-sidebar');
    if (!cartEl || !cartEl.classList.contains('cart-sidebar--open')) {
      overlay.classList.remove('overlay--active');
      document.body.style.overflow = '';
    }
  };

  const init = () => {
    sidebar  = document.getElementById('js-sidebar');
    openBtn  = document.getElementById('js-sidebar-open');
    closeBtn = document.getElementById('js-sidebar-close');
    overlay  = document.getElementById('js-overlay');

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);

    // Filtros de categoria dentro del sidebar
    sidebar.querySelectorAll('.sidebar__category-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        sidebar.querySelectorAll('.sidebar__category-tag').forEach(b => b.classList.remove('sidebar__category-tag--active'));
        btn.classList.add('sidebar__category-tag--active');
        ProductFilter.apply(btn.dataset.filter);
        close();
        setTimeout(() => {
          const sec = document.getElementById('products');
          if (sec) sec.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      });
    });

    // Links de navegacion del sidebar
    sidebar.querySelectorAll('.sidebar__nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          close();
          setTimeout(() => {
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      });
    });
  };

  return { init, open, close };
})();

// ============================================================
// MÓDULO: CARRITO DE COMPRAS (Requisitos 2 y 3 EBAC)
// ============================================================
const Cart = (() => {
  let cartSidebar, cartOpenBtn, cartCloseBtn, cartBadge, cartCount,
      cartBody, cartEmpty, cartFooter, cartSubtotal, cartDiscount, cartTotal, overlay;

  // Actualiza el badge numerico del carrito (Requisito 3 EBAC)
  const updateBadge = () => {
    const total = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = total;
    cartCount.textContent = total;
    if (total > 0) {
      cartBadge.classList.add('header__cart-badge--visible');
      cartBadge.classList.remove('header__cart-badge--pop');
      void cartBadge.offsetWidth; // Fuerza reflow para reiniciar animacion
      cartBadge.classList.add('header__cart-badge--pop');
    } else {
      cartBadge.classList.remove('header__cart-badge--visible');
    }
  };

  const updateSummary = () => {
    const subtotal = AppState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = subtotal * 0.30;
    const total    = subtotal - discount;
    cartSubtotal.textContent = formatPrice(subtotal);
    cartDiscount.textContent = '-' + formatPrice(discount);
    cartTotal.textContent    = formatPrice(total);
  };

  const createItemEl = (item) => {
    const el = document.createElement('article');
    el.className = 'cart-sidebar__item';
    el.dataset.id = item.id;
    el.setAttribute('aria-label', 'Producto: ' + item.name);
    el.innerHTML =
      '<img class="cart-sidebar__item-image" src="' + item.image + '" alt="' + item.name + '" width="64" height="64" loading="lazy"/>' +
      '<div class="cart-sidebar__item-info">' +
        '<p class="cart-sidebar__item-name">' + item.name + '</p>' +
        '<p class="cart-sidebar__item-category">' + item.category + '</p>' +
        '<p class="cart-sidebar__item-price">' + formatPrice(item.price) + '</p>' +
      '</div>' +
      '<div class="cart-sidebar__item-actions">' +
        '<button class="cart-sidebar__item-remove" data-id="' + item.id + '" aria-label="Eliminar ' + item.name + '">' +
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>' +
        '</button>' +
        '<div class="cart-sidebar__quantity" role="group" aria-label="Cantidad">' +
          '<button class="cart-sidebar__quantity-btn" data-action="decrease" data-id="' + item.id + '" aria-label="Reducir cantidad">-</button>' +
          '<span class="cart-sidebar__quantity-value" aria-live="polite">' + item.quantity + '</span>' +
          '<button class="cart-sidebar__quantity-btn" data-action="increase" data-id="' + item.id + '" aria-label="Aumentar cantidad">+</button>' +
        '</div>' +
      '</div>';
    return el;
  };

  const renderItems = () => {
    cartBody.querySelectorAll('.cart-sidebar__item').forEach(el => el.remove());
    if (AppState.cart.length === 0) {
      cartEmpty.hidden = false;
      cartFooter.hidden = true;
    } else {
      cartEmpty.hidden = true;
      cartFooter.hidden = false;
      AppState.cart.forEach(item => cartBody.appendChild(createItemEl(item)));
    }
    updateBadge();
    updateSummary();
  };

  // Agregar producto al carrito (Requisito 2 EBAC)
  const addItem = (product) => {
    const existing = AppState.cart.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
      Toast.show({ type: 'cart', title: 'Ya esta en tu carrito!', message: 'Se agrego otra unidad de "' + product.name + '".' });
    } else {
      AppState.cart.push({
        id: product.id, name: product.name,
        price: parseFloat(product.price), image: product.image,
        category: product.category, quantity: 1
      });
      Toast.show({ type: 'cart', title: 'Agregado al carrito!', message: '"' + product.name + '" fue agregado exitosamente.' });
    }
    renderItems();
    updateAddButtons();
  };

  const removeItem = (id) => {
    const idx = AppState.cart.findIndex(i => i.id === id);
    if (idx === -1) return;
    const name = AppState.cart[idx].name;
    AppState.cart.splice(idx, 1);
    renderItems();
    updateAddButtons();
    Toast.show({ type: 'default', title: 'Producto eliminado', message: '"' + name + '" fue eliminado del carrito.' });
  };

  const updateQuantity = (id, action) => {
    const item = AppState.cart.find(i => i.id === id);
    if (!item) return;
    if (action === 'increase') {
      item.quantity += 1;
    } else if (action === 'decrease') {
      if (item.quantity > 1) { item.quantity -= 1; } else { removeItem(id); return; }
    }
    renderItems();
  };

  // Actualiza el estado visual de los botones "Agregar al Carrito"
  const updateAddButtons = () => {
    document.querySelectorAll('.product-card').forEach(card => {
      const id  = card.dataset.id;
      const btn = card.querySelector('.product-card__add-btn');
      if (!btn) return;
      const cartItem = AppState.cart.find(i => i.id === id);
      if (cartItem) {
        btn.classList.add('product-card__add-btn--in-cart');
        btn.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>' +
          ' En el carrito (x' + cartItem.quantity + ')';
      } else {
        btn.classList.remove('product-card__add-btn--in-cart');
        btn.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>' +
          ' Agregar al Carrito';
      }
    });
  };

  const open = () => {
    cartSidebar.classList.add('cart-sidebar--open');
    cartSidebar.setAttribute('aria-hidden', 'false');
    cartOpenBtn.setAttribute('aria-expanded', 'true');
    overlay.classList.add('overlay--active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    cartSidebar.classList.remove('cart-sidebar--open');
    cartSidebar.setAttribute('aria-hidden', 'true');
    cartOpenBtn.setAttribute('aria-expanded', 'false');
    const sidebarEl = document.getElementById('js-sidebar');
    if (!sidebarEl || !sidebarEl.classList.contains('sidebar--open')) {
      overlay.classList.remove('overlay--active');
      document.body.style.overflow = '';
    }
  };

  const init = () => {
    cartSidebar  = document.getElementById('js-cart-sidebar');
    cartOpenBtn  = document.getElementById('js-cart-open');
    cartCloseBtn = document.getElementById('js-cart-close');
    cartBadge    = document.getElementById('js-cart-badge');
    cartCount    = document.getElementById('js-cart-count');
    cartBody     = document.getElementById('js-cart-body');
    cartEmpty    = document.getElementById('js-cart-empty');
    cartFooter   = document.getElementById('js-cart-footer');
    cartSubtotal = document.getElementById('js-cart-subtotal');
    cartDiscount = document.getElementById('js-cart-discount');
    cartTotal    = document.getElementById('js-cart-total');
    overlay      = document.getElementById('js-overlay');

    cartOpenBtn.addEventListener('click', open);
    cartCloseBtn.addEventListener('click', close);

    const exploreBtn = document.getElementById('js-cart-explore');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        close();
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
      });
    }

    const continueBtn = document.getElementById('js-cart-continue');
    if (continueBtn) continueBtn.addEventListener('click', close);

    // Delegacion de eventos para items del carrito
    cartBody.addEventListener('click', (e) => {
      const removeBtn   = e.target.closest('.cart-sidebar__item-remove');
      const quantityBtn = e.target.closest('.cart-sidebar__quantity-btn');
      if (removeBtn)   removeItem(removeBtn.dataset.id);
      if (quantityBtn) updateQuantity(quantityBtn.dataset.id, quantityBtn.dataset.action);
    });

    renderItems();
  };

  return { init, open, close, addItem, updateAddButtons };
})();

// ============================================================
// MÓDULO: FILTROS DE CATEGORÍA (Funcionalidad JS extra)
// Manipulacion del DOM: muestra/oculta tarjetas de producto
// ============================================================
const ProductFilter = (() => {
  const apply = (filter) => {
    AppState.activeFilter = filter;

    document.querySelectorAll('.products__filter-btn').forEach(btn => {
      const active = btn.dataset.filter === filter;
      btn.classList.toggle('products__filter-btn--active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    document.querySelectorAll('.product-card').forEach((card, i) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
      if (show) card.style.animationDelay = (i * 0.08) + 's';
    });
  };

  const init = () => {
    document.querySelectorAll('.products__filter-btn').forEach(btn => {
      btn.addEventListener('click', () => apply(btn.dataset.filter));
    });
  };

  return { init, apply };
})();

// ============================================================
// MÓDULO: MODAL DE PREVIEW (Funcionalidad JS extra)
// ============================================================
const Modal = (() => {
  let overlay, closeBtn, addBtn, wishBtn, currentId;

  const open = (productId) => {
    const p = PRODUCTS_DATA[productId];
    if (!p) return;
    currentId = productId;

    document.getElementById('js-modal-title').textContent          = p.name;
    document.getElementById('js-modal-product-title').textContent  = p.name;
    document.getElementById('js-modal-category').textContent       = p.category;
    document.getElementById('js-modal-description').textContent    = p.description;
    document.getElementById('js-modal-price').textContent          = formatPrice(p.price);
    document.getElementById('js-modal-original-price').textContent = formatPrice(p.originalPrice);

    const img = document.getElementById('js-modal-image');
    img.src = p.image;
    img.alt = 'Preview de ' + p.name;

    document.getElementById('js-modal-features').innerHTML =
      p.features.map(f => '<li class="modal__feature-item">' + f + '</li>').join('');

    overlay.classList.add('modal-overlay--open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeBtn.focus(), 100);
  };

  const close = () => {
    if (!overlay) return;
    overlay.classList.remove('modal-overlay--open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentId = null;
  };

  const init = () => {
    overlay  = document.getElementById('js-modal-overlay');
    closeBtn = document.getElementById('js-modal-close');
    addBtn   = document.getElementById('js-modal-add-btn');
    wishBtn  = document.getElementById('js-modal-wishlist-btn');

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    addBtn.addEventListener('click', () => {
      if (!currentId) return;
      const p = PRODUCTS_DATA[currentId];
      Cart.addItem({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category });
      close();
    });

    wishBtn.addEventListener('click', () => {
      if (currentId) Wishlist.toggle(currentId, wishBtn);
    });
  };

  return { init, open, close };
})();

// ============================================================
// MÓDULO: WISHLIST / FAVORITOS (Funcionalidad JS extra)
// ============================================================
const Wishlist = (() => {
  const toggle = (productId, btn) => {
    const idx = AppState.wishlist.indexOf(productId);
    const p   = PRODUCTS_DATA[productId];
    if (idx === -1) {
      AppState.wishlist.push(productId);
      btn.classList.add('product-card__wishlist--active');
      btn.setAttribute('aria-pressed', 'true');
      Toast.show({ type: 'success', title: 'Agregado a favoritos!', message: p ? '"' + p.name + '" esta en tu lista de deseos.' : '' });
    } else {
      AppState.wishlist.splice(idx, 1);
      btn.classList.remove('product-card__wishlist--active');
      btn.setAttribute('aria-pressed', 'false');
      Toast.show({ type: 'default', title: 'Eliminado de favoritos', message: p ? '"' + p.name + '" fue removido.' : '' });
    }
    localStorage.setItem('excelproWishlist', JSON.stringify(AppState.wishlist));
  };

  const restore = () => {
    const saved = localStorage.getItem('excelproWishlist');
    if (!saved) return;
    AppState.wishlist = JSON.parse(saved);
    AppState.wishlist.forEach(id => {
      const card = document.querySelector('.product-card[data-id="' + id + '"]');
      if (card) {
        const btn = card.querySelector('.product-card__wishlist');
        if (btn) { btn.classList.add('product-card__wishlist--active'); btn.setAttribute('aria-pressed', 'true'); }
      }
    });
  };

  return { toggle, restore };
})();

// ============================================================
// MÓDULO: BÚSQUEDA EN TIEMPO REAL (Funcionalidad JS extra)
// ============================================================
const Search = (() => {
  let debounce;

  const filterProducts = (query) => {
    const term = query.toLowerCase().trim();
    document.querySelectorAll('.product-card').forEach(card => {
      const match = card.dataset.name.toLowerCase().includes(term) || card.dataset.category.toLowerCase().includes(term);
      card.style.display = (term === '' || match) ? '' : 'none';
    });
  };

  const open = () => {
    const bar   = document.getElementById('js-search-bar');
    const input = document.getElementById('js-search-input');
    bar.classList.add('search-bar--open');
    bar.setAttribute('aria-hidden', 'false');
    document.getElementById('js-search-open').setAttribute('aria-expanded', 'true');
    setTimeout(() => input.focus(), 150);
  };

  const close = () => {
    const bar = document.getElementById('js-search-bar');
    bar.classList.remove('search-bar--open');
    bar.setAttribute('aria-hidden', 'true');
    document.getElementById('js-search-open').setAttribute('aria-expanded', 'false');
    document.getElementById('js-search-input').value = '';
    document.querySelectorAll('.product-card').forEach(c => { c.style.display = ''; });
  };

  const init = () => {
    document.getElementById('js-search-open').addEventListener('click', open);
    document.getElementById('js-search-close').addEventListener('click', close);
    document.getElementById('js-search-input').addEventListener('input', (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => filterProducts(e.target.value), 250);
    });
    document.getElementById('js-search-input').addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  };

  return { init, open, close };
})();

// ============================================================
// MÓDULO: BACK TO TOP (Funcionalidad JS extra)
// ============================================================
const BackToTop = (() => {
  const init = () => {
    const btn = document.getElementById('js-back-to-top');
    window.addEventListener('scroll', () => {
      btn.classList.toggle('back-to-top--visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };
  return { init };
})();

// ============================================================
// MÓDULO: HEADER STICKY
// ============================================================
const Header = (() => {
  const init = () => {
    const header = document.getElementById('js-header');
    window.addEventListener('scroll', () => {
      header.classList.toggle('header--scrolled', window.scrollY > 80);
    }, { passive: true });
  };
  return { init };
})();

// ============================================================
// MÓDULO: OVERLAY
// ============================================================
const Overlay = (() => {
  const init = () => {
    document.getElementById('js-overlay').addEventListener('click', () => {
      Sidebar.close();
      Cart.close();
    });
  };
  return { init };
})();

// ============================================================
// MÓDULO: BANNER PROMOCIONAL
// ============================================================
const PromoBanner = (() => {
  const init = () => {
    const banner   = document.querySelector('.promo-banner');
    const closeBtn = document.getElementById('js-promo-close');
    if (!banner || !closeBtn) return;
    if (sessionStorage.getItem('promoBannerClosed')) { banner.style.display = 'none'; return; }
    closeBtn.addEventListener('click', () => {
      banner.style.transition = 'max-height 0.4s ease, opacity 0.3s ease';
      banner.style.maxHeight  = '0';
      banner.style.opacity    = '0';
      banner.style.overflow   = 'hidden';
      setTimeout(() => { banner.style.display = 'none'; }, 400);
      sessionStorage.setItem('promoBannerClosed', 'true');
    });
  };
  return { init };
})();

// ============================================================
// MÓDULO: NEWSLETTER (Funcionalidad JS extra)
// ============================================================
const Newsletter = (() => {
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const init = () => {
    const form  = document.getElementById('js-newsletter-form');
    const input = document.getElementById('js-newsletter-input');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!isValidEmail(email)) {
        Toast.show({ type: 'error', title: 'Correo invalido', message: 'Por favor ingresa un correo electronico valido.' });
        input.focus();
        return;
      }
      Toast.show({ type: 'success', title: 'Suscripcion exitosa!', message: 'Te enviaremos novedades a ' + email + '. Bienvenida!', duration: 5000 });
      form.reset();
    });
  };
  return { init };
})();

// ============================================================
// MÓDULO: ANIMACIONES DE ENTRADA (Funcionalidad JS extra)
// Usa IntersectionObserver para mejor rendimiento
// ============================================================
const Animations = (() => {
  const init = () => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
      '.product-card, .category-card, .testimonial-card, .hero__content, .hero__image-wrapper, .newsletter__content'
    ).forEach(el => observer.observe(el));
  };
  return { init };
})();

// ============================================================
// INICIALIZACIÓN PRINCIPAL
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  Header.init();
  Overlay.init();
  Sidebar.init();
  Cart.init();
  ProductFilter.init();
  Modal.init();
  Search.init();
  BackToTop.init();
  PromoBanner.init();
  Newsletter.init();
  Animations.init();
  Wishlist.restore();

  // Delegacion de eventos en el grid de productos
  const productsGrid = document.getElementById('js-products-grid');
  if (productsGrid) {
    productsGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const id = card.dataset.id;

      // Boton "Agregar al Carrito" (Requisito 2 EBAC)
      if (e.target.closest('.product-card__add-btn')) {
        Cart.addItem({
          id:       id,
          name:     card.dataset.name,
          price:    parseFloat(card.dataset.price),
          image:    card.dataset.image,
          category: card.querySelector('.product-card__category').textContent
        });
        return;
      }

      // Boton de Wishlist
      if (e.target.closest('.product-card__wishlist')) {
        Wishlist.toggle(id, e.target.closest('.product-card__wishlist'));
        return;
      }

      // Boton "Ver Preview"
      if (e.target.closest('.product-card__preview-btn')) {
        Modal.open(id);
        return;
      }
    });
  }

  // Escape global
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      Sidebar.close();
      Cart.close();
      Modal.close();
      Search.close();
    }
  });

  // Navegacion suave del header
  document.querySelectorAll('.header__nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  console.log('ExcelPro Templates - Todos los modulos inicializados correctamente.');
  console.log('Funcionalidades: Sidebar, Carrito, Badge, Filtros, Modal, Toast, Busqueda, Wishlist, Back-to-top, Newsletter');
});
