import { books } from "../data.js";
import { renderBreadcrumb, showToast } from "../components/shell.js";
import { addToCart, addToWishlist, getState, removeFromWishlist } from "../state/store.js";
import { escapeHtml, formatVnd } from "../utils/formatters.js";

const icon = (name) =>
  `<span class="material-symbols-outlined" aria-hidden="true">${name}</span>`;

function grade(book) {
  const percent = book.condition.percent;

  if (percent >= 94) return "Like New";
  if (percent >= 88) return "Very Good";
  if (percent >= 78) return "Good";
  return "Acceptable";
}

function categoryName(book) {
  return book.category === "economics" ? "Kinh tế" : "Văn học";
}

function genreName(book) {
  if (book.category === "economics") return "business";
  if (book.id === "ha-noi-36-pho-phuong") return "essay";
  return "fiction";
}
const featured = ["so-do", "mat-biec", "tu-duy-nhanh-va-cham", "cha-giau-cha-ngheo"];

function cover(book, extraClass = "") {
  return book.coverUrl
    ? `<div class="shop-cover ${extraClass}"><img src="${escapeHtml(book.coverUrl)}" alt="Bìa ${escapeHtml(book.title)}" loading="lazy"></div>`
    : `<div class="shop-cover shop-cover--design ${escapeHtml(book.coverClass || "cover-paper")} ${extraClass}" role="img" aria-label="Bìa minh họa ${escapeHtml(book.title)}"><div class="shop-cover__ornament">✦</div><span class="shop-cover__publisher">${escapeHtml(book.publisher)}</span><strong>${escapeHtml(book.title)}</strong><span class="shop-cover__author">${escapeHtml(book.author)}</span><span class="shop-cover__line"></span></div>`;
}

function card(book) {
  const saved = getState().wishlist.includes(book.id);
  return `<article class="shop-card"><div class="shop-card__visual"><a href="#sach/${encodeURIComponent(book.id)}" aria-label="Xem chi tiết ${escapeHtml(book.title)}">${cover(book)}</a><span class="shop-card__badge">${escapeHtml(book.badges[0] || "Đã kiểm định")}</span><button class="shop-card__heart ${saved ? "is-saved" : ""}" type="button" data-shop-wish="${escapeHtml(book.id)}" aria-label="${saved ? "Bỏ yêu thích" : "Yêu thích"} ${escapeHtml(book.title)}">${icon(saved ? "favorite" : "favorite_border")}</button></div><div class="shop-card__content"><div class="shop-card__topline">${categoryName(book)} <span>·</span> ${book.year}</div><h3><a href="#sach/${encodeURIComponent(book.id)}">${escapeHtml(book.title)}</a></h3><p class="shop-card__author">${escapeHtml(book.author)}</p><p class="shop-card__meta">${escapeHtml(book.publisher)} · ${grade(book)}</p><div class="shop-card__bottom"><div><strong>${formatVnd(book.price)}</strong>${book.originalPrice ? `<del>${formatVnd(book.originalPrice)}</del>` : ""}</div><a class="shop-card__detail" href="#sach/${encodeURIComponent(book.id)}">Xem chi tiết ${icon("arrow_forward")}</a></div></div></article>`;
}

function bindShopActions(root) {
  root.firstElementChild.addEventListener("click", (event) => {
    const wish = event.target.closest("[data-shop-wish]");
    if (wish) {
      const id = wish.dataset.shopWish;
      const wasSaved = getState().wishlist.includes(id);
      if (wasSaved) removeFromWishlist(id);
      else addToWishlist(id);
      const isSaved = getState().wishlist.includes(id);
      wish.classList.toggle("is-saved", isSaved);
      wish.innerHTML = icon(isSaved ? "favorite" : "favorite_border");
      const book = books.find((b) => b.id === id);
      const title = book ? `"${book.title}"` : "sách";
      wish.setAttribute("aria-label", `${isSaved ? "Bỏ yêu thích" : "Yêu thích"} ${title}`);
      showToast(isSaved ? `Đã lưu ${title} vào danh sách yêu thích.` : `Đã bỏ ${title} khỏi danh sách yêu thích.`);
      return;
    }
    const cart = event.target.closest("[data-shop-cart]");
    if (cart) {
      const id = cart.dataset.shopCart;
      addToCart(id);
      const book = books.find((b) => b.id === id);
      const title = book ? `"${book.title}"` : "sách";
      showToast(`Đã thêm ${title} vào giỏ hàng.`);
    }
  });
}

