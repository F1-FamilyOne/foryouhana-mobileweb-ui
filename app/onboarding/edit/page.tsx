import { InfoIcon } from 'lucide-react';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import { InputAmount, InputDay } from '@/components/cmm/InputDayAmount';

export default function planEdit() {
  return (
    <div>
      <Header content="플랜 직접 수정하기" />
      <div className="grid gap-3">
        <h1 className="font-hana-light">
          원하는 대로 증여 계획을 조정해보세요.
        </h1>
        <div className="rounded-2xl border border-hana-gray-300 p-5 shadow-hana-gray-300 shadow-sm">
          <div>
            <div className="flex items-center gap-1 pb-2">
              <h2 className="font-hana-light text-xs">연금 저축 펀드</h2>
              <InfoIcon className="h-4 w-4 text-hana-gray-400" />
            </div>
            <div className="flex flex-row justify-between">
              <CustomButton preset="lightgrayshort">신청</CustomButton>
              <CustomButton preset="lightgrayshort">신청 안함</CustomButton>
            </div>
            <h4 className="pt-2 font-hana-light text-[10px] text-hana-gray-400">
              ※ 연금저축펀드는 세액공제 혜택이 있는 대신, 연금 수령 요건을
              충족하지 못하고 중도 해지할 경우 기타소득세 등 불이익이 발생할 수
              있습니다.
            </h4>
          </div>
          <div className="pt-2">
            <div className="flex items-center gap-1 pb-2">
              <h2 className="font-hana-light text-xs">유기정기금</h2>
              <InfoIcon className="h-4 w-4 text-hana-gray-400" />
              <h2 className="text-[12px]">
                약 ${}원의 증여세를 절감할 수 있어요.
              </h2>
            </div>
            <div className="flex flex-row justify-between">
              <CustomButton preset="lightgrayshort">신청</CustomButton>
              <CustomButton preset="lightgrayshort">신청 안함</CustomButton>
            </div>
            <h4 className="pt-2 font-hana-light text-[10px] text-hana-gray-400">
              ※ 증여세 공제는 10년마다 새로 적용돼요. 19세 미만은 2,000만원,
              성인은 5,000만원까지 공제되며, 한도를 초과한 금액에는 증여세가
              부과됩니다.
            </h4>
          </div>
          <div className="pt-2">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-1 pb-2">
                  <h2 className="font-hana-light text-xs">증여 기간</h2>
                  <InfoIcon className="h-4 w-4 text-hana-gray-400" />
                </div>
                <div className="flex flex-row justify-between">
                  <InputDay className="h-10.5 w-38.25 bg-hana-light-green" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 pb-2">
                  <h2 className="font-hana-light text-xs">월 증여액</h2>
                  <InfoIcon className="h-4 w-4 text-hana-gray-400" />
                </div>
                <div className="flex flex-row justify-between">
                  <InputAmount showLabel={false} className="h-10.5 w-38.25" />
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
                <h4 className="text-center text-hana-badge-green">5400만원</h4>
                <h4 className="text-hana-gray-500 text-xs">
                  9년 × 12개월 × 50만원
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="grid justify-center gap-2 pt-4">
          <CustomButton preset="lightgraylong">돌아가기</CustomButton>
          <CustomButton preset="greenlong">이 플랜으로 변경하기</CustomButton>
        </div>
      </div>
    </div>
  );
}
