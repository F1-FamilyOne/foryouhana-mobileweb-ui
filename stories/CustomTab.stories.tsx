import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { CustomTab } from '../components/cmm/CustomTab';

/**
 * @page: CustomTab 스토리북
 * @description: 커스텀탭을 위한 스토리북입니다.
 * @author: seonukim
 * @date: 2026-01-30
 */

const meta = {
  title: 'Components/CustomTab',
  component: CustomTab,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['big', 'small'],
      description: '탭의 크기를 설정합니다',
    },
    tabs: {
      description: '탭 목록 (label: 탭 라벨, value: 탭 값)',
    },
    value: {
      description: '현재 선택된 탭의 값',
    },
    onChange: {
      description: '탭 변경 시 호출되는 함수',
    },
  },
} satisfies Meta<typeof CustomTab>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper 컴포넌트로 상태 관리
const CustomTabWithState = (args: any) => {
  const [value, setValue] = useState(args.value);

  return (
    <CustomTab
      {...args}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        args.onChange?.(newValue);
      }}
    />
  );
};

// Big 변형 - 내가 가입한 펀드 페이지용
export const BigVariant: Story = {
  args: {
    variant: 'big',
    tabs: [
      { label: '전체', value: 'all' },
      { label: '투자중', value: 'investing' },
      { label: '만기', value: 'matured' },
    ],
    value: 'all',
    onChange: (value) => console.log('Selected tab:', value),
  },
  render: (args) => <CustomTabWithState {...args} />,
};

// Small 변형 - 펀드 수익률 도표용
export const SmallVariant: Story = {
  args: {
    variant: 'small',
    tabs: [
      { label: '1개월', value: '1m' },
      { label: '3개월', value: '3m' },
      { label: '6개월', value: '6m' },
      { label: '1년', value: '1y' },
    ],
    value: '1m',
    onChange: (value) => console.log('Selected period:', value),
  },
  render: (args) => <CustomTabWithState {...args} />,
};

// 2개 탭 예제
export const TwoTabs: Story = {
  args: {
    variant: 'big',
    tabs: [
      { label: '국내', value: 'domestic' },
      { label: '해외', value: 'overseas' },
    ],
    value: 'domestic',
    onChange: (value) => console.log('Selected tab:', value),
  },
  render: (args) => <CustomTabWithState {...args} />,
};

// 많은 탭 예제
export const ManyTabs: Story = {
  args: {
    variant: 'small',
    tabs: [
      { label: '1일', value: '1d' },
      { label: '1주', value: '1w' },
      { label: '1개월', value: '1m' },
      { label: '3개월', value: '3m' },
      { label: '6개월', value: '6m' },
      { label: '1년', value: '1y' },
      { label: '3년', value: '3y' },
    ],
    value: '1m',
    onChange: (value) => console.log('Selected period:', value),
  },
  render: (args) => <CustomTabWithState {...args} />,
};
