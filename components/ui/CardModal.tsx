'use client';

/**
 * @component CardModal
 * @description
 * Radix/Dialog 등 외부 라이브러리에 의존하지 않고,
 * Portal 기반으로 구현한 카드형 모달 공용 컴포넌트.
 *
 * - 배경 오버레이는 시각적 용도로만 사용되며 클릭 시 닫히지 않음
 * - 모달 닫힘은 내부에서 전달받은 onClose를 통해 명시적으로 제어
 * - 디자인 중심 모달(이벤트, 축하, 안내 등)에 적합
 *
 * @author minyoung
 * @date 2026-01-25
 */

import { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function CardModal({ isOpen, onClose, children }: CardModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 z-10 bg-black/40" />

      <div
        role="dialog"
        aria-modal="true"
        className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-20"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
