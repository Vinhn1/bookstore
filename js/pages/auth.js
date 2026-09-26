import { renderBreadcrumb, showToast, renderHeader, bindShellEvents } from '../components/shell.js';
import { renderField } from '../components/ui.js';
import { getState, login, logout } from '../state/store.js';
import { escapeHtml } from '../utils/formatters.js';

const authCopy = {
  login: { eyebrow: 'Kệ sách của tôi', title: 'Đăng nhập vào Kệ sách của tôi', description: 'Tiếp tục theo dõi đơn hàng, chứng thư điện tử và những ấn bản bạn đã lưu tâm.' },
  register: { eyebrow: 'Đăng ký thành viên', title: 'Tạo tài khoản bạn đọc', description: 'Chỉ mất khoảng một phút để bắt đầu.' },
  recover: { eyebrow: 'Tài khoản & bảo tồn', title: 'Khôi phục quyền truy cập', description: 'Nhập địa chỉ email bạn đã dùng để đăng ký. Chúng tôi sẽ gửi một liên kết để bạn đặt lại mật khẩu và trở lại với giá sách của mình.' }
};

function renderAlreadyLoggedInBanner(state) {
  if (!state?.isAuthenticated) return '';
  return `<div class="auth-status-card" style="margin-bottom:22px;padding:16px 18px;border:1px solid var(--pt-line);border-radius:var(--pt-radius-sm);background:var(--pt-paper);">
    <div style="display:flex;align-items:center;gap:8px;font-size:14px;color:var(--pt-forest);font-weight:600">
      <span class="material-symbols-outlined" style="color:var(--pt-amber);font-size:20px" aria-hidden="true">check_circle</span>
      <span>Bạn hiện đang đăng nhập</span>
    </div>
    <p style="margin:8px 0 14px;font-size:13.5px;color:var(--pt-muted);line-height:1.6">Tài khoản: <strong>${escapeHtml(state.account?.name || 'Thành viên')}</strong> (${escapeHtml(state.account?.email || '')})</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <a class="pt-button pt-button--primary pt-button--small" href="#settings">Đến Hồ sơ & Cài đặt →</a>
      <button class="pt-button pt-button--secondary pt-button--small" id="auth-inline-logout-btn" type="button">Đăng xuất tài khoản này</button>
    </div>
  </div>`;
}

function passwordField(id, label, autocomplete, placeholder) {
  return `<div class="pt-field" data-field="${id}"><label class="pt-field__label" for="${id}">${label} <span class="pt-field__required" aria-hidden="true">*</span></label><div class="auth-password-wrap"><input class="pt-input" id="${id}" name="${id}" type="password" autocomplete="${autocomplete}" placeholder="${placeholder}" required aria-describedby="${id}-error"><button class="auth-password-toggle" type="button" data-password-toggle="${id}" aria-controls="${id}" aria-label="Hiện mật khẩu" aria-pressed="false"><span class="material-symbols-outlined" aria-hidden="true">visibility</span><span>Hiện</span></button></div><span class="pt-field__error" id="${id}-error" role="alert"></span></div>`;
}

