import { renderBreadcrumb, showToast, renderHeader, bindShellEvents } from '../components/shell.js';
import { renderAccountContext, renderField, renderSelect } from '../components/ui.js';
import {
  getState,
  updateAccount,
  updateAccountNotifications,
  logout,
  addAddress,
  setDefaultAddress,
  deleteAddress
} from '../state/store.js';
import { escapeHtml, formatVnd } from '../utils/formatters.js';
import { getStoredTheme, getEffectiveTheme, setTheme } from '../utils/theme.js';
import { vietnamProvinces, getDistrictsByProvince } from '../data/locations.js';

function getThemeLabel(mode, effective) {
  if (mode === 'system') {
    return `Tự động (${effective === 'dark' ? 'Đang tối' : 'Đang sáng'})`;
  }
  return mode === 'dark' ? 'Chế độ Tối' : 'Chế độ Sáng';
}

function renderNav(activeTab) {
  const tabs = [
    { id: 'thong-tin-ca-nhan', label: 'Thông tin cá nhân', href: '#thong-tin-ca-nhan' },
    { id: 'giao-dien', label: 'Giao diện Sáng / Tối', href: '#giao-dien' },
    { id: 'bao-mat', label: 'Bảo mật & đăng nhập', href: '#bao-mat' },
    { id: 'dia-chi', label: 'Địa chỉ đã lưu', href: '#dia-chi' },
    { id: 'thong-bao', label: 'Tùy chọn thông báo', href: '#thong-bao' }
  ];

  return `<aside class="settings-nav" aria-label="Điều hướng cài đặt tài khoản">
    <div class="settings-nav__header">
      <div class="settings-nav__eyebrow">Tài khoản của tôi</div>
      <h2>Cài đặt</h2>
    </div>
    <nav class="settings-nav__links">
      ${tabs.map(t => `
        <a class="settings-nav__link ${activeTab === t.id ? 'is-active' : ''}" href="${t.href}">
          <span>${t.label}</span>
          <span>→</span>
        </a>
      `).join('')}
      <button class="settings-nav__link settings-nav__logout-link" type="button" data-account-logout style="width:100%;text-align:left;border:none;background:transparent;cursor:pointer">
        <span style="display:flex;align-items:center;gap:6px;color:var(--pt-burgundy)">
          <span class="material-symbols-outlined" aria-hidden="true" style="font-size:18px">logout</span>
          <strong>Đăng xuất tài khoản</strong>
        </span>
        <span style="color:var(--pt-burgundy)">→</span>
      </button>
    </nav>
    <div class="settings-nav__notice">
      <span class="material-symbols-outlined" aria-hidden="true">verified_user</span>
      <span>Hồ sơ và tùy biến hiển thị được lưu trữ an toàn trên thiết bị của bạn.</span>
    </div>
  </aside>`;
}

/* --------------------------------------------------------------------------
   VIEW 1: THÔNG TIN CÁ NHÂN
   -------------------------------------------------------------------------- */
