import type { OrderRecord, QuoteRecord, RiceCategory, RiceProduct } from '../types/rice';

export const HERO_IMAGE = '/src/assets/images/hero_mekong_rice_harvest_1795060100300.jpg';
export const MILL_STORY_IMAGE = '/src/assets/images/story_rice_mill_craft_1795060100594.jpg';

const IMG_ST25 = '/src/assets/images/product_st25_jasmine_1795060100426.jpg';
const IMG_FRAGRANT = '/src/assets/images/product_fragrant_white_rice_1795060099674.jpg';
const IMG_RESTAURANT = '/src/assets/images/product_fluffy_restaurant_rice_1795060100348.jpg';
const IMG_WHOLESALE_504 = '/src/assets/images/product_504_wholesale_sack_1795060556782.jpg';
const IMG_RED_BROWN = '/src/assets/images/product_red_brown_rice_1795060099899.jpg';
const IMG_GLUTINOUS = '/src/assets/images/product_glutinous_rice_1795060099903.jpg';

export const CATEGORY_OPTIONS: Array<{ id: RiceCategory; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'dac-san', label: 'Gạo đặc sản' },
  { id: 'deo-thom', label: 'Gạo dẻo thơm' },
  { id: 'no-xop', label: 'Gạo nở xốp' },
  { id: 'lut-nep', label: 'Gạo lứt & Nếp' },
];

export const BUSINESS_TYPES = [
  'Đại lý / Cửa hàng gạo',
  'Nhà hàng / Quán cơm văn phòng',
  'Bếp ăn công nghiệp / Trường học',
  'Đơn vị từ thiện / Sự kiện',
  'Khách sạn / Chuỗi F&B',
];

