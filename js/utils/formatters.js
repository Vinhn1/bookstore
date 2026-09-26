export function formatVnd(value) {
  return `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)} ₫`;
}

export function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value));
}

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

export function conditionClass(tone = 'neutral') {
  return `pt-badge--${tone}`;
}

export function orderStatusLabel(status) {
  return ({ all: 'Tất cả', processing: 'Đang xử lý', shipping: 'Đang giao', completed: 'Đã hoàn tất' })[status] || 'Đơn hàng';
}
