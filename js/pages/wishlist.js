import { books } from "../data.js";
import { renderBreadcrumb, showToast } from "../components/shell.js";
import { renderAccountContext, renderBookCard } from "../components/ui.js";
import { addToCart, getState, removeFromWishlist } from "../state/store.js";
import { escapeHtml } from "../utils/formatters.js";

const isRare = (book) => book.badges.some((badge) => /hiếm|ký|sưu tầm|bản in đầu/i.test(badge));
const normalize = (value) => String(value || "").toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");

function savedBooks() {
  const ids = getState().wishlist;
  return ids.map((id) => books.find((book) => book.id === id)).filter(Boolean);
}

function visibleBooks(filters) {
  let list = savedBooks();
  if (filters.kind === "rare") list = list.filter(isRare);
  if (filters.kind === "vietnamese-literature") list = list.filter((book) => book.category === "vietnamese-literature");
  if (filters.kind === "good-or-better") list = list.filter((book) => book.condition.percent >= 80);
  if (filters.query) {
    const query = normalize(filters.query);
    list = list.filter((book) => normalize(`${book.title} ${book.author} ${book.publisher}`).includes(query));
  }
  if (filters.sort === "price-low") list.sort((a, b) => a.price - b.price);
  else if (filters.sort === "condition") list.sort((a, b) => b.condition.percent - a.condition.percent);
  else list.reverse();
  return list;
}

function filterOptions(filters) {
  const saved = savedBooks();
  const choices = [
    ["all", `Tất cả (${saved.length})`],
    ["rare", `Bản hiếm (${saved.filter(isRare).length})`],
    ["vietnamese-literature", `Văn học (${saved.filter((book) => book.category === "vietnamese-literature").length})`],
    ["good-or-better", `Tốt trở lên (${saved.filter((book) => book.condition.percent >= 80).length})`],
  ];
  return choices.map(([id, label]) => `<button class="pt-chip ${filters.kind === id ? "is-active" : ""}" type="button" data-wishlist-filter="${id}" ${filters.kind === id ? 'aria-pressed="true"' : 'aria-pressed="false"'}>${label}</button>`).join("");
}

function resultsMarkup(filters) {
  const list = visibleBooks(filters);
  const empty = savedBooks().length
    ? `<div class="pt-empty wishlist-empty"><span class="material-symbols-outlined" style="font-size:42px;color:var(--pt-muted);margin-bottom:8px" aria-hidden="true">filter_list_off</span><h3>Chưa có cuốn phù hợp</h3><p>Thử một từ khóa khác hoặc xóa bộ lọc để xem lại sách đã lưu.</p><button class="pt-button pt-button--primary" type="button" data-wishlist-clear>Xóa bộ lọc</button></div>`
    : `<div class="pt-empty wishlist-empty"><span class="material-symbols-outlined" style="font-size:48px;color:var(--pt-muted);margin-bottom:8px" aria-hidden="true">favorite_border</span><h3>Danh sách yêu thích đang trống</h3><p>Bạn chưa lưu cuốn sách nào. Hãy khám phá kho sách và ấn vào biểu tượng trái tim để lưu lại những ấn bản bạn yêu thích.</p><div style="display:flex;gap:10px;justify-content:center;margin-top:16px"><a class="pt-button pt-button--primary" href="#danh-muc">Khám phá danh mục</a><a class="pt-button pt-button--secondary" href="#sach-hiem">Săn sách hiếm</a></div></div>`;
  return `<div class="wishlist-filter-row">${filterOptions(filters)}${filters.kind !== "all" || filters.query ? `<button class="wishlist-clear" type="button" data-wishlist-clear>Xóa bộ lọc</button>` : ""}</div><div class="wishlist-results"><span>Đang hiển thị <strong>${list.length}</strong> trong ${savedBooks().length} cuốn đã lưu</span><span class="desktop-only">Chọn một cuốn để xem tình trạng chi tiết</span></div>${list.length ? `<div class="wishlist-grid">${list.map((book) => renderBookCard(book, { saved: true })).join("")}</div>` : empty}`;
}

