import { renderHeader, renderFooter, bindShellEvents } from "./components/shell.js";
import { mountAuth } from "./pages/auth.js";
import { mountCatalogLanding, mountCuratedCategory } from "./pages/category.js";
import { mountOrders } from "./pages/orders.js";
import { mountSupport } from "./pages/support.js";
import { mountConsignment } from "./pages/consignment.js";
import { mountWishlist } from "./pages/wishlist.js";
import { mountCart } from "./pages/cart.js";
import { mountSettings } from "./pages/settings.js";
import { mountHome, mountSearch, mountProduct } from "./pages/storefront.js";
import { initTheme } from "./utils/theme.js";

const categoryRoute = (title, category) => ({
  title,
  render: (root) => mountCuratedCategory(root, category),
});

const renderThemeSettings = (root) => {
  mountSettings(root);
  setTimeout(() => {
    document.getElementById("giao-dien")?.scrollIntoView({ behavior: "smooth" });
  }, 60);
};

const routes = {
  home: { title: "Trang chủ", render: mountHome },
  "danh-muc": { title: "Danh mục sách", render: mountCatalogLanding },
  "category-literature": categoryRoute("Văn học Việt Nam", "literature"),
  "van-hoc": categoryRoute("Văn học Việt Nam", "literature"),
  "kinh-te": categoryRoute("Kinh tế & Tài chính", "economics"),
  "tam-ly": categoryRoute("Tư duy & Tâm lý", "psychology"),
  "sach-hiem": categoryRoute("Sách hiếm", "rare"),
  "sach-giam-gia": categoryRoute("Sách giảm giá", "deals"),
  "tim-kiem": { title: "Tìm kiếm nâng cao", render: mountSearch },
  sach: { title: "Chi tiết sách", render: mountProduct },
  login: { title: "Đăng nhập", render: (root) => mountAuth(root, "login") },
  register: { title: "Đăng ký", render: (root) => mountAuth(root, "register") },
  recover: { title: "Khôi phục mật khẩu", render: (root) => mountAuth(root, "recover") },
  orders: { title: "Đơn hàng của tôi", render: mountOrders },
  "don-hang": { title: "Đơn hàng của tôi", render: mountOrders },
  cart: { title: "Giỏ hàng của bạn", render: mountCart },
  "gio-hang": { title: "Giỏ hàng của bạn", render: mountCart },
  support: { title: "Hỗ trợ & FAQ", render: mountSupport },
  "ho-tro": { title: "Hỗ trợ & FAQ", render: mountSupport },
  consignment: { title: "Ký gửi & Thu mua sách", render: mountConsignment },
  "ky-gui": { title: "Ký gửi & Thu mua sách", render: mountConsignment },
  wishlist: { title: "Danh sách yêu thích", render: mountWishlist },
  "yeu-thich": { title: "Danh sách yêu thích", render: mountWishlist },
  settings: { title: "Hồ sơ & Cài đặt", render: (root) => mountSettings(root, "thong-tin-ca-nhan") },
  "cai-dat": { title: "Hồ sơ & Cài đặt", render: (root) => mountSettings(root, "thong-tin-ca-nhan") },
  "thong-tin-ca-nhan": { title: "Thông tin cá nhân", render: (root) => mountSettings(root, "thong-tin-ca-nhan") },
  theme: { title: "Giao diện Sáng & Tối", render: (root) => mountSettings(root, "giao-dien") },
  "giao-dien": { title: "Giao diện Sáng & Tối", render: (root) => mountSettings(root, "giao-dien") },
  "bao-mat": { title: "Bảo mật & Đăng nhập", render: (root) => mountSettings(root, "bao-mat") },
  "dia-chi": { title: "Địa chỉ đã lưu", render: (root) => mountSettings(root, "dia-chi") },
  "thong-bao": { title: "Tùy chọn thông báo", render: (root) => mountSettings(root, "thong-bao") },
};

function currentRouteKey() {
  const path = window.location.hash.slice(1).split("?")[0].trim();

  if (path.startsWith("sach/")) return "sach";
  return Object.hasOwn(routes, path) ? path : "home";
}

function renderRoute() {
  const key = currentRouteKey();
  const route = routes[key];
  const header = document.getElementById("header");
  const app = document.getElementById("app");
  const footer = document.getElementById("footer");

  header.innerHTML = renderHeader(key === "category-literature" ? "van-hoc" : key);
  app.replaceChildren();
  route.render(app);
  footer.innerHTML = renderFooter();
  bindShellEvents();

  document.title = `${route.title} — The Page Turner`;
  window.scrollTo({ top: 0, behavior: "auto" });
}

window.addEventListener("hashchange", renderRoute);
window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderRoute();
});