function renderPersonalInfoView(current) {
  const selectedProvince = current.city || 'Vĩnh Long';
  const districts = getDistrictsByProvince(selectedProvince);
  const selectedDistrict = current.district || districts[0];

  return `<div>
    <div class="settings-heading">
      <div>
        <div class="page-eyebrow">Hồ sơ người đọc</div>
        <h1>Thông tin cá nhân</h1>
        <p>Quản lý hồ sơ độc giả, thông tin liên lạc và cập nhật đơn vị hành chính sau sáp nhập.</p>
      </div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span class="pt-badge pt-badge--new">● Tài khoản đang hoạt động</span>
        <button class="pt-button pt-button--secondary pt-button--small" type="button" data-account-logout style="display:inline-flex;align-items:center;gap:6px">
          <span class="material-symbols-outlined" aria-hidden="true" style="font-size:16px">logout</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>

    <section class="settings-section">
      <div class="settings-section__header">
        <div>
          <h2>Chi tiết tài khoản & Địa chỉ liên hệ</h2>
          <p>Các trường có dấu <span style="color:var(--pt-amber)">*</span> là bắt buộc theo quy chuẩn lưu trữ.</p>
        </div>
        <span style="color:var(--pt-muted);font-size:12px">Cập nhật lần cuối: 24/02/2025</span>
      </div>

      <form class="settings-form" id="personal-info-form">
        ${renderField({ id: 'settings-name', label: 'Họ và tên', name: 'name', value: current.name, required: true })}
        ${renderField({ id: 'settings-email', label: 'Địa chỉ email', type: 'email', name: 'email', value: current.email, required: true })}
        ${renderField({ id: 'settings-phone', label: 'Số điện thoại', type: 'tel', name: 'phone', value: current.phone, required: true })}
        
        <div class="pt-field settings-form__readonly">
          <label class="pt-field__label" for="settings-reader-id">Mã độc giả (e-ID)</label>
          <input class="pt-input" id="settings-reader-id" value="${escapeHtml(current.readerId)}" readonly>
          <span class="settings-readonly-badge">Đã cấp</span>
        </div>

        <div class="pt-field">
          <label class="pt-field__label" for="settings-city">
            Tỉnh / Thành phố <span class="pt-field__required">*</span>
          </label>
          <select class="pt-select" id="settings-city" name="city" required>
            ${vietnamProvinces.map(p => `
              <option value="${escapeHtml(p.name)}" ${p.name.toLowerCase() === selectedProvince.toLowerCase() ? 'selected' : ''}>
                ${escapeHtml(p.name)}${p.type ? ` (${p.type})` : ''}
              </option>
            `).join('')}
          </select>
          <span class="pt-field__hint">Bao gồm 63 tỉnh/thành phố và các đô thị trực thuộc Trung ương sau sắp xếp.</span>
        </div>

        <div class="pt-field">
          <label class="pt-field__label" for="settings-district">
            Quận / Huyện / Thành phố thuộc tỉnh <span class="pt-field__required">*</span>
          </label>
          <select class="pt-select" id="settings-district" name="district" required>
            ${districts.map(d => `
              <option value="${escapeHtml(d)}" ${d.toLowerCase() === selectedDistrict.toLowerCase() ? 'selected' : ''}>
                ${escapeHtml(d)}
              </option>
            `).join('')}
          </select>
          <span class="pt-field__hint">Đã cập nhật các đơn vị sáp nhập như TP. Thủ Đức, TP. Thủy Nguyên, TP. Vinh...</span>
        </div>

        <div class="settings-form__full">
          ${renderField({
            id: 'settings-address',
            label: 'Địa chỉ chi tiết (Số nhà, tên ngõ/phố, phường/xã)',
            name: 'address',
            value: current.address || '',
            required: true,
            placeholder: 'Ví dụ: Số 18 Phố Chân Cầm, Phường Hàng Trống'
          })}
        </div>

        <div class="settings-form__full">
          <label class="pt-field__label" style="margin-bottom:8px">Lĩnh vực & ấn bản bạn quan tâm sưu tầm</label>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(210px, 1fr));gap:10px;padding:12px;background:var(--pt-paper);border:1px solid var(--pt-line);border-radius:var(--pt-radius-sm)">
            <label class="pt-check-row">
              <input type="checkbox" checked> <span>Văn học Việt Nam trước 1975</span>
            </label>
            <label class="pt-check-row">
              <input type="checkbox" checked> <span>Sách hiếm & Bản in đầu tiên</span>
            </label>
            <label class="pt-check-row">
              <input type="checkbox"> <span>Kinh tế chính trị & Lịch sử</span>
            </label>
            <label class="pt-check-row">
              <input type="checkbox" checked> <span>Bản đặc biệt có chữ ký tác giả</span>
            </label>
          </div>
        </div>

        <div class="settings-privacy settings-form__full">
          <span class="material-symbols-outlined" style="vertical-align:middle;font-size:18px;margin-right:6px">lock</span>
          Thông tin họ tên, số điện thoại và địa chỉ được bảo mật tuyệt đối, chỉ phục vụ việc vận chuyển đóng gói chuyên dụng và cấp chứng thư độc giả.
        </div>
      </form>

      <div class="settings-actions">
        <button class="pt-button pt-button--secondary" type="button" data-settings-cancel>Hủy thay đổi</button>
        <button class="pt-button pt-button--primary" type="submit" form="personal-info-form">Lưu thông tin cá nhân</button>
      </div>
    </section>
  </div>`;
}

/* --------------------------------------------------------------------------
   VIEW 2: GIAO DIỆN SÁNG / TỐI
   -------------------------------------------------------------------------- */
