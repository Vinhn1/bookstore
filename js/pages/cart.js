import { books } from "../data.js";
import { renderBreadcrumb, showToast } from "../components/shell.js";
import { getState, removeFromCart, updateCartQuantity, clearCart, checkoutCart, addToWishlist } from "../state/store.js";
import { formatVnd, escapeHtml } from "../utils/formatters.js";
import { renderConditionBadge } from "../components/ui.js";
import { vietnamProvinces, getDistrictsByProvince } from "../data/locations.js";

function getCartWithDetails() {
  const state = getState();
  const cartItems = state.cart || [];
  return cartItems.map((item) => {
    const book = books.find((b) => b.id === item.bookId) || {
      id: item.bookId,
      title: 'Ấn bản sưu tầm #' + item.bookId,
      author: 'Nhiều tác giả',
      publisher: 'The Page Turner',
      year: 2020,
      price: 100000,
      condition: { label: 'Tốt', percent: 85, tone: 'good' },
      badges: ['Sách tuyển chọn']
    };
    return {
      ...item,
      book,
      itemTotal: (book.price || 0) * item.quantity
    };
  });
}

function renderCartItem(item) {
  const book = item.book;
  const coverMarkup = book.coverUrl
    ? `<img src="${book.coverUrl}" alt="Bìa ${escapeHtml(book.title)}" class="cart-item__cover-img">`
    : `<div class="cart-item__cover-fallback ${book.coverClass || 'cover-paper'}"><span>${escapeHtml(book.title)}</span></div>`;

  return `
    <article class="cart-item" data-cart-row="${escapeHtml(book.id)}">
      <div class="cart-item__media">
        <a href="#sach/${encodeURIComponent(book.id)}" aria-label="Xem chi tiết ${escapeHtml(book.title)}">
          ${coverMarkup}
        </a>
      </div>
      <div class="cart-item__content">
        <div class="cart-item__header">
          <div>
            <h3 class="cart-item__title">
              <a href="#sach/${encodeURIComponent(book.id)}">${escapeHtml(book.title)}</a>
            </h3>
            <p class="cart-item__author">${escapeHtml(book.author)} · ${escapeHtml(book.publisher)} (${book.year})</p>
          </div>
          <button type="button" class="cart-item__del-btn" data-cart-del="${escapeHtml(book.id)}" aria-label="Xóa ${escapeHtml(book.title)} khỏi giỏ">
            <span class="material-symbols-outlined" aria-hidden="true">delete</span>
            <span class="cart-item__del-text">Xóa</span>
          </button>
        </div>

        <div class="cart-item__tags">
          ${renderConditionBadge(book.condition)}
          <span class="cart-item__badge-pkg">
            <span class="material-symbols-outlined" aria-hidden="true">verified_user</span>
            Bọc chống ẩm & chống va đập
          </span>
        </div>

        <div class="cart-item__footer">
          <div class="cart-item__price-block">
            <span class="cart-item__unit-price">${formatVnd(book.price)}</span>
            ${book.originalPrice ? `<del class="cart-item__old-price">${formatVnd(book.originalPrice)}</del>` : ''}
          </div>

          <div class="cart-item__qty-wrapper">
            <label class="sr-only" for="cart-qty-${escapeHtml(book.id)}">Số lượng cho ${escapeHtml(book.title)}</label>
            <div class="cart-qty-ctrl">
              <button type="button" class="cart-qty-btn" data-qty-dec="${escapeHtml(book.id)}" ${item.quantity <= 1 ? 'disabled' : ''} aria-label="Giảm số lượng">-</button>
              <input type="number" id="cart-qty-${escapeHtml(book.id)}" class="cart-qty-input" data-qty-field="${escapeHtml(book.id)}" value="${item.quantity}" min="1" max="99" aria-label="Số lượng">
              <button type="button" class="cart-qty-btn" data-qty-inc="${escapeHtml(book.id)}" aria-label="Tăng số lượng">+</button>
            </div>
          </div>

          <div class="cart-item__subtotal">
            <small>Thành tiền:</small>
            <strong>${formatVnd(item.itemTotal)}</strong>
          </div>
        </div>
      </div>
    </article>
  `;
}

