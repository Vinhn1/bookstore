import { escapeHtml, formatVnd, conditionClass } from '../utils/formatters.js';
import { getState } from '../state/store.js';
import { books } from '../data.js';

export function renderField({ id, label, type = 'text', value = '', placeholder = '', name = id, required = false, autocomplete = '', help = '', readonly = false }) {
  return `<div class="pt-field" data-field="${id}"><label class="pt-field__label" for="${id}">${escapeHtml(label)}${required ? ' <span class="pt-field__required" aria-hidden="true">*</span>' : ''}</label><input class="pt-input" id="${id}" name="${name}" type="${type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" ${required ? 'required' : ''} ${autocomplete ? `autocomplete="${autocomplete}"` : ''} ${readonly ? 'readonly' : ''} aria-describedby="${id}-error">${help ? `<span class="pt-field__help">${escapeHtml(help)}</span>` : ''}<span class="pt-field__error" id="${id}-error" role="alert"></span></div>`;
}

export function renderTextarea({ id, label, value = '', placeholder = '', name = id, required = false }) {
  return `<div class="pt-field" data-field="${id}"><label class="pt-field__label" for="${id}">${escapeHtml(label)}${required ? ' <span class="pt-field__required" aria-hidden="true">*</span>' : ''}</label><textarea class="pt-textarea" id="${id}" name="${name}" placeholder="${escapeHtml(placeholder)}" ${required ? 'required' : ''} aria-describedby="${id}-error">${escapeHtml(value)}</textarea><span class="pt-field__error" id="${id}-error" role="alert"></span></div>`;
}

export function renderSelect({ id, label, options, value = '', name = id, required = false }) {
  return `<div class="pt-field" data-field="${id}"><label class="pt-field__label" for="${id}">${escapeHtml(label)}${required ? ' <span class="pt-field__required" aria-hidden="true">*</span>' : ''}</label><select class="pt-select" id="${id}" name="${name}" ${required ? 'required' : ''} aria-describedby="${id}-error">${options.map((option) => `<option value="${escapeHtml(option.value)}" ${option.value === value ? 'selected' : ''}>${escapeHtml(option.label)}</option>`).join('')}</select><span class="pt-field__error" id="${id}-error" role="alert"></span></div>`;
}

export function renderConditionBadge(condition) {
  return `<span class="pt-badge ${conditionClass(condition.tone)}">${escapeHtml(condition.label)} · ${condition.percent}%</span>`;
}

function fallbackCover(book) {
  return `<div class="book-card__cover-fallback ${book.coverClass || 'cover-paper'}"><div class="book-card__cover-frame"><span class="book-card__cover-kicker">${escapeHtml(book.publisher)} · ${book.year}</span><span class="book-card__cover-title">${escapeHtml(book.title)}</span><span class="book-card__cover-author">${escapeHtml(book.author)}</span></div></div>`;
}

