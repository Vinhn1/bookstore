import { books, orders } from '../data.js';
import { renderBreadcrumb, showToast } from '../components/shell.js';
import { renderAccountContext, renderOrderCard } from '../components/ui.js';
import { getState, updateOrderFilter } from '../state/store.js';
import { escapeHtml } from '../utils/formatters.js';

let query = '';

function getOrdersList() {
  return getState().orders || orders;
}

function visibleOrders() {
  const filter = getState().orderFilter;
  const all = getOrdersList();
  return all.filter((order) => (filter === 'all' || order.status === filter) && (!query || order.id.toLowerCase().includes(query.toLowerCase())));
}

function renderPage(root) {
  const state = getState();
  const filter = state.orderFilter;
  const all = getOrdersList();
  const list = visibleOrders();
  const cartNotice = state.cartCount > 0 ? `
    <div style="margin-top:16px;padding:12px 18px;border-radius:var(--pt-radius-sm);background:rgba(38,70,52,0.08);border:1px solid rgba(38,70,52,0.2);display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:13px">
      <span style="display:flex;align-items:center;gap:6px">
        <span class="material-symbols-outlined" style="font-size:18px;color:var(--pt-forest)" aria-hidden="true">shopping_bag</span>
        <span>Bạn đang có <strong>${state.cartCount} cuốn sách</strong> trong giỏ hàng.</span>
      </span>
      <a class="pt-button pt-button--primary pt-button--small" href="#gio-hang">Xem giỏ hàng →</a>
    </div>
  ` : '';

  root.innerHTML = `<div class="orders-page pt-main"><div class="pt-container--wide">${renderBreadcrumb(['Tài khoản', 'Đơn hàng của tôi'])}<div style="margin-top:20px">${renderAccountContext('orders')}</div>${cartNotice}<section class="orders-heading"><div><div class="page-eyebrow">Lịch sử mua hàng</div><h1>Đơn hàng của tôi</h1><p>Theo dõi những cuốn sách đang trên đường về thư viện của bạn.</p></div><div class="orders-heading__updated">Đơn gần nhất<br><strong>${all[0]?.placedAt ? all[0].placedAt.split("-").reverse().join("/") : "Chưa có"}</strong></div></section><div class="orders-toolbar"><div class="orders-search"><span class="material-symbols-outlined" aria-hidden="true">search</span><input id="order-search" type="search" value="${escapeHtml(query)}" placeholder="Nhập mã đơn hàng, ví dụ PT-2025-0894X" aria-label="Tìm theo mã đơn hàng"></div><button class="pt-button pt-button--primary pt-button--small" type="button" data-order-search>Tìm đơn hàng</button><div class="orders-status pt-segmented">${[['all','Tất cả'],['processing','Đang xử lý'],['shipping','Đang giao'],['completed','Đã hoàn tất']].map(([id,label]) => `<button class="pt-segmented__item ${filter === id ? 'is-active' : ''}" data-order-filter="${id}" type="button">${label} (${id === "all" ? all.length : all.filter((order) => order.status === id).length})</button>`).join('')}</div></div><div class="orders-list"><div class="orders-list__header"><h2>Gần đây nhất</h2><span>${list.length} đơn hàng được hiển thị</span></div>${list.length ? list.map((order) => renderOrderCard(order, books)).join('') : '<div class="pt-empty"><h3>Chưa tìm thấy đơn hàng</h3><p>Thử đổi mã đơn hàng hoặc chọn một trạng thái khác.</p></div>'}</div><div class="orders-support"><div><strong>Cần hỗ trợ với đơn hàng?</strong> Đội ngũ The Page Turner sẵn sàng giải đáp từ 08:30 – 21:30 mỗi ngày.</div><a class="pt-button pt-button--secondary pt-button--small" href="tel:0988123456">Gọi 0988 123 456</a></div></div></div>`;
  bindEvents(root);
}

function bindEvents(root) {
  root.querySelectorAll('[data-order-filter]').forEach((button) => button.addEventListener('click', () => { updateOrderFilter(button.dataset.orderFilter); renderPage(root); }));
  root.querySelector('[data-order-search]')?.addEventListener('click', () => { query = root.querySelector('#order-search').value.trim(); renderPage(root); });
  root.querySelector('#order-search')?.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); query = event.target.value.trim(); renderPage(root); } });
  root.querySelectorAll('[data-order-track]').forEach((button) => button.addEventListener('click', () => { root.querySelector(`[data-order-tracking="${button.dataset.orderTrack}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); showToast('Đã mở phần theo dõi kiện hàng.'); }));
  root.querySelectorAll('[data-order-detail]').forEach((button) => button.addEventListener('click', () => showToast(`Đang xem chi tiết đơn ${button.dataset.orderDetail}.`)));
}

export function mountOrders(root) { renderPage(root); }