function renderLogin(state) {
  return `<div class="auth-page"><div class="auth-page__container">${renderBreadcrumb(['Tài khoản', 'Đăng nhập'])}<section class="auth-card" aria-labelledby="auth-title"><div class="auth-card__accent"></div><div class="auth-card__header"><div><div class="auth-card__eyebrow">${authCopy.login.eyebrow}</div><p class="auth-card__subtitle">Không gian riêng cho những ấn bản bạn trân trọng</p></div><span class="pt-badge pt-badge--neutral">Thành viên</span></div><div class="auth-card__body"><div class="auth-card__body-inner"><h1 class="auth-title" id="auth-title">${authCopy.login.title}</h1><p class="auth-description">${authCopy.login.description}</p>${renderAlreadyLoggedInBanner(state)}<div class="auth-success" data-success></div><form class="auth-form" data-auth-form="login" novalidate>${renderField({ id: 'login-email', label: 'Địa chỉ email', type: 'email', name: 'email', placeholder: 'ten@email.com', autocomplete: 'email', required: true })}${passwordField('login-password', 'Mật khẩu', 'current-password', 'Nhập mật khẩu của bạn')}<div class="auth-form__actions"><label class="pt-check-row" for="remember"><input id="remember" name="remember" type="checkbox"><span>Ghi nhớ đăng nhập</span></label><a class="auth-form__link" href="#recover">Quên mật khẩu?</a></div><button class="pt-button pt-button--primary" type="submit">Đăng nhập <span aria-hidden="true">→</span></button></form><div class="auth-divider">hoặc</div><p class="auth-form__footer">Chưa có tài khoản? <a href="#register">Đăng ký ngay</a></p><div class="auth-note"><span class="material-symbols-outlined" aria-hidden="true">lock</span><p>Thông tin của bạn được bảo mật. Đăng nhập để xem <strong>chứng thư điện tử</strong>, lịch sử đơn hàng và những ấn bản đã lưu.</p></div></div></div></section><p class="auth-advisory">The Page Turner lưu giữ lịch sử mua hàng và chứng thư số của bạn trong một không gian riêng, rõ ràng và dễ tra cứu.</p></div></div>`;
}

function renderRegister(state) {
  return `<div class="auth-page"><div class="pt-container"><div class="auth-layout__intro"><div class="auth-layout__eyebrow">Thành viên The Page Turner</div><h1>${authCopy.register.title.replace('Tạo tài khoản bạn đọc', 'Mở cánh cửa đến những trang sách thân quen')}</h1><p>Tạo tài khoản miễn phí để lưu lại những cuốn sách bạn yêu thích và nhận hỗ trợ tận tâm từ tiệm.</p></div><div class="auth-layout"><section class="auth-card" aria-labelledby="auth-title"><div class="auth-card__body"><div class="auth-card__body-inner"><div class="auth-card__eyebrow">${authCopy.register.eyebrow}</div><h2 class="auth-title" id="auth-title">${authCopy.register.title}</h2><p class="auth-description">${authCopy.register.description}</p>${renderAlreadyLoggedInBanner(state)}<div class="auth-success" data-success></div><form class="auth-form" data-auth-form="register" novalidate><div class="auth-register-grid">${renderField({ id: 'register-name', label: 'Họ và tên', name: 'name', placeholder: 'Nguyễn Hoàng Hải', autocomplete: 'name', required: true })}${renderField({ id: 'register-email', label: 'Địa chỉ email', type: 'email', name: 'email', placeholder: 'ban@thepageturner.vn', autocomplete: 'email', required: true })}<div class="auth-register-grid__full">${renderField({ id: 'register-phone', label: 'Số điện thoại', type: 'tel', name: 'phone', placeholder: '09xx xxx xxx', autocomplete: 'tel', required: true })}</div>${passwordField('register-password', 'Mật khẩu', 'new-password', 'Ít nhất 8 ký tự')}${passwordField('register-confirm', 'Nhập lại mật khẩu', 'new-password', 'Nhập lại mật khẩu của bạn')}</div><label class="pt-check-row" for="consent"><input id="consent" name="consent" type="checkbox" required><span>Tôi đồng ý với <a class="auth-form__link" href="#support">Điều khoản sử dụng</a> và <a class="auth-form__link" href="#support">Chính sách bảo mật</a> của The Page Turner.</span></label><button class="pt-button pt-button--primary" type="submit">Tạo tài khoản <span aria-hidden="true">→</span></button><p class="auth-form__footer">Đã có tài khoản? <a href="#login">Đăng nhập</a></p></form></div></div></section><aside class="auth-trust" aria-labelledby="trust-title"><div><span class="auth-trust__mark"><span class="material-symbols-outlined" aria-hidden="true">menu_book</span></span><span class="auth-trust__badge">Dành cho bạn đọc</span></div><div class="auth-card__eyebrow" style="margin-top:28px">Một góc riêng cho bạn</div><h2 id="trust-title">Đọc lâu hơn, giữ lại nhiều hơn.</h2><p>Tài khoản giúp mỗi lần ghé tiệm trở nên gọn gàng và gần gũi hơn.</p><div class="auth-trust__list">${[['shelves','Kệ sách cá nhân','Lưu những tựa sách muốn đọc và bộ sưu tập đã chọn.'],['verified','Chứng thư điện tử','Tra cứu chứng nhận sở hữu cho các bản sách đặc biệt.'],['local_shipping','Theo dõi đơn hàng','Xem trạng thái đóng gói, giao nhận và lịch sử mua.']].map(([icon,title,description]) => `<div class="auth-trust__item"><span class="auth-trust__icon"><span class="material-symbols-outlined" aria-hidden="true">${icon}</span></span><div><h3>${title}</h3><p>${description}</p></div></div>`).join('')}</div><div class="auth-note"><span class="material-symbols-outlined" aria-hidden="true">verified_user</span><p>Thông tin của bạn được giữ riêng tư và chỉ dùng để hỗ trợ trải nghiệm mua sách.</p></div></aside></div></div></div>`;
}

