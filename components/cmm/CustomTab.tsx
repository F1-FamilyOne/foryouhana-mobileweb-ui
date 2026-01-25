import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

/**
 * @page: CustomTab
 * @description: CustomTab 컴포넌트는 탭 UI를 구현하는 재사용 가능한 컴포넌트입니다탭
 * @author: seonukim
 * @date: 2026-01-23
 * variant는 big과 small 두 가지가 있습니다.
 * 활용위치는 두 곳, big은 내가 가입한 펀드 페이지,
 * small은 펀드 수익률 도표 내 선택 화면입니다.
 *
 * 입력값:
 * - tabs: 탭 목록 (label: 탭 라벨, value: 탭 값)
 * - value: 현재 선택된 탭의 값
 * - onChange: 탭 변경 시 호출되는 함수
 * - variant: 탭 크기 (big 또는 small)
 *
 * 더 활용하고 싶은 장소가 있을 경우 variant를 추가해서 사용하세요.
 */

type Props = {
  tabs: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'big' | 'small';
};

const variantMap = {
  big: 'h-10.25 w-73.75 bg-hana-gray-200 font-hana-light text-[15px]',
  small: 'h-8 text-[12px] bg-hana-gray-200',
};

export function CustomTab({ tabs, value, onChange, variant = 'big' }: Props) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className={cn(variantMap[variant])}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              variant === 'small' &&
                'text-hana-gray-400 data-[state=active]:text-hana-badge-green',
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
