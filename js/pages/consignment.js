import { consignmentSeed } from '../data.js';
import { renderBreadcrumb, showToast } from '../components/shell.js';
import { renderField, renderSelect, renderTextarea } from '../components/ui.js';
import { escapeHtml } from '../utils/formatters.js';

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function mountConsignment(root) {
  let uploadedImages = [];

  root.innerHTML = `<div class="consignment-page pt-main">
    <div class="pt-container--wide">
      ${renderBreadcrumb(['Đồng hành cùng sách', 'Ký gửi & thu mua sách cũ'])}
      <section class="consignment-hero">
        <div>
          <div class="page-eyebrow">Ký gửi · Thu mua · Bảo tồn</div>
          <h1>Trao lại một đời sách,<br><span>để câu chuyện tiếp tục.</span></h1>
          <p>The Page Turner nhận ký gửi và thu mua những cuốn sách có giá trị đọc, giá trị sưu tầm và một câu chuyện đáng được giữ lại.</p>
          <div class="consignment-hero__actions">
            <a class="pt-button pt-button--primary" href="#submission">Gửi thông tin sách ↗</a>
            <a class="pt-button pt-button--secondary" href="#process">Xem quy trình</a>
          </div>
          <div class="consignment-trust">
            <span>✓ Thẩm định minh bạch</span>
            <span>✓ Báo giá trong 2–3 ngày</span>
            <span>✓ Bảo quản lưu trữ</span>
          </div>
        </div>
        <div class="consignment-visual">
          <div class="consignment-visual__top">
            <span class="consignment-visual__badge">Sổ tay ký gửi · 01</span>
            <span class="consignment-visual__watermark">PT</span>
          </div>
          <div class="consignment-visual__book">
            <div class="consignment-visual__book-inner">
              <span class="consignment-visual__book-title">MỘT<br>ĐỜI<br>SÁCH</span>
              <span class="consignment-visual__book-meta">lưu truyền</span>
            </div>
          </div>
          <div class="consignment-visual__quote">
            Bản thảo của bạn<strong>Có thể là một phát hiện mới.</strong>
          </div>
          <div class="consignment-visual__footer">
            <span>Vĩnh Long · từ 2018</span>
            <strong>→ Bắt đầu gửi</strong>
          </div>
        </div>
      </section>

      <section class="consignment-process" id="process">
        <div class="consignment-section-heading">
          <div>
            <div class="page-eyebrow">Cách chúng tôi làm việc</div>
            <h2>Bốn bước để sách được trao đúng nơi</h2>
          </div>
          <p>Từ thông tin ban đầu đến lúc hoàn tất ký gửi, mọi mốc đều được thông báo rõ ràng.</p>
        </div>
        <div class="consignment-process__grid">
          ${[
            ['01', 'Gửi thông tin & ảnh', 'Cho chúng tôi biết về cuốn sách và đính kèm ảnh thực tế nếu có.', 'Form trực tuyến'],
            ['02', 'Thẩm định', 'Đội ngũ xem xét tình trạng, ấn bản, nhu cầu đọc và sưu tầm.', '2–3 ngày làm việc'],
            ['03', 'Định giá', 'Báo giá dựa trên tình trạng, độ hiếm và thị trường thực tế.', 'Có căn cứ'],
            ['04', 'Ký gửi / Thu mua', 'Bạn chọn hình thức phù hợp, chúng tôi tiếp nhận và bảo quản sách.', 'Hoàn tất minh bạch']
          ].map(([number, title, description, meta]) => `
            <article class="process-step">
              <div class="process-step__number">${number}</div>
              <h3>${title}</h3>
              <p>${description}</p>
              <div class="process-step__meta">${meta}</div>
            </article>
          `).join('')}
        </div>
      </section>
    </div>

    <section class="consignment-criteria">
      <div class="pt-container--wide">
        <div class="consignment-criteria__grid">
          <div class="consignment-criteria__intro">
            <div class="page-eyebrow">Tiêu chí tiếp nhận</div>
            <h2>Một cuốn sách<br>đáng để lưu giữ.</h2>
            <p>Chúng tôi ưu tiên những ấn bản có nội dung tốt, nguồn gốc rõ và tình trạng đủ để tiếp tục một vòng đời mới.</p>
            <div class="consignment-quote">“Không chỉ là bán lại. Là tìm một người đọc tiếp theo.”</div>
          </div>
          <div class="criteria-grid">
            ${[
              ['✦', 'Nội dung có giá trị', 'Văn học, lịch sử, triết học, nghệ thuật, sách thiếu nhi chọn lọc và ngoại văn.'],
              ['⌑', 'Ấn bản rõ ràng', 'Có thông tin tác giả, nhà xuất bản và năm in đủ để xác định ấn bản.'],
              ['◌', 'Tình trạng đủ tốt', 'Không bắt buộc hoàn hảo; mọi dấu vết đều được ghi nhận trung thực.'],
              ['✎', 'Có câu chuyện riêng', 'Chữ ký, dấu mộc, lời đề tặng và nguồn gốc đều giúp cuốn sách có thêm giá trị.']
            ].map(([icon, title, description]) => `
              <article class="criteria-card">
                <div class="criteria-card__icon">${icon}</div>
                <h3>${title}</h3>
                <p>${description}</p>
              </article>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <section class="consignment-form-section" id="submission">
      <div class="pt-container--wide">
        <div class="consignment-form-layout">
          <section class="consignment-form-card">
            <div class="page-eyebrow">Bắt đầu từ vài dòng thông tin</div>
            <h2>Gửi thông tin sách của bạn</h2>
            <p>Tải ảnh thực tế (bìa, gáy, trang sách) để được thẩm định và báo giá nhanh nhất · phản hồi trong 2–3 ngày làm việc.</p>
            
            <div class="consignment-success" data-consignment-success></div>

            <form id="consignment-form" class="consignment-fields" novalidate>
              ${renderField({ id: 'consign-name', label: 'Họ và tên', name: 'name', value: consignmentSeed.name, required: true })}
              ${renderField({ id: 'consign-email', label: 'Email', type: 'email', name: 'email', value: consignmentSeed.email, required: true })}
              ${renderField({ id: 'consign-phone', label: 'Số điện thoại', type: 'tel', name: 'phone', value: consignmentSeed.phone, required: true })}
              ${renderField({ id: 'consign-title', label: 'Tên sách', name: 'title', placeholder: 'Ví dụ: Số đỏ', required: true })}
              ${renderField({ id: 'consign-author', label: 'Tác giả', name: 'author', placeholder: 'Vũ Trọng Phụng', required: true })}
              ${renderField({ id: 'consign-publisher', label: 'Nhà xuất bản', name: 'publisher', placeholder: 'NXB Văn học' })}
              ${renderField({ id: 'consign-year', label: 'Năm xuất bản', name: 'year', placeholder: '1972' })}
              ${renderSelect({
                id: 'consign-method',
                label: 'Hình thức mong muốn',
                name: 'method',
                value: 'consignment',
                options: [
                  { value: 'consignment', label: 'Ký gửi — nhận tiền khi bán' },
                  { value: 'buyback', label: 'Thu mua — nhận tiền sau thẩm định' }
                ]
              })}
              <div class="consignment-field--full">
                ${renderTextarea({ id: 'consign-condition', label: 'Mô tả tình trạng sách', name: 'condition', placeholder: 'Bìa, gáy, ruột sách, chữ ký, ghi chú hoặc dấu vết sử dụng...' })}
              </div>

              <!-- Khu vực tải lên & cập nhật hình ảnh sách -->
              <div class="consignment-field--full consignment-upload-field">
                <div class="consignment-upload-header">
                  <label class="pt-field__label" for="consign-images">
                    Hình ảnh thực tế của sách
                    <span class="consignment-upload-counter" data-upload-counter>(0/8 ảnh)</span>
                  </label>
                  <span class="pt-field__help">Chụp bìa trước, bìa sau, gáy sách hoặc trang có chữ ký, vết ố (nếu có)</span>
                </div>

                <div class="consignment-dropzone" id="consign-dropzone" tabindex="0" role="button" aria-label="Chọn hoặc kéo thả ảnh sách">
                  <input type="file" id="consign-images" accept="image/png, image/jpeg, image/webp" multiple style="display: none;">
                  <span class="material-symbols-outlined consignment-dropzone__icon" aria-hidden="true">add_photo_alternate</span>
                  <div class="consignment-dropzone__text">
                    <strong>Nhấn để chọn ảnh</strong> hoặc kéo thả vào đây
                  </div>
                  <div class="consignment-dropzone__hint">Hỗ trợ JPG, PNG, WEBP · Tối đa 10MB mỗi ảnh · Tối đa 8 ảnh</div>
                </div>

                <div class="consignment-gallery" id="consign-gallery" aria-live="polite"></div>
              </div>

              ${renderField({ id: 'consign-price', label: 'Giá bạn ước tính', name: 'price', placeholder: 'Ví dụ 350.000 ₫' })}
              ${renderField({ id: 'consign-notes', label: 'Ghi chú thêm (tuỳ chọn)', name: 'notes', placeholder: 'Lời đề tặng, nguồn gốc...' })}
              
              <label class="pt-check-row consignment-field--full" for="consign-consent">
                <input id="consign-consent" name="consent" type="checkbox" required>
                <span>Tôi đồng ý để The Page Turner liên hệ về thông tin sách này.</span>
              </label>
              
              <button class="pt-button pt-button--primary consignment-field--full" type="submit">
                Gửi thông tin sách <span aria-hidden="true">→</span>
              </button>
            </form>
          </section>

          <aside class="consignment-trust-panel">
            <div class="consignment-trust-panel__main">
              <div class="page-eyebrow" style="color:#f4c477">Cam kết định giá</div>
              <h2>Rõ ràng từ<br>trang đầu tiên.</h2>
              <p>Mỗi cuốn sách được đọc như một vật phẩm riêng, không chạy theo một công thức máy móc.</p>
              <div class="consignment-trust-list">
                ${[
                  ['01', 'Chấm tình trạng có căn cứ', 'Bìa, gáy, ruột, chữ ký và vết ẩm được ghi nhận trung thực.'],
                  ['02', 'Ảnh thật, mô tả thật', 'Sách đăng bán được chụp tại tiệm, không dùng ảnh minh hoạ.'],
                  ['03', 'Bảo quản như sách quý', 'Được làm sạch, bọc và lưu trữ trong điều kiện phù hợp.'],
                  ['04', 'Kỳ vọng thanh toán rõ ràng', 'Ký gửi được đối soát định kỳ; thu mua thanh toán sau khi chốt giá.']
                ].map(([number, title, description]) => `
                  <div class="consignment-trust-list__item">
                    <span class="consignment-trust-list__number">${number}</span>
                    <div>
                      <h3>${title}</h3>
                      <p>${description}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="consignment-trust-panel__extra">
              <h3>Thang tình trạng</h3>
              <div class="consignment-condition-list">
                <span class="pt-badge pt-badge--new">Như mới</span>
                <span class="pt-badge pt-badge--good">Tốt</span>
                <span class="pt-badge pt-badge--used">Đã qua sử dụng</span>
                <span class="pt-badge pt-badge--worn">Có dấu vết rõ</span>
              </div>
              <p style="margin-top:18px;padding-top:14px;border-top:1px solid var(--pt-line)">
                <strong>Thanh toán & hoàn trả.</strong> Nếu không phù hợp với mức giá hoặc hình thức đã trao đổi, sách được gửi trả theo thỏa thuận ban đầu.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="consignment-note-section">
      <div class="pt-container--wide">
        <div class="consignment-note-grid">
          <div>
            <div class="page-eyebrow">Trước khi gửi</div>
            <h2>Một vài điều<br>cần biết.</h2>
            <p>Chúng tôi muốn quá trình trao đổi nhẹ nhàng, rõ ràng và tôn trọng cả cuốn sách lẫn người sở hữu.</p>
          </div>
          <div class="consignment-notes">
            ${[
              ['01', 'Chưa cần đóng gói hoặc mang sách đến ngay', 'Bước đầu chỉ cần thông tin cơ bản; chúng tôi sẽ hướng dẫn cách tiếp nhận sau khi xem xét.', 'Rõ ràng'],
              ['02', 'Hình ảnh chụp thực tế giúp định giá nhanh', 'Bạn có thể tải ảnh trực tiếp ở biểu mẫu hoặc gửi bổ sung qua email khi tiệm liên hệ.', 'Tiện lợi'],
              ['03', 'Bạn luôn được biết sách đang ở đâu', 'Từ lúc tiếp nhận, định giá đến khi bán được, mọi mốc đối soát đều được thông báo.', 'An tâm']
            ].map(([number, title, description, tag]) => `
              <div class="consignment-note">
                <span class="consignment-note__number">${number}</span>
                <div>
                  <h3>${title}</h3>
                  <p>${description}</p>
                </div>
                <span class="consignment-note__tag">${tag}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  </div>`;

  const form = root.querySelector('#consignment-form');
  const fileInput = root.querySelector('#consign-images');
  const dropzone = root.querySelector('#consign-dropzone');
  const gallery = root.querySelector('#consign-gallery');
  const counter = root.querySelector('[data-upload-counter]');

  function updateGalleryUI() {
    if (counter) {
      counter.textContent = `(${uploadedImages.length}/8 ảnh)`;
    }

    if (!gallery) return;

    if (uploadedImages.length === 0) {
      gallery.innerHTML = '';
      gallery.style.display = 'none';
      return;
    }

    gallery.style.display = 'grid';

    const cardsHtml = uploadedImages.map((img, index) => `
      <div class="consignment-thumb-card" data-thumb-id="${img.id}">
        <img src="${img.dataUrl}" alt="${escapeHtml(img.name)}" loading="lazy">
        <span class="consignment-thumb-badge">${index === 0 ? 'Ảnh bìa' : `#${index + 1}`}</span>
        <button type="button" class="consignment-thumb-remove" data-remove-id="${img.id}" aria-label="Xóa ảnh ${escapeHtml(img.name)}">
          <span class="material-symbols-outlined" aria-hidden="true">close</span>
        </button>
        <div class="consignment-thumb-info" title="${escapeHtml(img.name)} (${img.size})">
          ${escapeHtml(img.name)}
        </div>
      </div>
    `).join('');

    const addMoreHtml = uploadedImages.length < 8 ? `
      <button type="button" class="consignment-add-card" id="consign-add-more" aria-label="Tải thêm ảnh">
        <span class="material-symbols-outlined" aria-hidden="true">add</span>
        <span>Thêm ảnh</span>
      </button>
    ` : '';

    gallery.innerHTML = cardsHtml + addMoreHtml;

    gallery.querySelectorAll('[data-remove-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idToRemove = btn.getAttribute('data-remove-id');
        uploadedImages = uploadedImages.filter((item) => item.id !== idToRemove);
        updateGalleryUI();
        showToast('Đã xóa ảnh.', 'info');
      });
    });

    const addMoreBtn = gallery.querySelector('#consign-add-more');
    if (addMoreBtn) {
      addMoreBtn.addEventListener('click', () => {
        fileInput?.click();
      });
    }
  }

  function handleFiles(files) {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxFiles = 8;
    const maxSize = 10 * 1024 * 1024; // 10MB

    let addedCount = 0;

    for (const file of fileList) {
      if (uploadedImages.length >= maxFiles) {
        showToast(`Tối đa ${maxFiles} ảnh cho mỗi cuốn sách.`, 'warning');
        break;
      }

      if (!validImageTypes.includes(file.type) && !file.type.startsWith('image/')) {
        showToast(`Tệp "${file.name}" không phải là định dạng ảnh hợp lệ (JPG, PNG, WEBP).`, 'error');
        continue;
      }

      if (file.size > maxSize) {
        showToast(`Ảnh "${file.name}" vượt quá dung lượng 10MB.`, 'error');
        continue;
      }

      const reader = new FileReader();
      const tempId = 'img-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

      reader.onload = (e) => {
        uploadedImages.push({
          id: tempId,
          name: file.name,
          size: formatFileSize(file.size),
          dataUrl: e.target.result,
          file: file
        });
        updateGalleryUI();
      };

      reader.readAsDataURL(file);
      addedCount++;
    }

    if (addedCount > 0) {
      showToast(`Đã thêm ${addedCount} ảnh.`);
    }
  }

  // Sự kiện click Dropzone
  dropzone?.addEventListener('click', (e) => {
    if (e.target !== fileInput) {
      fileInput?.click();
    }
  });

  dropzone?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput?.click();
    }
  });

  // Sự kiện chọn tệp
  fileInput?.addEventListener('change', () => {
    if (fileInput.files) {
      handleFiles(fileInput.files);
      fileInput.value = '';
    }
  });

  // Sự kiện kéo thả
  ['dragenter', 'dragover'].forEach((eventName) => {
    dropzone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('is-dragover');
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    dropzone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('is-dragover');
    });
  });

  dropzone?.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  });

  // Xử lý gửi biểu mẫu
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach((field) => {
      if ((field.type === 'checkbox' && !field.checked) || (field.type !== 'checkbox' && !field.value.trim())) {
        field.closest('.pt-field')?.classList.add('is-invalid');
        valid = false;
      }
    });

    if (!valid) {
      showToast('Vui lòng điền các trường bắt buộc.', 'error');
      return;
    }

    const success = root.querySelector('[data-consignment-success]');
    const imageInfo = uploadedImages.length > 0 
      ? ` kèm ${uploadedImages.length} ảnh thực tế` 
      : '';

    success.innerHTML = `
      <div class="consignment-success__content">
        <span class="material-symbols-outlined consignment-success__icon" aria-hidden="true">check_circle</span>
        <div>
          <strong>Gửi thông tin sách thành công!</strong>
          <p>The Page Turner đã tiếp nhận thông tin${imageInfo}. Thủ thư chuyên trách sẽ thẩm định và phản hồi đến bạn trong vòng 2–3 ngày làm việc.</p>
        </div>
      </div>
    `;
    success.classList.add('is-visible');
    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    showToast(`Đã gửi thông tin sách${imageInfo} thành công.`);

    // Reset biểu mẫu & danh sách ảnh
    form.reset();
    uploadedImages = [];
    updateGalleryUI();
  });
}
