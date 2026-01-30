import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import {
  InputAmount,
  InputDay,
  InputMonth,
} from '../components/cmm/InputDayAmount';

/**
 * @page: InputDayAmount Stories
 * @description: InputDay, InputMonth, InputAmount 컴포넌트 스토리북
 * @author: 권순범
 * @date: 2026-01-25
 */

// ─── InputDay ───

const meta = {
  title: 'cmm/InputDayAmount',
  component: InputDay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: '입력된 숫자 값',
    },
    unit: {
      control: 'text',
      description: '입력 필드 우측에 표시되는 단위',
    },
    placeholder: {
      control: 'text',
      description: '입력 필드 플레이스홀더',
    },
    onChange: {
      description: '값 변경 시 호출되는 함수',
    },
  },
} satisfies Meta<typeof InputDay>;

export default meta;
type Story = StoryObj<typeof meta>;

const InputDayWithState = (args: {
  value?: number;
  unit: string;
  placeholder?: string;
}) => {
  const [value, setValue] = useState(args.value);
  return <InputDay {...args} value={value} onChange={(v) => setValue(v)} />;
};

export const DayDefault: Story = {
  args: {
    unit: '일',
    placeholder: '1~31',
  },
  render: (args) => <InputDayWithState {...args} />,
};

export const DayWithValue: Story = {
  args: {
    value: 25,
    unit: '일',
  },
  render: (args) => <InputDayWithState {...args} />,
};

// ─── InputMonth ───

const InputMonthWithState = (args: {
  value?: number;
  unit?: string;
  placeholder?: string;
  disabled?: boolean;
}) => {
  const [value, setValue] = useState(args.value);
  return <InputMonth {...args} value={value} onChange={(v) => setValue(v)} />;
};

export const MonthDefault: StoryObj = {
  args: {
    unit: '개월',
    placeholder: '납입 개월수',
  },
  render: (args) => <InputMonthWithState {...args} />,
};

export const MonthWithValue: StoryObj = {
  args: {
    value: 120,
    unit: '개월',
  },
  render: (args) => <InputMonthWithState {...args} />,
};

export const MonthDisabled: StoryObj = {
  args: {
    value: 60,
    unit: '개월',
    disabled: true,
  },
  render: (args) => <InputMonthWithState {...args} />,
};

// ─── InputAmount ───

const InputAmountWithState = (args: {
  value?: number;
  unit: string;
  placeholder?: string;
  label?: string;
  showLabel?: boolean;
  disabled?: boolean;
}) => {
  const [value, setValue] = useState(args.value);
  return <InputAmount {...args} value={value} onChange={(v) => setValue(v)} />;
};

export const AmountDefault: StoryObj = {
  args: {
    unit: '만원',
    placeholder: '금액 입력',
  },
  render: (args) => <InputAmountWithState {...args} />,
};

export const AmountWithValue: StoryObj = {
  args: {
    value: 416,
    unit: '만원',
    label: '월 증여액',
  },
  render: (args) => <InputAmountWithState {...args} />,
};

export const AmountNoLabel: StoryObj = {
  args: {
    value: 1000,
    unit: '만원',
    showLabel: false,
  },
  render: (args) => <InputAmountWithState {...args} />,
};

export const AmountDisabled: StoryObj = {
  args: {
    value: 500,
    unit: '만원',
    disabled: true,
  },
  render: (args) => <InputAmountWithState {...args} />,
};