export const RICE_PRODUCTS: RiceProduct[] = [
  {
    id: 'st25-soc-trang',
    sku: 'GPS-ST25',
    name: 'Gạo ST25 Sóc Trăng Thượng Hạng',
    category: 'dac-san',
    categoryLabel: 'Gạo đặc sản',
    origin: 'Sóc Trăng',
    image: IMG_ST25,
    imageAlt: 'Gạo ST25 Sóc Trăng hạt dài trắng trong trong tô sứ và túi giấy kraft',
    shortNote: 'Dẻo mềm, thơm lá dứa cốm non, để nguội vẫn giữ nguyên độ mềm.',
    description:
      'Tuyển chọn từ vùng lúa luân canh Mỹ Xuyên – Sóc Trăng. Hạt gạo thon dài, trắng trong không bạc bụng, khi nấu tỏa hương lá dứa tự nhiên và vị ngọt thanh đặc trưng.',
    suitableFor: 'Gia đình, nhà hàng cao cấp, quà biếu doanh nghiệp',
    retailPricePerKg: 36000,
    wholesale: {
      tier50Kg: 31500,
      tier500Kg: 29800,
      tier2000Kg: 28200,
    },
    availablePacks: [5, 10, 25, 50],
    characteristics: {
      stickiness: 4,
      fluffiness: 2,
      aroma: 'Thơm lá dứa & cốm non',
      waterRatio: '1 gạo : 1,1 nước',
      moistureMax: '≤ 14%',
      brokenRatio: '≤ 3%',
      harvestCrop: 'Vụ Đông Xuân mới',
    },
    inStock: true,
    featuredRank: 1,
    highlightTag: 'Bán chạy nhất',
  },
  {
    id: 'nang-hoa-9',
    sku: 'GPS-NH09',
    name: 'Gạo Nàng Hoa 9 Long An',
    category: 'deo-thom',
    categoryLabel: 'Gạo dẻo thơm',
    origin: 'Long An',
    image: IMG_FRAGRANT,
    imageAlt: 'Gạo Nàng Hoa 9 Long An trong bát gốm kèm bông lúa vàng',
    shortNote: 'Dẻo mềm vừa phải, hạt bóng đẹp, vị ngọt đậm đà cho bữa cơm hàng ngày.',
    description:
      'Giống lúa lai tạo nổi tiếng vùng Đồng Tháp Mười – Long An. Cơm chín có độ mềm dẻo cân bằng, mùi thơm thoang thoảng, phù hợp khẩu vị cả ba miền và quán cơm gia đình.',
    suitableFor: 'Bữa cơm gia đình, quán cơm niêu, đại lý gạo khu dân cư',
    retailPricePerKg: 26000,
    wholesale: {
      tier50Kg: 22500,
      tier500Kg: 21200,
      tier2000Kg: 20100,
    },
    availablePacks: [5, 10, 25, 50],
    characteristics: {
      stickiness: 3,
      fluffiness: 3,
      aroma: 'Thơm nhẹ hoa lài',
      waterRatio: '1 gạo : 1,2 nước',
      moistureMax: '≤ 14%',
      brokenRatio: '≤ 5%',
      harvestCrop: 'Vụ Đông Xuân mới',
    },
    inStock: true,
    featuredRank: 2,
  },
  {
    id: 'tai-nguyen-cho-dao',
    sku: 'GPS-TNCD',
    name: 'Gạo Tài Nguyên Chợ Đào',
    category: 'no-xop',
    categoryLabel: 'Gạo nở xốp',
    origin: 'Cần Đước, Long An',
    image: IMG_RESTAURANT,
    imageAlt: 'Gạo Tài Nguyên Chợ Đào trong hộc gỗ đo lường bên cạnh bao sỉ 25kg',
    shortNote: 'Nở xốp, mềm tơi hạt, ráo cơm — lựa chọn hàng đầu cho quán cơm tấm & cơm chiên.',
    description:
      'Đặc sản gạo mùa Cần Đước – Long An được trữ đúng độ tuổi giúp hạt cơm nở đều, tơi mềm nhưng không khô cứng. Rất được chủ quán cơm phần, quán cơm chiên dương châu tin dùng.',
    suitableFor: 'Quán cơm tấm, cơm chiên, người thích ăn cơm ráo tơi',
    retailPricePerKg: 25500,
    wholesale: {
      tier50Kg: 22000,
      tier500Kg: 20800,
      tier2000Kg: 19600,
    },
    availablePacks: [5, 10, 25, 50],
    characteristics: {
      stickiness: 2,
      fluffiness: 4,
      aroma: 'Thơm nhẹ gạo mùa',
      waterRatio: '1 gạo : 1,35 nước',
      moistureMax: '≤ 14%',
      brokenRatio: '≤ 5%',
      harvestCrop: 'Gạo mùa 6 tháng',
    },
    inStock: true,
    featuredRank: 3,
    highlightTag: 'Chuẩn quán cơm',
  },
  {
    id: 'gao-504-cu-tien-giang',
    sku: 'GPS-504C',
    name: 'Gạo 504 Cũ Tiền Giang (Chuyên Sỉ)',
    category: 'no-xop',
    categoryLabel: 'Gạo nở xốp',
    origin: 'Tiền Giang',
    image: IMG_WHOLESALE_504,
    imageAlt: 'Gạo 504 Cũ Tiền Giang trắng sạch bên cạnh các bao dệt chuyên dụng bán sỉ',
    shortNote: 'Nở nhiều, lợi cơm, ổn định chất lượng quanh năm — tối ưu giá vốn bếp công nghiệp.',
    description:
      'Dòng gạo chuyên dụng cho bếp ăn khu công nghiệp, quán cơm bình dân, cơ sở làm bún bánh và chương trình phát gạo từ thiện. Nguồn cung kho lớn ổn định trên 200 tấn/tháng.',
    suitableFor: 'Bếp ăn công nghiệp, đại lý sỉ, cơ sở bún phở, từ thiện',
    retailPricePerKg: 20500,
    wholesale: {
      tier50Kg: 18500,
      tier500Kg: 17400,
      tier2000Kg: 16500,
    },
    availablePacks: [10, 25, 50],
    characteristics: {
      stickiness: 1,
      fluffiness: 5,
      aroma: 'Mùi gạo tự nhiên',
      waterRatio: '1 gạo : 1,45 nước',
      moistureMax: '≤ 14,5%',
      brokenRatio: '≤ 8%',
      harvestCrop: 'Gạo trữ 4 tháng',
    },
    inStock: true,
    featuredRank: 4,
    highlightTag: 'Giá sỉ tối ưu',
  },
  {
    id: 'gao-lut-huyet-rong',
    sku: 'GPS-LHR',
    name: 'Gạo Lứt Huyết Rồng Hữu Cơ',
    category: 'lut-nep',
    categoryLabel: 'Gạo lứt & Nếp',
    origin: 'Đồng Tháp Mười',
    image: IMG_RED_BROWN,
    imageAlt: 'Gạo Lứt Huyết Rồng đỏ nâu nguyên cám trong bát gốm thủ công',
    shortNote: 'Giữ trọn lớp cám đỏ giàu chất xơ, bùi béo tự nhiên, phù hợp thực dưỡng.',
    description:
      'Xay tách vỏ trấu nguyên lớp cám đỏ giàu vitamin nhóm B và chất xơ. Khi nấu đúng tỷ lệ nước, hạt cơm chín mềm, bùi thơm, rất hợp làm cơm thực dưỡng và trà gạo lứt rang.',
    suitableFor: 'Chế độ ăn thực dưỡng, người ăn kiêng, cửa hàng nông sản sạch',
    retailPricePerKg: 34000,
    wholesale: {
      tier50Kg: 29500,
      tier500Kg: 27800,
      tier2000Kg: 26400,
    },
    availablePacks: [5, 10, 25],
    characteristics: {
      stickiness: 2,
      fluffiness: 2,
      aroma: 'Thơm bùi cám đỏ',
      waterRatio: 'Ngâm 2 giờ · 1 : 1,8 nước',
      moistureMax: '≤ 13,5%',
      brokenRatio: '≤ 3%',
      harvestCrop: 'Vụ Đông Xuân hữu cơ',
    },
    inStock: true,
    featuredRank: 5,
  },
  {
    id: 'nep-cai-hoa-vang',
    sku: 'GPS-NCHV',
    name: 'Gạo Nếp Cái Hoa Vàng Kinh Môn',
    category: 'lut-nep',
    categoryLabel: 'Gạo lứt & Nếp',
    origin: 'Hải Dương',
    image: IMG_GLUTINOUS,
    imageAlt: 'Gạo Nếp Cái Hoa Vàng hạt tròn trắng đục trong rổ tre lót lá dứa',
    shortNote: 'Hạt tròn mẩy, trắng đục đều, đồ xôi căng bóng, dẻo thơm bền mùi.',
    description:
      'Tuyển chọn nếp mùa chính gốc Kinh Môn, phơi nắng tự nhiên giữ nguyên hương thơm nồng nàn. Đồ xôi, gói bánh chưng hay nấu rượu đều đạt độ dẻo rền chuẩn vị.',
    suitableFor: 'Tiệm xôi, cơ sở làm bánh truyền thống, gia đình dịp lễ Tết',
    retailPricePerKg: 38000,
    wholesale: {
      tier50Kg: 33500,
      tier500Kg: 31800,
      tier2000Kg: 30200,
    },
    availablePacks: [5, 10, 25, 50],
    characteristics: {
      stickiness: 5,
      fluffiness: 1,
      aroma: 'Thơm nồng đặc trưng nếp mùa',
      waterRatio: 'Ngâm 6–8 giờ trước khi đồ',
      moistureMax: '≤ 14%',
      brokenRatio: '≤ 3%',
      harvestCrop: 'Vụ Mùa chính gốc',
    },
    inStock: true,
    featuredRank: 6,
  },
];

