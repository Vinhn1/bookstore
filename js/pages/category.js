import { books } from "../data.js";
import { renderBreadcrumb, showToast } from "../components/shell.js";
import { renderBookCard } from "../components/ui.js";
import { addToCart, addToWishlist, getState, removeFromWishlist } from "../state/store.js";
import { escapeHtml, formatVnd } from "../utils/formatters.js";

const literatureBooks = books.filter((book) => book.category === "vietnamese-literature");
const economicsBooks = books.filter((book) => book.category === "economics");
const rareBooks = books.filter((book) =>
  book.badges.some((badge) => /hiếm|bản in đầu|chữ ký/i.test(badge)),
);
const discountedBooks = books.filter((book) => book.originalPrice > book.price);
const psychologyBooks = books.filter((book) => book.id === "tu-duy-nhanh-va-cham");

const collections = {
  literature: {
    title: "Văn học Việt Nam",
    eyebrow: "Những câu chuyện ở lại",
    description: "Từ Hà Nội của Thạch Lam, hiện thực trào phúng của Vũ Trọng Phụng đến tuổi thơ trong truyện Nguyễn Nhật Ánh. Mỗi cuốn là một lát cắt văn chương Việt.",
    note: "Đọc theo tác giả, rồi chọn ấn bản hợp với cách bạn muốn lưu giữ câu chuyện.",
    featureId: "mat-biec",
    featureLabel: "Cuốn sách mở đầu",
    theme: "literature",
    books: literatureBooks,
    defaultSort: "featured",
    tabs: [
      { id: "all", label: "Tất cả", matches: () => true },
      { id: "nguyen-nhat-anh", label: "Nguyễn Nhật Ánh", matches: (book) => book.author === "Nguyễn Nhật Ánh" },
      { id: "tac-gia-khac", label: "Tác giả khác", matches: (book) => book.author !== "Nguyễn Nhật Ánh" },
    ],
  },
  economics: {
    title: "Kinh tế & Tài chính",
    eyebrow: "Đọc để hiểu cách vận hành",
    description: "Một kệ sách gọn về kinh doanh, quyết định và tiền bạc. Bắt đầu từ câu hỏi bạn đang quan tâm, rồi chọn cuốn phù hợp với công việc hoặc cuộc sống.",
    note: "Bốn cuốn sách, hai lối vào: ý tưởng kinh doanh và cách nhìn về tiền.",
    featureId: "nghe-thuat-quan-ly-tien",
    featureLabel: "Gợi ý cho người mới",
    theme: "economics",
    books: economicsBooks,
    defaultSort: "featured",
    tabs: [
      { id: "all", label: "Tất cả", matches: () => true },
      { id: "business", label: "Kinh doanh", matches: (book) => ["quoc-gia-khoi-nghiep", "tu-duy-nhanh-va-cham"].includes(book.id) },
      { id: "money", label: "Quản lý tiền", matches: (book) => ["cha-giau-cha-ngheo", "nghe-thuat-quan-ly-tien"].includes(book.id) },
    ],
  },
  rare: {
    title: "Sách hiếm & Ấn bản đáng giữ",
    eyebrow: "Kệ sưu tầm",
    description: "Những cuốn có dấu hiệu sưu tầm cụ thể như bản in đầu, chữ ký hoặc ấn bản khó gặp. Năm in và tình trạng của từng cuốn được ghi ngay trên trang sách.",
    note: "Xem năm in, tình trạng bìa và ghi chú của từng cuốn trước khi quyết định.",
    featureId: "so-do",
    featureLabel: "Ấn bản tiêu biểu",
    theme: "rare",
    books: rareBooks,
    defaultSort: "oldest",
    tabs: [
      { id: "all", label: "Tất cả", matches: () => true },
      { id: "early", label: "Bản in & ấn bản xưa", matches: (book) => book.badges.some((badge) => /bản in|ấn bản|hiếm/i.test(badge)) },
      { id: "signed", label: "Có chữ ký", matches: (book) => book.badges.some((badge) => /chữ ký/i.test(badge)) },
    ],
  },
  deals: {
    title: "Sách giảm giá",
    eyebrow: "Giá tốt cho lần đọc tiếp",
    description: "Các cuốn đang có giá thấp hơn giá niêm yết trong dữ liệu của tiệm. So sánh mức tiết kiệm và tình trạng thực tế để chọn cuốn đáng mang về.",
    note: "Giá cũ, giá hiện tại và mức giảm được tính trực tiếp từ từng cuốn sách.",
    featureId: "ngoi-khoc",
    featureLabel: "Giá dễ bắt đầu",
    theme: "deals",
    books: discountedBooks,
    defaultSort: "saving",
    tabs: [
      { id: "all", label: "Tất cả ưu đãi", matches: () => true },
      { id: "under-100", label: "Dưới 100.000 ₫", matches: (book) => book.price < 100000 },
      { id: "from-100", label: "Từ 100.000 ₫", matches: (book) => book.price >= 100000 },
    ],
  },
  psychology: {
    title: "Tư duy & Tâm lý",
    eyebrow: "Một điểm khởi đầu",
    description: "Bắt đầu với một cuốn về cách con người đưa ra quyết định. Kệ chủ đề này hiện còn ít đầu sách; bạn có thể mở rộng tìm kiếm sang kệ Kinh tế & Tài chính.",
    note: "Tìm hiểu cách ta suy nghĩ trước khi đi sâu vào các chủ đề liên quan.",
    featureId: "tu-duy-nhanh-va-cham",
    featureLabel: "Trên kệ lúc này",
    theme: "psychology",
    books: psychologyBooks,
    defaultSort: "featured",
    tabs: [{ id: "all", label: "Tất cả", matches: () => true }],
  },
};