function renderRecover() {
  return `<div class="auth-page"><div class="pt-container">${renderBreadcrumb(['Tài khoản', 'Khôi phục mật khẩu'])}<div class="auth-split" style="margin-top:28px"><article class="auth-split__form" aria-labelledby="auth-title"><div class="auth-layout__eyebrow" style="justify-content:flex-start">Tài khoản & bảo tồn</div><h1 class="auth-title" id="auth-title" style="margin-top:20px">${authCopy.recover.title}</h1><p class="auth-description">${authCopy.recover.description}</p><div class="auth-success" data-success></div><form class="auth-form" data-auth-form="recover" novalidate>${renderField({ id: 'recover-email', label: 'Địa chỉ email', type: 'email', name: 'email', placeholder: 'ban@example.com', autocomplete: 'email', required: true, help: 'Liên kết khôi phục có hiệu lực trong 30 phút.' })}<button class="pt-button pt-button--primary" type="submit">Gửi liên kết khôi phục <span aria-hidden="true">→</span></button></form><a class="auth-form__link" style="display:inline-flex;margin-top:20px" href="#login">← Quay lại đăng nhập</a><div class="auth-note"><span class="material-symbols-outlined" aria-hidden="true">verified_user</span><p><strong>Ghi chú riêng tư.</strong> Email của bạn chỉ được dùng để xác nhận quyền sở hữu tài khoản.</p></div></article><aside class="auth-split__aside"><div class="auth-card__eyebrow" style="color:#b9cbbe">Hồ sơ lưu trữ · 01</div><h2>Giá sách của bạn luôn được bảo toàn.</h2><p>Mỗi tài khoản là một phần trong hành trình sưu tầm riêng. Khi bạn khôi phục quyền truy cập, các chứng thư điện tử và danh mục sách cá nhân vẫn ở đúng vị trí.</p><div class="auth-split__aside-list"><div class="auth-split__aside-row"><strong>01</strong><span>Chứng thư điện tử</span><span style="margin-left:auto;color:#b9cbbe">Được giữ nguyên</span></div><div class="auth-split__aside-row"><strong>02</strong><span>Giá sách cá nhân</span><span style="margin-left:auto;color:#b9cbbe">Đồng bộ an toàn</span></div></div><div class="auth-note" style="border-color:rgba(185,203,190,.25);color:rgba(242,240,237,.8)"><span class="material-symbols-outlined" aria-hidden="true">auto_awesome</span><p>Bảo mật được chúng tôi gìn giữ như một trang sách quý: kín đáo, rõ ràng và có thể kiểm chứng.</p></div></aside></div></div></div>`;
}

