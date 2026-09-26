// Danh mục đầy đủ 63 tỉnh / thành phố trực thuộc Trung ương của Việt Nam
// và danh sách quận / huyện / thị xã tương ứng (bao gồm các đơn vị hành chính sau sáp nhập như TP. Thủ Đức)

export const vietnamProvinces = [
  {
    name: 'Hà Nội',
    type: 'Thành phố trực thuộc Trung ương',
    districts: [
      'Quận Hoàn Kiếm', 'Quận Ba Đình', 'Quận Đống Đa', 'Quận Hai Bà Trưng',
      'Quận Cầu Giấy', 'Quận Tây Hồ', 'Quận Thanh Xuân', 'Quận Nam Từ Liêm',
      'Quận Bắc Từ Liêm', 'Quận Long Biên', 'Quận Hà Đông', 'Quận Hoàng Mai',
      'Thị xã Sơn Tây', 'Huyện Đông Anh', 'Huyện Gia Lâm', 'Huyện Sóc Sơn',
      'Huyện Thanh Trì', 'Huyện Đan Phượng', 'Huyện Hoài Đức', 'Huyện Thạch Thất',
      'Huyện Quốc Oai', 'Huyện Chương Mỹ', 'Huyện Thường Tín', 'Huyện Phú Xuyên',
      'Huyện Thanh Oai', 'Huyện Ứng Hòa', 'Huyện Mỹ Đức', 'Huyện Mê Linh',
      'Huyện Ba Vì', 'Huyện Phúc Thọ'
    ]
  },
  {
    name: 'Thành phố Hồ Chí Minh',
    type: 'Thành phố trực thuộc Trung ương',
    districts: [
      'Thành phố Thủ Đức (Sau sáp nhập Q2, Q9 & Thủ Đức)',
      'Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8',
      'Quận 10', 'Quận 11', 'Quận 12', 'Quận Bình Thạnh', 'Quận Phú Nhuận',
      'Quận Gò Vấp', 'Quận Tân Bình', 'Quận Tân Phú', 'Quận Bình Tân',
      'Huyện Củ Chi', 'Huyện Hóc Môn', 'Huyện Bình Chánh', 'Huyện Nhà Bè', 'Huyện Cần Giờ'
    ]
  },
  {
    name: 'Đà Nẵng',
    type: 'Thành phố trực thuộc Trung ương',
    districts: [
      'Quận Hải Châu', 'Quận Thanh Khê', 'Quận Sơn Trà', 'Quận Ngũ Hành Sơn',
      'Quận Liên Chiểu', 'Quận Cẩm Lệ', 'Huyện Hòa Vang', 'Huyện Hoàng Sa'
    ]
  },
  {
    name: 'Hải Phòng',
    type: 'Thành phố trực thuộc Trung ương',
    districts: [
      'Quận Hồng Bàng', 'Quận Ngô Quyền', 'Quận Lê Chân', 'Quận Hải An',
      'Quận Kiến An', 'Quận Đồ Sơn', 'Quận Dương Kinh',
      'Thành phố Thủy Nguyên (Sau sắp xếp nâng cấp)',
      'Huyện An Dương', 'Huyện An Lão', 'Huyện Kiến Thụy', 'Huyện Tiên Lãng',
      'Huyện Vĩnh Bảo', 'Huyện Cát Hải', 'Huyện Bạch Long Vĩ'
    ]
  },
  {
    name: 'Cần Thơ',
    type: 'Thành phố trực thuộc Trung ương',
    districts: [
      'Quận Ninh Kiều', 'Quận Bình Thủy', 'Quận Cái Răng', 'Quận Ô Môn',
      'Quận Thốt Nốt', 'Huyện Phong Điền', 'Huyện Cờ Đỏ', 'Huyện Thới Lai', 'Huyện Vĩnh Thạnh'
    ]
  },
  {
    name: 'Thừa Thiên Huế',
    type: 'Đô thị di sản trực thuộc Trung ương',
    districts: [
      'Thành phố Huế', 'Thị xã Hương Thủy', 'Thị xã Hương Trà', 'Huyện Phú Vang',
      'Huyện Quảng Điền', 'Huyện Phong Điền', 'Huyện Phú Lộc', 'Huyện A Lưới', 'Huyện Nam Đông'
    ]
  },
  {
    name: 'An Giang',
    districts: ['Thành phố Long Xuyên', 'Thành phố Châu Đốc', 'Thị xã Tân Châu', 'Thị xã Tịnh Biên', 'Huyện An Phú', 'Huyện Châu Phú', 'Huyện Châu Thành', 'Huyện Chợ Mới', 'Huyện Phú Tân', 'Huyện Thoại Sơn', 'Huyện Tri Tôn']
  },
  {
    name: 'Bà Rịa - Vũng Tàu',
    districts: ['Thành phố Vũng Tàu', 'Thành phố Bà Rịa', 'Thị xã Phú Mỹ', 'Huyện Châu Đức', 'Huyện Côn Đảo', 'Huyện Đất Đỏ', 'Huyện Long Điền', 'Huyện Xuyên Mộc']
  },
  {
    name: 'Bắc Giang',
    districts: ['Thành phố Bắc Giang', 'Thị xã Việt Yên', 'Huyện Hiệp Hòa', 'Huyện Lạng Giang', 'Huyện Lục Nam', 'Huyện Lục Ngạn', 'Huyện Sơn Động', 'Huyện Tân Yên', 'Huyện Yên Dũng', 'Huyện Yên Thế']
  },
  {
    name: 'Bắc Kạn',
    districts: ['Thành phố Bắc Kạn', 'Huyện Ba Bể', 'Huyện Bạch Thông', 'Huyện Chợ Đồn', 'Huyện Chợ Mới', 'Huyện Na Rì', 'Huyện Ngân Sơn', 'Huyện Pác Nặm']
  },
  {
    name: 'Bạc Liêu',
    districts: ['Thành phố Bạc Liêu', 'Thị xã Giá Rai', 'Huyện Đông Hải', 'Huyện Hòa Bình', 'Huyện Hồng Dân', 'Huyện Phước Long', 'Huyện Vĩnh Lợi']
  },
  {
    name: 'Bắc Ninh',
    districts: ['Thành phố Bắc Ninh', 'Thành phố Từ Sơn', 'Thị xã Thuận Thành', 'Thị xã Quế Võ', 'Huyện Gia Bình', 'Huyện Lương Tài', 'Huyện Tiên Du', 'Huyện Yên Phong']
  },
  {
    name: 'Bến Tre',
    districts: ['Thành phố Bến Tre', 'Huyện Ba Tri', 'Huyện Bình Đại', 'Huyện Châu Thành', 'Huyện Chợ Lách', 'Huyện Giồng Trôm', 'Huyện Mỏ Cày Bắc', 'Huyện Mỏ Cày Nam', 'Huyện Thạnh Phú']
  },
  {
    name: 'Bình Định',
    districts: ['Thành phố Quy Nhơn', 'Thị xã An Nhơn', 'Thị xã Hoài Nhơn', 'Huyện An Lão', 'Huyện Hoài Ân', 'Huyện Phù Cát', 'Huyện Phù Mỹ', 'Huyện Tây Sơn', 'Huyện Tuy Phước', 'Huyện Vân Canh', 'Huyện Vĩnh Thạnh']
  },
  {
    name: 'Bình Dương',
    districts: ['Thành phố Thủ Dầu Một', 'Thành phố Thuận An', 'Thành phố Dĩ An', 'Thành phố Tân Uyên', 'Thành phố Bến Cát', 'Huyện Bàu Bàng', 'Huyện Bắc Tân Uyên', 'Huyện Dầu Tiếng', 'Huyện Phú Giáo']
  },
  {
    name: 'Bình Phước',
    districts: ['Thành phố Đồng Xoài', 'Thị xã Bình Long', 'Thị xã Phước Long', 'Thị xã Chơn Thành', 'Huyện Bù Đăng', 'Huyện Bù Đốp', 'Huyện Bù Gia Mập', 'Huyện Đồng Phú', 'Huyện Hớn Quản', 'Huyện Lộc Ninh', 'Huyện Phú Riềng']
  },
  {
    name: 'Bình Thuận',
    districts: ['Thành phố Phan Thiết', 'Thị xã La Gi', 'Huyện Bắc Bình', 'Huyện Đức Linh', 'Huyện Hàm Tân', 'Huyện Hàm Thuận Bắc', 'Huyện Hàm Thuận Nam', 'Huyện Phú Quý', 'Huyện Tánh Linh', 'Huyện Tuy Phong']
  },
  {
    name: 'Cà Mau',
    districts: ['Thành phố Cà Mau', 'Huyện Cái Nước', 'Huyện Đầm Dơi', 'Huyện Năm Căn', 'Huyện Ngọc Hiển', 'Huyện Phú Tân', 'Huyện Thới Bình', 'Huyện Trần Văn Thời', 'Huyện U Minh']
  },
  {
    name: 'Cao Bằng',
    districts: ['Thành phố Cao Bằng', 'Huyện Bảo Lạc', 'Huyện Bảo Lâm', 'Huyện Hạ Lang', 'Huyện Hà Quảng', 'Huyện Hòa An', 'Huyện Nguyên Bình', 'Huyện Quảng Hòa', 'Huyện Thạch An', 'Huyện Trùng Khánh']
  },
  {
    name: 'Đắk Lắk',
    districts: ['Thành phố Buôn Ma Thuột', 'Thị xã Buôn Hồ', 'Huyện Buôn Đôn', 'Huyện Cư Kuin', 'Huyện Cư M\'gar', 'Huyện Ea H\'leo', 'Huyện Ea Kar', 'Huyện Ea Súp', 'Huyện Krông Ana', 'Huyện Krông Bông', 'Huyện Krông Búk', 'Huyện Krông Năng', 'Huyện Krông Pắc', 'Huyện Lắk', 'Huyện M\'Drắk']
  },
  {
    name: 'Đắk Nông',
    districts: ['Thành phố Gia Nghĩa', 'Huyện Cư Jút', 'Huyện Đắk Glong', 'Huyện Đắk Mil', 'Huyện Đắk R\'lấp', 'Huyện Đắk Song', 'Huyện Krông Nô', 'Huyện Tuy Đức']
  },
  {
    name: 'Điện Biên',
    districts: ['Thành phố Điện Biên Phủ', 'Thị xã Mường Lay', 'Huyện Điện Biên', 'Huyện Điện Biên Đông', 'Huyện Mường Ảng', 'Huyện Mường Chà', 'Huyện Mường Nhé', 'Huyện Nậm Pồ', 'Huyện Tủa Chùa', 'Huyện Tuần Giáo']
  },
  {
    name: 'Đồng Nai',
    districts: ['Thành phố Biên Hòa', 'Thành phố Long Khánh', 'Huyện Cẩm Mỹ', 'Huyện Định Quán', 'Huyện Long Thành', 'Huyện Nhơn Trạch', 'Huyện Tân Phú', 'Huyện Thống Nhất', 'Huyện Trảng Bom', 'Huyện Vĩnh Cửu', 'Huyện Xuân Lộc']
  },
  {
    name: 'Đồng Tháp',
    districts: ['Thành phố Cao Lãnh', 'Thành phố Sa Đéc', 'Thành phố Hồng Ngự', 'Huyện Cao Lãnh', 'Huyện Châu Thành', 'Huyện Hồng Ngự', 'Huyện Lai Vung', 'Huyện Lấp Vò', 'Huyện Tam Nông', 'Huyện Tân Hồng', 'Huyện Thanh Bình', 'Huyện Tháp Mười']
  },
  {
    name: 'Gia Lai',
    districts: ['Thành phố Pleiku', 'Thị xã An Khê', 'Thị xã Ayun Pa', 'Huyện Chư Păh', 'Huyện Chư Prông', 'Huyện Chư Pưh', 'Huyện Chư Sê', 'Huyện Đắk Đoa', 'Huyện Đắk Pơ', 'Huyện Đức Cơ', 'Huyện Ia Grai', 'Huyện Ia Pa', 'Huyện K\'Bang', 'Huyện Kông Chro', 'Huyện Krông Pa', 'Huyện Mang Yang', 'Huyện Phú Thiện']
  },
  {
    name: 'Hà Giang',
    districts: ['Thành phố Hà Giang', 'Huyện Bắc Mê', 'Huyện Bắc Quang', 'Huyện Đồng Văn', 'Huyện Hoàng Su Phì', 'Huyện Mèo Vạc', 'Huyện Mèo Vạc', 'Huyện Quang Bình', 'Huyện Vị Xuyên', 'Huyện Xín Mần', 'Huyện Yên Minh']
  },
  {
    name: 'Hà Nam',
    districts: ['Thành phố Phủ Lý', 'Thị xã Duy Tiên', 'Huyện Bình Lục', 'Huyện Kim Bảng', 'Huyện Lý Nhân', 'Huyện Thanh Liêm']
  },
  {
    name: 'Hà Tĩnh',
    districts: ['Thành phố Hà Tĩnh', 'Thị xã Hồng Lĩnh', 'Thị xã Kỳ Anh', 'Huyện Cẩm Xuyên', 'Huyện Can Lộc', 'Huyện Đức Thọ', 'Huyện Hương Khê', 'Huyện Hương Sơn', 'Huyện Kỳ Anh', 'Huyện Lộc Hà', 'Huyện Nghi Xuân', 'Huyện Thạch Hà', 'Huyện Vũ Quang']
  },
  {
    name: 'Hải Dương',
    districts: ['Thành phố Hải Dương', 'Thành phố Chí Linh', 'Thị xã Kinh Môn', 'Huyện Bình Giang', 'Huyện Cẩm Giàng', 'Huyện Gia Lộc', 'Huyện Kim Thành', 'Huyện Nam Sách', 'Huyện Ninh Giang', 'Huyện Thanh Hà', 'Huyện Thanh Miện', 'Huyện Tứ Kỳ']
  },
  {
    name: 'Hậu Giang',
    districts: ['Thành phố Vị Thanh', 'Thành phố Ngã Bảy', 'Thị xã Long Mỹ', 'Huyện Châu Thành', 'Huyện Châu Thành A', 'Huyện Phụng Hiệp', 'Huyện Vị Thủy']
  },
  {
    name: 'Hòa Bình',
    districts: ['Thành phố Hòa Bình', 'Huyện Cao Phong', 'Huyện Đà Bắc', 'Huyện Kim Bôi', 'Huyện Lạc Sơn', 'Huyện Lạc Thủy', 'Huyện Lương Sơn', 'Huyện Mai Châu', 'Huyện Tân Lạc', 'Huyện Yên Thủy']
  },
  {
    name: 'Hưng Yên',
    districts: ['Thành phố Hưng Yên', 'Thị xã Mỹ Hào', 'Huyện Ân Thi', 'Huyện Khoái Châu', 'Huyện Kim Động', 'Huyện Phù Cừ', 'Huyện Tiên Lữ', 'Huyện Văn Giang', 'Huyện Văn Lâm', 'Huyện Yên Mỹ']
  },
  {
    name: 'Khánh Hòa',
    districts: ['Thành phố Nha Trang', 'Thành phố Cam Ranh', 'Thị xã Ninh Hòa', 'Huyện Cam Lâm', 'Huyện Diên Khánh', 'Huyện Khánh Sơn', 'Huyện Khánh Vĩnh', 'Huyện Trường Sa', 'Huyện Vạn Ninh']
  },
  {
    name: 'Kiên Giang',
    districts: ['Thành phố Rạch Giá', 'Thành phố Hà Tiên', 'Thành phố Phú Quốc', 'Huyện An Biên', 'Huyện An Minh', 'Huyện Châu Thành', 'Huyện Giang Thành', 'Huyện Giồng Riềng', 'Huyện Gò Quao', 'Huyện Hòn Đất', 'Huyện Kiên Hải', 'Huyện Kiên Lương', 'Huyện Tân Hiệp', 'Huyện U Minh Thượng', 'Huyện Vĩnh Thuận']
  },
  {
    name: 'Kon Tum',
    districts: ['Thành phố Kon Tum', 'Huyện Đắk Glei', 'Huyện Đắk Hà', 'Huyện Đắk Tô', 'Huyện Ia H\'Drai', 'Huyện Kon Plông', 'Huyện Kon Rẫy', 'Huyện Ngọc Hồi', 'Huyện Sa Thầy', 'Huyện Tu Mơ Rông']
  },
  {
    name: 'Lai Châu',
    districts: ['Thành phố Lai Châu', 'Huyện Mường Tè', 'Huyện Nậm Nhùn', 'Huyện Phong Thổ', 'Huyện Sìn Hồ', 'Huyện Tam Đường', 'Huyện Tân Uyên', 'Huyện Than Uyên']
  },
  {
    name: 'Lâm Đồng',
    districts: ['Thành phố Đà Lạt', 'Thành phố Bảo Lộc', 'Huyện Bảo Lâm', 'Huyện Cát Tiên', 'Huyện Đạ Huoai', 'Huyện Đạ Tẻh', 'Huyện Đam Rông', 'Huyện Di Linh', 'Huyện Đơn Dương', 'Huyện Đức Trọng', 'Huyện Lạc Dương', 'Huyện Lâm Hà']
  },
  {
    name: 'Lạng Sơn',
    districts: ['Thành phố Lạng Sơn', 'Huyện Bắc Sơn', 'Huyện Bình Gia', 'Huyện Cao Lộc', 'Huyện Chi Lăng', 'Huyện Đình Lập', 'Huyện Hữu Lũng', 'Huyện Lộc Bình', 'Huyện Tràng Định', 'Huyện Văn Lãng', 'Huyện Văn Quan']
  },
  {
    name: 'Lào Cai',
    districts: ['Thành phố Lào Cai', 'Thị xã Sa Pa', 'Huyện Bát Xát', 'Huyện Bảo Thắng', 'Huyện Bảo Yên', 'Huyện Bắc Hà', 'Huyện Mường Khương', 'Huyện Si Ma Cai', 'Huyện Văn Bàn']
  },
  {
    name: 'Long An',
    districts: ['Thành phố Tân An', 'Thị xã Kiến Tường', 'Huyện Bến Lức', 'Huyện Cần Đước', 'Huyện Cần Giuộc', 'Huyện Châu Thành', 'Huyện Đức Hòa', 'Huyện Đức Huệ', 'Huyện Mộc Hóa', 'Huyện Tân Hưng', 'Huyện Tân Thạnh', 'Huyện Tân Trụ', 'Huyện Thạnh Hóa', 'Huyện Thủ Thừa', 'Huyện Vĩnh Hưng']
  },
  {
    name: 'Nam Định',
    districts: ['Thành phố Nam Định (Sau sắp xếp sáp nhập Mỹ Lộc)', 'Huyện Giao Thủy', 'Huyện Hải Hậu', 'Huyện Nam Trực', 'Huyện Nghĩa Hưng', 'Huyện Trực Ninh', 'Huyện Vụ Bản', 'Huyện Xuân Trường', 'Huyện Ý Yên']
  },
  {
    name: 'Nghệ An',
    districts: ['Thành phố Vinh (Sau sáp nhập Cửa Lò & các xã lân cận)', 'Thị xã Thái Hòa', 'Thị xã Hoàng Mai', 'Huyện Anh Sơn', 'Huyện Con Cuông', 'Huyện Diễn Châu', 'Huyện Đô Lương', 'Huyện Hưng Nguyên', 'Huyện Kỳ Sơn', 'Huyện Nam Đàn', 'Huyện Nghi Lộc', 'Huyện Nghĩa Đàn', 'Huyện Quế Phong', 'Huyện Quỳ Châu', 'Huyện Quỳ Hợp', 'Huyện Quỳnh Lưu', 'Huyện Tân Kỳ', 'Huyện Thanh Chương', 'Huyện Tương Dương', 'Huyện Yên Thành']
  },
  {
    name: 'Ninh Bình',
    districts: ['Thành phố Ninh Bình (Đang hoàn tất sắp xếp cùng Hoa Lư)', 'Thành phố Tam Điệp', 'Huyện Gia Viễn', 'Huyện Hoa Lư', 'Huyện Kim Sơn', 'Huyện Nho Quan', 'Huyện Yên Khánh', 'Huyện Yên Mô']
  },
  {
    name: 'Ninh Thuận',
    districts: ['Thành phố Phan Rang - Tháp Chàm', 'Huyện Bác Ái', 'Huyện Ninh Hải', 'Huyện Ninh Phước', 'Huyện Ninh Sơn', 'Huyện Thuận Bắc', 'Huyện Thuận Nam']
  },
  {
    name: 'Phú Thọ',
    districts: ['Thành phố Việt Trì', 'Thị xã Phú Thọ', 'Huyện Cẩm Khê', 'Huyện Đoan Hùng', 'Huyện Hạ Hòa', 'Huyện Lâm Thao', 'Huyện Phù Ninh', 'Huyện Tam Nông', 'Huyện Tân Sơn', 'Huyện Thanh Ba', 'Huyện Thanh Sơn', 'Huyện Thanh Thủy', 'Huyện Yên Lập']
  },
  {
    name: 'Phú Yên',
    districts: ['Thành phố Tuy Hòa', 'Thị xã Sông Cầu', 'Thị xã Đông Hòa', 'Huyện Đồng Xuân', 'Huyện Phú Hòa', 'Huyện Sơn Hòa', 'Huyện Sông Hinh', 'Huyện Tây Hòa', 'Huyện Tuy An']
  },
  {
    name: 'Quảng Bình',
    districts: ['Thành phố Đồng Hới', 'Thị xã Ba Đồn', 'Huyện Bố Trạch', 'Huyện Lệ Thủy', 'Huyện Minh Hóa', 'Huyện Quảng Ninh', 'Huyện Quảng Trạch', 'Huyện Tuyên Hóa']
  },
  {
    name: 'Quảng Nam',
    districts: ['Thành phố Tam Kỳ', 'Thành phố Hội An', 'Thị xã Điện Bàn', 'Huyện Bắc Trà My', 'Huyện Đại Lộc', 'Huyện Đông Giang', 'Huyện Duy Xuyên', 'Huyện Hiệp Đức', 'Huyện Nam Giang', 'Huyện Nam Trà My', 'Huyện Nông Sơn', 'Huyện Núi Thành', 'Huyện Phú Ninh', 'Huyện Phước Sơn', 'Huyện Quế Sơn', 'Huyện Tây Giang', 'Huyện Thăng Bình', 'Huyện Tiên Phước']
  },
  {
    name: 'Quảng Ngãi',
    districts: ['Thành phố Quảng Ngãi', 'Thị xã Đức Phổ', 'Huyện Ba Tơ', 'Huyện Bình Sơn', 'Huyện Lý Sơn', 'Huyện Minh Long', 'Huyện Mộ Đức', 'Huyện Nghĩa Hành', 'Huyện Sơn Hà', 'Huyện Sơn Tây', 'Huyện Sơn Tịnh', 'Huyện Trà Bồng', 'Huyện Tư Nghĩa']
  },
  {
    name: 'Quảng Ninh',
    districts: ['Thành phố Hạ Long', 'Thành phố Cẩm Phả', 'Thành phố Móng Cái', 'Thành phố Uông Bí', 'Thị xã Đông Triều', 'Thị xã Quảng Yên', 'Huyện Ba Chẽ', 'Huyện Bình Liêu', 'Huyện Cô Tô', 'Huyện Đầm Hà', 'Huyện Hải Hà', 'Huyện Tiên Yên', 'Huyện Vân Đồn']
  },
  {
    name: 'Quảng Trị',
    districts: ['Thành phố Đông Hà', 'Thị xã Quảng Trị', 'Huyện Cam Lộ', 'Huyện Cồn Cỏ', 'Huyện Đakrông', 'Huyện Gio Linh', 'Huyện Hướng Hóa', 'Huyện Hải Lăng', 'Huyện Triệu Phong', 'Huyện Vĩnh Linh']
  },
  {
    name: 'Sóc Trăng',
    districts: ['Thành phố Sóc Trăng', 'Thị xã Ngã Năm', 'Thị xã Vĩnh Châu', 'Huyện Châu Thành', 'Huyện Cù Lao Dung', 'Huyện Kế Sách', 'Huyện Long Phú', 'Huyện Mỹ Tú', 'Huyện Mỹ Xuyên', 'Huyện Thạnh Trị', 'Huyện Trần Đề']
  },
  {
    name: 'Sơn La',
    districts: ['Thành phố Sơn La', 'Huyện Bắc Yên', 'Huyện Mai Sơn', 'Huyện Mộc Châu', 'Huyện Mường La', 'Huyện Phù Yên', 'Huyện Quỳnh Nhai', 'Huyện Sông Mã', 'Huyện Sốp Cộp', 'Huyện Thuận Châu', 'Huyện Vân Hồ', 'Huyện Yên Châu']
  },
  {
    name: 'Tây Ninh',
    districts: ['Thành phố Tây Ninh', 'Thị xã Hòa Thành', 'Thị xã Trảng Bàng', 'Huyện Bến Cầu', 'Huyện Châu Thành', 'Huyện Dương Minh Châu', 'Huyện Gò Dầu', 'Huyện Tân Biên', 'Huyện Tân Châu']
  },
  {
    name: 'Thái Bình',
    districts: ['Thành phố Thái Bình', 'Huyện Đông Hưng', 'Huyện Hưng Hà', 'Huyện Kiến Xương', 'Huyện Quỳnh Phụ', 'Huyện Thái Thụy', 'Huyện Tiền Hải', 'Huyện Vũ Thư']
  },
  {
    name: 'Thái Nguyên',
    districts: ['Thành phố Thái Nguyên', 'Thành phố Sông Công', 'Thành phố Phổ Yên', 'Huyện Đại Từ', 'Huyện Định Hóa', 'Huyện Đồng Hỷ', 'Huyện Phú Bình', 'Huyện Phú Lương', 'Huyện Võ Nhai']
  },
  {
    name: 'Thanh Hóa',
    districts: ['Thành phố Thanh Hóa (Sau sáp nhập Huyện Đông Sơn)', 'Thành phố Sầm Sơn', 'Thị xã Bỉm Sơn', 'Thị xã Nghi Sơn', 'Huyện Bá Thước', 'Huyện Cẩm Thủy', 'Huyện Hà Trung', 'Huyện Hậu Lộc', 'Huyện Hoằng Hóa', 'Huyện Lang Chánh', 'Huyện Mường Lát', 'Huyện Nga Sơn', 'Huyện Ngọc Lặc', 'Huyện Như Thanh', 'Huyện Như Xuân', 'Huyện Nông Cống', 'Huyện Quan Hóa', 'Huyện Quan Sơn', 'Huyện Quảng Xương', 'Huyện Thạch Thành', 'Huyện Thiệu Hóa', 'Huyện Thọ Xuân', 'Huyện Thường Xuân', 'Huyện Triệu Sơn', 'Huyện Vĩnh Lộc', 'Huyện Yên Định']
  },
  {
    name: 'Tiền Giang',
    districts: ['Thành phố Mỹ Tho', 'Thị xã Gò Công', 'Thị xã Cai Lậy', 'Huyện Cái Bè', 'Huyện Cai Lậy', 'Huyện Châu Thành', 'Huyện Chợ Gạo', 'Huyện Gò Công Đông', 'Huyện Gò Công Tây', 'Huyện Tân Phú Đông', 'Huyện Tân Phước']
  },
  {
    name: 'Trà Vinh',
    districts: ['Thành phố Trà Vinh', 'Thị xã Duyên Hải', 'Huyện Càng Long', 'Huyện Cầu Kè', 'Huyện Cầu Ngang', 'Huyện Châu Thành', 'Huyện Duyên Hải', 'Huyện Tiểu Cần', 'Huyện Trà Cú']
  },
  {
    name: 'Tuyên Quang',
    districts: ['Thành phố Tuyên Quang', 'Huyện Chiêm Hóa', 'Huyện Hàm Yên', 'Huyện Lâm Bình', 'Huyện Na Hang', 'Huyện Sơn Dương', 'Huyện Yên Sơn']
  },
  {
    name: 'Vĩnh Long',
    districts: ['Thành phố Vĩnh Long', 'Thị xã Bình Minh', 'Huyện Bình Tân', 'Huyện Long Hồ', 'Huyện Mang Thít', 'Huyện Tam Bình', 'Huyện Trà Ôn', 'Huyện Vũng Liêm']
  },
  {
    name: 'Vĩnh Phúc',
    districts: ['Thành phố Vĩnh Yên', 'Thành phố Phúc Yên', 'Huyện Bình Xuyên', 'Huyện Lập Thạch', 'Huyện Sông Lô', 'Huyện Tam Đảo', 'Huyện Tam Dương', 'Huyện Vĩnh Tường', 'Huyện Yên Lạc']
  },
  {
    name: 'Yên Bái',
    districts: ['Thành phố Yên Bái', 'Thị xã Nghĩa Lộ', 'Huyện Lục Yên', 'Huyện Mù Cang Chải', 'Huyện Trạm Tấu', 'Huyện Trấn Yên', 'Huyện Văn Chấn', 'Huyện Văn Yên', 'Huyện Yên Bình']
  }
];

export function getDistrictsByProvince(provinceName) {
  const province = vietnamProvinces.find(p => p.name.toLowerCase() === (provinceName || '').toLowerCase());
  if (province && province.districts && province.districts.length > 0) {
    return province.districts;
  }
  // Mặc định quận / huyện nếu chưa có chi tiết
  return ['Khu vực Trung tâm', 'Khu vực Ngoại thành', 'Thị xã trung tâm'];
}
