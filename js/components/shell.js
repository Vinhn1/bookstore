import { escapeHtml } from "../utils/formatters.js";
import { getState, logout } from "../state/store.js";
import { getEffectiveTheme, toggleTheme } from "../utils/theme.js";

const navItems = [
  ["Trang chủ", "#home"],
  ["Danh mục sách", "#danh-muc"],
  ["Tìm kiếm nâng cao", "#tim-kiem"],
  ["Văn học", "#van-hoc"],
  ["Kinh tế", "#kinh-te"],
  ["Sách hiếm", "#sach-hiem"],
  ["Sách giảm giá", "#sach-giam-gia"],
  ["Ký gửi & thu mua", "#consignment"],
  ["Hỗ trợ & FAQ", "#support"],
];

export function renderHeader(activeRoute = "") {
  const state = getState();
  const effectiveTheme = getEffectiveTheme();
  const userInitials = state.account?.name
    ? state.account.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
    : 'NH';
  const shortName = state.account?.name
    ? state.account.name.split(' ').slice(-1)[0]
    : 'Thành viên';

  const authActionsMarkup = state.isAuthenticated
    ? `<a class="site-header__member" href="#settings" aria-label="Hồ sơ ${escapeHtml(state.account?.name || 'thành viên')}"><span class="site-header__member-mark">${escapeHtml(userInitials)}</span><span class="site-header__member-name">${escapeHtml(shortName)}</span></a>`
    : `<div class="site-header__auth">
         <a class="site-header__action site-header__action--button" href="#login" aria-label="Đăng nhập">Đăng nhập</a>
         <a class="site-header__action site-header__action--button is-primary" href="#register" aria-label="Đăng ký">Đăng ký</a>
       </div>`;

  return `<header class="site-header">
    <div class="site-header__utility"><div class="pt-container site-header__utility-inner">
      <p>Cam kết 100% ảnh thật chụp trực tiếp từng cuốn sách <span class="site-header__utility-accent">•</span> Kiểm tra hàng trước khi thanh toán <span class="site-header__utility-accent">•</span> Đổi trả miễn phí 7 ngày</p>
      <div class="site-header__utility-contact"><span>Hà Nội: 08:30 – 21:30</span><span>Hotline: 0988 123 456</span></div>
    </div></div>
    <div class="pt-container site-header__main">
      <a class="site-brand" href="#home" aria-label="The Page Turner — về trang chủ">
        <span class="site-brand__mark"><span class="material-symbols-outlined" aria-hidden="true">menu_book</span></span>
        <span class="site-brand__text"><span class="site-brand__name">The Page Turner</span><span class="site-brand__tagline">Sách cũ & quý hiếm</span></span>
      </a>
      <form class="site-search" id="global-search" role="search">
        <span class="material-symbols-outlined" aria-hidden="true">search</span>
        <input name="q" type="search" placeholder="Tìm kiếm sách, tác giả, nhà xuất bản" aria-label="Tìm kiếm sách">
        <span class="site-search__tag">Trước 1975</span>
      </form>
      <div class="site-header__actions">
        <button class="site-header__theme-toggle" id="theme-toggle-btn" type="button" aria-label="Chuyển đổi giao diện sáng/tối" title="Chuyển đổi giao diện sáng/tối">
          <span class="material-symbols-outlined" aria-hidden="true" data-theme-icon>${effectiveTheme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          <span class="site-header__theme-label" data-theme-label>${effectiveTheme === 'dark' ? 'Chế độ tối' : 'Chế độ sáng'}</span>
        </button>
        ${authActionsMarkup}
        <a class="site-header__action" href="#wishlist" aria-label="Danh sách yêu thích"><span class="material-symbols-outlined" aria-hidden="true">favorite_border</span><span>Yêu thích <b data-wishlist-count>${state.wishlist ? state.wishlist.length : 0}</b></span></a>
        <a class="site-header__action" href="#gio-hang" aria-label="Giỏ hàng"><span class="material-symbols-outlined" aria-hidden="true">local_mall</span><span>Giỏ hàng <b data-cart-count>${state.cartCount || 0}</b></span></a>
      </div>
    </div>
    <nav class="site-nav" aria-label="Điều hướng chính"><div class="pt-container site-nav__inner">
      ${navItems.map(([label, href]) => `<a class="site-nav__link ${activeRoute === href.slice(1) ? "is-active" : ""}" href="${href}">${label}</a>`).join("")}
    </div></nav>
  </header>`;
}

