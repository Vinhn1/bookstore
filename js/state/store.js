import { account, books, orders as defaultOrders } from '../data.js';

const STORAGE_KEY = 'page-turner-state-v1';
const WISHLIST_VERSION = 2; // Increment to force-reset old wishlist seeds
const LEGACY_SEED = ['so-do', 'mat-biec', 'noi-buon-chien-tranh', 'ha-noi-36-pho-phuong'];
const LEGACY_SEED_SET = new Set(LEGACY_SEED);

function isLegacySeed(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  // Single "so-do" seed
  if (arr.length === 1 && arr[0] === 'so-do') return true;
  // Full 4-item seed exactly matching legacy order
  if (arr.length === 4 && arr.every((item, i) => item === LEGACY_SEED[i])) return true;
  // Any subset of legacy seed IDs (covers all partial seed combinations)
  if (arr.every((item) => LEGACY_SEED_SET.has(item))) return true;
  return false;
}

export const initialAddresses = [
  {
    id: 'addr-1',
    name: 'Nguyễn Hoàng Hải',
    phone: '0912 845 678',
    province: 'Vĩnh Long',
    district: 'TP. Vĩnh Long',
    address: 'Số 12 Trưng Nữ Vương, Phường 1',
    tag: 'Nhà riêng',
    isDefault: true
  },
  {
    id: 'addr-2',
    name: 'Nguyễn Hoàng Hải',
    phone: '0912 845 678',
    province: 'Vĩnh Long',
    district: 'Huyện Long Hồ',
    address: 'Số 88 Khóm 1, Thị trấn Long Hồ',
    tag: 'Thư phòng',
    isDefault: false
  },
  {
    id: 'addr-3',
    name: 'Nguyễn Hoàng Hải',
    phone: '0988 123 456',
    province: 'Thành phố Hồ Chí Minh',
    district: 'Thành phố Thủ Đức (Sau sáp nhập Q2, Q9 & Thủ Đức)',
    address: 'Số 88 Đường Song Hành, Phường An Phú',
    tag: 'Kho lưu trữ',
    isDefault: false
  }
];

const initialState = {
  cart: [],
  cartCount: 0,
  wishlist: [],
  wishlistVersion: WISHLIST_VERSION,
  wishlistFilter: 'all',
  orderFilter: 'all',
  orders: structuredClone(defaultOrders),
  account: structuredClone(account),
  addresses: structuredClone(initialAddresses),
  isAuthenticated: true
};

let state = hydrateState();

function hydrateState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!saved) return structuredClone(initialState);

    let wishlist = [];
    const isOutdatedVersion = (saved.wishlistVersion || 0) < WISHLIST_VERSION;

    if (Array.isArray(saved.wishlist)) {
      // Legacy seed check always takes priority — clear mock data regardless of flags
      if (isLegacySeed(saved.wishlist)) {
        wishlist = [];
      } else if (isOutdatedVersion) {
        // Old version without version tracking — reset to be safe
        wishlist = [];
      } else if (saved.wishlist.length > 0 && (saved.userCreatedWishlist || saved.userExplicitWishlist)) {
        wishlist = saved.wishlist;
      }
      // If no explicit user interaction flags, wishlist stays []
    }

    const cart = Array.isArray(saved.cart) ? saved.cart : [];
    const cartCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const orders = Array.isArray(saved.orders) && saved.orders.length > 0 ? saved.orders : structuredClone(defaultOrders);

    return {
      ...structuredClone(initialState),
      ...saved,
      cart,
      cartCount,
      wishlist,
      wishlistVersion: WISHLIST_VERSION,
      orders,
      isAuthenticated: saved.isAuthenticated !== undefined ? Boolean(saved.isAuthenticated) : true,
      addresses: Array.isArray(saved.addresses) && saved.addresses.length > 0 ? saved.addresses : structuredClone(initialAddresses),
      account: { ...structuredClone(account), ...(saved.account || {}), notifications: { ...account.notifications, ...(saved.account?.notifications || {}) } }
    };
  } catch {
    return structuredClone(initialState);
  }
}

export function getState() { return state; }

export function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* local-only demo can continue without storage */
  }
}

export function setState(patch) {
  state = { ...state, ...patch };
  persistState();
  syncShellBadges();
  return state;
}