function renderThemeView(storedTheme, effectiveTheme) {
  return `<div>
    <div class="settings-heading">
      <div>
        <div class="page-eyebrow">Trải nghiệm đọc sách</div>
        <h1>Giao diện Sáng / Tối</h1>
        <p>Chọn phong cách hiển thị bảo vệ mắt và phù hợp với điều kiện ánh sáng xung quanh.</p>
      </div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span class="pt-badge pt-badge--active" data-theme-status-badge>${getThemeLabel(storedTheme, effectiveTheme)}</span>
        <button class="pt-button pt-button--secondary pt-button--small" type="button" data-account-logout style="display:inline-flex;align-items:center;gap:6px">
          <span class="material-symbols-outlined" aria-hidden="true" style="font-size:16px">logout</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>

    <section class="settings-section theme-selector-section" id="giao-dien">
      <div class="settings-section__header">
        <div>
          <h2>Phong cách hiển thị</h2>
          <p>Hệ thống tự động lưu lựa chọn của bạn và đồng bộ trên mọi trang của tiệm sách.</p>
        </div>
      </div>

      <div style="padding:22px">
        <div class="theme-options-grid" role="radiogroup" aria-label="Tùy chọn giao diện">
          <article class="theme-card ${storedTheme === 'light' ? 'is-active' : ''}" data-set-theme="light" tabindex="0" role="radio" aria-checked="${storedTheme === 'light'}">
            <div class="theme-card__preview theme-card__preview--light">
              <div class="preview-bar">
                <span class="preview-dot"></span>
                <span style="font-size:9px;color:#8a570c;font-weight:700;letter-spacing:0.1em">PAGE TURNER</span>
              </div>
              <div class="preview-lines">
                <div class="preview-line preview-line--title"></div>
                <div class="preview-line preview-line--short"></div>
                <div class="preview-line"></div>
              </div>
            </div>
            <div class="theme-card__header">
              <div class="theme-card__title">
                <span class="material-symbols-outlined" aria-hidden="true">light_mode</span>
                Chế độ Sáng
              </div>
              <span class="theme-card__badge">${storedTheme === 'light' ? 'Đang dùng' : 'Giấy ngà'}</span>
            </div>
            <p class="theme-card__desc">Sắc giấy ngà ấm áp truyền thống, tôn vinh từng trang sách cổ, thích hợp đọc sách ban ngày và nơi đầy đủ ánh sáng.</p>
          </article>

          <article class="theme-card ${storedTheme === 'dark' ? 'is-active' : ''}" data-set-theme="dark" tabindex="0" role="radio" aria-checked="${storedTheme === 'dark'}">
            <div class="theme-card__preview theme-card__preview--dark">
              <div class="preview-bar">
                <span class="preview-dot" style="background:#ffb74d"></span>
                <span style="font-size:9px;color:#ffb74d;font-weight:700;letter-spacing:0.1em">PAGE TURNER</span>
              </div>
              <div class="preview-lines">
                <div class="preview-line preview-line--title" style="background:#ffb74d"></div>
                <div class="preview-line preview-line--short" style="background:#555"></div>
                <div class="preview-line" style="background:#444"></div>
              </div>
            </div>
            <div class="theme-card__header">
              <div class="theme-card__title">
                <span class="material-symbols-outlined" aria-hidden="true">dark_mode</span>
                Chế độ Tối
              </div>
              <span class="theme-card__badge">${storedTheme === 'dark' ? 'Đang dùng' : 'Thư viện đêm'}</span>
            </div>
            <p class="theme-card__desc">Nền tối trung tính cao cấp (True Dark - không ám xanh), chữ trắng sáng đạt chuẩn WCAG AAA, dịu mắt khi đọc trong bóng tối.</p>
          </article>

          <article class="theme-card ${storedTheme === 'system' ? 'is-active' : ''}" data-set-theme="system" tabindex="0" role="radio" aria-checked="${storedTheme === 'system'}">
            <div class="theme-card__preview theme-card__preview--system">
              <div class="preview-split">
                <div class="split-side split-side--light"></div>
                <div class="split-side split-side--dark"></div>
              </div>
            </div>
            <div class="theme-card__header">
              <div class="theme-card__title">
                <span class="material-symbols-outlined" aria-hidden="true">devices</span>
                Theo hệ thống
              </div>
              <span class="theme-card__badge">${storedTheme === 'system' ? 'Đang dùng' : 'Tự động'}</span>
            </div>
            <p class="theme-card__desc">Tự động đồng bộ với chế độ Sáng / Tối trên máy tính hoặc điện thoại thông minh của bạn theo thời gian thực.</p>
          </article>
        </div>

        <div class="theme-status-banner">
          <span class="material-symbols-outlined" aria-hidden="true">visibility</span>
          <span>Mẹo nhanh: Bạn có thể bấm biểu tượng Sáng / Tối trên thanh tiêu đề đầu trang bất cứ lúc nào để đổi giao diện tức thì.</span>
        </div>
      </div>
    </section>
  </div>`;
}

/* --------------------------------------------------------------------------
   VIEW 3: BẢO MẬT & ĐĂNG NHẬP
   -------------------------------------------------------------------------- */
