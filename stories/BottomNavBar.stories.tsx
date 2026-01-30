import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BottomNavBar } from '@/components/cmm/NavBar';

const meta: Meta<typeof BottomNavBar> = {
  title: 'Common/BottomNavBar',
  component: BottomNavBar,
  parameters: {
    layout: 'fullscreen',
    // Next.js 기능을 스토리북에 주입합니다.
    nextjs: {
      appDirectory: true,
    },
  },
  // 컴포넌트가 absolute라 잘 안 보일 수 있으니 높이를 잡아줍니다.
  decorators: [
    (Story) => (
      <div className="relative h-[100px] w-full bg-gray-50">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BottomNavBar>;

export const HomeActive: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: '/main/123/home' },
    },
  },
};

export const TimelineActive: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: '/main/123/timeline' },
    },
  },
};

export const MenuActive: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: '/main/123/menu' },
    },
  },
};
