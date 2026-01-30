import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MainCute from '@/components/home/MainCute';

const meta: Meta<typeof MainCute> = {
  title: 'Pages/MainCute', // 스토리북 좌측 사이드바 경로
  component: MainCute,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{ padding: '20px', backgroundColor: '#eee', height: '100vh' }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MainCute>;

export const Default: Story = {
  render: () => <MainCute />,
};