function renderSecurityView(current) {
  return `<div>
    <div class="settings-heading">
      <div>
        <div class="page-eyebrow">Bảo vệ tài khoản bạn đọc</div>
        <h1>Bảo mật & Đăng nhập</h1>
        <p>Quản lý mật khẩu, định danh điện tử độc giả e-ID và kiểm soát các phiên đăng nhập.</p>
      </div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span class="pt-badge pt-badge--new">✓ Đã xác thực e-ID</span>
        <button class="pt-button pt-button--secondary pt-button--small" type="button" data-account-logout style="display:inline-flex;align-items:center;gap:6px">
          <span class="material-symbols-outlined" aria-hidden="true" style="font-size:16px">logout</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:24px;margin-bottom:24px">
      <!-- Cột 1: Đổi mật khẩu -->
      <section class="settings-section">
        <div class="settings-section__header">
          <div>
            <h2>Đổi mật khẩu</h2>
            <p>Mật khẩu nên chứa ít nhất 8 ký tự, bao gồm cả chữ và số.</p>
          </div>
        </div>
        <form class="settings-form" id="change-password-form" style="grid-template-columns:1fr;padding:22px">
          <div class="pt-field">
            <label class="pt-field__label" for="curr-password">Mật khẩu hiện tại <span class="pt-field__required">*</span></label>
            <input class="pt-input" id="curr-password" type="password" placeholder="Nhập mật khẩu hiện tại" required>
          </div>
          <div class="pt-field">
            <label class="pt-field__label" for="new-password">Mật khẩu mới <span class="pt-field__required">*</span></label>
            <input class="pt-input" id="new-password" type="password" placeholder="Ít nhất 8 ký tự" minlength="8" required>
          </div>
          <div class="pt-field">
            <label class="pt-field__label" for="confirm-new-password">Nhập lại mật khẩu mới <span class="pt-field__required">*</span></label>
            <input class="pt-input" id="confirm-new-password" type="password" placeholder="Khớp với mật khẩu mới" minlength="8" required>
          </div>
          <button class="pt-button pt-button--primary" type="submit" style="margin-top:10px">Cập nhật mật khẩu mới</button>
        </form>
      </section>

      <!-- Cột 2: Định danh e-ID & 2FA -->
      <div style="display:flex;flex-direction:column;gap:24px">
        <section class="settings-section">
          <div class="settings-section__header">
            <div>
              <h2>Định danh điện tử e-ID</h2>
              <p>Chứng thực pháp lý bạn đọc trên hệ thống The Page Turner.</p>
            </div>
            <span class="pt-badge pt-badge--active">Cấp độ 2</span>
          </div>
          <div style="padding:22px">
            <div style="padding:16px;border-radius:var(--pt-radius-sm);background:var(--pt-paper);border:1px solid var(--pt-line)">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
                <span style="font-size:11px;font-weight:700;letter-spacing:0.1em;color:var(--pt-amber);text-transform:uppercase">CHỨNG THỰC BẠN ĐỌC QUỐC GIA</span>
                <span class="material-symbols-outlined" style="color:var(--pt-amber)">verified</span>
              </div>
              <div style="font-size:18px;font-weight:700;font-family:var(--pt-font-display);color:var(--pt-forest)">${escapeHtml(current.name)}</div>
              <div style="font-size:13px;color:var(--pt-muted);margin-top:4px">Mã định danh: <strong style="color:var(--pt-ink)">${escapeHtml(current.readerId)}</strong></div>
              <div style="font-size:12px;color:var(--pt-muted);margin-top:2px">Hạng hội viên: <strong style="color:var(--pt-amber)">${escapeHtml(current.rank)}</strong></div>
              <div style="font-size:11px;color:var(--pt-muted);margin-top:12px;padding-top:10px;border-top:1px dashed var(--pt-line)">
                Đã đồng bộ xác minh qua Căn cước công dân gắn chip / VNeID. Quyền lợi: Thẩm định sách miễn phí và ưu tiên quyền sở hữu ấn bản độc bản.
              </div>
            </div>
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section__header">
            <div>
              <h2>Xác thực hai lớp (2FA)</h2>
              <p>Tăng cường bảo vệ tài khoản khi đăng nhập trên thiết bị lạ.</p>
            </div>
            <span class="pt-badge pt-badge--new">Đang bật</span>
          </div>
          <div style="padding:22px;display:flex;align-items:center;justify-content:space-between;gap:16px">
            <div>
              <strong style="color:var(--pt-ink);font-size:14px;display:block">Mã OTP qua số điện thoại</strong>
              <span style="font-size:12px;color:var(--pt-muted)">Gửi mã xác nhận 6 số về số điện thoại ${escapeHtml(current.phone)} khi có đăng nhập mới.</span>
            </div>
            <button class="pt-button pt-button--secondary pt-button--small" type="button" id="toggle-2fa-btn">Cấu hình</button>
          </div>
        </section>
      </div>
    </div>

    <!-- Phiên đăng nhập & Thiết bị -->
    <section class="settings-section">
      <div class="settings-section__header">
        <div>
          <h2>Lịch sử các phiên đăng nhập</h2>
          <p>Kiểm tra danh sách các thiết bị hiện đang đăng nhập vào Kệ sách của bạn.</p>
        </div>
        <button class="pt-button pt-button--secondary pt-button--small" type="button" id="logout-other-devices-btn">Đăng xuất các thiết bị khác</button>
      </div>
      <div style="padding:16px 22px">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--pt-line)">
          <div style="display:flex;align-items:center;gap:12px">
            <span class="material-symbols-outlined" style="font-size:24px;color:var(--pt-amber)">laptop_mac</span>
            <div>
              <strong style="color:var(--pt-forest);font-size:14px">Chrome trên Windows 11</strong>
              <div style="font-size:12px;color:var(--pt-muted)">Vĩnh Long, Việt Nam · IP: 118.70.x.x · Thiết bị này</div>
            </div>
          </div>
          <span class="pt-badge pt-badge--new">● Đang hoạt động</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0">
          <div style="display:flex;align-items:center;gap:12px">
            <span class="material-symbols-outlined" style="font-size:24px;color:var(--pt-muted)">smartphone</span>
            <div>
              <strong style="color:var(--pt-forest);font-size:14px">Safari trên iPhone 15 Pro</strong>
              <div style="font-size:12px;color:var(--pt-muted)">Vĩnh Long, Việt Nam · Đăng nhập 2 ngày trước</div>
            </div>
          </div>
          <span style="font-size:12px;color:var(--pt-muted)">24/02/2025</span>
        </div>
      </div>
    </section>
  </div>`;
}