const landingCategories = [
  { href: "#van-hoc", number: "01", title: "Văn học Việt Nam", description: "Tiểu thuyết, ký ức tuổi thơ và những trang văn đi cùng nhiều thế hệ.", books: literatureBooks, className: "literature" },
  { href: "#kinh-te", number: "02", title: "Kinh tế & Tài chính", description: "Những góc nhìn về doanh nghiệp, quyết định và cách dùng tiền.", books: economicsBooks, className: "economics" },
  { href: "#sach-hiem", number: "03", title: "Sách hiếm", description: "Bản in đầu, cuốn có chữ ký và các ấn bản đáng lưu giữ.", books: rareBooks, className: "rare" },
  { href: "#sach-giam-gia", number: "04", title: "Sách giảm giá", description: "Chọn một cuốn mới cho mình với mức giá dễ bắt đầu.", books: discountedBooks, className: "deals" },
];

function findBook(id) {
  return books.find((book) => book.id === id);
}

function renderFeature(book, label) {
  const cover = book.coverUrl
    ? `<img src="${escapeHtml(book.coverUrl)}" alt="Bìa sách ${escapeHtml(book.title)}" loading="lazy">`
    : `<div class="catalog-feature__book ${escapeHtml(book.coverClass || "cover-paper")}"><span>${escapeHtml(book.publisher)} · ${book.year}</span><strong>${escapeHtml(book.title)}</strong><small>${escapeHtml(book.author)}</small></div>`;

  return `
    <a class="catalog-feature" href="#sach/${encodeURIComponent(book.id)}">
      <div class="catalog-feature__art">${cover}</div>
      <div class="catalog-feature__copy">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(book.title)}</strong>
        <small>${escapeHtml(book.author)} · ${book.year}</small>
        <b>Xem cuốn sách <span aria-hidden="true">↗</span></b>
      </div>
    </a>
  `;
}

function renderLandingCard(category) {
  return `
    <a class="catalog-door catalog-door--${category.className}" href="${category.href}">
      <span class="catalog-door__number">${category.number} / KHÁM PHÁ</span>
      <div>
        <h2>${escapeHtml(category.title)}</h2>
        <p>${escapeHtml(category.description)}</p>
      </div>
      <span class="catalog-door__bottom">${category.books.length} cuốn trên kệ <span aria-hidden="true">↗</span></span>
    </a>
  `;
}

