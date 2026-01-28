import Image from 'next/image';

/**
 * @page: fund-header-section
 * @description: 펀드 상세 페이지 아이콘 분기
 * @author: typeYu
 * @date: 2026-01-27
 */

type DetailIcon = 'hana' | 'king' | 'sp';

type Props = {
  company: string;
  logoSrc: string;
  icon: DetailIcon;
};

export function FundHeaderSection({ company, logoSrc, icon }: Props) {
  return (
    <div className="flex items-center gap-3 pt-4">
      <div className="h-10 w-10 overflow-hidden rounded-xl">
        <Image
          src={logoSrc}
          alt={icon === 'hana' ? 'hanalogo' : icon === 'king' ? 'king' : 'S&P'}
          width={40}
          height={40}
        />
      </div>

      <div className="font-hana-bold text-[18px] text-black">{company}</div>
    </div>
  );
}