export function mountHome(root) {
  const chosen = featured.map((id) => books.find((book) => book.id === id)).filter(Boolean);
  root.innerHTML = `<div class="home-page"><section class="home-hero"><div class="pt-container home-hero__inner"><div class="home-hero__copy"><span class="section-kicker section-kicker--light">THE PAGE TURNER · TIỆM SÁCH CŨ CHỌN LỌC</span><h1>Mỗi cuốn sách cũ là một hành trình <em>còn tiếp diễn.</em></h1><p>Những trang sách đã qua tay ai đó, nay chờ một người đọc mới. Chúng tôi chọn từng cuốn, chụp ảnh và ghi rõ tình trạng để bạn yên tâm khám phá.</p><div class="home-hero__actions"><a class="shop-button shop-button--gold" href="#danh-muc">Khám phá bộ sưu tập ${icon("arrow_forward")}</a><a class="shop-button shop-button--outline-light" href="#sach-hiem">Săn sách hiếm</a></div><div class="home-hero__foot"><span>${icon("verified")} Sách thật, mô tả thật</span><span>${icon("local_shipping")} Giao sách toàn quốc</span></div></div><div class="home-hero__seal" aria-hidden="true"><span>EST. 2020</span><strong>READ<br>AGAIN</strong><span>PASS IT ON</span></div></div></section>
  <section class="promise-strip"><div class="pt-container promise-strip__grid">${[["photo_camera", "Ảnh riêng từng cuốn", "Xem đúng ấn bản bạn nhận"], ["fact_check", "Tình trạng minh bạch", "Phân loại và ghi chú chi tiết"], ["verified_user", "Sách thật 100%", "Kiểm tra trước khi lên kệ"], ["assignment_return", "Đổi trả trong 7 ngày", "Khi sách khác mô tả"]].map(([symbol, title, body]) => `<div class="promise-strip__item">${icon(symbol)}<div><strong>${title}</strong><span>${body}</span></div></div>`).join("")}</div></section>
  <section class="home-section pt-container"><div class="section-heading"><div><span class="section-kicker">BẮT ĐẦU HÀNH TRÌNH ĐỌC</span><h2>Khám phá theo sở thích</h2></div><a href="#danh-muc" class="text-link">Xem tất cả sách ${icon("arrow_forward")}</a></div><div class="home-categories"><a class="home-category home-category--literature" href="#van-hoc"><span>01 / VĂN HỌC</span><h3>Những câu chuyện<br>ở lại mãi</h3><p>Tiểu thuyết, ký ức và thi ca</p><b>Khám phá ${icon("arrow_forward")}</b></a><a class="home-category home-category--economics" href="#kinh-te"><span>02 / KINH TẾ</span><h3>Tri thức để<br>tiến xa hơn</h3><p>Kinh doanh, tài chính và tư duy</p><b>Khám phá ${icon("arrow_forward")}</b></a><a class="home-category home-category--rare" href="#sach-hiem"><span>03 / TUYỂN CHỌN</span><h3>Ấn bản đáng<br>gìn giữ</h3><p>Sách hiếm và bản in đặc biệt</p><b>Khám phá ${icon("arrow_forward")}</b></a></div></section>
  <section class="home-section home-section--paper"><div class="pt-container"><div class="section-heading"><div><span class="section-kicker">ĐƯỢC THỦ THƯ CHỌN LỌC</span><h2>Trên kệ hôm nay</h2><p>Những cuốn sách đang chờ cuộc gặp gỡ tiếp theo.</p></div><a href="#tim-kiem" class="text-link">Tìm cuốn dành cho bạn ${icon("arrow_forward")}</a></div><div class="shop-grid shop-grid--home">${chosen.map(card).join("")}</div></div></section>
  <section class="home-collections pt-container"><div class="section-heading"><div><span class="section-kicker">BỘ SƯU TẬP THEO CHỦ ĐỀ</span><h2>Một lối vào mới cho mỗi câu chuyện</h2></div></div><div class="home-collections__grid"><a href="#sach-hiem"><span>SƯU TẦM</span><strong>Sách hiếm mới về</strong>${icon("north_east")}</a><a href="#van-hoc"><span>ĐỌC LẠI</span><strong>Văn học kinh điển</strong>${icon("north_east")}</a><a href="#kinh-te"><span>MỞ RỘNG GÓC NHÌN</span><strong>Sách kinh tế đáng đọc</strong>${icon("north_east")}</a><a href="#sach-giam-gia"><span>CHỌN HAY, GIÁ TỐT</span><strong>Giảm giá sâu</strong>${icon("north_east")}</a></div></section>
  <section class="home-story pt-container"><div class="home-story__visual"><div class="home-story__quote">“Sách cũ có thể mang dấu vết thời gian, nhưng giá trị của chúng luôn mới.”</div><span class="home-story__label">THE ART OF SECONDHAND BOOKS</span></div><div class="home-story__copy"><span class="section-kicker">ĐẰNG SAU MỖI TRANG SÁCH</span><h2>Một cuốn sách cũ.<br>Một sự chăm chút mới.</h2><p>Trước khi lên kệ, mỗi cuốn được kiểm tra nguồn gốc, bìa, gáy và từng trang giấy. Chúng tôi ghi lại những dấu vết đặc trưng để bạn biết chính xác điều mình đang chọn.</p><div class="home-steps">${[["01", "Tiếp nhận", "Thu mua và ký gửi từ người đọc"], ["02", "Thẩm định", "Kiểm tra sách thật và phân loại tình trạng"], ["03", "Ghi lại", "Chụp ảnh, mô tả, bảo quản cẩn thận"]].map(([n, title, body]) => `<div><b>${n}</b><span><strong>${title}</strong><small>${body}</small></span></div>`).join("")}</div><a href="#support" class="text-link">Tìm hiểu cam kết của chúng tôi ${icon("arrow_forward")}</a></div></section>
  <section class="home-section home-features"><div class="pt-container"><div class="section-heading"><div><span class="section-kicker">DÀNH RIÊNG CHO NGƯỜI YÊU SÁCH</span><h2>Tìm đúng cuốn, theo cách của bạn</h2></div></div><div class="home-features__grid"><a href="#support"><span class="feature-icon">${icon("auto_awesome")}</span><h3>Gợi ý theo tâm trạng</h3><p>Chia sẻ điều bạn muốn đọc, thủ thư sẽ giúp chọn cuốn phù hợp.</p><b>Nhận gợi ý →</b></a><a href="#consignment"><span class="feature-icon">${icon("notifications_active")}</span><h3>Thông báo sách hiếm</h3><p>Để lại tên sách bạn tìm. Chúng tôi sẽ báo ngay khi có bản phù hợp.</p><b>Gửi yêu cầu →</b></a><a href="#tim-kiem"><span class="feature-icon">${icon("compare_arrows")}</span><h3>So sánh ấn bản</h3><p>Lọc theo năm in, nhà xuất bản và tình trạng để chọn đúng bản.</p><b>Bắt đầu tìm →</b></a></div></div></section>
  <section class="home-testimonial"><div class="pt-container"><span class="section-kicker section-kicker--light">LỜI NGƯỜI ĐỌC</span><blockquote>“Điều mình thích nhất là từng vết cũ đều được mô tả rõ. Mở gói sách ra có cảm giác như nhận lại một câu chuyện quen thuộc.”</blockquote><span>— Một độc giả của The Page Turner</span></div></section></div>`;
  bindShopActions(root);
}