function renderLandingShelf() {
  const featured = ["so-do", "mat-biec", "nghe-thuat-quan-ly-tien"].map(findBook);

  return `
    <section class="catalog-landing__shelf" aria-labelledby="landing-shelf-title">
      <div class="catalog-section-heading">
        <div><span class="page-eyebrow">Một vài cuốn để bắt đầu</span><h2 id="landing-shelf-title">Dừng lại ở một cuốn hay</h2></div>
        <a href="#tim-kiem">Tìm kiếm toàn bộ sách <span aria-hidden="true">↗</span></a>
      </div>
      <div class="catalog-book-grid">${featured.map((book) => renderBookCard(book)).join("")}</div>
    </section>
  `;
}

export function mountCatalogLanding(root) {
  root.innerHTML = `
    <div class="catalog-page catalog-page--landing pt-main">
      <div class="pt-container--wide">
        ${renderBreadcrumb(["Danh mục sách"])}
        <section class="catalog-landing__hero">
          <div>
            <span class="page-eyebrow">Bản đồ kệ sách</span>
            <h1>Đi theo điều bạn <em>muốn đọc.</em></h1>
            <p>Khám phá theo thể loại, tìm một ấn bản để sưu tầm hoặc bắt đầu từ mức giá phù hợp. Mỗi lối vào dẫn đến một kệ sách riêng.</p>
            <a class="pt-button pt-button--primary" href="#tim-kiem">Tìm một cuốn cụ thể <span aria-hidden="true">↗</span></a>
          </div>
          <div class="catalog-landing__index" aria-label="Tổng quan kệ sách">
            <span>KỆ SÁCH / ${new Date().getFullYear()}</span>
            <strong>${books.length}</strong>
            <p>cuốn đang được giới thiệu</p>
            <div><span>${literatureBooks.length} văn học</span><span>${economicsBooks.length} kinh tế</span></div>
          </div>
        </section>
        <section aria-labelledby="landing-paths-title">
          <div class="catalog-section-heading"><div><span class="page-eyebrow">Bốn lối vào</span><h2 id="landing-paths-title">Bạn muốn bắt đầu ở đâu?</h2></div></div>
          <div class="catalog-doors">${landingCategories.map(renderLandingCard).join("")}</div>
        </section>
        ${renderLandingShelf()}
      </div>
    </div>
  `;

  bindBookActions(root.firstElementChild);
}

function renderThemeSection(config) {
  if (config.theme === "literature") {
    const oldest = Math.min(...config.books.map((book) => book.year));
    const newest = Math.max(...config.books.map((book) => book.year));

    return `<section class="catalog-story catalog-story--literature" aria-label="Gợi ý đọc văn học">
      <div><span class="page-eyebrow">Dòng thời gian trên kệ</span><strong>${oldest} <i>→</i> ${newest}</strong><p>Từ ấn bản sớm nhất đến cuốn mới nhất đang có trong kệ.</p></div>
      <div><span class="page-eyebrow">Điểm hẹn tác giả</span><strong>Nguyễn Nhật Ánh</strong><p>Chọn tab tên tác giả bên dưới để xem những cuốn tuổi thơ hiện có.</p></div>
    </section>`;
  }

  if (config.theme === "economics") {
    return `<section class="catalog-story catalog-story--economics" aria-label="Lối đọc sách kinh tế">
      <div><span>01 / Ý tưởng & quyết định</span><h2>Nhìn rộng hơn về kinh doanh</h2><p>Khởi đầu với câu chuyện khởi nghiệp và cách con người đưa ra quyết định.</p><button type="button" data-collection-tab="business">Xem kệ kinh doanh ↗</button></div>
      <div><span>02 / Tiền bạc hàng ngày</span><h2>Hiểu cách quản lý tiền</h2><p>Hai cuốn dẫn vào thói quen tài chính và góc nhìn dài hạn về tiền.</p><button type="button" data-collection-tab="money">Xem kệ quản lý tiền ↗</button></div>
    </section>`;
  }

  if (config.theme === "rare") {
    return `<section class="catalog-story catalog-story--rare" aria-label="Cách xem sách sưu tầm">
      <div><span class="page-eyebrow">01 / Dấu hiệu</span><strong>Ấn bản</strong><p>Xem nhãn bản in đầu, ấn bản xưa hoặc chữ ký trên từng cuốn.</p></div>
      <div><span class="page-eyebrow">02 / Thời gian</span><strong>Năm in</strong><p>Đối chiếu năm xuất bản để hiểu bối cảnh của bản sách.</p></div>
      <div><span class="page-eyebrow">03 / Hiện trạng</span><strong>Tình trạng</strong><p>Đọc ghi chú về bìa, gáy và ruột trước khi chọn mua.</p></div>
    </section>`;
  }

  if (config.theme === "deals") {
    const maxDiscount = Math.max(...config.books.map((book) =>
      Math.round((1 - book.price / book.originalPrice) * 100),
    ));

    return `<section class="catalog-story catalog-story--deals" aria-label="Thông tin sách giảm giá">
      <div><span class="page-eyebrow">Mức tiết kiệm cao nhất</span><strong>${maxDiscount}%</strong><p>Tính từ giá cũ và giá hiện tại của những cuốn đang có.</p></div>
      <div><span class="page-eyebrow">Chọn theo ngân sách</span><strong>${config.books.filter((book) => book.price < 100000).length} cuốn dưới 100.000 ₫</strong><p>Dùng các lựa chọn bên dưới để thu hẹp kệ sách.</p></div>
    </section>`;
  }

  return `<section class="catalog-story catalog-story--psychology"><div><span class="page-eyebrow">Đọc tiếp ở đâu?</span><strong>Kinh tế & Tài chính</strong><p>Mở rộng sang các cuốn về quyết định, thói quen và quản lý tiền.</p><a href="#kinh-te">Đi đến kệ Kinh tế ↗</a></div></section>`;
}