/* --------------------------------------------------------------------------
   VIEW 4: ĐỊA CHỈ ĐÃ LƯU
   -------------------------------------------------------------------------- */
function renderAddressesView(addresses, current) {
  const defaultProv = 'Vĩnh Long';
  const defaultDistricts = getDistrictsByProvince(defaultProv);

  return `<div>
    <div class="settings-heading">
      <div>
        <div class="page-eyebrow">Sổ địa chỉ nhận sách quý</div>
        <h1>Địa chỉ đã lưu</h1>
        <p>Quản lý các địa chỉ giao nhận sách. Toàn bộ ấn bản đều được bọc chống ẩm, gia cố góc và niêm phong chuyên dụng.</p>
      </div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span class="pt-badge pt-badge--active">${addresses.length} địa chỉ đã lưu</span>
        <button class="pt-button pt-button--secondary pt-button--small" type="button" data-account-logout style="display:inline-flex;align-items:center;gap:6px">
          <span class="material-symbols-outlined" aria-hidden="true" style="font-size:16px">logout</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>

    <!-- Danh sách thẻ địa chỉ -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:20px;margin-bottom:32px">
      ${addresses.map(addr => `
        <article class="settings-info-card" style="min-height:auto;position:relative">
          <div class="settings-info-card__header">
            <div>
              <div class="settings-info-card__eyebrow">${escapeHtml(addr.tag || 'Địa chỉ')}</div>
              <h2>${escapeHtml(addr.name)}</h2>
            </div>
            ${addr.isDefault ? `<span class="pt-badge pt-badge--active">Mặc định</span>` : `<button class="pt-button pt-button--ghost pt-button--small" type="button" data-set-default="${addr.id}">Đặt mặc định</button>`}
          </div>
          <div class="settings-info-card__body">
            <div style="font-size:13px;color:var(--pt-forest);font-weight:600;margin-bottom:4px">SĐT: ${escapeHtml(addr.phone)}</div>
            <p class="settings-info-card__address" style="margin-bottom:8px">${escapeHtml(addr.address)}, ${escapeHtml(addr.district)}, ${escapeHtml(addr.province)}</p>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:14px;padding-top:12px;border-top:1px solid var(--pt-line)">
            <button class="pt-button pt-button--ghost pt-button--small" type="button" data-edit-addr="${addr.id}">Sửa</button>
            ${!addr.isDefault ? `<button class="pt-button pt-button--ghost pt-button--small" style="color:var(--pt-burgundy)" type="button" data-delete-addr="${addr.id}">Xóa</button>` : ''}
          </div>
        </article>
      `).join('')}
    </div>

    <!-- Form thêm địa chỉ mới -->
    <section class="settings-section">
      <div class="settings-section__header">
        <div>
          <h2>Thêm địa chỉ giao nhận mới</h2>
          <p>Hỗ trợ đầy đủ 63 tỉnh thành Việt Nam và các đơn vị hành chính sau sáp nhập.</p>
        </div>
      </div>
      <form class="settings-form" id="new-address-form" style="padding:22px">
        ${renderField({ id: 'new-addr-name', label: 'Họ tên người nhận', name: 'name', value: current.name, required: true })}
        ${renderField({ id: 'new-addr-phone', label: 'Số điện thoại', type: 'tel', name: 'phone', value: current.phone, required: true })}

        <div class="pt-field">
          <label class="pt-field__label" for="new-addr-province">Tỉnh / Thành phố <span class="pt-field__required">*</span></label>
          <select class="pt-select" id="new-addr-province" name="province" required>
            ${vietnamProvinces.map(p => `
              <option value="${escapeHtml(p.name)}">${escapeHtml(p.name)}${p.type ? ` (${p.type})` : ''}</option>
            `).join('')}
          </select>
          <span class="pt-field__hint">Chọn để tự động tải quận/huyện tương ứng.</span>
        </div>

        <div class="pt-field">
          <label class="pt-field__label" for="new-addr-district">Quận / Huyện / TP thuộc tỉnh <span class="pt-field__required">*</span></label>
          <select class="pt-select" id="new-addr-district" name="district" required>
            ${defaultDistricts.map(d => `
              <option value="${escapeHtml(d)}">${escapeHtml(d)}</option>
            `).join('')}
          </select>
          <span class="pt-field__hint">Đã cập nhật các đơn vị mới như TP. Thủ Đức, TP. Thủy Nguyên...</span>
        </div>

        <div class="settings-form__full">
          ${renderField({
            id: 'new-addr-street',
            label: 'Số nhà, tên ngõ, đường/phố, phường/xã',
            name: 'address',
            placeholder: 'Ví dụ: Tầng 3, số 88 Phố Huế, Phường Hàng Bài',
            required: true
          })}
        </div>

        <div>
          <label class="pt-field__label" for="new-addr-tag">Phân loại địa chỉ</label>
          <select class="pt-select" id="new-addr-tag" name="tag">
            <option value="Nhà riêng">Nhà riêng</option>
            <option value="Thư phòng / Cơ quan">Thư phòng / Cơ quan</option>
            <option value="Kho lưu trữ">Kho lưu trữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div style="display:flex;align-items:center;gap:8px;padding-top:28px">
          <label class="pt-check-row">
            <input type="checkbox" id="new-addr-is-default" name="isDefault">
            <span>Đặt làm địa chỉ nhận sách mặc định</span>
          </label>
        </div>

        <div class="settings-form__full" style="display:flex;justify-content:flex-end;margin-top:10px">
          <button class="pt-button pt-button--primary" type="submit">Lưu địa chỉ mới vào sổ</button>
        </div>
      </form>
    </section>
  </div>`;
}

