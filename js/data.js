const imageUrls = {
  matBiec: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu46ib24Cp_IGMe2vo_6WL64g5ma-23foulD3ZDErilw7Hhpkz7cmU7KetbbAkiwqThE3Pf0ieyqfvV5lElAU55xf7lHgxhAqb_HlbcR-sRJ5oJpOb9Ire4cxnZ3REoTs-0cZYAbiuI4HD1pA-yfrkgnJxwW3rajNII_iPF1A8iTuscV0dAGyw7pUtMZYqbEZRXV0wCIzpPuogs_tg3Jg6QG_OeKKwvPwcFbwFp_npoSZAo8OjxmOv',
  hoaVang: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDC-7iuOQG65Cvw2pwGI_hsvcX_O5WQtoKOMauFWCas4zOSu1-wcata4srSyLc2eku3mTc6edtdJKr5EMHAdsBow2zCGuM1mdZFQ4C7gHMTmqM3mJEKXI5nrH2qjKc0mGiks-LwGrKF3t_GBDvBrGKF723JzHMPkjpLFm0e2zQTkOSqmxCR0MeWpLkRzAbku1vKRPEeywk_yP0XsBgswS1PSA_P9ZYZAPIqJWpaWYCjFn-SOuNFllp',
  kinhVanHoa: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvVTyk0sG2a98Mmsk4qtQtSVGna4y0oxcjqPZKE55H4--1JasqmHx5K_DwZ2cId7gR66OKC_C-g4w2bKFg331nIzVvmFXM9VxD5EfMKc0iJuna8caFFhtFk-iQ5dWdgXwg7Qw7ykeWPkvdGMDaWhTcz0UpopgEAOEbe6_FV0OH_MMrH8CNkNVXAY5XJ8QUfbnNrr4NkwHXj9RMKJenAz72QcgE-uI8HdM9X4D_I55k_PQFo6yNdPHZ',
  tuoiTho: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrxC3zhR_XA5uVuxan0pNZXhNxoaD-qi6QapGWVj4wvheOkAYBQM4w2bszutB2MTZ1A60NoTb_CRqTBz2inn6Ko5vpUNWeBbLuMtWx8xnvm_oKxE4lgLlNMxFh7PDfCRIJB_5ZaUUztpXAcNhIW6oKYtPrDn94RGDfQE3zFRbjJtdhlyPWS02aL_8KNkot3vTbvOozdD0TXM0KYd9EYm0KSXMA8RbjAz-CMsfUO_n8rESH-0Qk4WJE'
};

