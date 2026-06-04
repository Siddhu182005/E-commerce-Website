/**
 * LUMIS Audio — products.js
 * Filter, sort, color swatch interactions
 */

// ============================================================
// FILTER BUTTONS
// ============================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-full-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    let visibleCount = 0;

    productCards.forEach(card => {
      const category = card.dataset.category;
      const show = filter === 'all' || category === filter;
      card.classList.toggle('hidden', !show);
      if (show) visibleCount++;
    });
  });
});

// ============================================================
// SORT
// ============================================================
const sortSelect = document.getElementById('sortSelect');
const productsGrid = document.getElementById('productsGrid');

sortSelect?.addEventListener('change', () => {
  const val = sortSelect.value;
  const cards = [...productsGrid.querySelectorAll('.product-full-card')];

  cards.sort((a, b) => {
    if (val === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
    if (val === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
    return 0; // featured — keep original
  });

  cards.forEach(card => productsGrid.appendChild(card));
});

// ============================================================
// COLOR SWATCHES
// ============================================================
document.querySelectorAll('.product-full-card').forEach(card => {
  const dots = card.querySelectorAll('.color-dot');
  const label = card.querySelector('.color-label');

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      if (label) label.textContent = dot.dataset.color;
    });
  });
});

// ============================================================
// COMPARISON TABLE: highlight on hover
// ============================================================
const tableRows = document.querySelectorAll('.comparison-table tbody tr');
tableRows.forEach(row => {
  row.addEventListener('mouseenter', () => {
    row.querySelectorAll('td').forEach(td => {
      td.style.background = 'rgba(212,190,152,0.04)';
    });
  });
  row.addEventListener('mouseleave', () => {
    row.querySelectorAll('td').forEach(td => {
      td.style.background = '';
    });
  });
});
