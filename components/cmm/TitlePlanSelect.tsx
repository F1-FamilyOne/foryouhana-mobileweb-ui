'use client';

import { InfoIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function TitlePlanSelect({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<'to-right' | 'to-left'>(
    'to-right',
  );

  useEffect(() => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const screenCenter = window.innerWidth / 2;

    setDirection(rect.left < screenCenter ? 'to-right' : 'to-left');
  }, []);

  return (
    <div className="flex items-center gap-1">
      <h2 className="font-hana-light text-xs">{title}</h2>

      {description && (
        <div
          ref={wrapperRef}
          className="group relative inline-flex items-center"
        >
          <InfoIcon className="h-4 w-4 text-hana-gray-400" />

          <div
            className={`pointer-events-none absolute bottom-full mb-2 w-50 max-w-[240px] rounded bg-black px-2 py-1 text-white text-xs opacity-0 transition group-hover:opacity-100 ${
              direction === 'to-right' ? 'ml left-full' : 'mr right-full'
            }
            `}
          >
            {description}
          </div>
        </div>
      )}
    </div>
  );
}