export function renderBookCard(book, { saved = false } = {}) {
  const state = getState();
  const isSaved = saved || state.wishlist.includes(book.id);
  const localBook = books.some((item) => item.id === book.id);
  const cover = book.coverUrl ? `<div class="book-card__cover"><img src="${book.coverUrl}" alt="Bìa sách ${escapeHtml(book.title)}" loading="lazy"><span class="book-card__spine"></span></div>` : fallbackCover(book);
  return `<article class="book-card" data-book-card="${book.id}"><div class="book-card__media">${cover}<div class="book-card__badge-stack">${book.badges.map((badge) => `<span class="pt-badge ${badge.toLowerCase().includes('hiếm') || badge.toLowerCase().includes('ký') ? 'pt-badge--rare' : 'pt-badge--active'}">${escapeHtml(badge)}</span>`).join('')}</div><div class="book-card__condition">${renderConditionBadge(book.condition)}</div><button class="book-card__wishlist ${isSaved ? 'is-saved' : ''}" type="button" data-wishlist-id="${book.id}" aria-label="${isSaved ? 'Bỏ ' : 'Lưu '}${escapeHtml(book.title)} ${isSaved ? 'khỏi danh sách yêu thích' : 'vào danh sách yêu thích'}"><span class="material-symbols-outlined" aria-hidden="true">${isSaved ? 'favorite' : 'favorite_border'}</span></button></div><div class="book-card__body"><div class="book-card__meta">${escapeHtml(book.category === 'vietnamese-literature' ? 'Văn học Việt' : book.category)} · ${book.year}</div><h3 class="book-card__title">${localBook ? `<a href="#sach/${encodeURIComponent(book.id)}">${escapeHtml(book.title)}</a>` : escapeHtml(book.title)}</h3><p class="book-card__author">${escapeHtml(book.author)} · ${escapeHtml(book.publisher)}</p><div class="book-card__note"><span class="material-symbols-outlined" aria-hidden="true">verified_user</span><span>${escapeHtml(book.description)}</span></div><div class="book-card__footer"><div><div class="book-card__price">${formatVnd(book.price)}</div>${book.originalPrice ? `<div class="book-card__old-price">${formatVnd(book.originalPrice)}</div>` : `<div class="book-card__hint">${escapeHtml(book.badges[0] || 'Đã kiểm định')}</div>`}</div>${localBook ? `<a class="book-card__action" href="#sach/${encodeURIComponent(book.id)}">Xem chi tiết</a>` : `<button class="book-card__action" type="button" data-cart-id="${book.id}">Thêm vào giỏ</button>`}</div></div></article>`;
}

export function renderAccountContext(active = 'overview') {
  const state = getState();
  const account = state.account;
  const userInitials = account?.name
    ? account.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
    : 'NH';
  const tabs = [['overview', 'Kệ bản & Chứng thư số (14)', '#settings'], ['wishlist', 'Danh sách yêu thích', '#wishlist'], ['orders', 'Đơn hàng', '#orders'], ['consignment', 'Ký gửi & thẩm định', '#consignment']];
  const actionButtons = active === 'overview'
    ? `<a class="pt-button pt-button--secondary pt-button--small" href="#consignment">Ký gửi định giá</a><button class="pt-button pt-button--secondary pt-button--small" type="button" data-account-logout style="display:inline-flex;align-items:center;gap:5px"><span class="material-symbols-outlined" aria-hidden="true" style="font-size:16px">logout</span><span>Đăng xuất</span></button>`
    : `<a class="pt-button pt-button--secondary pt-button--small" href="#consignment">Ký gửi định giá</a><a class="pt-button pt-button--primary pt-button--small" href="#settings">Hồ sơ & cài đặt</a>`;
  return `<section class="pt-account-context" aria-label="Ngữ cảnh tài khoản"><div class="pt-account-context__main"><div class="pt-account-context__identity"><div class="pt-account-context__avatar">${escapeHtml(userInitials)}</div><div><div class="pt-account-context__name">${escapeHtml(account.name)} <span class="pt-badge pt-badge--active">${escapeHtml(account.rank)}</span></div><div class="pt-account-context__meta">Độc giả Thư Tịch quý từ 2023 · ID: ${escapeHtml(account.readerId)} · e-ID đã xác thực</div></div></div><div class="pt-account-context__actions">${actionButtons}</div></div><div class="pt-account-context__metrics"><div class="pt-account-context__metric"><div class="pt-account-context__metric-label">Ấn bản sưu tầm</div><div class="pt-account-context__metric-value">${account.metrics.collection} <small>cuốn</small></div></div><div class="pt-account-context__metric"><div class="pt-account-context__metric-label">Chứng thư số e-ID</div><div class="pt-account-context__metric-value">${String(account.metrics.certificates).padStart(2, '0')} <small>bản</small></div></div><div class="pt-account-context__metric"><div class="pt-account-context__metric-label">Đang khử acid & vận chuyển</div><div class="pt-account-context__metric-value">${String(account.metrics.shipments).padStart(2, '0')} <small>kiện</small></div></div><div class="pt-account-context__metric"><div class="pt-account-context__metric-label">Tổng giá trị bảo tồn</div><div class="pt-account-context__metric-value">${formatVnd(account.metrics.totalValue)}</div></div></div><nav class="pt-account-context__nav" aria-label="Điều hướng tài khoản">${tabs.map(([id, label, href]) => `<a class="pt-account-context__nav-link ${active === id ? 'is-active' : ''}" href="${href}">${label}${id === 'wishlist' ? ` (${state.wishlist.length})` : ''}</a>`).join('')}</nav></section>`;
}