export function syncShellBadges() {
  if (typeof document === 'undefined') return;
  const cartBadges = document.querySelectorAll('[data-cart-count]');
  cartBadges.forEach((el) => {
    el.textContent = state.cartCount || 0;
  });
  const wishBadges = document.querySelectorAll('[data-wishlist-count]');
  wishBadges.forEach((el) => {
    el.textContent = state.wishlist?.length || 0;
  });
}

export function addToCart(bookId, quantity = 1) {
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const cart = [...(state.cart || [])];
  const existingIndex = cart.findIndex((item) => item.bookId === bookId);
  if (existingIndex > -1) {
    cart[existingIndex] = {
      ...cart[existingIndex],
      quantity: cart[existingIndex].quantity + qty
    };
  } else {
    cart.push({ bookId, quantity: qty, addedAt: Date.now() });
  }
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  state = { ...state, cart, cartCount, lastAddedBookId: bookId };
  persistState();
  syncShellBadges();
  return state;
}

export function removeFromCart(bookId) {
  const cart = (state.cart || []).filter((item) => item.bookId !== bookId);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  state = { ...state, cart, cartCount };
  persistState();
  syncShellBadges();
  return state;
}

export function updateCartQuantity(bookId, quantity) {
  const qty = parseInt(quantity, 10);
  let cart = [...(state.cart || [])];
  if (isNaN(qty) || qty <= 0) {
    cart = cart.filter((item) => item.bookId !== bookId);
  } else {
    const index = cart.findIndex((item) => item.bookId === bookId);
    if (index > -1) {
      cart[index] = { ...cart[index], quantity: qty };
    }
  }
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  state = { ...state, cart, cartCount };
  persistState();
  syncShellBadges();
  return state;
}

export function clearCart() {
  state = { ...state, cart: [], cartCount: 0 };
  persistState();
  syncShellBadges();
  return state;
}

export function checkoutCart({
  recipientName = '',
  recipientPhone = '',
  shippingAddress = '',
  shippingMethod = 'standard',
  shippingCost = 0,
  paymentMethod = 'cod',
  paymentDetails = {},
  note = '',
  discountCode = '',
  discountAmount = 0
} = {}) {
  if (!state.cart || state.cart.length === 0) return null;
  const currentBooks = books;
  let subtotal = 0;
  const items = state.cart.map((cartItem) => {
    const book = currentBooks.find((b) => b.id === cartItem.bookId);
    const price = book ? book.price : 100000;
    subtotal += price * cartItem.quantity;
    return {
      bookId: cartItem.bookId,
      title: book ? book.title : 'Ấn bản sách',
      author: book ? book.author : '',
      coverClass: book ? book.coverClass : 'cover-paper',
      quantity: cartItem.quantity,
      price,
      packaging: shippingMethod === 'express' ? 'Hộp cứng Archival Box khử acid & đệm mút' : 'Hộp carton 3 lớp bọc chống ẩm chuyên dụng'
    };
  });

  const finalTotal = Math.max(0, subtotal + shippingCost - discountAmount);

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const dayStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;

  const defaultAddr = (state.addresses || []).find((a) => a.isDefault) || state.addresses?.[0];
  const finalRecipientName = recipientName || state.account?.name || 'Nguyễn Hoàng Hải';
  const finalRecipientPhone = recipientPhone || state.account?.phone || '0912 845 678';
  const finalShippingAddress = shippingAddress || (defaultAddr ? `${defaultAddr.address}, ${defaultAddr.district}, ${defaultAddr.province}` : 'Số 12 Trưng Nữ Vương, Phường 1, TP. Vĩnh Long');

  let paymentLabel = 'Thanh toán khi nhận hàng (COD)';
  let paymentStatus = 'Chưa thanh toán (Thu hộ khi nhận hàng)';
  if (paymentMethod === 'banking') {
    paymentLabel = 'Chuyển khoản ngân hàng (VietQR)';
    paymentStatus = 'Đang chờ đối soát chuyển khoản';
  } else if (paymentMethod === 'card') {
    paymentLabel = `Thẻ quốc tế (${paymentDetails.cardType || 'Visa'} ···· ${paymentDetails.last4 || '8888'})`;
    paymentStatus = 'Đã thanh toán qua thẻ';
  } else if (paymentMethod === 'ewallet') {
    paymentLabel = `Ví điện tử (${paymentDetails.walletName || 'MoMo'})`;
    paymentStatus = 'Đã thanh toán qua ví';
  }

  const orderId = `PT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}X`;
  const isExpress = shippingMethod === 'express';

  const newOrder = {
    id: orderId,
    placedAt: dateStr,
    placedTime: `${dayStr} ${timeStr}`,
    paymentMethod,
    paymentLabel,
    paymentStatus,
    paymentDetails,
    shippingMethod,
    shippingMethodLabel: isExpress ? 'Giao hỏa tốc & Bảo tồn nguyên bản (24h)' : 'Giao hàng tiêu chuẩn (2–3 ngày)',
    shippingCost,
    subtotal,
    discountCode,
    discountAmount,
    total: finalTotal,
    status: 'shipping',
    eta: isExpress ? 'Trong 24 giờ' : '2 - 3 ngày',
    carrier: isExpress ? 'The Page Turner Express (Bàn giao trực tiếp)' : 'Giao Hàng Nhanh',
    trackingCode: `GHN-${orderId.replace(/[^a-zA-Z0-9]/g, '')}`,
    note: note || '',
    recipientName: finalRecipientName,
    recipientPhone: finalRecipientPhone,
    shippingAddress: finalShippingAddress,
    items,
    timeline: [
      { label: 'Đã tiếp nhận đơn hàng', date: `${dayStr} · ${timeStr}`, state: 'done' },
      { label: isExpress ? 'Đang bọc hộp khử acid & niêm phong' : 'Đang đóng gói & khử acid', date: 'Đang xử lý', state: 'active' },
      { label: 'Bàn giao vận chuyển', date: isExpress ? 'Trong ngày' : 'Dự kiến hôm nay', state: 'pending' },
      { label: 'Giao hàng thành công', date: 'Chưa cập nhật', state: 'pending' }
    ]
  };

  const orders = [newOrder, ...(state.orders || defaultOrders)];
  state = { ...state, orders, cart: [], cartCount: 0 };
  persistState();
  syncShellBadges();
  return newOrder;
}

