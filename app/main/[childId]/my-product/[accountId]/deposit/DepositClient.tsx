/**
 * @page: DepositClient
 * @description: 입금하기 클라이언트 컴포넌트 (UI/상태 관리)
 * @author: 권순범
 * @date: 2026-01-27
 */

'use client';

import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/cmm/Header';
import NumericKeypad from '@/components/deposit/NumericKeypad';
import { formatWon } from '@/lib/utils';
import { processDeposit } from './actions';

/** 최대 입금 금액 (10억 원) */
const MAX_DEPOSIT_AMOUNT = 1_000_000_000;

/** 빠른 입금 버튼에서 '전액'을 의미하는 특수 값 */
const QUICK_AMOUNT_ALL = -1;

type SerializedFund = {
  id: number;
  name: string;
  danger: string;
  type: string;
  is_pension: boolean;
  saving_type: string;
  company: string;
  total_fee: number;
  sell_fee: number;
  set_date: Date;
  plus_1: number | null;
  plus_5: number | null;
  plus_10: number | null;
  total_money: number;
  image: string;
};

type SerializedAccount = {
  id: number;
  user_id: number;
  fund_id: number | null;
  acc_num: string;
  acc_type: string;
  opened_at: Date;
  closed_at: Date | null;
  deposit: number;
  in_type: boolean;
  plus_rate: number;
  plus_money: number;
  in_month: number | null;
};

type SerializedAccountWithFund = SerializedAccount & {
  fund: SerializedFund | null;
};

type Props = {
  targetAccount: SerializedAccountWithFund;
  sourceAccounts: SerializedAccount[];
  childId: number;
  accountId: number;
};