export const books = [
  { id: 'so-do', title: 'Số đỏ', author: 'Vũ Trọng Phụng', publisher: 'NXB Mai Lĩnh', year: 1936, category: 'vietnamese-literature', condition: { label: 'Tốt', percent: 86, tone: 'good' }, price: 420000, originalPrice: 500000, badges: ['Bản hiếm'], description: 'Bìa cứng, ruột sách sạch · có dấu lưu trữ', coverClass: 'cover-paper' },
  { id: 'mat-biec', title: 'Mắt biếc', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', year: 2004, category: 'vietnamese-literature', condition: { label: 'Như mới', percent: 94, tone: 'new' }, price: 120000, badges: ['Ấn bản sưu tầm'], description: 'Bản in tái bản · gáy và ruột gần như nguyên', coverUrl: imageUrls.matBiec },
  { id: 'noi-buon-chien-tranh', title: 'Nỗi buồn chiến tranh', author: 'Bảo Ninh', publisher: 'NXB Văn học', year: 1990, category: 'vietnamese-literature', condition: { label: 'Đã qua sử dụng', percent: 76, tone: 'used' }, price: 165000, badges: ['Có chữ ký'], description: 'Dấu mực ở trang tên sách · gáy có dấu mòn', coverClass: 'cover-ink' },
  { id: 'ha-noi-36-pho-phuong', title: 'Hà Nội băm sáu phố phường', author: 'Thạch Lam', publisher: 'NXB Văn học', year: 2022, category: 'vietnamese-literature', condition: { label: 'Tốt', percent: 82, tone: 'good' }, price: 95000, badges: ['Tùy bút kinh điển'], description: 'Bìa mềm · vài vết xước nhỏ ở mép bìa', coverClass: 'cover-stone' },
  { id: 'toi-thay-hoa-vang', title: 'Tôi thấy hoa vàng trên cỏ xanh', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', year: 2010, category: 'vietnamese-literature', condition: { label: 'Như mới', percent: 95, tone: 'new' }, price: 140000, badges: ['Bản in đầu'], description: 'Đai sách nguyên bản · bìa vuông thành sắc cạnh', coverUrl: imageUrls.hoaVang },
  { id: 'kinh-van-hoa', title: 'Kính vạn hoa — Tập 1', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Kim Đồng', year: 1995, category: 'vietnamese-literature', condition: { label: 'Đã qua sử dụng', percent: 75, tone: 'used' }, price: 85000, badges: ['Ấn bản xưa'], description: 'Gáy có mòn mép nhẹ · giấy ngả màu tự nhiên', coverUrl: imageUrls.kinhVanHoa },
  { id: 'cho-toi-xin', title: 'Cho tôi xin một vé đi tuổi thơ', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', year: 2008, category: 'vietnamese-literature', condition: { label: 'Như mới', percent: 98, tone: 'new' }, price: 195000, badges: ['Bìa cứng giới hạn'], description: 'Bìa cứng nguyên đai · ruột trắng tinh khiết', coverClass: 'cover-green' },
  { id: 'con-chut-gi', title: 'Còn chút gì để nhớ', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', year: 1998, category: 'vietnamese-literature', condition: { label: 'Tốt', percent: 80, tone: 'good' }, price: 45000, originalPrice: 70000, badges: ['Giá mềm'], description: 'Bìa xước dăm nhẹ · ruột sách sạch sẽ nguyên lành', coverClass: 'cover-amber' },
  { id: 'bo-cau', title: 'Bồ câu không đưa thư', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Kim Đồng', year: 1993, category: 'vietnamese-literature', condition: { label: 'Đã qua sử dụng', percent: 70, tone: 'used' }, price: 50000, badges: ['Ấn bản hiếm gặp'], description: 'Giấy ngả vàng nâu vintage · gáy được gia cố bảo quản', coverClass: 'cover-paper' },
  { id: 'ha-do', title: 'Hạ đỏ', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', year: 1995, category: 'vietnamese-literature', condition: { label: 'Tốt', percent: 85, tone: 'good' }, price: 70000, badges: ['Sách tuyển chọn'], description: 'Tình trạng giấy đẹp · có chữ ký lưu niệm nhỏ', coverClass: 'cover-amber' },
  { id: 'ngoi-khoc', title: 'Ngồi khóc trên cây', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', year: 2013, category: 'vietnamese-literature', condition: { label: 'Như mới', percent: 92, tone: 'new' }, price: 75000, originalPrice: 115000, badges: ['Ảnh thật 5 góc'], description: 'Bìa mềm có tay gập · còn bookmark vải', coverClass: 'cover-green' },
  { id: 'co-gai-hom-qua', title: 'Cô gái đến từ hôm qua', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', year: 2001, category: 'vietnamese-literature', condition: { label: 'Tốt', percent: 88, tone: 'good' }, price: 58000, originalPrice: 90000, badges: ['Tái bản đẹp'], description: 'Bìa bóng mờ nguyên vẹn · gáy thẳng tắp', coverClass: 'cover-stone' },
  { id: 'quoc-gia-khoi-nghiep', title: 'Quốc gia khởi nghiệp', author: 'Dan Senor & Saul Singer', publisher: 'NXB Thế Giới', year: 2018, category: 'economics', condition: { label: 'Rất tốt', percent: 90, tone: 'good' }, price: 135000, badges: ['Mới về'], description: 'Bìa sạch, gáy chắc, có vài nếp gấp nhẹ ở mép', coverClass: 'cover-ink' },
  { id: 'cha-giau-cha-ngheo', title: 'Cha giàu cha nghèo', author: 'Robert T. Kiyosaki', publisher: 'NXB Trẻ', year: 2020, category: 'economics', condition: { label: 'Như mới', percent: 97, tone: 'new' }, price: 109000, originalPrice: 158000, badges: ['Giảm giá'], description: 'Ruột sách sạch, không ghi chú, bìa còn đẹp', coverClass: 'cover-amber' },
  { id: 'tu-duy-nhanh-va-cham', title: 'Tư duy nhanh và chậm', author: 'Daniel Kahneman', publisher: 'NXB Thế Giới', year: 2019, category: 'economics', condition: { label: 'Tốt', percent: 84, tone: 'good' }, price: 179000, badges: ['Tuyển chọn'], description: 'Có vết xước nhỏ ở bìa, các trang nguyên vẹn', coverClass: 'cover-stone' },
  { id: 'nghe-thuat-quan-ly-tien', title: 'Nghệ thuật quản lý tiền', author: 'Morgan Housel', publisher: 'NXB Dân Trí', year: 2022, category: 'economics', condition: { label: 'Rất tốt', percent: 92, tone: 'good' }, price: 149000, badges: ['Mới về'], description: 'Sách phẳng, vài trang đầu hơi ngả màu', coverClass: 'cover-green' }
];

export const wishlistSeed = ['so-do', 'mat-biec', 'noi-buon-chien-tranh', 'ha-noi-36-pho-phuong'];

export const orders = [
  {
    id: 'PT-2025-0894X', placedAt: '2025-02-21', paymentLabel: 'Đã thanh toán · Chuyển khoản', status: 'shipping', eta: '25/02/2025', total: 1315000, carrier: 'Giao Hàng Nhanh', trackingCode: 'GHN-PT0894X',
    items: [{ bookId: 'so-do', quantity: 1, price: 1250000, packaging: 'Archival Preservation' }, { bookId: 'mat-biec', quantity: 1, price: 65000, packaging: 'Chống ẩm chuyên dụng' }],
    timeline: [{ label: 'Đã tiếp nhận đơn hàng', date: '21/02 · 09:14', state: 'done' }, { label: 'Đã đóng gói & bàn giao', date: '23/02 · 16:20', state: 'done' }, { label: 'Đang giao đến bạn', date: 'Dự kiến 25/02 · Vĩnh Long', state: 'active' }, { label: 'Giao hàng thành công', date: 'Chưa cập nhật', state: 'pending' }]
  },
  {
    id: 'PT-2024-1120B', placedAt: '2024-12-14', paymentLabel: 'Đã thanh toán · Visa', status: 'completed', eta: '18/12/2024', total: 485000, carrier: 'Giao Hàng Nhanh', trackingCode: 'GHN-PT1120B',
    items: [{ bookId: 'kinh-van-hoa', quantity: 1, price: 420000, packaging: 'Bảo quản cơ bản' }, { bookId: 'ha-do', quantity: 1, price: 65000, packaging: 'Chống ẩm chuyên dụng' }],
    timeline: [{ label: 'Đã đặt', date: '14/12 · 08:35', state: 'done' }, { label: 'Đã giao thành công', date: '18/12/2024 · 14:26', state: 'done' }]
  }
];

export const faqs = [
  { id: 'payment', topic: 'Đặt hàng & thanh toán', question: 'Tôi có thể thanh toán bằng hình thức nào?', answer: 'Bạn có thể chuyển khoản, thanh toán khi nhận hàng hoặc dùng Visa, Mastercard, JCB và ví điện tử. Đơn được xác nhận sau khi thanh toán thành công.' },
  { id: 'shipping', topic: 'Giao nhận & đóng gói', question: 'Sách được bọc và gửi đi như thế nào?', answer: 'Mỗi cuốn được kiểm tra lần cuối, bọc chống ẩm, chèn góc và đặt trong hộp cứng. Đơn nội ô Vĩnh Long thường đến trong 1–2 ngày.' },
  { id: 'condition', topic: 'Tình trạng sách & đổi trả', question: '“Tốt (85%)” trên trang sách có nghĩa là gì?', answer: 'Đó là mức đánh giá tổng hợp về bìa, gáy, ruột và độ sạch của sách. Mọi dấu vết đáng chú ý đều được ghi rõ trong phần mô tả.' },
  { id: 'returns', topic: 'Tình trạng sách & đổi trả', question: 'Tôi có được đổi sách nếu nhận hàng không đúng mô tả?', answer: 'Có. Hãy liên hệ trong vòng 7 ngày kể từ khi nhận hàng nếu sách có lỗi không được ghi trong mô tả và giữ lại bao bì ban đầu.' },
  { id: 'certificate', topic: 'Chứng thư & nguồn gốc', question: 'Làm sao tra cứu chứng thư điện tử của một ấn bản?', answer: 'Bạn có thể mở Kệ sách cá nhân, chọn ấn bản tương ứng và tra cứu mã e-ID trên chứng thư. Thủ thư cũng có thể hỗ trợ kiểm tra nguồn gốc.' }
];

export const account = {
  name: 'Nguyễn Hoàng Hải', email: 'hoanghai.nguyen@archival.vn', phone: '0912 845 678', readerId: 'TPT-VINHLONG-8456', rank: 'Thủ thư Danh dự', city: 'Vĩnh Long', district: 'TP. Vĩnh Long', address: 'Số 12 Trưng Nữ Vương, Phường 1',
  metrics: { collection: 14, certificates: 5, shipments: 2, totalValue: 8450000 },
  notifications: { rareBooks: true, orders: true }
};

export const consignmentSeed = { name: account.name, email: account.email, phone: account.phone };