export const PARTNER_TESTIMONIALS = [
  {
    name: 'Nguyễn Minh Tuấn',
    role: 'Chủ hệ thống 4 quán Cơm Niêu Phố Cổ',
    organization: 'TP. Hồ Chí Minh',
    quote:
      'Trước đây bếp thường bị lệch độ dẻo giữa các đợt giao gạo. Từ khi chuyển sang nhập ST25 và Nàng Hoa 9 theo hợp đồng 1,2 tấn/tháng tại Gạo Phù Sa, chất lượng cơm ổn định suốt 14 tháng và tiết kiệm 11% chi phí nguyên liệu.',
  },
  {
    name: 'Trần Thị Bích Hạnh',
    role: 'Chủ Đại lý Gạo Hạnh Phát',
    organization: 'Bình Dương',
    quote:
      'Điểm tôi yên tâm nhất là gạo xay mới liên tục, bao bì 25kg và 50kg cân đủ ký, không lẫn tấm vụn. Xe tải giao hàng đúng 7 giờ sáng mỗi thứ Hai và có đầy đủ hóa đơn VAT.',
  },
  {
    name: 'Lê Hoàng Nam',
    role: 'Quản lý thu mua Bếp Ăn Công Nghiệp Nam Việt',
    organization: 'KCN VSIP 1',
    quote:
      'Mỗi ngày bếp phục vụ hơn 1.800 suất ăn công nhân nên cần gạo 504 Cũ nở đều, không bị khô khi chia khay. Gạo Phù Sa luôn giao đủ sản lượng 4 tấn/tháng kể cả mùa cao điểm.',
  },
];