let searchState = { page: 1, sort: "featured", filters: {} };
const perPage = 8;
const fields = [
  ["category", "Danh mục", [["literature", "Văn học"], ["economics", "Kinh tế"]]],
  ["condition", "Tình trạng", [["Like New", "Like New · Mới 99%"], ["Very Good", "Very Good · Rất tốt"], ["Good", "Good · Tốt"], ["Acceptable", "Acceptable · Chấp nhận được"]]],
];

function searchFilters() {
  const f = searchState.filters;
  return `<form class="search-filters" id="advanced-filters"><div class="search-filters__head"><div>${icon("tune")}<strong>Bộ lọc sách</strong></div><button type="button" data-clear>Xóa tất cả</button></div><div class="search-filter__group"><label for="filter-keyword">Tên sách hoặc từ khóa</label><input id="filter-keyword" name="keyword" type="search" placeholder="Ví dụ: Mắt biếc" value="${escapeHtml(f.keyword || "")}"></div>${fields.map(([name, title, options]) => `<fieldset class="search-filter__group"><legend>${title}</legend>${options.map(([value, label]) => `<label class="search-choice"><input type="checkbox" name="${name}" value="${value}" ${(f[name] || []).includes(value) ? "checked" : ""}><span>${label}</span></label>`).join("")}</fieldset>`).join("")}<div class="search-filter__group"><label for="filter-author">Tác giả</label><input id="filter-author" name="author" type="text" placeholder="Nhập tên tác giả" value="${escapeHtml(f.author || "")}"></div><div class="search-filter__group"><label for="filter-publisher">Nhà xuất bản</label><input id="filter-publisher" name="publisher" type="text" placeholder="Ví dụ: NXB Trẻ" value="${escapeHtml(f.publisher || "")}"></div><div class="search-filter__group"><label for="filter-year-from">Năm xuất bản</label><div class="search-filter__pair"><input id="filter-year-from" name="yearFrom" type="number" min="1800" max="2100" placeholder="Từ năm" value="${escapeHtml(f.yearFrom || "")}"><input name="yearTo" type="number" min="1800" max="2100" placeholder="Đến năm" aria-label="Đến năm" value="${escapeHtml(f.yearTo || "")}"></div></div><div class="search-filter__group"><label for="filter-price-from">Khoảng giá (₫)</label><div class="search-filter__pair"><input id="filter-price-from" name="priceFrom" type="number" min="0" step="1000" placeholder="Từ" value="${escapeHtml(f.priceFrom || "")}"><input name="priceTo" type="number" min="0" step="1000" placeholder="Đến" aria-label="Giá đến" value="${escapeHtml(f.priceTo || "")}"></div></div><div class="search-filter__group"><label for="filter-language">Ngôn ngữ</label><select id="filter-language" name="language"><option value="">Tất cả</option><option value="vi" ${f.language === "vi" ? "selected" : ""}>Tiếng Việt</option></select></div><div class="search-filter__group"><label for="filter-genre">Thể loại</label><select id="filter-genre" name="genre"><option value="">Tất cả thể loại</option><option value="fiction" ${f.genre === "fiction" ? "selected" : ""}>Tiểu thuyết & truyện</option><option value="essay" ${f.genre === "essay" ? "selected" : ""}>Tản văn</option><option value="business" ${f.genre === "business" ? "selected" : ""}>Kinh doanh & tài chính</option></select></div><label class="search-choice search-choice--rare"><input type="checkbox" name="rare" value="1" ${f.rare ? "checked" : ""}><span>Chỉ xem sách hiếm</span></label><button class="shop-button shop-button--dark search-filters__submit" type="submit">Áp dụng bộ lọc ${icon("arrow_forward")}</button></form>`;
}