/* --------------------------------------------------------------------------
   VIEW 5: TÙY CHỌN THÔNG BÁO
   -------------------------------------------------------------------------- */
function renderNotificationsView(notifications) {
  return `<div>
    <div class="settings-heading">
      <div>
        <div class="page-eyebrow">Luôn cập nhật đúng lúc</div>
        <h1>Tùy chọn thông báo</h1>
        <p>Chọn lọc những bản tin, cập nhật sách quý và cảnh báo bảo tồn bạn muốn nhận.</p>
      </div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span class="pt-badge pt-badge--new">● Đang hoạt động</span>
        <button class="pt-button pt-button--secondary pt-button--small" type="button" data-account-logout style="display:inline-flex;align-items:center;gap:6px">
          <span class="material-symbols-outlined" aria-hidden="true" style="font-size:16px">logout</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>

    <section class="settings-section">
      <div class="settings-section__header">
        <div>
          <h2>Danh mục thông báo</h2>
          <p>Tất cả thay đổi sẽ được áp dụng ngay cho tài khoản của bạn.</p>
        </div>
      </div>

      <form id="notifications-settings-form">
        <div style="padding:22px;display:grid;gap:24px">
          <div>
            <h3 style="margin:0 0 12px;font-size:15px;color:var(--pt-forest);font-family:var(--pt-font-display)">1. Sách quý & Bộ sưu tập</h3>
            <div style="display:grid;gap:12px;padding:16px;border:1px solid var(--pt-line);border-radius:var(--pt-radius-sm);background:var(--pt-paper)">
              <label class="pt-check-row">
                <input type="checkbox" name="rareBooks" ${notifications.rareBooks ? 'checked' : ''}>
                <span>
                  <strong style="color:var(--pt-ink);display:block;font-size:13.5px">Tin ấn bản mới & sách độc bản</strong>
                  <span style="font-size:12px;color:var(--pt-muted)">Nhận thông tin khi có sách hiếm trước 1975, sách có chữ ký hoặc bản in đầu vừa về tiệm.</span>
                </span>
              </label>
              <label class="pt-check-row">
                <input type="checkbox" name="newsletter" checked>
                <span>
                  <strong style="color:var(--pt-ink);display:block;font-size:13.5px">Bản tin Sách Hiếm sáng thứ Bảy</strong>
                  <span style="font-size:12px;color:var(--pt-muted)">Điểm tin văn học, góc nhìn giám tuyển và danh mục sách chọn lọc phát hành hàng tuần.</span>
                </span>
              </label>
              <label class="pt-check-row">
                <input type="checkbox" name="wishlistAlerts" checked>
                <span>
                  <strong style="color:var(--pt-ink);display:block;font-size:13.5px">Thông báo sách trong Danh sách yêu thích</strong>
                  <span style="font-size:12px;color:var(--pt-muted)">Báo ngay khi cuốn sách bạn đang lưu tâm có người ký gửi hoặc được điều chỉnh giá tốt.</span>
                </span>
              </label>
            </div>
          </div>

          <div>
            <h3 style="margin:0 0 12px;font-size:15px;color:var(--pt-forest);font-family:var(--pt-font-display)">2. Đơn hàng & Vận chuyển</h3>
            <div style="display:grid;gap:12px;padding:16px;border:1px solid var(--pt-line);border-radius:var(--pt-radius-sm);background:var(--pt-paper)">
              <label class="pt-check-row">
                <input type="checkbox" name="orders" ${notifications.orders ? 'checked' : ''}>
                <span>
                  <strong style="color:var(--pt-ink);display:block;font-size:13.5px">Tiến độ đóng gói, khử acid & vận chuyển</strong>
                  <span style="font-size:12px;color:var(--pt-muted)">Cập nhật từng chặng từ lúc kiểm định sách đến khi shipper giao tận tay bạn.</span>
                </span>
              </label>
              <label class="pt-check-row">
                <input type="checkbox" name="consignment" checked>
                <span>
                  <strong style="color:var(--pt-ink);display:block;font-size:13.5px">Trạng thái hồ sơ ký gửi & thẩm định</strong>
                  <span style="font-size:12px;color:var(--pt-muted)">Thông báo kết quả thẩm định giá trị sách cũ bạn gửi cho hội đồng giám định.</span>
                </span>
              </label>
            </div>
          </div>

          <div>
            <h3 style="margin:0 0 12px;font-size:15px;color:var(--pt-forest);font-family:var(--pt-font-display)">3. Kênh tiếp nhận thông báo</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;padding:16px;border:1px solid var(--pt-line);border-radius:var(--pt-radius-sm);background:var(--pt-paper)">
              <label class="pt-check-row">
                <input type="checkbox" checked disabled>
                <span><strong>Email chính</strong> (Bắt buộc)</span>
              </label>
              <label class="pt-check-row">
                <input type="checkbox" checked>
                <span><strong>Tin nhắn SMS</strong> (Mã đơn hàng)</span>
              </label>
              <label class="pt-check-row">
                <input type="checkbox" checked>
                <span><strong>Thông báo trình duyệt</strong></span>
              </label>
            </div>
          </div>
        </div>

        <div class="settings-actions">
          <button class="pt-button pt-button--primary" type="submit">Lưu tùy chọn thông báo</button>
        </div>
      </form>
    </section>
  </div>`;
}