export default function DepositClient({
  targetAccount,
  sourceAccounts,
  childId,
  accountId,
}: Props) {
  const router = useRouter();
  const [selectedSource, setSelectedSource] =
    useState<SerializedAccount | null>(
      sourceAccounts.length > 0 ? sourceAccounts[0] : null,
    );
  const [amount, setAmount] = useState(0);
  const [amountStr, setAmountStr] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 숫자 키 입력
  const handleNumberPress = (num: string) => {
    setError(null);
    if (amountStr === '0' || amountStr === '') {
      setAmountStr(num);
      setAmount(Number.parseInt(num, 10));
    } else {
      const newStr = amountStr + num;
      if (Number.parseInt(newStr, 10) > MAX_DEPOSIT_AMOUNT) return;
      setAmountStr(newStr);
      setAmount(Number.parseInt(newStr, 10));
    }
  };

  // 백스페이스
  const handleBackspace = () => {
    setError(null);
    const newStr = amountStr.slice(0, -1) || '0';
    setAmountStr(newStr);
    setAmount(Number.parseInt(newStr, 10) || 0);
  };

  // 빠른 금액 (누적)
  const handleQuickAmount = (value: number) => {
    setError(null);
    if (!selectedSource) {
      setError('출금 계좌를 선택해주세요.');
      return;
    }

    if (value === QUICK_AMOUNT_ALL) {
      // 전액
      const max = selectedSource.deposit;
      setAmount(max);
      setAmountStr(max.toString());
    } else {
      const newAmount = Math.min(amount + value, selectedSource.deposit);
      setAmount(newAmount);
      setAmountStr(newAmount.toString());
    }
  };

  // 완료 버튼
  const handleComplete = async () => {
    setError(null);

    if (!selectedSource) {
      setError('출금 계좌를 선택해주세요.');
      return;
    }

    if (amount <= 0) {
      setError('금액을 입력해주세요.');
      return;
    }

    if (amount > selectedSource.deposit) {
      setError('잔액이 부족합니다.');
      return;
    }

    setIsSubmitting(true);

    const result = await processDeposit({
      childId,
      sourceAccountId: selectedSource.id,
      targetAccountId: accountId,
      amount,
    });

    setIsSubmitting(false);

    if (result.success) {
      router.push(`/main/${childId}/my-product/${accountId}/deposit/complete`);
    } else {
      setError(result.error || '입금 처리 중 오류가 발생했습니다.');
    }
  };

  // 계좌 선택
  const handleSelectSource = (account: SerializedAccount) => {
    setSelectedSource(account);
    setIsDropdownOpen(false);
    // 선택한 계좌의 잔액보다 입력 금액이 크면 리셋
    if (amount > account.deposit) {
      setAmount(0);
      setAmountStr('0');
    }
  };

  const quickAmounts = [
    { label: '1만', value: 10000 },
    { label: '5만', value: 50000 },
    { label: '10만', value: 100000 },
    { label: '100만', value: 1000000 },
    { label: '전액', value: QUICK_AMOUNT_ALL },
  ];

  return (
    <div className="relative flex h-screen flex-col bg-white">
      <Header content="입금하기" />

      {/* 상단 영역 - 입금 대상 계좌 */}
      <div className="px-5">
        <div className="mt-2">
          <p className="font-hana-medium text-[14px] text-gray-900">
            {targetAccount.fund?.name || '펀드 계좌'}{' '}
            <span className="font-hana-regular">으로</span>
          </p>
          <p className="mt-0.5 font-hana-regular text-[12px] text-hana-gray-500">
            하나은행 {targetAccount.acc_num}
          </p>
        </div>
      </div>

      {/* 금액 표시 영역 - 입금계좌와 출금계좌 사이 중앙 배치 */}
      <div className="flex flex-1 items-center justify-center px-5">
        {amount === 0 ? (
          <p className="font-hana-bold text-[20px] text-gray-900">
            얼마를 보낼까요?
          </p>
        ) : (
          <p className="font-hana-bold text-[24px] text-gray-900">
            {formatWon(amount)}
            <span className="ml-1 font-hana-medium text-[18px]">원</span>
          </p>
        )}
      </div>

      {/* 하단 영역 - 출금계좌 + 키패드 */}
      <div className="px-5">
        {/* 출금 계좌 선택 (드롭다운) */}
        <div className="relative mb-4">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex w-full items-center justify-between rounded-xl bg-hana-gray-200 p-4"
          >
            {selectedSource ? (
              <div className="text-left">
                <p className="font-hana-medium text-[14px] text-gray-700">
                  하나 {selectedSource.acc_num}
                </p>
                <p className="font-hana-regular text-[13px] text-hana-gray-600">
                  {formatWon(selectedSource.deposit)} 원
                </p>
              </div>
            ) : (
              <p className="font-hana-regular text-[14px] text-hana-gray-500">
                계좌를 선택해주세요
              </p>
            )}
            <ChevronDown
              size={20}
              className={`text-hana-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* 드롭다운 목록 */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 left-0 z-10 mt-1 rounded-xl border border-hana-gray-200 bg-white shadow-lg">
              {sourceAccounts.length > 0 ? (
                sourceAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectSource(acc)}
                    className={`w-full p-4 text-left transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-hana-gray-100 ${
                      selectedSource?.id === acc.id ? 'bg-hana-gray-100' : ''
                    }`}
                  >
                    <p className="font-hana-medium text-[14px] text-gray-700">
                      하나 {acc.acc_num}
                    </p>
                    <p className="font-hana-regular text-[13px] text-hana-gray-600">
                      {formatWon(acc.deposit)} 원
                    </p>
                  </button>
                ))
              ) : (
                <p className="p-4 font-hana-regular text-[14px] text-hana-gray-500">
                  출금 가능한 계좌가 없습니다
                </p>
              )}
            </div>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p className="mb-2 text-center font-hana-regular text-[13px] text-red-500">
            {error}
          </p>
        )}

        {/* 빠른 금액 버튼 */}
        <div className="mb-6 flex justify-center gap-2">
          {quickAmounts.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleQuickAmount(item.value)}
              disabled={isSubmitting}
              className="rounded-full bg-[#EFF0F4] px-3 py-1.5 font-hana-regular text-[13px] text-gray-600 transition-all active:scale-95 active:bg-hana-gray-300 disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 숫자 키패드 */}
        <div className="pb-4">
          <NumericKeypad
            onNumberPress={handleNumberPress}
            onBackspace={handleBackspace}
            onComplete={handleComplete}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