function filteredBooks() {
  const filters = searchState.filters;
  const includesText = (value, query) => normalizeText(value).includes(normalizeText(query));
  const result = books.filter((book) => {
    const searchableText = `${book.title} ${book.author} ${book.publisher}`;
    const category = book.category === "economics" ? "economics" : "literature";

    if (filters.keyword && !includesText(searchableText, filters.keyword)) return false;
    if (filters.author && !includesText(book.author, filters.author)) return false;
    if (filters.publisher && !includesText(book.publisher, filters.publisher)) return false;
    if (filters.category?.length && !filters.category.includes(category)) return false;
    if (filters.condition?.length && !filters.condition.includes(grade(book))) return false;
    if (filters.yearFrom && book.year < Number(filters.yearFrom)) return false;
    if (filters.yearTo && book.year > Number(filters.yearTo)) return false;
    if (filters.priceFrom && book.price < Number(filters.priceFrom)) return false;
    if (filters.priceTo && book.price > Number(filters.priceTo)) return false;
    if (filters.genre && genreName(book) !== filters.genre) return false;
    if (filters.rare && !book.badges.some((badge) => /hiếm|bản in đầu|chữ ký/i.test(badge))) return false;
    return true;
  });

  if (searchState.sort === "newest") result.sort((a, b) => b.year - a.year);
  if (searchState.sort === "price-low") result.sort((a, b) => a.price - b.price);
  if (searchState.sort === "price-high") result.sort((a, b) => b.price - a.price);
  return result;
}

