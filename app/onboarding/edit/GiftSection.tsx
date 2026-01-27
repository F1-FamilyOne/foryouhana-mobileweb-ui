import { InfoIcon } from 'lucide-react';
import { InputAmount, InputDay } from '@/components/cmm/InputDayAmount';
import {
  calculateGiftBenefit,
  formatWonDetail,
  formatWonNumbers,
  getMonthUnit,
  getWonUnit,
} from '@/lib/utils';
import { BinaryToggle } from '../../../components/cmm/BinaryToggle';

/**
 * @page: GiftSection
 * @description: GiftSection은 온보딩 내의 플랜 수정 페이지에서 증여 관련 선택 부분을 나타내는 컴포넌트입니다.
 * 유기정기금 사용 여부, 정기 이제 / 자유 이체 방식 선택이 담겨있습니다.
 * @author: 작성자명
 * @date: 2026-01-26
 */

const ANNUAL_RATE = 0.03;

export default function GiftSection({
  giftPlan,
  onGiftPlanSelected,
  regular,
  onRegularSelected,
  monthlyMoney,
  inMonth,
}: {
  giftPlan: boolean;
  onGiftPlanSelected: (isSelected: boolean) => void;
  regular: boolean;
  onRegularSelected: (isSelected: boolean) => void;
  monthlyMoney: number;
  inMonth: number;
}) {
  return (
    <div className="pt-2">
      <div className="flex items-center gap-1 pb-2">
        <h2 className="font-hana-light text-xs">유기정기금</h2>
        <InfoIcon className="h-4 w-4 text-hana-gray-400" />
        <h2 className="text-[12px]">
          약{' '}
          {formatWonDetail(
            calculateGiftBenefit({
              monthlyMoney,
              inMonth,
              annualRate: ANNUAL_RATE,
            }).benefit,
          )}
          의 증여세를 절감할 수 있어요.
        </h2>
      </div>
      <BinaryToggle
        value={giftPlan}
        onChange={(v) => onGiftPlanSelected(v)}
        trueLabel="신청"
        falseLabel="신청 안함"
      />
      <h4 className="pt-2 font-hana-light text-[10px] text-hana-gray-400">
        ※ 증여세 공제는 10년마다 새로 적용돼요. 19세 미만은 2,000만원, 성인은
        5,000만원까지 공제되며, 한도를 초과한 금액에는 증여세가 부과됩니다.
      </h4>
      <div className="pt-2">
        {giftPlan === false ? (
          <div>
            <div className="flex items-center gap-1 pb-2">
              <h2 className="font-hana-light text-xs">증여 방식 선택</h2>
              <InfoIcon className="h-4 w-4 text-hana-gray-400" />
            </div>
            <BinaryToggle
              value={regular}
              onChange={(v) => onRegularSelected(v)}
              trueLabel="정기 이체"
              falseLabel="자유 이체"
            />
          </div>
        ) : (
          <div></div>
        )}
        {regular === false ? (
          <div></div>
        ) : (
          <div className="pt-2">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-1 pb-2">
                  <h2 className="font-hana-light text-xs">증여 기간</h2>
                  <InfoIcon className="h-4 w-4 text-hana-gray-400" />
                </div>
                <div className="flex flex-row justify-between">
                  <InputDay
                    className="h-10.5 w-38.25 bg-hana-light-green"
                    value={inMonth}
                    unit={getMonthUnit(inMonth)}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 pb-2">
                  <h2 className="font-hana-light text-xs">월 증여액</h2>
                  <InfoIcon className="h-4 w-4 text-hana-gray-400" />
                </div>
                <div className="flex flex-row justify-between">
                  <InputAmount
                    showLabel={false}
                    className="h-10.5 w-38.25"
                    value={formatWonNumbers(monthlyMoney)}
                    unit={getWonUnit(monthlyMoney)}
                  />
                </div>
              </div>
            </div>
            <hr className="my-6 border-hana-gray-300" />
            <div className="grid gap-2">
              <div className="flex gap-1">
                <h2 className="font-hana-light text-xs">총 증여액</h2>
                <InfoIcon className="h-4 w-4 text-hana-gray-400" />
              </div>
              <div className="grid justify-center rounded-xl bg-hana-light-green px-10 py-5">
                <h4 className="text-center text-hana-badge-green">
                  {formatWonDetail(monthlyMoney * inMonth)}
                </h4>
                <h4 className="text-hana-gray-500 text-xs">
                  {formatWonDetail(monthlyMoney)} X {inMonth}
                  {getMonthUnit(inMonth)}
                </h4>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