function sortedBooks(items, sort) {
  const sorted = [...items];

  switch (sort) {
    case "newest": return sorted.sort((a, b) => b.year - a.year);
    case "oldest": return sorted.sort((a, b) => a.year - b.year);
    case "price-low": return sorted.sort((a, b) => a.price - b.price);
    case "price-high": return sorted.sort((a, b) => b.price - a.price);
    case "saving": return sorted.sort((a, b) =>
      (b.originalPrice - b.price) / b.originalPrice - (a.originalPrice - a.price) / a.originalPrice,
    );
    default: return sorted;
  }
}

function renderShelf(config, state) {
  const tab = config.tabs.find((item) => item.id === state.tab) || config.tabs[0];
  const selectedBooks = sortedBooks(config.books.filter(tab.matches), state.sort);
  const count = selectedBooks.length;

  return `
    <section class="catalog-shelf" id="collection-shelf" aria-labelledby="collection-shelf-title">
      <div class="catalog-section-heading">
        <div><span class="page-eyebrow">Khám phá kệ sách</span><h2 id="collection-shelf-title">${escapeHtml(config.title)}</h2><p>${count} cuốn trong lựa chọn này</p></div>
        <a href="#tim-kiem">Tìm kiếm nâng cao <span aria-hidden="true">↗</span></a>
      </div>
      <div class="catalog-shelf__controls">
        <div class="catalog-shelf__tabs" role="group" aria-label="Chọn nhóm sách">
          ${config.tabs.map((item) => `<button type="button" class="${state.tab === item.id ? "is-active" : ""}" data-collection-tab="${item.id}" aria-pressed="${state.tab === item.id}">${escapeHtml(item.label)} <span>${config.books.filter(item.matches).length}</span></button>`).join("")}
        </div>
        <label>Sắp xếp <select data-collection-sort aria-label="Sắp xếp sách">
          ${[["featured", "Gợi ý của tiệm"], ["newest", "Năm in mới nhất"], ["oldest", "Năm in cũ nhất"], ["price-low", "Giá tăng dần"], ["price-high", "Giá giảm dần"], ...(config.theme === "deals" ? [["saving", "Giảm nhiều nhất"]] : [])].map(([value, label]) => `<option value="${value}" ${state.sort === value ? "selected" : ""}>${label}</option>`).join("")}
        </select></label>
      </div>
      <div class="catalog-book-grid ${count === 1 ? "catalog-book-grid--single" : ""}">
        ${selectedBooks.map((book) => `<div class="catalog-book-item">${config.theme === "deals" ? `<span class="catalog-book-item__saving">Tiết kiệm ${Math.round((1 - book.price / book.originalPrice) * 100)}% · ${formatVnd(book.originalPrice - book.price)}</span>` : ""}${renderBookCard(book)}</div>`).join("")}
      </div>
    </section>
  `;
}