/* --------------------------------------------------------------------------
   HÀM CHÍNH RENDER TRANG SETTINGS THEO TAB
   -------------------------------------------------------------------------- */
function renderPage(root, activeTab = 'thong-tin-ca-nhan') {
  const state = getState();
  const current = state.account;
  const storedTheme = getStoredTheme();
  const effectiveTheme = getEffectiveTheme();
  const addresses = state.addresses || [];
  const notifications = current.notifications || {};

  // Xác định tiêu đề breadcrumb
  const breadcrumbLabels = {
    'thong-tin-ca-nhan': 'Thông tin cá nhân',
    'giao-dien': 'Giao diện Sáng / Tối',
    'bao-mat': 'Bảo mật & đăng nhập',
    'dia-chi': 'Địa chỉ đã lưu',
    'thong-bao': 'Tùy chọn thông báo'
  };

  const currentLabel = breadcrumbLabels[activeTab] || 'Cài đặt tài khoản';

  let mainContentMarkup = '';
  if (activeTab === 'giao-dien') {
    mainContentMarkup = renderThemeView(storedTheme, effectiveTheme);
  } else if (activeTab === 'bao-mat') {
    mainContentMarkup = renderSecurityView(current);
  } else if (activeTab === 'dia-chi') {
    mainContentMarkup = renderAddressesView(addresses, current);
  } else if (activeTab === 'thong-bao') {
    mainContentMarkup = renderNotificationsView(notifications);
  } else {
    mainContentMarkup = renderPersonalInfoView(current);
  }

  root.innerHTML = `<div class="settings-page pt-main">
    <div class="pt-container--wide">
      ${renderBreadcrumb(['Khu vực cá nhân', currentLabel])}
      <div style="margin-top:20px">${renderAccountContext('overview')}</div>
      
      <div class="settings-layout">
        ${renderNav(activeTab)}
        <div class="settings-content-pane">
          ${mainContentMarkup}
        </div>
      </div>
    </div>
  </div>`;

  // Gán sự kiện cho form thông tin cá nhân
  const personalForm = root.querySelector('#personal-info-form');
  if (personalForm) {
    const citySelect = personalForm.querySelector('#settings-city');
    const districtSelect = personalForm.querySelector('#settings-district');

    citySelect?.addEventListener('change', () => {
      const newDistricts = getDistrictsByProvince(citySelect.value);
      districtSelect.innerHTML = newDistricts.map(d => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');
    });

    personalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(personalForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const phone = String(formData.get('phone') || '').trim();
      const city = String(formData.get('city') || '').trim();
      const district = String(formData.get('district') || '').trim();
      const address = String(formData.get('address') || '').trim();

      updateAccount({ name, email, phone, city, district, address });
      showToast('Đã lưu thông tin cá nhân thành công.');
      
      const header = document.getElementById('header');
      if (header) {
        header.innerHTML = renderHeader();
        bindShellEvents();
      }
    });

    root.querySelector('[data-settings-cancel]')?.addEventListener('click', () => {
      personalForm.reset();
      showToast('Đã hủy các thay đổi chưa lưu.');
    });
  }

  // Gán sự kiện cho các thẻ đổi giao diện Sáng / Tối
  root.querySelectorAll('[data-set-theme]').forEach((card) => {
    const handleSelect = () => {
      const targetTheme = card.getAttribute('data-set-theme');
      setTheme(targetTheme);

      root.querySelectorAll('[data-set-theme]').forEach((c) => {
        const isActive = c.getAttribute('data-set-theme') === targetTheme;
        c.classList.toggle('is-active', isActive);
        c.setAttribute('aria-checked', isActive ? 'true' : 'false');
        const badge = c.querySelector('.theme-card__badge');
        if (badge) {
          if (isActive) {
            badge.textContent = 'Đang dùng';
          } else {
            const mode = c.getAttribute('data-set-theme');
            badge.textContent = mode === 'light' ? 'Giấy ngà' : (mode === 'dark' ? 'Thư viện đêm' : 'Tự động');
          }
        }
      });

      const statusBadge = root.querySelector('[data-theme-status-badge]');
      if (statusBadge) {
        statusBadge.textContent = getThemeLabel(targetTheme, getEffectiveTheme(targetTheme));
      }

      showToast(targetTheme === 'dark' ? 'Đã bật chế độ Tối (Thư viện đêm).' : targetTheme === 'light' ? 'Đã bật chế độ Sáng (Giấy ngà).' : 'Đã bật chế độ đồng bộ theo hệ thống.');
    };

    card.addEventListener('click', handleSelect);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect();
      }
    });
  });

  // Gán sự kiện đổi mật khẩu
  const passwordForm = root.querySelector('#change-password-form');
  if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const curr = passwordForm.querySelector('#curr-password').value;
      const newP = passwordForm.querySelector('#new-password').value;
      const confirmP = passwordForm.querySelector('#confirm-new-password').value;

      if (newP !== confirmP) {
        showToast('Mật khẩu nhập lại chưa khớp!', 'warning');
        return;
      }
      passwordForm.reset();
      showToast('Đã đổi mật khẩu tài khoản thành công.');
    });
  }

  root.querySelector('#toggle-2fa-btn')?.addEventListener('click', () => {
    showToast('Xác thực hai lớp (2FA) đang hoạt động ổn định trên số điện thoại của bạn.');
  });

  root.querySelector('#logout-other-devices-btn')?.addEventListener('click', () => {
    showToast('Đã ngắt kết nối và đăng xuất khỏi tất cả các thiết bị khác.');
  });

  // Gán sự kiện sổ địa chỉ
  const newAddrForm = root.querySelector('#new-address-form');
  if (newAddrForm) {
    const provSelect = newAddrForm.querySelector('#new-addr-province');
    const distSelect = newAddrForm.querySelector('#new-addr-district');

    provSelect?.addEventListener('change', () => {
      const newDistricts = getDistrictsByProvince(provSelect.value);
      distSelect.innerHTML = newDistricts.map(d => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');
    });

    newAddrForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(newAddrForm);
      const name = String(formData.get('name') || '').trim();
      const phone = String(formData.get('phone') || '').trim();
      const province = String(formData.get('province') || '').trim();
      const district = String(formData.get('district') || '').trim();
      const address = String(formData.get('address') || '').trim();
      const tag = String(formData.get('tag') || 'Nhà riêng').trim();
      const isDefault = Boolean(newAddrForm.querySelector('#new-addr-is-default')?.checked);

      addAddress({ name, phone, province, district, address, tag, isDefault });
      showToast('Đã thêm địa chỉ nhận sách mới vào sổ.');
      renderPage(root, 'dia-chi');
    });
  }

  root.querySelectorAll('[data-set-default]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-set-default');
      setDefaultAddress(id);
      showToast('Đã đặt làm địa chỉ nhận sách mặc định.');
      renderPage(root, 'dia-chi');
    });
  });

  root.querySelectorAll('[data-delete-addr]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-delete-addr');
      deleteAddress(id);
      showToast('Đã xóa địa chỉ khỏi sổ.');
      renderPage(root, 'dia-chi');
    });
  });

  root.querySelectorAll('[data-edit-addr]').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Bạn có thể chỉnh sửa địa chỉ trực tiếp qua biểu mẫu thêm mới bên dưới.');
    });
  });

  // Gán sự kiện tùy chọn thông báo
  const notifForm = root.querySelector('#notifications-settings-form');
  if (notifForm) {
    notifForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rareBooks = notifForm.querySelector('[name="rareBooks"]')?.checked;
      const orders = notifForm.querySelector('[name="orders"]')?.checked;
      updateAccountNotifications({ rareBooks, orders });
      showToast('Đã lưu tùy chọn thông báo thành công.');
    });
  }

  // Gán sự kiện Đăng xuất
  root.querySelectorAll('[data-account-logout]').forEach((btn) => {
    btn.addEventListener('click', () => {
      logout();
      showToast('Đã đăng xuất tài khoản thành công.');
      const header = document.getElementById('header');
      if (header) {
        header.innerHTML = renderHeader();
        bindShellEvents();
      }
      window.location.hash = '#login';
    });
  });
}

export function mountSettings(root, activeTab = 'thong-tin-ca-nhan') {
  // Chuẩn hóa activeTab nếu nhận từ route hash
  const hash = window.location.hash.slice(1).split('?')[0].trim();
  let tab = activeTab;
  if (hash === 'giao-dien' || hash === 'theme') tab = 'giao-dien';
  else if (hash === 'bao-mat') tab = 'bao-mat';
  else if (hash === 'dia-chi') tab = 'dia-chi';
  else if (hash === 'thong-bao') tab = 'thong-bao';
  else if (hash === 'thong-tin-ca-nhan' || hash === 'settings' || hash === 'cai-dat') tab = 'thong-tin-ca-nhan';

  renderPage(root, tab);
}
