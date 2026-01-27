/**
 * @page: InfoBadge
 * @description: InfoCard안에 들어가는 뱃지입니다.
 * @author: seonukim
 * @date: 2026-01-27
 *
 */

type Props = {
  label: string;
};

export default function InfoBadge({ label }: Props) {
  return (
    <div className="inline-flex items-center rounded-full border border-hana-main px-1.25 py-1 text-[11px] text-hana-main">
      {label}
    </div>
  );
}
