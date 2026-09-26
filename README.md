# The Page Turner — Tiệm Sách Cũ Việt Nam

> Nền tảng thương mại điện tử chuyên bán sách cũ, sách hiếm và sách second-hand tại Việt Nam. Được xây dựng thuần bằng HTML, CSS và Vanilla JavaScript — không framework, không build tool.

## Tính năng chính

- **Trang chủ** — Hero banner, danh mục, bộ sưu tập nổi bật và testimonials
- **Danh mục sách** — Tìm kiếm, lọc theo thể loại / tình trạng / giá; sắp xếp linh hoạt
- **Chi tiết sản phẩm** — Gallery ảnh, thông tin tình trạng, gợi ý liên quan
- **Giỏ hàng** — Thêm/xóa/cập nhật số lượng, tính phí vận chuyển
- **Thanh toán 3 bước** — Địa chỉ → Phương thức thanh toán → Xác nhận đơn
  - Hỗ trợ: COD, VietQR (tạo mã QR động), Thẻ quốc tế, Ví điện tử
- **Yêu thích** — Lưu sách yêu thích, lọc theo thể loại; đồng bộ qua `localStorage`
- **Đơn hàng** — Lịch sử đặt hàng, theo dõi trạng thái, xem chi tiết đơn
- **Hồ sơ / Cài đặt** — Quản lý thông tin cá nhân, địa chỉ giao hàng, thông báo, giao diện
- **Đăng ký / Đăng nhập** — Form xác thực, quên mật khẩu, trạng thái đăng nhập lưu qua state
- **Hỗ trợ & FAQ** — Tìm kiếm nhanh, gợi ý câu hỏi, liên hệ thủ thư
- **Ký gửi sách** — Form consignment để bán lại sách cũ
- **Dark mode** — Chuyển đổi giao diện sáng/tối; lưu preference
- **Responsive** — Tương thích đầy đủ trên smartphone, tablet và desktop

## Công nghệ

| Layer | Công nghệ |
|---|---|
| Markup | HTML5 (semantic) |
| Style | Vanilla CSS (CSS Variables, Grid, Flexbox) |
| Logic | Vanilla JavaScript (ES Modules) |
| Lưu trữ | `localStorage` (state, giỏ hàng, yêu thích) |
| Font | Google Fonts — Crimson Pro + DM Sans |
| Icons | Google Material Symbols |
| QR Payment | [img.vietqr.io](https://img.vietqr.io) API |

## Cấu trúc thư mục

```
bookstore/
├── index.html              # Entry point duy nhất (SPA)
├── css/
│   ├── style.css           # Import aggregator
│   ├── tokens.css          # Design tokens (màu sắc, typography, spacing)
│   ├── base.css            # CSS reset + utility classes
│   ├── theme.css           # Dark mode overrides
│   ├── responsive.css      # Mobile responsive overrides (480 / 640 / 768px)
│   ├── components/
│   │   ├── shell.css       # Header, Footer, Breadcrumb, Toast
│   │   ├── cards.css       # Book cards
│   │   └── controls.css    # Buttons, inputs, badges
│   └── pages/
│       ├── storefront.css  # Home, Search, Product detail
│       ├── cart.css        # Giỏ hàng + Checkout flow
│       ├── wishlist.css    # Danh sách yêu thích
│       ├── orders.css      # Lịch sử đơn hàng
│       ├── settings.css    # Hồ sơ & cài đặt
│       ├── auth.css        # Đăng nhập / Đăng ký
│       ├── support.css     # Hỗ trợ & FAQ
│       ├── catalog.css     # Danh mục sản phẩm
│       └── consignment.css # Ký gửi sách
├── js/
│   ├── app.js              # Router SPA chính
│   ├── data.js             # Dữ liệu mẫu (sách, tài khoản, đơn hàng)
│   ├── utils/
│   │   └── formatters.js   # Định dạng tiền tệ, ngày tháng, escape HTML
│   ├── state/
│   │   └── store.js        # State management (getState, dispatch, subscribe)
│   ├── components/
│   │   └── shell.js        # Header, Footer, Toast, Breadcrumb
│   └── pages/
│       ├── home.js         # Trang chủ
│       ├── catalog.js      # Danh mục / Tìm kiếm
│       ├── product.js      # Chi tiết sản phẩm
│       ├── cart.js         # Giỏ hàng + Checkout
│       ├── wishlist.js     # Yêu thích
│       ├── orders.js       # Đơn hàng
│       ├── settings.js     # Cài đặt / Hồ sơ
│       ├── auth.js         # Đăng nhập / Đăng ký
│       ├── support.js      # Hỗ trợ
│       └── consignment.js  # Ký gửi
└── README.md
```

## Chạy local

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .

# Sau đó mở trình duyệt tại:
# http://localhost:8000
```

> Không cần cài đặt gì thêm. Không có bước build.

## State Management

Toàn bộ state được quản lý qua `js/state/store.js`:

- **Persistence**: Tự động lưu/load từ `localStorage` với key `page-turner-state-v1`
- **Wishlist versioning**: `WISHLIST_VERSION = 2` — tự động reset data cũ khi upgrade
- **Reactive**: Các component subscribe vào store để cập nhật UI khi state thay đổi

```js
import { getState, dispatch, subscribe } from './state/store.js';

// Đọc state
const { cart, wishlist } = getState();

// Thay đổi state
dispatch({ type: 'ADD_TO_CART', payload: { bookId: 'abc', quantity: 1 } });

// Lắng nghe thay đổi
subscribe(() => { /* re-render */ });
```

## Routing

`app.js` implement một SPA router đơn giản dùng `history.pushState`:

```
/           → Trang chủ
/search     → Tìm kiếm / Danh mục
/book/:id   → Chi tiết sản phẩm
/cart       → Giỏ hàng & Checkout
/wishlist   → Yêu thích
/orders     → Đơn hàng
/settings   → Cài đặt
/auth       → Đăng nhập / Đăng ký
/support    → Hỗ trợ & FAQ
/consignment → Ký gửi sách
```

## Design System

Các CSS Variables được định nghĩa trong `css/tokens.css`:

| Token | Mô tả |
|---|---|
| `--pt-forest` | Màu chính (xanh rừng) |
| `--pt-amber` | Màu nhấn (vàng hổ phách) |
| `--pt-ink` | Màu chữ chính |
| `--pt-muted` | Màu chữ phụ |
| `--pt-surface` | Nền trang |
| `--pt-paper` | Nền card |
| `--pt-line` | Đường kẻ / border |

## Tác giả

Được xây dựng như một dự án học tập về frontend development thuần — không phụ thuộc vào framework hay thư viện bên ngoài.

---

*The Page Turner — Mỗi cuốn sách đều xứng đáng có một ngôi nhà mới.*