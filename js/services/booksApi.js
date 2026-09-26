const OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json";
const GOOGLE_BOOKS_SEARCH_URL = "https://www.googleapis.com/books/v1/volumes";
const GUTENDEX_SEARCH_URL = "https://gutendex.com/books";
const BOOK_SEARCH_QUERIES = [
  "vietnamese literature",
  "Vietnamese poetry",
  "classic literature",
  "novel history",
  "philosophy books",
  "children literature",
  "self help",
  "design books",
  "biography",
  "literary fiction",
  "sociology",
];
const REQUEST_TIMEOUT_MS = 2000;

async function fetchJsonWithTimeout(
  url,
  options = {},
  timeoutMs = REQUEST_TIMEOUT_MS,
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeBookCover(book) {
  if (book.cover_i) {
    return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
  }

  return undefined;
}

function normalizeTone(index) {
  const tones = ["new", "good", "used"];
  return tones[index % tones.length];
}

function normalizeCondition(tone) {
  const map = {
    new: { label: "Như mới", percent: 94 },
    good: { label: "Tốt", percent: 84 },
    used: { label: "Đã qua sử dụng", percent: 76 },
  };

  return map[tone] || map.good;
}

function safeText(value, fallback = "") {
  if (typeof value === "string") return value.trim() || fallback;
  if (Array.isArray(value) && value.length)
    return String(value[0]).trim() || fallback;
  return fallback;
}

function dedupeBooks(books) {
  const seen = new Set();

  return books.filter((book) => {
    const key = `${String(book.title || "").toLowerCase()}::${String(book.author || "").toLowerCase()}`;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sortByImagePriority(books) {
  const sourcePriority = {
    openlibrary: 1,
    google: 2,
    gutendex: 3,
  };

  return [...books].sort((a, b) => {
    const imageDiff = Number(Boolean(b.coverUrl)) - Number(Boolean(a.coverUrl));
    if (imageDiff !== 0) return imageDiff;

    const sourceDiff =
      (sourcePriority[a.source] || 99) - (sourcePriority[b.source] || 99);
    if (sourceDiff !== 0) return sourceDiff;

    return String(a.title).localeCompare(String(b.title));
  });
}

function buildNormalizedBook(book, index, source) {
  const title = safeText(book.title, "Sách chưa rõ tên");
  const author = safeText(book.author, "Tác giả chưa xác định");
  const publisher = safeText(book.publisher, "Nhà xuất bản chưa xác định");
  const year = Number(book.year || 2000 + (index % 25));
  const tone = normalizeTone(index + (source === "google" ? 1 : 0));
  const condition = normalizeCondition(tone);
  const priceBase = 48000 + (index + 1) * 19000;
  const originalPrice = priceBase + 22000;

  return {
    id: book.id || `api-${source}-${Date.now()}-${index}`,
    source,
    title,
    author,
    publisher,
    year,
    category: "vietnamese-literature",
    condition: {
      label: condition.label,
      percent: condition.percent,
      tone,
    },
    price: priceBase,
    originalPrice,
    badges:
      source === "google"
        ? ["Từ Google Books", "Dữ liệu trực tuyến"]
        : index % 2 === 0
          ? ["Ấn bản mới", "Đã kiểm định"]
          : ["Tìm thấy trực tuyến", "Bản lọc tự động"],
    description: safeText(
      book.description,
      "Ấn bản đang được kiểm định và bảo quản trước khi giao hàng.",
    ).slice(0, 110),
    coverUrl: book.coverUrl,
    coverClass: ["cover-paper", "cover-ink", "cover-stone"][index % 3],
  };
}

export async function fetchOpenLibraryBooks(
  query = "vietnamese literature",
  limit = 12,
) {
  const url = `${OPEN_LIBRARY_SEARCH_URL}?q=${encodeURIComponent(query)}&limit=${limit}`;

  const payload = await fetchJsonWithTimeout(url, {
    headers: {
      Accept: "application/json",
    },
  }).catch((error) => {
    throw new Error(
      `Open Library request failed: ${error.message || "network error"}`,
    );
  });
  const docs = Array.isArray(payload.docs) ? payload.docs : [];

  return docs
    .filter((book) => book && (book.title || book.author_name))
    .slice(0, limit)
    .map((book, index) => {
      const title = safeText(book.title, "Sách chưa rõ tên");
      const author = safeText(book.author_name, "Tác giả chưa xác định");
      const publisher = safeText(book.publisher, "Nhà xuất bản chưa xác định");
      const year = Number(book.first_publish_year || 2000 + (index % 25));

      return buildNormalizedBook(
        {
          id:
            book.key?.replace("/works/", "") ||
            `api-openlibrary-${Date.now()}-${index}`,
          title,
          author,
          publisher,
          year,
          description:
            Array.isArray(book.first_sentence) && book.first_sentence.length
              ? String(book.first_sentence[0]).slice(0, 110)
              : "Ấn bản đang được kiểm định và bảo quản trước khi giao hàng.",
          coverUrl: normalizeBookCover(book),
        },
        index,
        "openlibrary",
      );
    });
}

export async function fetchGoogleBooks(
  query = "vietnamese literature",
  limit = 12,
) {
  const url = `${GOOGLE_BOOKS_SEARCH_URL}?q=${encodeURIComponent(query)}&maxResults=${limit}&printType=books`;

  const payload = await fetchJsonWithTimeout(url, {
    headers: {
      Accept: "application/json",
    },
  }).catch((error) => {
    throw new Error(
      `Google Books request failed: ${error.message || "network error"}`,
    );
  });
  const books = Array.isArray(payload.items) ? payload.items : [];

  return books
    .filter(
      (book) =>
        book && (book.volumeInfo?.title || book.volumeInfo?.authors?.length),
    )
    .slice(0, limit)
    .map((book, index) => {
      const info = book.volumeInfo || {};
      const publishedDate = safeText(info.publishedDate, "2000");
      const year = Number(
        String(publishedDate).slice(0, 4) || 2000 + (index % 25),
      );
      const title = safeText(info.title, "Sách chưa rõ tên");
      const author = safeText(info.authors, "Tác giả chưa xác định");
      const publisher = safeText(info.publisher, "Nhà xuất bản chưa xác định");
      const coverUrl =
        info.imageLinks?.thumbnail ||
        info.imageLinks?.smallThumbnail ||
        undefined;

      return buildNormalizedBook(
        {
          id: book.id || `api-google-${Date.now()}-${index}`,
          title,
          author,
          publisher,
          year,
          description: safeText(
            info.description,
            "Ấn bản đang được kiểm định và bảo quản trước khi giao hàng.",
          ),
          coverUrl: coverUrl
            ? coverUrl.replace("http://", "https://")
            : undefined,
        },
        index,
        "google",
      );
    });
}

export async function fetchGutendexBooks(
  query = "vietnamese literature",
  limit = 12,
) {
  const url = `${GUTENDEX_SEARCH_URL}?search=${encodeURIComponent(query)}&page=1&count=${limit}`;

  const payload = await fetchJsonWithTimeout(url, {
    headers: {
      Accept: "application/json",
    },
  }).catch((error) => {
    throw new Error(
      `Gutendex request failed: ${error.message || "network error"}`,
    );
  });
  const books = Array.isArray(payload.results) ? payload.results : [];

  return books
    .filter((book) => book && (book.title || book.authors?.length))
    .slice(0, limit)
    .map((book, index) => {
      const author =
        Array.isArray(book.authors) && book.authors.length
          ? book.authors.map((person) => person.name).join(", ")
          : "Tác giả chưa xác định";
      const title = safeText(book.title, "Sách chưa rõ tên");
      const year = Number(book?.bookshelves?.[0] ? 2000 : 2000 + (index % 25));
      const coverUrl = Array.isArray(book.formats)
        ? Object.entries(book.formats).find(
            ([key]) => key.includes("image/jpeg") || key.includes("image/png"),
          )?.[1]
        : undefined;

      return buildNormalizedBook(
        {
          id: `gutendex-${book.id || `${Date.now()}-${index}`}`,
          title,
          author,
          publisher: "Project Gutenberg",
          year,
          description: safeText(
            book?.summaries?.[0],
            "Bản sách công cộng được thu thập từ nguồn kỹ thuật số đáng tin cậy.",
          ),
          coverUrl: coverUrl
            ? coverUrl.replace("http://", "https://")
            : undefined,
        },
        index,
        "gutendex",
      );
    });
}

export async function fetchMultiSourceBooks(
  query = "vietnamese literature",
  limit = 12,
) {
  const targetLimit = Math.max(1, Number(limit) || 12);
  const queries = Array.from(
    new Set([query, ...BOOK_SEARCH_QUERIES.filter((item) => item !== query)]),
  ).slice(0, 4);

  const sourceTasks = [
    async () => {
      const results = await Promise.allSettled(
        queries
          .slice(0, 2)
          .map((item) =>
            fetchGutendexBooks(item, Math.max(2, Math.ceil(targetLimit / 2))),
          ),
      );

      return results.flatMap((result) =>
        result.status === "fulfilled" ? result.value : [],
      );
    },
    async () => {
      const results = await Promise.allSettled(
        queries
          .slice(0, 2)
          .map((item) =>
            fetchOpenLibraryBooks(
              item,
              Math.max(2, Math.ceil(targetLimit / 3)),
            ),
          ),
      );

      return results.flatMap((result) =>
        result.status === "fulfilled" ? result.value : [],
      );
    },
    async () => {
      const results = await Promise.allSettled(
        queries
          .slice(0, 2)
          .map((item) =>
            fetchGoogleBooks(item, Math.max(2, Math.ceil(targetLimit / 3))),
          ),
      );

      return results.flatMap((result) =>
        result.status === "fulfilled" ? result.value : [],
      );
    },
  ];

  const combined = [];

  for (const task of sourceTasks) {
    try {
      const sourceBooks = await task();
      if (sourceBooks.length) {
        combined.push(...sourceBooks);
        break;
      }
    } catch {
      // Ignore a source if the public API is rate-limited or unavailable.
    }
  }

  if (!combined.length) {
    throw new Error("All public book sources failed.");
  }

  const uniqueBooks = dedupeBooks(combined);
  const prioritizedBooks = sortByImagePriority(uniqueBooks);

  return prioritizedBooks.slice(0, targetLimit);
}