export function renderOrderCard(order, books) {
  const items = order.items.map((item) => {
    const book = books.find((candidate) => candidate.id === item.bookId) || {
      title: item.title || 'Ấn bản sưu tầm',
      year: 2024,
      coverClass: item.coverClass || 'cover-paper',
      author: item.author || 'Nhiều tác giả',
      publisher: 'The Page Turner',
      condition: { label: 'Tốt', percent: 85 }
    };
    const recipient = order.recipientName || getState().account?.name || 'Nguyễn Hoàng Hải';
    return `<div class="order-card__item"><div class="order-card__thumb" style="--cover-a:${book.coverClass === 'cover-green' ? '#7e9278' : '#b69d78'};--cover-b:#3a211d"><span class="order-card__thumb-title">${escapeHtml(book.title)}</span><span class="order-card__thumb-year">${book.year}</span></div><div class="order-card__item-info"><div class="order-card__item-head"><h3 class="order-card__item-title">${escapeHtml(book.title)}</h3><span class="order-card__item-price">${formatVnd(item.price)}</span></div><p class="order-card__item-meta">${escapeHtml(book.author)} · ${escapeHtml(book.publisher)} · ${book.year}</p><div class="order-card__item-tags"><span class="order-card__item-tag">Tình trạng: ${escapeHtml(book.condition?.label || 'Tốt')} (${book.condition?.percent || 85}%)</span><span class="order-card__item-tag">${escapeHtml(item.packaging || 'Đã kiểm định')}</span></div><p class="order-card__item-meta">${item.quantity} cuốn · Người nhận: ${escapeHtml(recipient)}</p></div></div>`;
  }).join('');
  const status = order.status === 'shipping' ? ['Đang giao', 'active'] : ['Đã hoàn tất', 'new'];
  return `<article class="order-card" data-order-card="${order.id}"><div class="order-card__header"><div class="order-card__identifiers"><div><div class="order-card__label">Mã đơn hàng</div><div class="order-card__value">#${escapeHtml(order.id)}</div></div><div><div class="order-card__label">Đặt ngày</div><div class="order-card__value">${order.placedAt.split('-').reverse().join('/')}</div></div><span class="pt-badge pt-badge--active">${escapeHtml(order.paymentLabel)}</span></div><span class="pt-badge pt-badge--${status[1]}">${status[0]}${order.eta ? ` · ${order.eta}` : ''}</span></div><div class="order-card__body"><div class="order-card__items">${items}</div><aside class="order-card__tracking" tabindex="-1" data-order-tracking="${order.id}"><div class="order-card__tracking-head"><span>Hành trình giao hàng</span><strong>${status[0]}</strong></div><div class="order-timeline">${order.timeline.map((step) => `<div class="order-timeline__step is-${step.state}"><span class="order-timeline__dot"></span><strong>${escapeHtml(step.label)}</strong><div>${escapeHtml(step.date || '')}</div></div>`).join('')}</div><div class="order-card__carrier"><strong>Đơn vị vận chuyển:</strong> ${escapeHtml(order.carrier)}<br><strong>Mã vận đơn:</strong> ${escapeHtml(order.trackingCode)}</div></aside></div><div class="order-card__footer"><div class="order-card__total">Tổng cộng <strong>${formatVnd(order.total)}</strong></div><div class="order-card__actions"><button class="pt-button pt-button--secondary pt-button--small" type="button" data-order-detail="${order.id}">Xem chi tiết</button><button class="pt-button pt-button--primary pt-button--small" type="button" data-order-track="${order.id}">Theo dõi kiện hàng <span aria-hidden="true">→</span></button></div></div></article>`;
}