export function addToWishlist(bookId) {
  const wishlist = state.wishlist.includes(bookId)
    ? state.wishlist
    : [...state.wishlist, bookId];
  state = { ...state, wishlist, userCreatedWishlist: true, userExplicitWishlist: true };
  persistState();
  syncShellBadges();
  return state;
}

export function removeFromWishlist(bookId) {
  const wishlist = state.wishlist.filter((id) => id !== bookId);
  state = { ...state, wishlist, userCreatedWishlist: true, userExplicitWishlist: true };
  persistState();
  syncShellBadges();
  return state;
}

export function clearWishlist() {
  state = { ...state, wishlist: [], userCreatedWishlist: true, userExplicitWishlist: true };
  persistState();
  syncShellBadges();
  return state;
}

export function toggleWishlist(bookId) {
  const isSaved = state.wishlist.includes(bookId);
  if (isSaved) {
    removeFromWishlist(bookId);
    return false;
  } else {
    addToWishlist(bookId);
    return true;
  }
}

export function isBookInWishlist(bookId) {
  return state.wishlist?.includes(bookId) || false;
}

export function updateWishlistFilter(filter) { return setState({ wishlistFilter: filter }); }
export function updateOrderFilter(filter) { return setState({ orderFilter: filter }); }
export function updateAccount(patch) { return setState({ account: { ...state.account, ...patch } }); }
export function updateAccountNotifications(patch) { return updateAccount({ notifications: { ...state.account.notifications, ...patch } }); }
export function resetAccount(accountSnapshot) { return setState({ account: structuredClone(accountSnapshot) }); }
export function login({ name, email } = {}) {
  const accountPatch = {};
  if (name) accountPatch.name = name;
  if (email) accountPatch.email = email;
  return setState({
    isAuthenticated: true,
    account: { ...state.account, ...accountPatch }
  });
}
export function logout() {
  return setState({ isAuthenticated: false });
}

export function addAddress(address) {
  const newAddr = { ...address, id: 'addr-' + Date.now() };
  let addresses = [...(state.addresses || initialAddresses)];
  if (newAddr.isDefault) {
    addresses = addresses.map(a => ({ ...a, isDefault: false }));
  }
  addresses.push(newAddr);
  return setState({ addresses });
}

export function setDefaultAddress(id) {
  const addresses = (state.addresses || initialAddresses).map(a => ({
    ...a,
    isDefault: a.id === id
  }));
  return setState({ addresses });
}

export function deleteAddress(id) {
  let addresses = (state.addresses || initialAddresses).filter(a => a.id !== id);
  if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
    addresses[0].isDefault = true;
  }
  return setState({ addresses });
}