export function mountWishlist(root) {
  const filters = { kind: "all", query: "", sort: "recent" };
  const render = () => {
    const saved = savedBooks();
    root.innerHTML = `<div class="wishlist-page pt-main"><div class="pt-container--wide">${renderBreadcrumb(["Kệ sách cá nhân", "Danh sách yêu thích"])}<div class="wishlist-account">${renderAccountContext("wishlist")}</div><section class="wishlist-heading"><div><div class="page-eyebrow">Kệ sách cá nhân / đã lưu</div><h1>Danh sách yêu thích</h1><p>${saved.length} cuốn sách bạn đã lưu để quay lại khi muốn đọc thêm.</p></div><div class="wishlist-stats"><div class="wishlist-stat"><strong>${saved.length}</strong><span>cuốn đã lưu</span></div><div class="wishlist-stat wishlist-stat--rare"><strong>${saved.filter(isRare).length}</strong><span>bản đặc biệt</span></div></div></section><div class="wishlist-toolbar"><label class="wishlist-search"><span class="material-symbols-outlined" aria-hidden="true">search</span><input id="wishlist-search" type="search" value="${escapeHtml(filters.query)}" placeholder="Tìm trong sách đã lưu" aria-label="Tìm trong sách đã lưu"></label><label class="wishlist-sort-label" for="wishlist-sort">Sắp xếp</label><select class="pt-sort" id="wishlist-sort"><option value="recent" ${filters.sort === "recent" ? "selected" : ""}>Mới lưu nhất</option><option value="price-low" ${filters.sort === "price-low" ? "selected" : ""}>Giá thấp đến cao</option><option value="condition" ${filters.sort === "condition" ? "selected" : ""}>Tình trạng tốt nhất</option></select></div><div data-wishlist-results>${resultsMarkup(filters)}</div><section class="wishlist-banner"><div><h2>Không tìm thấy bản in bạn mong muốn?</h2><p>Gửi yêu cầu tìm sách để thủ thư hỗ trợ tìm một cuốn cụ thể.</p></div><div class="wishlist-banner__actions"><a class="pt-button pt-button--amber pt-button--small" href="#consignment">Gửi yêu cầu tìm sách</a><a class="pt-button pt-button--ghost pt-button--small" href="#support">Nhắn với thủ thư</a></div></section></div></div>`;
  };
  const refreshResults = () => {
    root.querySelector("[data-wishlist-results]").innerHTML = resultsMarkup(filters);
  };
  render();

  root.addEventListener("input", (event) => {
    if (event.target.id !== "wishlist-search") return;
    filters.query = event.target.value;
    refreshResults();
  });
  root.addEventListener("change", (event) => {
    if (event.target.id !== "wishlist-sort") return;
    filters.sort = event.target.value;
    refreshResults();
  });
  root.addEventListener("click", (event) => {
    const filter = event.target.closest("[data-wishlist-filter]");
    if (filter) {
      filters.kind = filter.dataset.wishlistFilter;
      refreshResults();
      return;
    }
    if (event.target.closest("[data-wishlist-clear]")) {
      filters.kind = "all";
      filters.query = "";
      root.querySelector("#wishlist-search").value = "";
      refreshResults();
      return;
    }
    const wish = event.target.closest("[data-wishlist-id]");
    if (wish) {
      const id = wish.dataset.wishlistId;
      const book = books.find((b) => b.id === id);
      const title = book ? `"${book.title}"` : "sách";
      removeFromWishlist(id);
      render();
      showToast(`Đã bỏ ${title} khỏi danh sách yêu thích.`);
      return;
    }
    const cart = event.target.closest("[data-cart-id]");
    if (cart) {
      const id = cart.dataset.cartId;
      addToCart(id);
      const book = books.find((b) => b.id === id);
      const title = book ? `"${book.title}"` : "sách";
      showToast(`Đã thêm ${title} vào giỏ hàng.`);
    }
  });
}