export function renderFooter() {
  return `<footer class="site-footer"><div class="pt-container site-footer__inner">
    <div class="site-footer__grid">
      <div><h2 class="site-footer__brand">The Page Turner</h2><p>Nơi gìn giữ và trao gửi những giá trị tri thức qua năm tháng. Mỗi cuốn sách là một chứng nhân của thời gian, được thẩm định tỉ mỉ và trao lại cho người đọc.</p><p class="site-footer__contact-item"><span class="material-symbols-outlined" aria-hidden="true">auto_stories</span><strong>Tiệm sách độc lập Hà Nội</strong></p></div>
      <div><h3>Hỗ trợ & Chính sách</h3><div class="site-footer__list"><a href="#support">Quy chuẩn phân loại tình trạng sách</a><a href="#support">Chính sách kiểm tra & đổi trả 7 ngày</a><a href="#support">Giao hàng & đóng gói chuyên dụng</a><a href="#consignment">Ký gửi & thu mua sách cũ hiếm</a></div></div>
      <div><h3>Liên hệ tiệm sách</h3><div class="site-footer__contact"><span class="site-footer__contact-item"><span class="material-symbols-outlined" aria-hidden="true">location_on</span>42 Tràng Tiền, Hoàn Kiếm, Hà Nội</span><span class="site-footer__contact-item"><span class="material-symbols-outlined" aria-hidden="true">call</span>Hotline: 0988 123 456</span><span class="site-footer__contact-item"><span class="material-symbols-outlined" aria-hidden="true">mail</span>thuthu@thepageturner.vn</span><span class="site-footer__contact-item"><span class="material-symbols-outlined" aria-hidden="true">schedule</span>Mở cửa: 08:30 – 21:30 hàng ngày</span></div></div>
      <div><h3>Bản tin Sách Hiếm</h3><p>Nhận danh mục bản tuyển chọn, sách chữ ký và bản in đầu phát hành mỗi sáng thứ Bảy.</p><form class="site-footer__newsletter" id="newsletter-form"><label class="sr-only" for="newsletter-email">Địa chỉ email nhận bản tin</label><input id="newsletter-email" type="email" placeholder="Địa chỉ email của bạn..." required><button class="pt-button pt-button--primary pt-button--small" type="submit">Đăng ký nhận tin</button></form></div>
    </div>
    <div class="site-footer__copyright"><span>© ${new Date().getFullYear()} The Page Turner. Bản quyền thuộc về Tiệm sách The Page Turner Việt Nam.</span><span class="site-footer__legal"><a href="#support">Điều khoản dịch vụ</a><a href="#support">Chính sách bảo mật</a><a href="#support">Chứng thực ấn bản</a></span></div>
  </div></footer>`;
}

export function renderBreadcrumb(items = []) {
  const path = items.map((item, index) => {
    const current = index === items.length - 1;
    const label = escapeHtml(item);
    const content = !current && item === "Danh mục sách"
      ? `<a href="#danh-muc">${label}</a>`
      : `<span class="${current ? "pt-breadcrumb__current" : ""}" ${current ? 'aria-current="page"' : ""}>${label}</span>`;

    return `<span class="pt-breadcrumb__separator" aria-hidden="true">/</span>${content}`;
  }).join("");

  return `<nav class="pt-breadcrumb" aria-label="Breadcrumb"><a href="#home">Trang chủ</a>${path}</nav>`;
}

export function showToast(message, tone = "success") {
  const root = document.getElementById("toast-root");
  if (!root) return;
  root.innerHTML = `<div class="toast toast--${tone}" role="status">${escapeHtml(message)}</div>`;
  const toast = root.firstElementChild;
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => root.replaceChildren(), 220);
  }, 2800);
}

export function bindShellEvents() {
  const search = document.getElementById("global-search");
  search?.addEventListener("submit", (event) => {
    event.preventDefault();
    const rawQuery = String(new FormData(search).get("q") ?? "").trim();

    if (!rawQuery) {
      showToast("Hãy nhập tên sách hoặc tác giả để tìm kiếm.");
      return;
    }

    const encodedQuery = encodeURIComponent(rawQuery);
    window.location.hash = `#tim-kiem?q=${encodedQuery}`;
    showToast(`Đang mở danh mục cho “${rawQuery}”.`);
  });
  const newsletter = document.getElementById("newsletter-form");
  newsletter?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!newsletter.checkValidity()) {
      newsletter.reportValidity();
      return;
    }
    newsletter.reset();
    showToast("Đã đăng ký nhận Bản tin Sách Hiếm.");
  });
  const themeToggle = document.getElementById("theme-toggle-btn");
  themeToggle?.addEventListener("click", () => {
    const nextTheme = toggleTheme();
    showToast(nextTheme === 'dark' ? 'Đã bật chế độ Tối.' : 'Đã bật chế độ Sáng.');
  });
  const logoutBtn = document.getElementById("header-logout-btn");
  logoutBtn?.addEventListener("click", () => {
    logout();
    showToast("Đã đăng xuất tài khoản thành công.");
    window.location.hash = "#login";
    const header = document.getElementById("header");
    if (header) {
      header.innerHTML = renderHeader();
      bindShellEvents();
    }
  });
}

