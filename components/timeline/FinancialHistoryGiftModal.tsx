'use client';

import { DownloadIcon } from 'lucide-react';
import Image from 'next/image';
import { IMAGES_PATH } from '@/constants/images';
import { CardModal } from '../ui/CardModal';

/**
 * @component FinancialHistoryGiftModal
 * @description 자녀 성인 시 금융 이력을 선물 형태로 저장·전달할 수 있는 카드형 모달 UI
 * @props
 * - `isOpen` (boolean)
 *   모달의 노출 여부를 제어한다.
 *   `true`일 경우 모달이 표시되며, `false`일 경우 렌더링되지 않는다.
 *
 * - `onClose` (() => void)
 *   모달을 닫기 위한 콜백 함수이다.
 *   "다음에 하기" 등 명시적인 액션 버튼에서 호출된다.
 *
 * - `childName` (string)
 *   모달 본문에 노출될 자녀 이름이다.
 *   축하 메시지 문구에 포함되어 사용자에게 개인화된 경험을 제공한다.
 *
 * - `onDownload` (() => void) (현재 미적용)
 *   금융 이력 파일 선택 또는 다운로드 이후 처리 로직을 연결하기 위한 콜백이다.
 *   파일 업로드, 검증, 서버 전송 등의 후속 작업에 활용할 수 있다.
 *
 * - `onShare` (() => void) (현재 미적용)
 *   "공유하기" 버튼 클릭 시 호출되는 콜백이다.
 *   카카오톡 공유 등 외부 공유 기능과 연결하여 사용한다.
 *
 * - `onNext` (() => void)
 *   "다음에 하기" 버튼 클릭 시 호출되는 콜백이다.
 *   모달을 닫거나 다음 사용자 플로우로 이동시키는 데 사용한다.
 *
 * @author minyoung
 * @date 2026-01-25
 */

interface FinancialHistoryGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  onShare: () => void;
  onNext: () => void;
}

export function FinancialHistoryGiftModal({
  isOpen,
  onClose,
  childName,
  onShare,
  onNext,
}: FinancialHistoryGiftModalProps) {
  return (
    <CardModal isOpen={isOpen} onClose={onClose}>
      <div className="relative h-107.25 w-87 overflow-visible rounded-[30px] bg-hana-white-yellow">
        <Image
          src={IMAGES_PATH.STAR_BG}
          alt=""
          width={346}
          height={317}
          className="-top-30 -translate-x-1/2 pointer-events-none absolute left-1/2 z-20 object-cover opacity-60"
          style={{
            maskImage:
              'linear-gradient(to bottom, black 40%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 40%, transparent 100%)',
          }}
        />

        <Image
          src={IMAGES_PATH.STAR_ICON}
          alt=""
          width={48}
          height={48}
          className="-top-6 -translate-x-1/2 pointer-events-none absolute left-1/2 z-30"
        />

        <div className="absolute top-10 z-20 w-full px-9 text-center">
          <h2 className="font-hana-cm text-[25px] leading-tight">
            자녀의 성인을 축하드립니다.
          </h2>
          <p className="mt-2 font-hana-regular text-[13px] text-gray-600 leading-relaxed">
            축하 기념으로 {childName}에게
            <br />
            그동안의 금융 스토리를 전달해보세요.
          </p>
        </div>

        <div className="-translate-x-1/2 absolute top-30 left-1/2 z-20">
          <Image
            src={IMAGES_PATH.POPUP_ILLUSTRATION}
            alt="엄마와 자녀"
            width={220}
            height={180}
            priority
          />
        </div>

        <input id="file-down" type="file" className="hidden" />

        <label
          htmlFor="file-down"
          className="-translate-x-1/2 absolute bottom-20 left-1/2 flex h-12 w-70 cursor-pointer items-center justify-center gap-2 rounded-full bg-hana-pastel-yellow font-hana-regular text-[13px] hover:opacity-90"
        >
          <DownloadIcon className="h-5 w-5" />
          <span>내 아이 첫 금융 이력 파일 다운로드</span>
        </label>

        <div className="-translate-x-1/2 absolute bottom-8 left-1/2 flex gap-2">
          <button
            type="button"
            className="w-33 rounded-full bg-hana-gray-300 py-2 text-[13px]"
            onClick={onNext}
          >
            다음에 하기
          </button>
          <button
            type="button"
            className="w-33 rounded-full bg-hana-gray-300 py-2 text-[13px]"
            onClick={onShare}
          >
            공유하기
          </button>
        </div>
      </div>
    </CardModal>
  );
}
