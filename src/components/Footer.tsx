export function Footer() {
  return (
    <footer className="border-t border-[#1C4D33] bg-[#113121] text-[#EAF2EC]">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-2xl font-semibold text-white">
              Gạo Phù Sa
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#C4DACB]">
              Hệ thống cung cấp gạo sỉ và lẻ trực tiếp từ nhà máy xay xát Đồng Bằng Sông
              Cửu Long. Cam kết gạo vụ mới nguyên chất, cân đủ trọng lượng và minh bạch
              nguồn gốc.
            </p>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold text-[#F7CA5E]">Kho tổng &amp; Liên hệ</h3>
            <ul className="mt-3 space-y-2 text-sm text-[#CFE2D5]">
              <li>Kho TP.HCM: 142 Quốc lộ 1A, Bình Chánh, TP. Hồ Chí Minh</li>
              <li>Nhà máy: Cụm công nghiệp An Nghiệp, TP. Sóc Trăng</li>
              <li>
                Hotline bán lẻ &amp; sỉ:{' '}
                <span className="font-mono font-semibold text-[#F7CA5E]">
                  028 3890 6868
                </span>
              </li>
              <li>Giờ xuất kho: 06:30 – 19:30 (Thứ 2 đến Chủ Nhật)</li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-[#F7CA5E]">Danh mục nhanh</h3>
            <ul className="mt-3 space-y-2 text-sm text-[#CFE2D5]">
              <li>
                <a href="#san-pham" className="transition-colors hover:text-[#F7CA5E]">
                  Các dòng gạo đặc sản &amp; phổ thông
                </a>
              </li>
              <li>
                <a href="#bang-gia-si" className="transition-colors hover:text-[#F7CA5E]">
                  Bảng giá sỉ &amp; dự toán sản lượng
                </a>
              </li>
              <li>
                <a href="#nguon-goc" className="transition-colors hover:text-[#F7CA5E]">
                  Quy chuẩn xay xát &amp; đối tác
                </a>
              </li>
              <li>
                <a href="#tra-cuu" className="transition-colors hover:text-[#F7CA5E]">
                  Tra cứu đơn hàng &amp; báo giá
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-xs text-[#A7C4B1]">
          <p>© {new Date().getFullYear()} Gạo Phù Sa. Đầy đủ chứng nhận VSATTP &amp; hóa đơn VAT.</p>
          <p>Giao hàng nội thành trong ngày · Gửi chành xe 63 tỉnh thành</p>
        </div>
      </div>
    </footer>
  );
}