export function mountAuth(root, mode) {
  const state = getState();
  root.innerHTML = mode === 'login' ? renderLogin(state) : mode === 'register' ? renderRegister(state) : renderRecover();
  
  const inlineLogoutBtn = root.querySelector('#auth-inline-logout-btn');
  inlineLogoutBtn?.addEventListener('click', () => {
    logout();
    showToast('Đã đăng xuất tài khoản thành công.');
    const header = document.getElementById('header');
    if (header) {
      header.innerHTML = renderHeader();
      bindShellEvents();
    }
    mountAuth(root, mode);
  });

  const form = root.querySelector('[data-auth-form]');
  if (!form) return;
  root.querySelectorAll('[data-password-toggle]').forEach((button) => button.addEventListener('click', () => {
    const field = document.getElementById(button.dataset.passwordToggle);
    const visible = field.type === 'text';
    field.type = visible ? 'password' : 'text';
    button.setAttribute('aria-pressed', String(!visible));
    button.setAttribute('aria-label', visible ? 'Hiện mật khẩu' : 'Ẩn mật khẩu');
    button.querySelector('span:last-child').textContent = visible ? 'Hiện' : 'Ẩn';
    button.querySelector('.material-symbols-outlined').textContent = visible ? 'visibility' : 'visibility_off';
  }));
  const showError = (field, message) => { const wrapper = field.closest('.pt-field'); wrapper?.classList.toggle('is-invalid', Boolean(message)); const error = document.getElementById(`${field.id}-error`); if (error) error.textContent = message || ''; };
  const validate = () => {
    let valid = true;
    form.querySelectorAll('input[required]').forEach((field) => {
      let message = '';
      if (field.type === 'checkbox' && !field.checked) message = 'Vui lòng xác nhận lựa chọn này.';
      else if (!field.value.trim()) message = 'Vui lòng điền thông tin này.';
      else if (field.type === 'email' && !field.validity.valid) message = 'Email chưa đúng định dạng.';
      else if (field.minLength > 0 && field.value.length < field.minLength) message = `Vui lòng nhập ít nhất ${field.minLength} ký tự.`;
      showError(field, message);
      if (message) valid = false;
    });
    const password = form.querySelector('[name="password"], #register-password');
    const confirm = form.querySelector('#register-confirm');
    if (confirm && password && confirm.value && password.value !== confirm.value) { showError(confirm, 'Mật khẩu nhập lại chưa khớp.'); valid = false; }
    return valid;
  };
  form.querySelectorAll('input').forEach((field) => field.addEventListener('blur', validate));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validate()) return;
    
    if (mode === 'login') {
      const email = form.querySelector('#login-email')?.value?.trim();
      login({ email });
      const success = form.parentElement.querySelector('[data-success]');
      if (success) {
        success.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';
        success.classList.add('is-visible');
      }
      showToast('Đăng nhập thành công! Đang chuyển đến Hồ sơ & Cài đặt.');
      const header = document.getElementById('header');
      if (header) {
        header.innerHTML = renderHeader();
        bindShellEvents();
      }
      setTimeout(() => {
        window.location.hash = '#settings';
      }, 400);
    } else if (mode === 'register') {
      const name = form.querySelector('#register-name')?.value?.trim();
      const email = form.querySelector('#register-email')?.value?.trim();
      login({ name, email });
      const success = form.parentElement.querySelector('[data-success]');
      if (success) {
        success.textContent = 'Đăng ký tài khoản thành công! Đang chuyển hướng...';
        success.classList.add('is-visible');
      }
      showToast('Tạo tài khoản thành công! Chào mừng bạn đến với The Page Turner.');
      const header = document.getElementById('header');
      if (header) {
        header.innerHTML = renderHeader();
        bindShellEvents();
      }
      setTimeout(() => {
        window.location.hash = '#settings';
      }, 400);
    } else {
      const success = form.parentElement.querySelector('[data-success]');
      if (success) {
        success.textContent = 'Đã gửi liên kết khôi phục. Hãy kiểm tra hộp thư của bạn.';
        success.classList.add('is-visible');
      }
      showToast('Đã gửi liên kết khôi phục.');
    }
  });
}