export const SEED_ORDERS: OrderRecord[] = [
  {
    orderCode: 'GPS-260418',
    createdAt: '2026-11-16T08:30:00.000Z',
    status: 'Đang giao hàng — Xe tải kho Bình Chánh',
    customerName: 'Quán Cơm Niêu Minh Khôi',
    phone: '0908456123',
    address: '214 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh',
    note: 'Giao trước 9h sáng, xuất hóa đơn đỏ',
    paymentMethod: 'bank_transfer',
    needVatInvoice: true,
    companyName: 'Công ty TNHH Ẩm Thực Minh Khôi',
    taxCode: '0316789214',
    isWholesaleOrder: true,
    totalKg: 100,
    subtotal: 3150000,
    shippingFee: 0,
    totalSavings: 450000,
    grandTotal: 3150000,
    items: [
      {
        productId: 'st25-soc-trang',
        productName: 'Gạo ST25 Sóc Trăng Thượng Hạng',
        packWeightKg: 50,
        quantity: 2,
        lineKg: 100,
        unitPricePerKg: 31500,
        tierLabel: 'Giá sỉ 50–499kg',
        lineSubtotal: 3150000,
      },
    ],
  },
  {
    orderCode: 'GPS-260412',
    createdAt: '2026-11-15T14:15:00.000Z',
    status: 'Đã giao thành công',
    customerName: 'Phạm Thu Hà',
    phone: '0912345678',
    address: '88 Lê Văn Sỹ, Quận Phú Nhuận, TP. Hồ Chí Minh',
    note: 'Gọi trước 15 phút khi đến',
    paymentMethod: 'cod',
    needVatInvoice: false,
    isWholesaleOrder: false,
    totalKg: 10,
    subtotal: 360000,
    shippingFee: 0,
    totalSavings: 0,
    grandTotal: 360000,
    items: [
      {
        productId: 'st25-soc-trang',
        productName: 'Gạo ST25 Sóc Trăng Thượng Hạng',
        packWeightKg: 10,
        quantity: 1,
        lineKg: 10,
        unitPricePerKg: 36000,
        tierLabel: 'Giá lẻ',
        lineSubtotal: 360000,
      },
    ],
  },
];

export const SEED_QUOTES: QuoteRecord[] = [
  {
    quoteCode: 'BG-260109',
    createdAt: '2026-11-17T09:10:00.000Z',
    status: 'Đã gửi bảng giá & hẹn giao mẫu thử',
    contactName: 'Đại lý Gạo Thành Đạt',
    phone: '0987654321',
    businessType: 'Đại lý / Cửa hàng gạo',
    productName: 'Gạo 504 Cũ Tiền Giang (Chuyên Sỉ)',
    quantityKg: 1000,
    estimatedUnitPrice: 17400,
    estimatedTotal: 17400000,
    tierLabel: 'Giá sỉ 500kg – 1,9 tấn',
    deliveryArea: 'TP. Thủ Đức, TP.HCM',
    needSample: true,
    needVat: true,
    note: 'Cần nhập định kỳ 2 đợt/tháng',
  },
];
