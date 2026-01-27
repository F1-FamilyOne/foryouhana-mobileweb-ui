import Image from 'next/image';
import { IMAGES_PATH } from '@/constants/images';

/**
 * @page: ProgressBar
 * @description: 가입 절차에 사용되는 프로그레스 바
 *
 * completed, current, pending 각각 완료, 진행중, 진행하지 않음을 나타냅니다.
 *
 * 사용법) <ProgressBar step='completed' step='current'/>
 *
 * @author: 승빈
 * @date: 2026-01-25
 */

type Step = {
  step: 'completed' | 'current' | 'pending';
  step2: 'completed' | 'current' | 'pending';
  content1: string;
  content2: string;
};

export default function ProgressBar({ step, step2, content1, content2 }: Step) {
  // const ICON_PATH = '/ProgressBar/icon/StepSuccess.svg';

  // 재사용 가능한 Step 렌더링 함수
  const renderStep = (
    status: 'completed' | 'current' | 'pending',
    label: string,
  ) => (
    <div className="w-full">
      <div
        className={`border-b-3 ${
          status !== 'pending'
            ? 'border-b-[var(--color-hana-badge-green)]'
            : 'border-b-[var(--color-hana-gray-500)]'
        }`}
      />
      <div className="flex justify-center gap-1 p-1">
        {status === 'completed' && (
          <Image
            src={IMAGES_PATH.PROGRESS_CHECK}
            alt="완료"
            width={12}
            height={12}
          />
        )}
        <p
          className={`font-hana-light text-[13px] ${
            status !== 'pending'
              ? 'text-[var(--color-hana-badge-green)]'
              : 'text-[var(--color-hana-gray-600)]'
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex w-full justify-center">
      <div className="flex h-[40px] w-[357px] gap-3">
        {renderStep(step, content1)}
        {renderStep(step2, content2)}
      </div>
    </div>
  );
}