function normalizeText(value) {
  return String(value || "")
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function activeTags() {
  const f = searchState.filters;
  const tags = [];
  if (f.keyword) tags.push(`Từ khóa: ${f.keyword}`);
  if (f.category?.includes("literature")) tags.push("Văn học");
  if (f.category?.includes("economics")) tags.push("Kinh tế");
  if (f.condition?.length) tags.push(...f.condition);
  if (f.author) tags.push(`Tác giả: ${f.author}`);
  if (f.publisher) tags.push(`NXB: ${f.publisher}`);
  if (f.rare) tags.push("Sách hiếm");
  if (f.genre) tags.push(({ fiction: "Tiểu thuyết & truyện", essay: "Tản văn", business: "Kinh doanh & tài chính" })[f.genre]);
  if (f.priceFrom || f.priceTo) tags.push(`Giá: ${f.priceFrom ? formatVnd(f.priceFrom) : "0 ₫"} – ${f.priceTo ? formatVnd(f.priceTo) : "∞"}`);
  if (f.yearFrom || f.yearTo) tags.push(`Năm: ${f.yearFrom || "…"} – ${f.yearTo || "…"}`);
  return tags;
}

function searchResults() {
  const result = filteredBooks();
  const pages = Math.max(1, Math.ceil(result.length / perPage));
  searchState.page = Math.min(searchState.page, pages);
  const visible = result.slice((searchState.page - 1) * perPage, searchState.page * perPage);
  const tags = activeTags();
  return `<div class="search-results__toolbar"><div><strong>${result.length} cuốn sách</strong><span> phù hợp với tìm kiếm của bạn</span></div><label>Sắp xếp <select id="search-sort"><option value="featured" ${searchState.sort === "featured" ? "selected" : ""}>Nổi bật</option><option value="newest" ${searchState.sort === "newest" ? "selected" : ""}>Mới nhất</option><option value="price-low" ${searchState.sort === "price-low" ? "selected" : ""}>Giá tăng dần</option><option value="price-high" ${searchState.sort === "price-high" ? "selected" : ""}>Giá giảm dần</option></select></label></div>${tags.length ? `<div class="search-tags"><span>Đang lọc:</span>${tags.map((tag) => `<span class="search-tag">${escapeHtml(tag)}</span>`).join("")}<button type="button" data-clear>Xóa bộ lọc</button></div>` : ""}${visible.length ? `<div class="shop-grid shop-grid--search">${visible.map(card).join("")}</div>` : `<div class="search-empty">${icon("search_off")}<h2>Chưa tìm thấy cuốn phù hợp</h2><p>Thử bỏ bớt điều kiện lọc hoặc gửi yêu cầu để chúng tôi hỗ trợ tìm sách.</p><button type="button" data-clear class="shop-button shop-button--dark">Xóa bộ lọc</button></div>`}<div class="search-pagination"><span>Trang ${searchState.page} / ${pages}</span><div>${Array.from({ length: pages }, (_, index) => `<button type="button" data-page="${index + 1}" class="${searchState.page === index + 1 ? "is-active" : ""}" aria-label="Trang ${index + 1}" ${searchState.page === index + 1 ? 'aria-current="page"' : ""}>${index + 1}</button>`).join("")}</div></div>`;
}

export function mountSearch(root) {
  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  searchState = { page: 1, sort: "featured", filters: { keyword: params.get("q") || "", category: params.get("category") ? [params.get("category")] : [], rare: params.get("rare") === "1", priceTo: params.get("priceTo") || "" } };
  root.innerHTML = `<div class="search-page"><div class="pt-container search-page__inner">${renderBreadcrumb(["Tìm kiếm nâng cao"])}<div class="search-page__heading"><div><span class="section-kicker">KHÁM PHÁ KHO SÁCH</span><h1>Tìm kiếm nâng cao</h1><p>Lọc theo tên sách, tác giả, năm in và tình trạng để tìm đúng cuốn bạn cần.</p></div><span class="search-page__count">${books.length} cuốn đang trên kệ</span></div><div class="search-layout"><div id="search-filters">${searchFilters()}</div><div id="search-results">${searchResults()}</div></div><section class="search-request"><div>${icon("auto_stories")}<div><h2>Chưa tìm thấy cuốn bạn cần?</h2><p>Gửi yêu cầu tìm sách, chúng tôi sẽ liên hệ khi có ấn bản phù hợp.</p></div></div><a class="shop-button shop-button--gold" href="#consignment">Gửi yêu cầu tìm sách ${icon("arrow_forward")}</a></section></div></div>`;
  bindShopActions(root);
  const page = root.firstElementChild;
  page.addEventListener("submit", (event) => {
    if (event.target.id !== "advanced-filters") return;
    event.preventDefault();
    const data = new FormData(event.target);
    searchState.filters = { keyword: String(data.get("keyword") || "").trim(), author: String(data.get("author") || "").trim(), publisher: String(data.get("publisher") || "").trim(), category: data.getAll("category"), condition: data.getAll("condition"), yearFrom: data.get("yearFrom"), yearTo: data.get("yearTo"), priceFrom: data.get("priceFrom"), priceTo: data.get("priceTo"), language: data.get("language"), genre: data.get("genre"), rare: data.has("rare") };
    searchState.page = 1;
    root.querySelector("#search-results").innerHTML = searchResults();
  });
  page.addEventListener("change", (event) => {
    if (event.target.id !== "search-sort") return;
    searchState.sort = event.target.value;
    searchState.page = 1;
    root.querySelector("#search-results").innerHTML = searchResults();
  });
  page.addEventListener("click", (event) => {
    if (event.target.closest("[data-clear]")) {
      searchState = { page: 1, sort: "featured", filters: {} };
      root.querySelector("#search-filters").innerHTML = searchFilters();
      root.querySelector("#search-results").innerHTML = searchResults();
    }
    const pageButton = event.target.closest("[data-page]");
    if (pageButton) {
      searchState.page = Number(pageButton.dataset.page);
      root.querySelector("#search-results").innerHTML = searchResults();
      root.querySelector(".search-page__heading").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

export function mountProduct(root) {
  const id = decodeURIComponent(window.location.hash.slice(6).split("?")[0]);
  const book = books.find((item) => item.id === id);
  if (!book) {
    root.innerHTML = `<div class="pt-container product-missing"><h1>Không tìm thấy cuốn sách</h1><p>Ấn bản này có thể đã rời khỏi kệ.</p><a class="shop-button shop-button--dark" href="#tim-kiem">Tìm sách khác</a></div>`;
    return;
  }
  const related = books.filter((item) => item.id !== id && item.category === book.category).slice(0, 4);
  const conditionItems = [["Bìa", "Bề mặt được kiểm tra; dấu cũ nếu có được ghi rõ."], ["Gáy", "Gáy chắc, có thể có vết mòn tự nhiên theo tuổi sách."], ["Trang giấy", "Trang đầy đủ, mức ngả màu phù hợp năm in."], ["Ghi chú", escapeHtml(book.description)]];
  root.innerHTML = `<div class="product-page"><div class="pt-container product-page__inner">${renderBreadcrumb([categoryName(book), book.title])}<div class="product-top"><div class="product-gallery"><div class="product-gallery__stage"><span class="product-gallery__hint">Hình ảnh bìa tham khảo</span><div id="product-main-cover">${cover(book, "shop-cover--large")}</div></div><div class="product-gallery__thumbs"><button type="button" class="is-active" data-gallery="front" aria-label="Xem bìa trước">${cover(book)}</button><button type="button" data-gallery="back" aria-label="Xem bìa sau"><span class="gallery-view gallery-view--back">BÌA SAU</span></button><button type="button" data-gallery="spine" aria-label="Xem gáy sách"><span class="gallery-view gallery-view--spine">GÁY SÁCH</span></button><button type="button" data-gallery="pages" aria-label="Xem trang giấy"><span class="gallery-view gallery-view--pages">TRANG SÁCH</span></button></div><p class="product-gallery__disclaimer">Các góc bìa sau, gáy và trang là minh họa bố cục. Liên hệ thủ thư để nhận ảnh thực tế của cuốn này.</p></div><div class="product-summary"><div class="product-summary__tags"><span>${escapeHtml(book.badges[0] || "Đã kiểm định")}</span><span>${categoryName(book)}</span></div><h1>${escapeHtml(book.title)}</h1><p class="product-summary__author">Tác giả: <strong>${escapeHtml(book.author)}</strong></p><div class="product-summary__facts"><div><span>Nhà xuất bản</span><strong>${escapeHtml(book.publisher)}</strong></div><div><span>Năm xuất bản</span><strong>${book.year}</strong></div><div><span>Thể loại</span><strong>${categoryName(book)}</strong></div><div><span>Tình trạng</span><strong>${grade(book)}</strong></div></div><div class="product-summary__price"><strong>${formatVnd(book.price)}</strong>${book.originalPrice ? `<del>${formatVnd(book.originalPrice)}</del>` : ""}</div><div class="product-summary__condition"><div><strong>${icon("verified")} Đã kiểm định · ${grade(book)}</strong><span>${book.condition.percent}% mức bảo quản</span></div><p>${escapeHtml(book.description)}. Đây là cuốn sách cũ riêng biệt; dấu thời gian là một phần đặc trưng của ấn bản.</p></div><p class="product-summary__stock">${icon("fiber_manual_record")} Còn 1 cuốn trên kệ</p><div class="product-summary__actions"><button type="button" class="shop-button shop-button--dark" data-shop-cart="${escapeHtml(book.id)}">${icon("shopping_bag")} Thêm vào giỏ</button><button type="button" class="shop-button shop-button--gold" data-buy-now="${escapeHtml(book.id)}">Mua ngay ${icon("arrow_forward")}</button><button type="button" class="product-summary__heart ${getState().wishlist.includes(book.id) ? "is-saved" : ""}" data-shop-wish="${escapeHtml(book.id)}" aria-label="${getState().wishlist.includes(book.id) ? "Bỏ yêu thích" : "Yêu thích"} ${escapeHtml(book.title)}">${icon(getState().wishlist.includes(book.id) ? "favorite" : "favorite_border")}</button></div><div class="product-summary__reassurance">${icon("local_shipping")} Giao hàng toàn quốc <span>·</span> ${icon("assignment_return")} Đổi trả trong 7 ngày</div></div></div><div class="product-info"><div class="product-info__main"><section><span class="section-kicker">VỀ CUỐN SÁCH</span><h2>Một ấn bản đáng đọc lại</h2><p><strong>${escapeHtml(book.title)}</strong> của ${escapeHtml(book.author)} thuộc tuyển chọn ${categoryName(book).toLowerCase()} tại The Page Turner. Chúng tôi chọn cuốn sách này vì giá trị đọc bền lâu và khả năng mở ra một cuộc trò chuyện mới với người đọc tiếp theo.</p><p>Ấn bản do ${escapeHtml(book.publisher)} phát hành năm ${book.year}. Thông tin sách được ghi lại để bạn dễ so sánh và quyết định trước khi đặt mua.</p></section><section><span class="section-kicker">MINH BẠCH TÌNH TRẠNG</span><h2>Kiểm tra từng chi tiết</h2><div class="product-condition-grid">${conditionItems.map(([title, body]) => `<div>${icon("check_circle")}<strong>${title}</strong><p>${body}</p></div>`).join("")}</div></section><section><span class="section-kicker">NGƯỜI ĐỌC CHIA SẺ</span><h2>Đánh giá từ cộng đồng</h2><div class="product-review"><span>★★★★★</span><p>“Sách được đóng gói cẩn thận. Tình trạng thực tế đúng với ghi chú trên trang.”</p><small>Độc giả đã mua · Đánh giá về mô tả và đóng gói</small></div></section></div><aside class="product-info__aside"><section><h3>Cam kết của tiệm</h3><ul><li>${icon("verified_user")} Sách thật 100%, kiểm tra trước khi lên kệ</li><li>${icon("assignment_return")} Đổi trả 7 ngày nếu khác mô tả</li><li>${icon("currency_exchange")} Miễn phí đổi trả khi lỗi thẩm định</li><li>${icon("workspace_premium")} Bồi thường 200% nếu phát hiện sách giả hoặc in nối</li></ul></section><section><h3>Vận chuyển & thanh toán</h3><p>Đóng gói chống ẩm, chống va đập. Thanh toán khi nhận hàng hoặc chuyển khoản. Thời gian và phí vận chuyển được xác nhận trước khi đặt mua.</p><a href="#support" class="text-link">Xem chính sách ${icon("arrow_forward")}</a></section></aside></div><section class="home-section product-related"><div class="section-heading"><div><span class="section-kicker">CÙNG MẠCH ĐỌC</span><h2>Sách liên quan</h2></div><a href="#tim-kiem" class="text-link">Xem thêm ${icon("arrow_forward")}</a></div><div class="shop-grid shop-grid--home">${related.map(card).join("")}</div></section><section class="product-recommend"><div><span class="section-kicker section-kicker--light">GỢI Ý DÀNH CHO BẠN</span><h2>Chưa đúng cuốn bạn tìm?</h2><p>Dùng bộ lọc nâng cao để tìm theo tác giả, năm in, nhà xuất bản và tình trạng.</p></div><a class="shop-button shop-button--gold" href="#tim-kiem">Tìm ấn bản khác ${icon("arrow_forward")}</a></section></div></div>`;
  bindShopActions(root);
  root.firstElementChild.addEventListener("click", (event) => {
    const buy = event.target.closest("[data-buy-now]");
    if (buy) {
      const bookId = buy.dataset.buyNow;
      addToCart(bookId);
      const book = books.find((b) => b.id === bookId);
      const title = book ? `"${book.title}"` : "sách";
      showToast(`Đã thêm ${title} vào giỏ hàng. Đang chuyển đến giỏ hàng...`);
      window.location.hash = "#gio-hang";
    }
    const gallery = event.target.closest("[data-gallery]");
    if (!gallery) return;
    root.querySelectorAll("[data-gallery]").forEach((button) => button.classList.toggle("is-active", button === gallery));
    const view = gallery.dataset.gallery;
    root.querySelector("#product-main-cover").innerHTML = view === "front" ? cover(book, "shop-cover--large") : `<div class="gallery-view gallery-view--large gallery-view--${view}"><span>${view === "back" ? "Bìa sau" : view === "spine" ? "Gáy sách" : "Trang bên trong"}</span><strong>${escapeHtml(book.title)}</strong><small>Hình minh họa · Liên hệ để nhận ảnh thực tế</small></div>`;
  });
}
