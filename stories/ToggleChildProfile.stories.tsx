import type { Meta, StoryObj } from '@storybook/nextjs-vite';
/**
 * Next/Image는 스토리북에서 최적화 이슈가 있어서
 * 보통 아래처럼 unoptimized 처리하거나 mock을 씀
 */
import Image from 'next/image';
import { useState } from 'react';
import ToggleChildProfile, {
  type KidProfile,
} from '@/components/home/ToggleChildProfile';

(Image as any).defaultProps = {
  unoptimized: true,
};

const meta: Meta<typeof ToggleChildProfile> = {
  title: 'Components/ToggleChildProfile',
  component: ToggleChildProfile,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ToggleChildProfile>;

const mockKids: KidProfile[] = [
  {
    id: 1,
    avatarUrl: 'https://picsum.photos/seed/kid1/200',
  },
  {
    id: 2,
    avatarUrl: 'https://picsum.photos/seed/kid2/200',
  },
  {
    id: 3,
    avatarUrl: 'https://picsum.photos/seed/kid3/200',
  },
];

export const Default: Story = {
  render: () => {
    const [selectedKidId, setSelectedKidId] = useState<number>(1);

    return (
      <ToggleChildProfile
        kids={mockKids}
        selectedKidId={selectedKidId}
        onSelect={(kidId) => {
          setSelectedKidId(kidId);
          console.log('selected kid id:', kidId);
        }}
        onAddKid={() => {
          alert('자녀 추가 클릭');
        }}
      />
    );
  },
};