export function mountCuratedCategory(root, collectionId) {
  const config = collections[collectionId];
  const featured = findBook(config.featureId);
  const state = { tab: "all", sort: config.defaultSort };

  root.innerHTML = `
    <div class="catalog-page catalog-page--${config.theme} pt-main">
      <div class="pt-container--wide">
        ${renderBreadcrumb(["Danh mục sách", config.title])}
        <section class="catalog-hero">
          <div class="catalog-hero__copy">
            <span class="page-eyebrow">${escapeHtml(config.eyebrow)}</span>
            <h1>${escapeHtml(config.title)}</h1>
            <p>${escapeHtml(config.description)}</p>
            <div class="catalog-hero__meta">
              <div class="catalog-hero__stat">
                <strong>${config.books.length}</strong>
                <span>cuốn trên kệ</span>
              </div>
              <i class="catalog-hero__divider" aria-hidden="true"></i>
              <span class="catalog-hero__note">${escapeHtml(config.note)}</span>
            </div>
            <a class="catalog-hero__jump" href="#collection-shelf">
              <span class="catalog-hero__jump-text">Khám phá kệ sách</span>
              <span class="catalog-hero__jump-arrow" aria-hidden="true">↓</span>
            </a>
          </div>
          ${renderFeature(featured, config.featureLabel)}
        </section>
        ${renderThemeSection(config)}
        <div data-collection-shelf>${renderShelf(config, state)}</div>
        <aside class="catalog-next"><div><span class="page-eyebrow">Tiếp tục khám phá</span><h2>Vẫn còn một cuốn đang chờ bạn.</h2><p>Tìm theo tên sách, tác giả hoặc năm in trong toàn bộ kệ của tiệm.</p></div><a class="pt-button pt-button--amber" href="#tim-kiem">Tìm sách nâng cao ↗</a></aside>
      </div>
    </div>
  `;

  const page = root.firstElementChild;
  const shelf = page.querySelector("[data-collection-shelf]");
  const refreshShelf = () => { shelf.innerHTML = renderShelf(config, state); };

  page.addEventListener("click", (event) => {
    const tabButton = event.target.closest("[data-collection-tab]");
    if (tabButton) {
      state.tab = tabButton.dataset.collectionTab;
      refreshShelf();
      page.querySelector("#collection-shelf").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  page.addEventListener("change", (event) => {
    if (!event.target.matches("[data-collection-sort]")) return;
    state.sort = event.target.value;
    refreshShelf();
  });

  bindBookActions(page);
}

function bindBookActions(root) {
  root.addEventListener("click", (event) => {
    const wishButton = event.target.closest("[data-wishlist-id]");
    if (wishButton) {
      const id = wishButton.dataset.wishlistId;
      const wasSaved = getState().wishlist.includes(id);

      if (wasSaved) removeFromWishlist(id);
      else addToWishlist(id);

      const isSaved = getState().wishlist.includes(id);
      wishButton.classList.toggle("is-saved", isSaved);
      const book = findBook(id);
      const title = book ? `"${book.title}"` : "sách";
      wishButton.setAttribute("aria-label", `${isSaved ? "Bỏ" : "Lưu"} ${title} ${isSaved ? "khỏi" : "vào"} danh sách yêu thích`);
      const iconSpan = wishButton.querySelector(".material-symbols-outlined");
      if (iconSpan) iconSpan.textContent = isSaved ? "favorite" : "favorite_border";
      showToast(isSaved ? `Đã lưu ${title} vào danh sách yêu thích.` : `Đã bỏ ${title} khỏi danh sách yêu thích.`);
      return;
    }

    const cartButton = event.target.closest("[data-cart-id]");
    if (!cartButton) return;

    const id = cartButton.dataset.cartId;
    addToCart(id);
    const book = findBook(id);
    const title = book ? `"${book.title}"` : "sách";
    showToast(`Đã thêm ${title} vào giỏ hàng.`);
  });
}
