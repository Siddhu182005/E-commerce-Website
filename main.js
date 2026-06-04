/**
 * LUMIS Audio — main.js
 * Shared functionality: nav scroll, mobile menu, cart, toast, scroll reveal
 */

// ============================================================
// NAV: scroll behavior + mobile burger
// ============================================================
const nav = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const navLinks = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

if (navBurger && navLinks) {
  navBurger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navBurger.setAttribute('aria-expanded', isOpen);
    navBurger.querySelectorAll('span').forEach((s, i) => {
      if (isOpen) {
        if (i === 0) s.style.transform = 'translateY(7px) rotate(45deg)';
        if (i === 1) s.style.opacity = '0';
        if (i === 2) s.style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        s.style.transform = '';
        s.style.opacity = '';
      }
    });
  });
  // Close on link click
  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navBurger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ============================================================
// CART: state management
// ============================================================
let cart = JSON.parse(localStorage.getItem('lumis_cart') || '[]');

function saveCart() {
  localStorage.setItem('lumis_cart', JSON.stringify(cart));
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');

  if (!cartItems) return;

  // Update count badge
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.classList.toggle('visible', totalItems > 0);
  }

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    if (cartFooter) cartFooter.style.display = 'none';
    return;
  }

  cartItems.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price">$${item.price} × ${item.qty}</div>
      </div>
      <button class="cart-item__remove" onclick="removeFromCart(${idx})" aria-label="Remove ${item.name}">✕</button>
    </div>
  `).join('');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (cartTotal) cartTotal.textContent = '$' + total.toLocaleString();
  if (cartFooter) cartFooter.style.display = 'flex';
}

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart();
  renderCart();
  showToast(`${name} added to cart`);
  openCart();
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  saveCart();
  renderCart();
}

function openCart() {
  document.getElementById('cartSidebar')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cartBtn')?.addEventListener('click', openCart);
document.getElementById('cartClose')?.addEventListener('click', closeCart);
document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

// ============================================================
// TOAST notifications
// ============================================================
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================================
// Init
// ============================================================
renderCart();
