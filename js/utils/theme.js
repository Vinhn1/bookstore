const THEME_STORAGE_KEY = 'page-turner-theme';

export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  } catch {
    return 'light';
  }
}

export function getEffectiveTheme(theme = getStoredTheme()) {
  if (theme === 'system') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return theme;
}

export function applyTheme(theme = getStoredTheme()) {
  const effective = getEffectiveTheme(theme);
  document.documentElement.setAttribute('data-theme', effective);
  document.documentElement.setAttribute('data-theme-mode', theme);
  
  // Cập nhật biểu tượng toggle trên Header nếu có
  const icon = document.querySelector('[data-theme-icon]');
  const label = document.querySelector('[data-theme-label]');
  if (icon) {
    icon.textContent = effective === 'dark' ? 'light_mode' : 'dark_mode';
  }
  if (label) {
    label.textContent = effective === 'dark' ? 'Chế độ tối' : 'Chế độ sáng';
  }

  // Phát sự kiện để các trang (như trang Settings) cập nhật UI lựa chọn
  window.dispatchEvent(new CustomEvent('page-turner:themechange', {
    detail: { theme, effective }
  }));
}

export function setTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Không làm gián đoạn trải nghiệm nếu localStorage bị chặn
  }
  applyTheme(theme);
}

export function toggleTheme() {
  const current = getStoredTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

export function initTheme() {
  const current = getStoredTheme();
  applyTheme(current);

  // Lắng nghe thay đổi chế độ sáng/tối của hệ điều hành
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (getStoredTheme() === 'system') {
        applyTheme('system');
      }
    });
  }
}