export function mountCart(root) {
  let appliedDiscount = 0;
  let discountCode = '';
  let viewStep = 'cart'; // 'cart' | 'checkout' | 'success'
  let placedOrderData = null;

  // Checkout form state
  const state = getState();
  const defaultAddr = (state.addresses || []).find((a) => a.isDefault) || state.addresses?.[0];
  let selectedAddressType = defaultAddr ? defaultAddr.id : 'new';
  let shippingMethod = 'standard'; // 'standard' (0) | 'express' (35000)
  let paymentMethod = 'cod'; // 'cod' | 'banking' | 'card' | 'ewallet'
  let orderNote = '';

  let newAddressData = {
    name: state.account?.name || 'Nguyễn Hoàng Hải',
    phone: state.account?.phone || '0912 845 678',
    province: 'Vĩnh Long',
    district: 'TP. Vĩnh Long',
    address: ''
  };

  let cardData = {
    number: '',
    name: (state.account?.name || 'NGUYEN HOANG HAI').toUpperCase(),
    expiry: '',
    cvv: ''
  };

  let selectedWallet = 'momo'; // 'momo' | 'zalopay'

  const render = () => {
    const detailedItems = getCartWithDetails();
    const subtotal = detailedItems.reduce((sum, item) => sum + item.itemTotal, 0);
    const totalQuantity = detailedItems.reduce((sum, item) => sum + item.quantity, 0);
    const shippingFee = shippingMethod === 'express' ? 35000 : 0;
    const finalTotal = Math.max(0, subtotal - appliedDiscount + shippingFee);

    // If step is success and we have an order placed
    if (viewStep === 'success' && placedOrderData) {
      renderSuccessView(placedOrderData);
      return;
    }

    // Empty cart state (only when in cart step and 0 items)
    if (detailedItems.length === 0 && viewStep !== 'success') {
      root.innerHTML = `
        <div class="cart-page pt-main">
          <div class="pt-container--wide">
            ${renderBreadcrumb(["Trang chủ", "Giỏ hàng của bạn"])}
            <section class="cart-empty-section">
              <div class="cart-empty-card">
                <div class="cart-empty-icon-wrap">
                  <span class="material-symbols-outlined cart-empty-icon" aria-hidden="true">local_mall</span>
                </div>
                <h2>Giỏ hàng của bạn đang trống</h2>
                <p>Bạn chưa thêm cuốn sách nào vào giỏ. Hãy dạo qua các chuyên mục văn học, kinh tế, tâm lý và những ấn bản hiếm có của The Page Turner để tìm cuốn sách tâm đắc.</p>
                <div class="cart-empty-actions">
                  <a class="pt-button pt-button--primary" href="#danh-muc">Khám phá danh mục sách</a>
                  <a class="pt-button pt-button--secondary" href="#wishlist">Xem sách đã yêu thích</a>
                  <a class="pt-button pt-button--ghost" href="#sach-hiem">Săn sách quý hiếm</a>
                </div>
              </div>
            </section>
          </div>
        </div>
      `;
      return;
    }

    if (viewStep === 'checkout') {
      renderCheckoutView({ detailedItems, subtotal, totalQuantity, shippingFee, finalTotal });
    } else {
      renderCartView({ detailedItems, subtotal, totalQuantity, shippingFee, finalTotal });
    }
  };

  // STEP 1: CART REVIEW
  const renderCartView = ({ detailedItems, subtotal, totalQuantity, shippingFee, finalTotal }) => {
    root.innerHTML = `
      <div class="cart-page pt-main">
        <div class="pt-container--wide">
          ${renderBreadcrumb(["Trang chủ", "Giỏ hàng của bạn"])}

          <div class="checkout-stepper">
            <div class="checkout-step is-active">
              <span class="checkout-step__num">1</span>
              <span class="checkout-step__label">Giỏ hàng</span>
            </div>
            <div class="checkout-step__line"></div>
            <div class="checkout-step">
              <span class="checkout-step__num">2</span>
              <span class="checkout-step__label">Đặt hàng & Thanh toán</span>
            </div>
            <div class="checkout-step__line"></div>
            <div class="checkout-step">
              <span class="checkout-step__num">3</span>
              <span class="checkout-step__label">Hoàn tất</span>
            </div>
          </div>

          <section class="cart-heading">
            <div>
              <div class="page-eyebrow">Mua sắm / Giỏ hàng</div>
              <h1>Giỏ hàng của bạn</h1>
              <p>Kiểm tra danh mục các ấn bản đã chọn trước khi tiến hành khử acid đóng gói và chuyển giao tận tay bạn.</p>
            </div>
            <div class="cart-stats">
              <div class="cart-stat">
                <strong>${totalQuantity}</strong>
                <span>cuốn trong giỏ</span>
              </div>
            </div>
          </section>

          <div class="cart-grid">
            <div class="cart-main-col">
              <div class="cart-items-card">
                <div class="cart-items-card__head">
                  <h2>Danh sách ấn bản (${detailedItems.length} đầu sách)</h2>
                  <button type="button" class="cart-clear-btn" data-cart-clear-all>
                    <span class="material-symbols-outlined" aria-hidden="true">delete_sweep</span>
                    Làm trống giỏ hàng
                  </button>
                </div>

                <div class="cart-items-list">
                  ${detailedItems.map(renderCartItem).join('')}
                </div>

                <div class="cart-items-card__foot">
                  <a class="pt-button pt-button--secondary pt-button--small" href="#danh-muc">
                    <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
                    Tiếp tục chọn thêm sách
                  </a>
                </div>
              </div>
            </div>

            <aside class="cart-aside-col">
              <div class="cart-summary-card">
                <h2>Tóm tắt đơn hàng</h2>

                <div class="cart-summary-rows">
                  <div class="cart-summary-row">
                    <span>Tổng tiền sách (${totalQuantity} cuốn)</span>
                    <strong>${formatVnd(subtotal)}</strong>
                  </div>

                  <div class="cart-summary-row">
                    <span>Phí vận chuyển dự tính</span>
                    <strong class="cart-text-green">Miễn phí</strong>
                  </div>

                  <div class="cart-summary-row">
                    <span>Đóng gói bảo quản chuyên dụng</span>
                    <strong class="cart-text-green">Miễn phí</strong>
                  </div>

                  ${appliedDiscount > 0 ? `
                    <div class="cart-summary-row cart-summary-row--discount">
                      <span>Mã giảm giá (${escapeHtml(discountCode)})</span>
                      <strong>-${formatVnd(appliedDiscount)}</strong>
                    </div>
                  ` : ''}
                </div>

                <div class="cart-voucher-box">
                  <label for="cart-voucher-input">Mã ưu đãi / Phiếu quà tặng</label>
                  <div class="cart-voucher-form">
                    <input type="text" id="cart-voucher-input" placeholder="Ví dụ: READAGAIN" value="${escapeHtml(discountCode)}">
                    <button type="button" class="pt-button pt-button--secondary pt-button--small" data-apply-coupon>Áp dụng</button>
                  </div>
                  <small class="cart-voucher-hint">Nhập <strong>READAGAIN</strong> để giảm 30.000₫ cho độc giả thân thiết.</small>
                </div>

                <div class="cart-total-row">
                  <div>
                    <span class="cart-total-label">Tổng thanh toán:</span>
                    <small class="cart-vat-note">(Đã bao gồm VAT & bảo quản chuyên dụng)</small>
                  </div>
                  <strong class="cart-total-amount">${formatVnd(finalTotal)}</strong>
                </div>

                <div class="cart-checkout-actions">
                  <button type="button" class="pt-button pt-button--primary cart-checkout-btn" data-go-to-checkout>
                    <span>Tiến hành đặt hàng</span>
                    <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                  </button>
                </div>

                <div class="cart-reassurances">
                  <div class="cart-reassurance-item">
                    <span class="material-symbols-outlined" aria-hidden="true">verified</span>
                    <span>100% Sách thật, đúng với ảnh và mô tả tình trạng.</span>
                  </div>
                  <div class="cart-reassurance-item">
                    <span class="material-symbols-outlined" aria-hidden="true">local_shipping</span>
                    <span>Đóng gói hộp cứng 3 lớp, chống ẩm và chống cong gáy.</span>
                  </div>
                  <div class="cart-reassurance-item">
                    <span class="material-symbols-outlined" aria-hidden="true">assignment_return</span>
                    <span>Hỗ trợ đổi trả miễn phí trong 7 ngày nếu lỗi thẩm định.</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    `;

    bindCartEvents();
  };

  // STEP 2: CHECKOUT & PAYMENT SELECTION
  const renderCheckoutView = ({ detailedItems, subtotal, totalQuantity, shippingFee, finalTotal }) => {
    const addresses = getState().addresses || [];
    const districtsForNew = getDistrictsByProvince(newAddressData.province) || [];

    root.innerHTML = `
      <div class="cart-page pt-main checkout-page">
        <div class="pt-container--wide">
          ${renderBreadcrumb(["Trang chủ", "Giỏ hàng", "Đặt hàng & Thanh toán"])}

          <div class="checkout-stepper">
            <div class="checkout-step is-complete" data-step-cart style="cursor:pointer">
              <span class="checkout-step__num"><span class="material-symbols-outlined" style="font-size:16px" aria-hidden="true">check</span></span>
              <span class="checkout-step__label">Giỏ hàng</span>
            </div>
            <div class="checkout-step__line is-active"></div>
            <div class="checkout-step is-active">
              <span class="checkout-step__num">2</span>
              <span class="checkout-step__label">Đặt hàng & Thanh toán</span>
            </div>
            <div class="checkout-step__line"></div>
            <div class="checkout-step">
              <span class="checkout-step__num">3</span>
              <span class="checkout-step__label">Hoàn tất</span>
            </div>
          </div>

          <div class="checkout-back-bar">
            <button type="button" class="checkout-back-link" data-step-cart>
              <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
              Quay lại kiểm tra giỏ hàng
            </button>
          </div>

          <div class="cart-grid checkout-grid">
            <div class="cart-main-col checkout-form-col">

              <!-- SECTION 1: ĐỊA CHỈ NHẬN HÀNG -->
              <section class="checkout-card" id="checkout-address-section">
                <div class="checkout-card__head">
                  <div class="checkout-card__title-wrap">
                    <span class="checkout-card__badge">1</span>
                    <div>
                      <h2>Địa chỉ nhận hàng</h2>
                      <p>Sách sẽ được giao tận tay theo thông tin người nhận dưới đây.</p>
                    </div>
                  </div>
                </div>

                <div class="checkout-address-list">
                  ${addresses.map((addr) => `
                    <label class="checkout-option-card ${selectedAddressType === addr.id ? 'is-selected' : ''}">
                      <input type="radio" name="deliveryAddress" value="${escapeHtml(addr.id)}" ${selectedAddressType === addr.id ? 'checked' : ''} class="checkout-radio">
                      <div class="checkout-option-card__content">
                        <div class="checkout-address-info__header">
                          <strong>${escapeHtml(addr.name)}</strong>
                          <span class="checkout-phone">${escapeHtml(addr.phone)}</span>
                          <span class="checkout-tag">${escapeHtml(addr.tag || 'Địa chỉ')}</span>
                          ${addr.isDefault ? '<span class="pt-badge pt-badge--active">Mặc định</span>' : ''}
                        </div>
                        <p class="checkout-address-detail">${escapeHtml(addr.address)}, ${escapeHtml(addr.district)}, ${escapeHtml(addr.province)}</p>
                      </div>
                    </label>
                  `).join('')}

                  <label class="checkout-option-card ${selectedAddressType === 'new' ? 'is-selected' : ''}">
                    <input type="radio" name="deliveryAddress" value="new" ${selectedAddressType === 'new' ? 'checked' : ''} class="checkout-radio">
                    <div class="checkout-option-card__content">
                      <div class="checkout-address-info__header">
                        <strong>Giao đến địa chỉ mới khác</strong>
                      </div>
                      <p class="checkout-address-detail">Nhập thông tin người nhận và vị trí nhận hàng mới.</p>
                    </div>
                  </label>
                </div>

                <!-- Form nhập địa chỉ mới (nếu chọn 'new') -->
                <div class="checkout-new-address-form ${selectedAddressType === 'new' ? 'is-visible' : 'is-hidden'}" id="new-address-box">
                  <div class="checkout-form-row">
                    <div class="checkout-form-group">
                      <label for="new-recipient-name">Họ và tên người nhận <span class="req">*</span></label>
                      <input type="text" id="new-recipient-name" value="${escapeHtml(newAddressData.name)}" placeholder="Ví dụ: Nguyễn Hoàng Hải">
                    </div>
                    <div class="checkout-form-group">
                      <label for="new-recipient-phone">Số điện thoại <span class="req">*</span></label>
                      <input type="tel" id="new-recipient-phone" value="${escapeHtml(newAddressData.phone)}" placeholder="Ví dụ: 0912 845 678">
                    </div>
                  </div>

                  <div class="checkout-form-row">
                    <div class="checkout-form-group">
                      <label for="new-recipient-province">Tỉnh / Thành phố <span class="req">*</span></label>
                      <select id="new-recipient-province" class="pt-select">
                        ${vietnamProvinces.map((p) => `<option value="${escapeHtml(p.name)}" ${newAddressData.province === p.name ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}
                      </select>
                    </div>
                    <div class="checkout-form-group">
                      <label for="new-recipient-district">Quận / Huyện / Thị xã <span class="req">*</span></label>
                      <select id="new-recipient-district" class="pt-select">
                        ${districtsForNew.map((d) => `<option value="${escapeHtml(d)}" ${newAddressData.district === d ? 'selected' : ''}>${escapeHtml(d)}</option>`).join('')}
                      </select>
                    </div>
                  </div>

                  <div class="checkout-form-group">
                    <label for="new-recipient-address">Địa chỉ chi tiết (Số nhà, tên ngõ, đường, phường/xã) <span class="req">*</span></label>
                    <input type="text" id="new-recipient-address" value="${escapeHtml(newAddressData.address)}" placeholder="Ví dụ: Số 18 Phố Chân Cầm, Phường Hàng Trống">
                  </div>
                </div>

                <!-- Ghi chú giao hàng -->
                <div class="checkout-note-group">
                  <label for="checkout-order-note">Ghi chú cho tiệm & bưu tá (tùy chọn)</label>
                  <textarea id="checkout-order-note" rows="2" placeholder="Ví dụ: Giao giờ hành chính, gọi điện trước khi giao 15 phút, sách cổ đóng bọc cẩn thận...">${escapeHtml(orderNote)}</textarea>
                </div>
              </section>

              <!-- SECTION 2: PHƯƠNG THỨC VẬN CHUYỂN & BẢO QUẢN -->
              <section class="checkout-card" id="checkout-shipping-section">
                <div class="checkout-card__head">
                  <div class="checkout-card__title-wrap">
                    <span class="checkout-card__badge">2</span>
                    <div>
                      <h2>Hình thức vận chuyển & bảo tồn</h2>
                      <p>Tiệm cam kết quy chuẩn khử ẩm và chèn đệm giảm sốc cho từng ấn bản.</p>
                    </div>
                  </div>
                </div>

                <div class="checkout-shipping-options">
                  <label class="checkout-option-card checkout-shipping-card ${shippingMethod === 'standard' ? 'is-selected' : ''}">
                    <input type="radio" name="shippingMethod" value="standard" ${shippingMethod === 'standard' ? 'checked' : ''} class="checkout-radio">
                    <div class="checkout-option-card__content">
                      <div class="checkout-shipping-head">
                        <div class="checkout-shipping-title">
                          <span class="material-symbols-outlined" aria-hidden="true">local_shipping</span>
                          <strong>Giao hàng tiêu chuẩn (Tiệm sách bảo trợ)</strong>
                        </div>
                        <span class="checkout-shipping-price cart-text-green">Miễn phí</span>
                      </div>
                      <p class="checkout-shipping-desc">Giao trong 2 – 3 ngày làm việc (Nội ô Vĩnh Long trong 24h). Hộp carton 3 lớp, bọc màng chống ẩm chuyên dụng.</p>
                    </div>
                  </label>

                  <label class="checkout-option-card checkout-shipping-card ${shippingMethod === 'express' ? 'is-selected' : ''}">
                    <input type="radio" name="shippingMethod" value="express" ${shippingMethod === 'express' ? 'checked' : ''} class="checkout-radio">
                    <div class="checkout-option-card__content">
                      <div class="checkout-shipping-head">
                        <div class="checkout-shipping-title">
                          <span class="material-symbols-outlined" aria-hidden="true">bolt</span>
                          <strong>Giao hỏa tốc & Bảo tồn sách quý (24h)</strong>
                        </div>
                        <span class="checkout-shipping-price">+35.000₫</span>
                      </div>
                      <p class="checkout-shipping-desc">Giao nhanh trong 24h bằng đường bay hoặc xe chuyên dụng. Hộp cứng khử acid Archival Box nắp nam châm, đệm mút chống móp góc, niêm phong sáp đỏ.</p>
                    </div>
                  </label>
                </div>
              </section>

              <!-- SECTION 3: PHƯƠNG THỨC THANH TOÁN THỰC TẾ -->
              <section class="checkout-card" id="checkout-payment-section">
                <div class="checkout-card__head">
                  <div class="checkout-card__title-wrap">
                    <span class="checkout-card__badge">3</span>
                    <div>
                      <h2>Lựa chọn hình thức thanh toán</h2>
                      <p>Chọn hình thức thanh toán thuận tiện nhất với bạn.</p>
                    </div>
                  </div>
                </div>

                <div class="checkout-payment-options">

                  <!-- 1. COD -->
                  <div class="checkout-payment-item ${paymentMethod === 'cod' ? 'is-active' : ''}">
                    <label class="checkout-option-card">
                      <input type="radio" name="paymentMethod" value="cod" ${paymentMethod === 'cod' ? 'checked' : ''} class="checkout-radio">
                      <div class="checkout-option-card__content">
                        <div class="checkout-payment-header">
                          <div class="checkout-payment-title">
                            <span class="material-symbols-outlined" aria-hidden="true">payments</span>
                            <strong>Thanh toán tiền mặt khi nhận hàng (COD)</strong>
                          </div>
                          <span class="checkout-badge-pill">Phổ biến</span>
                        </div>
                        <p class="checkout-payment-desc">Bưu tá giao sách tận nơi. Quý khách được mở hộp đồng kiểm tra tình trạng sách thật 100% trước khi thanh toán tiền mặt.</p>
                      </div>
                    </label>

                    ${paymentMethod === 'cod' ? `
                      <div class="checkout-payment-subbox">
                        <div class="checkout-alert checkout-alert--info">
                          <span class="material-symbols-outlined" aria-hidden="true">verified_user</span>
                          <span>Chính sách đồng kiểm: Bạn có quyền mở hộp kiểm tra đúng ấn bản, đúng năm xuất bản và tình trạng bảo quản trước khi gửi tiền cho nhân viên bưu tá.</span>
                        </div>
                      </div>
                    ` : ''}
                  </div>

                  <!-- 2. VIETQR / CHUYỂN KHOẢN NGÂN HÀNG -->
                  <div class="checkout-payment-item ${paymentMethod === 'banking' ? 'is-active' : ''}">
                    <label class="checkout-option-card">
                      <input type="radio" name="paymentMethod" value="banking" ${paymentMethod === 'banking' ? 'checked' : ''} class="checkout-radio">
                      <div class="checkout-option-card__content">
                        <div class="checkout-payment-header">
                          <div class="checkout-payment-title">
                            <span class="material-symbols-outlined" aria-hidden="true">qr_code_2</span>
                            <strong>Chuyển khoản ngân hàng qua mã VietQR</strong>
                          </div>
                          <span class="checkout-badge-pill checkout-badge-pill--green">Khuyên dùng · Xử lý ngay</span>
                        </div>
                        <p class="checkout-payment-desc">Quét mã QR qua ứng dụng mọi ngân hàng (Vietcombank, Techcombank, MB, BIDV...). Đơn hàng được tự động xác nhận trong 1–2 phút.</p>
                      </div>
                    </label>

                    ${paymentMethod === 'banking' ? `
                      <div class="checkout-payment-subbox checkout-vietqr-preview">
                        <div class="vietqr-preview-card">
                          <div class="vietqr-preview-badge">Tài khoản chính thức của Tiệm sách</div>
                          <div class="vietqr-preview-row">
                            <span>Ngân hàng thụ hưởng:</span>
                            <strong>Vietcombank (VCB) · CN Vĩnh Long</strong>
                          </div>
                          <div class="vietqr-preview-row">
                            <span>Số tài khoản:</span>
                            <strong class="vietqr-acc-highlight">1029 3847 56</strong>
                          </div>
                          <div class="vietqr-preview-row">
                            <span>Chủ tài khoản:</span>
                            <strong>TIEM SACH THE PAGE TURNER</strong>
                          </div>
                          <div class="vietqr-preview-note">
                            <span class="material-symbols-outlined" aria-hidden="true">info</span>
                            <span>Mã VietQR động chứa chính xác số tiền <strong>${formatVnd(finalTotal)}</strong> và cú pháp đơn hàng sẽ được hiển thị ngay sau khi bạn bấm Xác nhận đặt hàng.</span>
                          </div>
                        </div>
                      </div>
                    ` : ''}
                  </div>

                  <!-- 3. THẺ TÍN DỤNG / GHI NỢ QUỐC TẾ -->
                  <div class="checkout-payment-item ${paymentMethod === 'card' ? 'is-active' : ''}">
                    <label class="checkout-option-card">
                      <input type="radio" name="paymentMethod" value="card" ${paymentMethod === 'card' ? 'checked' : ''} class="checkout-radio">
                      <div class="checkout-option-card__content">
                        <div class="checkout-payment-header">
                          <div class="checkout-payment-title">
                            <span class="material-symbols-outlined" aria-hidden="true">credit_card</span>
                            <strong>Thẻ thanh toán quốc tế (Visa, MasterCard, JCB)</strong>
                          </div>
                          <span class="checkout-badge-pill">Bảo mật PCI-DSS</span>
                        </div>
                        <p class="checkout-payment-desc">Mã hóa chuẩn quốc tế SSL 256-bit. Chấp nhận tất cả thẻ ghi nợ và thẻ tín dụng phát hành trong nước và quốc tế.</p>
                      </div>
                    </label>

                    ${paymentMethod === 'card' ? `
                      <div class="checkout-payment-subbox checkout-card-form">
                        <div class="checkout-form-group">
                          <label for="card-number">Số thẻ <span class="req">*</span></label>
                          <div class="checkout-input-with-icon">
                            <span class="material-symbols-outlined" aria-hidden="true">credit_card</span>
                            <input type="text" id="card-number" placeholder="4123 4567 8901 2345" maxlength="19" value="${escapeHtml(cardData.number)}">
                          </div>
                        </div>

                        <div class="checkout-form-group">
                          <label for="card-holder-name">Tên chủ thẻ (In trên mặt thẻ) <span class="req">*</span></label>
                          <input type="text" id="card-holder-name" placeholder="NGUYEN HOANG HAI" value="${escapeHtml(cardData.name)}" style="text-transform:uppercase">
                        </div>

                        <div class="checkout-form-row">
                          <div class="checkout-form-group">
                            <label for="card-expiry">Hạn dùng (MM/YY) <span class="req">*</span></label>
                            <input type="text" id="card-expiry" placeholder="12/28" maxlength="5" value="${escapeHtml(cardData.expiry)}">
                          </div>
                          <div class="checkout-form-group">
                            <label for="card-cvv">Mã bảo mật CVV/CVC <span class="req">*</span></label>
                            <input type="password" id="card-cvv" placeholder="•••" maxlength="4" value="${escapeHtml(cardData.cvv)}">
                          </div>
                        </div>
                      </div>
                    ` : ''}
                  </div>

                  <!-- 4. VÍ ĐIỆN TỬ -->
                  <div class="checkout-payment-item ${paymentMethod === 'ewallet' ? 'is-active' : ''}">
                    <label class="checkout-option-card">
                      <input type="radio" name="paymentMethod" value="ewallet" ${paymentMethod === 'ewallet' ? 'checked' : ''} class="checkout-radio">
                      <div class="checkout-option-card__content">
                        <div class="checkout-payment-header">
                          <div class="checkout-payment-title">
                            <span class="material-symbols-outlined" aria-hidden="true">account_balance_wallet</span>
                            <strong>Ví điện tử (MoMo / ZaloPay)</strong>
                          </div>
                          <span class="checkout-badge-pill">Thanh toán 1 chạm</span>
                        </div>
                        <p class="checkout-payment-desc">Mở ứng dụng ví điện tử trên điện thoại quét mã thanh toán an toàn, tiện lợi.</p>
                      </div>
                    </label>

                    ${paymentMethod === 'ewallet' ? `
                      <div class="checkout-payment-subbox checkout-wallet-selection">
                        <div class="wallet-options-row">
                          <label class="wallet-option ${selectedWallet === 'momo' ? 'is-selected' : ''}">
                            <input type="radio" name="subWallet" value="momo" ${selectedWallet === 'momo' ? 'checked' : ''}>
                            <strong>Ví MoMo</strong>
                            <small>Quét mã thanh toán MoMo</small>
                          </label>
                          <label class="wallet-option ${selectedWallet === 'zalopay' ? 'is-selected' : ''}">
                            <input type="radio" name="subWallet" value="zalopay" ${selectedWallet === 'zalopay' ? 'checked' : ''}>
                            <strong>Ví ZaloPay</strong>
                            <small>Liên kết ZaloPay tiện lợi</small>
                          </label>
                        </div>
                      </div>
                    ` : ''}
                  </div>

                </div>
              </section>

            </div>

            <!-- ASIDE: TÓM TẮT ĐƠN HÀNG THANH TOÁN -->
            <aside class="cart-aside-col checkout-summary-col">
              <div class="cart-summary-card checkout-summary-card">
                <h2>Chi tiết thanh toán</h2>

                <!-- Danh sách sách tóm tắt -->
                <div class="checkout-mini-items">
                  <div class="checkout-mini-items__title">Sản phẩm (${totalQuantity} cuốn):</div>
                  <ul class="checkout-mini-list">
                    ${detailedItems.map((item) => `
                      <li class="checkout-mini-item">
                        <span class="checkout-mini-item__name">${escapeHtml(item.book.title)} <small>x${item.quantity}</small></span>
                        <strong class="checkout-mini-item__price">${formatVnd(item.itemTotal)}</strong>
                      </li>
                    `).join('')}
                  </ul>
                </div>

                <div class="cart-summary-rows">
                  <div class="cart-summary-row">
                    <span>Tiền sách (${totalQuantity} cuốn)</span>
                    <strong>${formatVnd(subtotal)}</strong>
                  </div>

                  <div class="cart-summary-row">
                    <span>Phí vận chuyển</span>
                    <strong>${shippingFee === 0 ? '<span class="cart-text-green">Miễn phí</span>' : formatVnd(shippingFee)}</strong>
                  </div>

                  <div class="cart-summary-row">
                    <span>Đóng gói khử acid</span>
                    <strong class="cart-text-green">Miễn phí</strong>
                  </div>

                  ${appliedDiscount > 0 ? `
                    <div class="cart-summary-row cart-summary-row--discount">
                      <span>Mã giảm giá (${escapeHtml(discountCode)})</span>
                      <strong>-${formatVnd(appliedDiscount)}</strong>
                    </div>
                  ` : ''}
                </div>

                <div class="cart-total-row">
                  <div>
                    <span class="cart-total-label">Tổng thanh toán:</span>
                    <small class="cart-vat-note">(Đã bao gồm VAT & bao bì bảo tồn)</small>
                  </div>
                  <strong class="cart-total-amount">${formatVnd(finalTotal)}</strong>
                </div>

                <div class="cart-checkout-actions">
                  <button type="button" class="pt-button pt-button--primary cart-checkout-btn" data-confirm-order-btn>
                    <span class="material-symbols-outlined" aria-hidden="true">check_circle</span>
                    <span>Xác nhận đặt hàng</span>
                  </button>
                </div>

                <div class="checkout-guarantees">
                  <div class="cart-reassurance-item">
                    <span class="material-symbols-outlined" aria-hidden="true">verified</span>
                    <span>Cam kết 100% sách thật, mô tả đúng tình trạng.</span>
                  </div>
                  <div class="cart-reassurance-item">
                    <span class="material-symbols-outlined" aria-hidden="true">assignment_return</span>
                    <span>Đổi trả miễn phí trong 7 ngày nếu không đúng mô tả.</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    `;

    bindCheckoutEvents();
  };

  // STEP 3: ORDER SUCCESS RECEIPT & PAYMENT CONFIRMATION
  const renderSuccessView = (order) => {
    const isBanking = order.paymentMethod === 'banking';
    const isCod = order.paymentMethod === 'cod';
    const isCard = order.paymentMethod === 'card';
    const isWallet = order.paymentMethod === 'ewallet';

    // Simulated VietQR code URL via standard VietQR image API
    const vietQrUrl = `https://img.vietqr.io/image/VCB-1029384756-compact2.png?amount=${order.total}&addInfo=${encodeURIComponent(order.id)}&accountName=TIEM%20SACH%20THE%20PAGE%20TURNER`;

    root.innerHTML = `
      <div class="cart-page pt-main checkout-success-page">
        <div class="pt-container--wide">
          ${renderBreadcrumb(["Trang chủ", "Giỏ hàng", "Đặt hàng thành công"])}

          <div class="checkout-stepper">
            <div class="checkout-step is-complete">
              <span class="checkout-step__num"><span class="material-symbols-outlined" style="font-size:16px" aria-hidden="true">check</span></span>
              <span class="checkout-step__label">Giỏ hàng</span>
            </div>
            <div class="checkout-step__line is-active"></div>
            <div class="checkout-step is-complete">
              <span class="checkout-step__num"><span class="material-symbols-outlined" style="font-size:16px" aria-hidden="true">check</span></span>
              <span class="checkout-step__label">Đặt hàng & Thanh toán</span>
            </div>
            <div class="checkout-step__line is-active"></div>
            <div class="checkout-step is-active">
              <span class="checkout-step__num">3</span>
              <span class="checkout-step__label">Hoàn tất</span>
            </div>
          </div>

          <div class="order-success-hero">
            <div class="order-success-hero__icon">
              <span class="material-symbols-outlined" aria-hidden="true">check_circle</span>
            </div>
            <h1>Đặt hàng thành công!</h1>
            <p class="order-success-hero__msg">
              Cảm ơn bạn đã lựa chọn trao gửi niềm tin tại <strong>The Page Turner</strong>.<br>
              Mã đơn hàng của bạn là <strong>#${escapeHtml(order.id)}</strong>. Kiện hàng đang được chuyển sang quy trình khử acid và đóng gói bảo tồn.
            </p>
          </div>

          <!-- PHẦN HƯỚNG DẪN THANH TOÁN THEO HÌNH THỨC -->
          ${isBanking ? `
            <section class="order-payment-box order-payment-box--banking">
              <div class="order-payment-box__header">
                <span class="material-symbols-outlined" aria-hidden="true">qr_code_2</span>
                <div>
                  <h2>Hướng dẫn chuyển khoản VietQR</h2>
                  <p>Quét mã VietQR dưới đây để thanh toán tự động, hoặc chuyển khoản theo thông tin tài khoản bên dưới.</p>
                </div>
              </div>

              <div class="vietqr-display-grid">
                <div class="vietqr-code-wrapper">
                  <img src="${vietQrUrl}" alt="Mã VietQR thanh toán cho đơn hàng ${escapeHtml(order.id)}" class="vietqr-image" onerror="this.src='./media/vietqr_fallback.png'">
                  <span class="vietqr-scan-hint">Mở app Ngân hàng để quét mã QR</span>
                </div>

                <div class="vietqr-details-table">
                  <div class="vietqr-detail-row">
                    <span class="vqr-label">Ngân hàng:</span>
                    <div class="vqr-val-group">
                      <strong>Vietcombank (VCB) — CN Vĩnh Long</strong>
                    </div>
                  </div>

                  <div class="vietqr-detail-row">
                    <span class="vqr-label">Số tài khoản:</span>
                    <div class="vqr-val-group">
                      <strong class="vqr-highlight">1029 3847 56</strong>
                      <button type="button" class="pt-button pt-button--secondary pt-button--small copy-btn" data-copy="1029384756">
                        <span class="material-symbols-outlined" aria-hidden="true">content_copy</span>
                        Sao chép
                      </button>
                    </div>
                  </div>

                  <div class="vietqr-detail-row">
                    <span class="vqr-label">Chủ tài khoản:</span>
                    <div class="vqr-val-group">
                      <strong>TIEM SACH THE PAGE TURNER</strong>
                    </div>
                  </div>

                  <div class="vietqr-detail-row">
                    <span class="vqr-label">Số tiền:</span>
                    <div class="vqr-val-group">
                      <strong class="vqr-amount-text">${formatVnd(order.total)}</strong>
                      <button type="button" class="pt-button pt-button--secondary pt-button--small copy-btn" data-copy="${order.total}">
                        <span class="material-symbols-outlined" aria-hidden="true">content_copy</span>
                        Sao chép
                      </button>
                    </div>
                  </div>

                  <div class="vietqr-detail-row">
                    <span class="vqr-label">Nội dung chuyển khoản:</span>
                    <div class="vqr-val-group">
                      <strong class="vqr-memo-text">${escapeHtml(order.id)}</strong>
                      <button type="button" class="pt-button pt-button--secondary pt-button--small copy-btn" data-copy="${escapeHtml(order.id)}">
                        <span class="material-symbols-outlined" aria-hidden="true">content_copy</span>
                        Sao chép
                      </button>
                    </div>
                  </div>

                  <div class="vietqr-instruction-alert">
                    <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                    <span>Đơn hàng được hệ thống tự động kiểm tra và xác nhận chuyển sang trạng thái <strong>Đang đóng gói</strong> ngay khi tài khoản nhận được số tiền trên (thường mất 30s – 2 phút).</span>
                  </div>
                </div>
              </div>
            </section>
          ` : ''}

          ${isCod ? `
            <section class="order-payment-box order-payment-box--cod">
              <div class="order-payment-box__header">
                <span class="material-symbols-outlined" aria-hidden="true">payments</span>
                <div>
                  <h2>Hình thức: Thanh toán khi nhận hàng (COD)</h2>
                  <p>Số tiền cần chuẩn bị thanh toán khi bưu tá giao hàng: <strong>${formatVnd(order.total)}</strong></p>
                </div>
              </div>
              <div class="order-cod-instructions">
                <p>Nhân viên bưu tá sẽ liên hệ với bạn qua số điện thoại <strong>${escapeHtml(order.recipientPhone)}</strong> trước khi giao. Bạn vui lòng giữ máy để quá trình bàn giao sách diễn ra thuận lợi.</p>
                <div class="order-cod-reminder">
                  <span class="material-symbols-outlined" aria-hidden="true">check_circle</span>
                  <span>Được đồng kiểm tra hàng trước khi thanh toán. Nếu tình trạng sách có bất kỳ điểm nào không như mô tả, quý khách có quyền từ chối nhận hàng không mất phí.</span>
                </div>
              </div>
            </section>
          ` : ''}

          ${isCard ? `
            <section class="order-payment-box order-payment-box--card">
              <div class="order-payment-box__header">
                <span class="material-symbols-outlined" aria-hidden="true">credit_card</span>
                <div>
                  <h2>Thanh toán qua thẻ quốc tế đã được ủy quyền thành công</h2>
                  <p>Giao dịch: <strong>${formatVnd(order.total)}</strong> · ${escapeHtml(order.paymentLabel)}</p>
                </div>
              </div>
              <p>Thẻ của bạn đã được trừ tiền thành công qua cổng thanh toán bảo mật. Hóa đơn điện tử đã được khởi tạo.</p>
            </section>
          ` : ''}

          ${isWallet ? `
            <section class="order-payment-box order-payment-box--wallet">
              <div class="order-payment-box__header">
                <span class="material-symbols-outlined" aria-hidden="true">account_balance_wallet</span>
                <div>
                  <h2>Thanh toán qua ví điện tử thành công</h2>
                  <p>Giao dịch: <strong>${formatVnd(order.total)}</strong> · ${escapeHtml(order.paymentLabel)}</p>
                </div>
              </div>
              <p>Khoản thanh toán đã được ghi nhận vào hệ thống. Đơn hàng đang được chuẩn bị để đóng gói.</p>
            </section>
          ` : ''}

          <!-- BIÊN LAI CHI TIẾT ĐƠN HÀNG -->
          <div class="order-receipt-card">
            <div class="order-receipt-card__header">
              <div>
                <h2>Biên lai đặt hàng #${escapeHtml(order.id)}</h2>
                <span class="order-receipt-date">Ngày đặt: ${order.placedTime || order.placedAt}</span>
              </div>
              <div class="order-receipt-status">
                <span class="pt-badge pt-badge--active">Đã tiếp nhận</span>
              </div>
            </div>

            <div class="order-receipt-meta-grid">
              <div class="order-receipt-meta-col">
                <h3>Thông tin người nhận</h3>
                <p><strong>${escapeHtml(order.recipientName)}</strong></p>
                <p>${escapeHtml(order.recipientPhone)}</p>
                <p>${escapeHtml(order.shippingAddress)}</p>
                ${order.note ? `<p class="order-receipt-note"><em>Ghi chú: ${escapeHtml(order.note)}</em></p>` : ''}
              </div>

              <div class="order-receipt-meta-col">
                <h3>Vận chuyển & Thanh toán</h3>
                <p><strong>Hình thức:</strong> ${escapeHtml(order.shippingMethodLabel || 'Giao tiêu chuẩn')}</p>
                <p><strong>Dự kiến nhận:</strong> ${escapeHtml(order.eta)}</p>
                <p><strong>Thanh toán:</strong> ${escapeHtml(order.paymentLabel)}</p>
                <p><strong>Mã vận đơn:</strong> ${escapeHtml(order.trackingCode)}</p>
              </div>
            </div>

            <div class="order-receipt-items-table">
              <h3>Danh mục ấn bản (${order.items.length} đầu sách)</h3>
              <div class="order-receipt-items-list">
                ${order.items.map((item) => `
                  <div class="order-receipt-item-row">
                    <div class="order-receipt-item-info">
                      <strong>${escapeHtml(item.title || 'Ấn bản sưu tầm')}</strong>
                      ${item.author ? `<small>${escapeHtml(item.author)}</small>` : ''}
                      <span class="order-receipt-item-pkg">${escapeHtml(item.packaging)}</span>
                    </div>
                    <div class="order-receipt-item-qty">x${item.quantity}</div>
                    <div class="order-receipt-item-price">${formatVnd(item.price * item.quantity)}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="order-receipt-pricing">
              <div class="order-receipt-price-row">
                <span>Tiền sách:</span>
                <span>${formatVnd(order.subtotal || order.total)}</span>
              </div>
              <div class="order-receipt-price-row">
                <span>Phí vận chuyển:</span>
                <span>${order.shippingCost ? formatVnd(order.shippingCost) : 'Miễn phí'}</span>
              </div>
              ${order.discountAmount ? `
                <div class="order-receipt-price-row cart-text-green">
                  <span>Mã ưu đãi:</span>
                  <span>-${formatVnd(order.discountAmount)}</span>
                </div>
              ` : ''}
              <div class="order-receipt-total-row">
                <strong>Tổng thanh toán:</strong>
                <strong>${formatVnd(order.total)}</strong>
              </div>
            </div>

            <div class="order-receipt-actions">
              <a class="pt-button pt-button--primary" href="#don-hang">
                <span class="material-symbols-outlined" aria-hidden="true">receipt_long</span>
                Xem đơn hàng của tôi
              </a>
              <button type="button" class="pt-button pt-button--secondary" onclick="window.print()">
                <span class="material-symbols-outlined" aria-hidden="true">print</span>
                In biên lai đơn hàng
              </button>
              <a class="pt-button pt-button--ghost" href="#danh-muc">
                Tiếp tục tìm sách
              </a>
            </div>
          </div>

        </div>
      </div>
    `;

    // Bind copy buttons
    root.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const textToCopy = btn.dataset.copy;
        if (textToCopy && navigator.clipboard) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Đã sao chép: ' + textToCopy);
          }).catch(() => {
            showToast('Đã chọn: ' + textToCopy);
          });
        } else {
          showToast('Đã chọn: ' + textToCopy);
        }
      });
    });
  };

  // CART STEP EVENTS
  const bindCartEvents = () => {
    // Quantity decrement
    root.querySelectorAll('[data-qty-dec]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.qtyDec;
        const input = root.querySelector(`[data-qty-field="${id}"]`);
        if (input) {
          const current = Math.max(1, parseInt(input.value, 10) || 1);
          if (current > 1) {
            updateCartQuantity(id, current - 1);
            render();
          }
        }
      });
    });

    // Quantity increment
    root.querySelectorAll('[data-qty-inc]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.qtyInc;
        const input = root.querySelector(`[data-qty-field="${id}"]`);
        if (input) {
          const current = Math.max(1, parseInt(input.value, 10) || 1);
          updateCartQuantity(id, current + 1);
          render();
        }
      });
    });

    // Manual quantity input change
    root.querySelectorAll('[data-qty-field]').forEach((input) => {
      input.addEventListener('change', () => {
        const id = input.dataset.qtyField;
        const val = parseInt(input.value, 10);
        if (isNaN(val) || val < 1) {
          updateCartQuantity(id, 1);
        } else {
          updateCartQuantity(id, val);
        }
        render();
      });
    });

    // Delete single item
    root.querySelectorAll('[data-cart-del]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.cartDel;
        const book = books.find((b) => b.id === id);
        const title = book ? `"${book.title}"` : "sách";
        removeFromCart(id);
        render();
        showToast(`Đã xóa ${title} khỏi giỏ hàng.`);
      });
    });

    // Clear all
    root.querySelector('[data-cart-clear-all]')?.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn làm trống toàn bộ giỏ hàng?')) {
        clearCart();
        render();
        showToast('Đã làm trống toàn bộ giỏ hàng.');
      }
    });

    // Coupon apply
    root.querySelector('[data-apply-coupon]')?.addEventListener('click', () => {
      const input = root.querySelector('#cart-voucher-input');
      const code = (input?.value || '').trim().toUpperCase();
      if (!code) {
        showToast('Vui lòng nhập mã ưu đãi.');
        return;
      }
      if (code === 'READAGAIN') {
        appliedDiscount = 30000;
        discountCode = 'READAGAIN';
        showToast('Áp dụng mã READAGAIN thành công: Giảm 30.000₫!');
        render();
      } else {
        showToast('Mã ưu đãi không hợp lệ hoặc đã hết hạn.');
      }
    });

    // Go to checkout step
    root.querySelector('[data-go-to-checkout]')?.addEventListener('click', () => {
      viewStep = 'checkout';
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  // CHECKOUT STEP EVENTS
  const bindCheckoutEvents = () => {
    // Return to cart
    root.querySelectorAll('[data-step-cart]').forEach((el) => {
      el.addEventListener('click', () => {
        viewStep = 'cart';
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Address selection radio
    root.querySelectorAll('input[name="deliveryAddress"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        selectedAddressType = radio.value;
        const newBox = root.querySelector('#new-address-box');
        if (newBox) {
          if (selectedAddressType === 'new') {
            newBox.classList.remove('is-hidden');
            newBox.classList.add('is-visible');
          } else {
            newBox.classList.add('is-hidden');
            newBox.classList.remove('is-visible');
          }
        }
        // Update selection highlight
        root.querySelectorAll('.checkout-address-list .checkout-option-card').forEach((card) => {
          const r = card.querySelector('input[type="radio"]');
          card.classList.toggle('is-selected', r && r.checked);
        });
      });
    });

    // New address fields inputs
    root.querySelector('#new-recipient-name')?.addEventListener('input', (e) => {
      newAddressData.name = e.target.value;
    });
    root.querySelector('#new-recipient-phone')?.addEventListener('input', (e) => {
      newAddressData.phone = e.target.value;
    });
    root.querySelector('#new-recipient-address')?.addEventListener('input', (e) => {
      newAddressData.address = e.target.value;
    });

    // Province dropdown change -> update districts
    const provSelect = root.querySelector('#new-recipient-province');
    if (provSelect) {
      provSelect.addEventListener('change', (e) => {
        newAddressData.province = e.target.value;
        const dists = getDistrictsByProvince(newAddressData.province) || [];
        newAddressData.district = dists[0] || '';
        const distSelect = root.querySelector('#new-recipient-district');
        if (distSelect) {
          distSelect.innerHTML = dists.map((d) => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');
        }
      });
    }

    const distSelect = root.querySelector('#new-recipient-district');
    if (distSelect) {
      distSelect.addEventListener('change', (e) => {
        newAddressData.district = e.target.value;
      });
    }

    // Order note
    root.querySelector('#checkout-order-note')?.addEventListener('input', (e) => {
      orderNote = e.target.value;
    });

    // Shipping method change
    root.querySelectorAll('input[name="shippingMethod"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        shippingMethod = radio.value;
        render();
      });
    });

    // Payment method change
    root.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        paymentMethod = radio.value;
        render();
      });
    });

    // Sub-wallet radio
    root.querySelectorAll('input[name="subWallet"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        selectedWallet = radio.value;
      });
    });

    // Card inputs
    const cardNum = root.querySelector('#card-number');
    if (cardNum) {
      cardNum.addEventListener('input', (e) => {
        // Auto format 4-digit groups
        let val = e.target.value.replace(/\D/g, '').slice(0, 16);
        val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = val;
        cardData.number = val;
      });
    }

    const cardHolder = root.querySelector('#card-holder-name');
    if (cardHolder) {
      cardHolder.addEventListener('input', (e) => {
        cardData.name = e.target.value.toUpperCase();
      });
    }

    const cardExp = root.querySelector('#card-expiry');
    if (cardExp) {
      cardExp.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (val.length >= 3) {
          val = val.slice(0, 2) + '/' + val.slice(2);
        }
        e.target.value = val;
        cardData.expiry = val;
      });
    }

    const cardCvv = root.querySelector('#card-cvv');
    if (cardCvv) {
      cardCvv.addEventListener('input', (e) => {
        cardData.cvv = e.target.value.replace(/\D/g, '').slice(0, 4);
      });
    }

    // Confirm order placement
    root.querySelector('[data-confirm-order-btn]')?.addEventListener('click', () => {
      // Validate address
      let finalName = '';
      let finalPhone = '';
      let finalAddress = '';

      if (selectedAddressType === 'new') {
        if (!newAddressData.name.trim()) {
          showToast('Vui lòng nhập họ tên người nhận.');
          root.querySelector('#new-recipient-name')?.focus();
          return;
        }
        if (!newAddressData.phone.trim() || newAddressData.phone.trim().length < 8) {
          showToast('Vui lòng nhập số điện thoại người nhận hợp lệ.');
          root.querySelector('#new-recipient-phone')?.focus();
          return;
        }
        if (!newAddressData.address.trim()) {
          showToast('Vui lòng nhập địa chỉ cụ thể.');
          root.querySelector('#new-recipient-address')?.focus();
          return;
        }
        finalName = newAddressData.name.trim();
        finalPhone = newAddressData.phone.trim();
        finalAddress = `${newAddressData.address.trim()}, ${newAddressData.district}, ${newAddressData.province}`;
      } else {
        const addr = (getState().addresses || []).find((a) => a.id === selectedAddressType) || getState().addresses?.[0];
        if (addr) {
          finalName = addr.name;
          finalPhone = addr.phone;
          finalAddress = `${addr.address}, ${addr.district}, ${addr.province}`;
        } else {
          finalName = state.account?.name || 'Nguyễn Hoàng Hải';
          finalPhone = state.account?.phone || '0912 845 678';
          finalAddress = 'Số 12 Trưng Nữ Vương, Phường 1, TP. Vĩnh Long';
        }
      }

      // Validate card if card method
      if (paymentMethod === 'card') {
        const rawNum = (cardData.number || '').replace(/\s/g, '');
        if (rawNum.length < 12) {
          showToast('Vui lòng nhập đủ 16 số trên thẻ thanh toán.');
          root.querySelector('#card-number')?.focus();
          return;
        }
        if (!cardData.name.trim()) {
          showToast('Vui lòng nhập tên chủ thẻ.');
          root.querySelector('#card-holder-name')?.focus();
          return;
        }
        if (!cardData.expiry || cardData.expiry.length < 4) {
          showToast('Vui lòng nhập ngày hết hạn MM/YY trên thẻ.');
          root.querySelector('#card-expiry')?.focus();
          return;
        }
      }

      const shippingCost = shippingMethod === 'express' ? 35000 : 0;
      const paymentDetails = {};
      if (paymentMethod === 'card') {
        const rawNum = cardData.number.replace(/\s/g, '');
        paymentDetails.last4 = rawNum.slice(-4) || '8888';
        paymentDetails.cardType = rawNum.startsWith('4') ? 'Visa' : (rawNum.startsWith('5') ? 'MasterCard' : 'JCB');
      } else if (paymentMethod === 'ewallet') {
        paymentDetails.walletName = selectedWallet === 'momo' ? 'MoMo' : 'ZaloPay';
      }

      // Execute order creation
      const order = checkoutCart({
        recipientName: finalName,
        recipientPhone: finalPhone,
        shippingAddress: finalAddress,
        shippingMethod,
        shippingCost,
        paymentMethod,
        paymentDetails,
        note: orderNote,
        discountCode,
        discountAmount: appliedDiscount
      });

      if (order) {
        placedOrderData = order;
        viewStep = 'success';
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast(`Đặt hàng thành công đơn #${order.id}!`);
      } else {
        showToast('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
      }
    });
  };

  render();
}
