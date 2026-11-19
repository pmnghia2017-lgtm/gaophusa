import { ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/riceCatalog';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onSelectWholesaleMode: () => void;
}

const PROOF_METRICS = [
  {
    value: '16.500 đ/kg',
    label: 'Giá sỉ tận nhà máy từ 2 tấn',
  },
  {
    value: '320+ đối tác',
    label: 'Đại lý, nhà hàng & bếp ăn tin dùng',
  },
  {
    value: 'Trong 24 giờ',
    label: 'Giao lẻ tận nhà & xe tải chành xe',
  },
  {
    value: '100% vụ mới',
    label: 'Xay xát mới mỗi tuần, không đấu trộn',
  },
];

export function HeroSection({ onSelectWholesaleMode }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="border-b border-[#DCE5DE] bg-gradient-to-br from-[#FBF6E8] via-[#FCFBF7] to-[#EAF4EE]"
    >
      <div className="mx-auto max-w-[1200px] px-4 pt-10 pb-12 sm:px-6 lg:px-8 lg:pt-14 lg:pb-16">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left editorial column */}
          <div className="flex flex-col justify-between lg:col-span-6 lg:py-2">
            <div>
              <p className="text-xs font-semibold tracking-wide text-[#9A6306]">
                Nhà máy xay xát Đồng Bằng Sông Cửu Long · Chứng nhận VSATTP
              </p>

              <h1 className="mt-4 font-display text-[clamp(2rem,3.6vw,3.15rem)] leading-[1.16] font-semibold tracking-tight text-[#12261B]">
                Gạo đặc sản vụ mới,{' '}
                <span className="text-[#155E37]">giá sỉ tận kho</span> &amp; giao lẻ tận nhà
              </h1>

              <p className="mt-5 max-w-[54ch] text-base leading-relaxed text-[#3B4C41]">
                Gạo Phù Sa cung cấp trực tiếp ST25 Sóc Trăng, Nàng Hoa 9, Tài Nguyên và
                504 Cũ từ vùng nguyên liệu Đồng Bằng Sông Cửu Long. Đáp ứng linh hoạt từ
                túi 5kg cho gia đình đến đơn hàng 10 tấn có hóa đơn VAT cho đại lý và bếp
                ăn công nghiệp.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href="#san-pham"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-md bg-[#155E37] px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 shadow-xs transition-colors duration-150 hover:bg-[#0F4628] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#155E37]"
                >
                  <span>Xem các dòng gạo</span>
                  <ArrowRight className="h-4 w-4 text-[#F5C451]" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={onSelectWholesaleMode}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-md border border-[#DFC078] bg-[#FBF3DC] px-5 py-3 text-sm font-semibold text-[#6B4303] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#C98A16] hover:bg-[#F5E7C1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98A16]"
                >
                  Xem bảng giá sỉ &amp; nhận mẫu thử
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-y-1.5 border-t border-[#DFDFD2] pt-5 text-xs font-medium text-[#3B4C41] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
              <span>Miễn phí giao lẻ từ 300.000 đ</span>
              <span aria-hidden="true" className="hidden text-[#C98A16] sm:inline">
                ·
              </span>
              <span>Chiết khấu sỉ tự động từ 50kg</span>
              <span aria-hidden="true" className="hidden text-[#C98A16] sm:inline">
                ·
              </span>
              <span>Xuất hóa đơn VAT đầy đủ</span>
            </div>
          </div>

          {/* Right editorial photography column */}
          <div className="overflow-hidden rounded-xl border border-[#DFD8C4] bg-[#F2EFE4] shadow-sm lg:col-span-6">
            <div className="aspect-[16/10] w-full lg:aspect-auto lg:h-full lg:min-h-[420px]">
              <ResilientImage
                src={HERO_IMAGE}
                alt="Gạo trắng thơm vụ mới đổ vào mẹt tre bên bao gạo vải bố với cánh đồng lúa Đồng Bằng Sông Cửu Long phía sau"
                fallbackLabel="Gạo Phù Sa — Vùng nguyên liệu Đồng Bằng Sông Cửu Long"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-width 4-column deep Mekong emerald proof strip below hero split */}
        <dl className="mt-10 grid grid-cols-2 divide-y divide-white/15 overflow-hidden rounded-xl bg-[#123D27] text-white shadow-sm sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {PROOF_METRICS.map((metric) => (
            <div key={metric.label} className="px-5 py-5 sm:px-6">
              <dt className="text-xs text-[#C7DFD0]">{metric.label}</dt>
              <dd className="mt-1.5 text-lg font-semibold tracking-tight text-[#F7CA5E] tabular-nums sm:text-xl">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
