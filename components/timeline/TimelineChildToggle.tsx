'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import ToggleChildProfile, {
  type KidProfile,
} from '@/components/home/ToggleChildProfile';

type Props = {
  kids: KidProfile[];
  selectedKidId: number;
};

export default function TimelineChildToggle({ kids, selectedKidId }: Props) {
  const router = useRouter();

  const handleSelect = (id: number) => {
    // 클라이언트 측에서는 router.push를 사용하여 이동합니다.
    router.push(`/main/${id}/timeline` as Route);
  };

  return (
    <div className="mb-6 flex justify-end">
      <ToggleChildProfile
        kids={kids}
        selectedKidId={selectedKidId}
        onSelect={handleSelect}
        onAddKid={() => router.push('/main/add-child' as Route)}
      />
    </div>
  );
}
