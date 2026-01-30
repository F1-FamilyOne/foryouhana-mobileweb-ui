import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useMemo, useState } from 'react';

import { AgreeTerms } from '../components/cmm/AgreeTerms';

/**
 * @page: 약관 동의 컴포넌트
 * @description: default, all checked, NoItems 3개의 모드
 * @author: typeYu
 * @date: 2026-01-30
 */

type AgreeItemState = {
  content: string;
  checked: boolean;
};

const meta = {
  title: 'cmm/AgreeTerms',
  component: AgreeTerms,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    className: { control: 'text' },
    label: { control: 'text' },
    // items는 내부 상태로 만들 거라 컨트롤 비활성화
    items: { control: false },
  },
} satisfies Meta<typeof AgreeTerms>;

export default meta;

type Story = StoryObj<typeof meta>;

function AgreeTermsStateful(props: { label: string; className?: string }) {
  const [items, setItems] = useState<AgreeItemState[]>([
    { content: '(필수) 서비스 이용약관 동의', checked: false },
    { content: '(필수) 개인정보 처리방침 동의', checked: false },
    { content: '(선택) 마케팅 수신 동의', checked: false },
  ]);

  const agreeItems = useMemo(() => {
    return items.map((it) => {
      return {
        content: it.content,
        checked: it.checked,
        onCheckedChange: (nextChecked: boolean) => {
          setItems((prev) => {
            return prev.map((p) => {
              if (p.content !== it.content) {
                return p;
              }
              return { ...p, checked: nextChecked };
            });
          });
        },
      };
    });
  }, [items]);

  return (
    <div className="w-[360px]">
      <AgreeTerms
        label={props.label}
        className={props.className}
        items={agreeItems}
      />
    </div>
  );
}

export const Default: Story = {
  args: {
    label: '약관에 동의해 주세요',
  },
  render: (args) => {
    return <AgreeTermsStateful label={args.label} className={args.className} />;
  },
};

export const AllChecked: Story = {
  args: {
    label: '약관에 동의해 주세요',
  },
  render: (args) => {
    return (
      <div className="w-[360px]">
        <AgreeTerms
          label={args.label}
          className={args.className}
          items={[
            {
              content: '(필수) 서비스 이용약관 동의',
              checked: true,
              onCheckedChange: () => {},
            },
            {
              content: '(필수) 개인정보 처리방침 동의',
              checked: true,
              onCheckedChange: () => {},
            },
            {
              content: '(선택) 마케팅 수신 동의',
              checked: true,
              onCheckedChange: () => {},
            },
          ]}
        />
      </div>
    );
  },
};

export const NoItems: Story = {
  args: {
    label: '약관 동의',
  },
  render: (args) => {
    return (
      <div className="w-[360px]">
        <AgreeTerms label={args.label} className={args.className} items={[]} />
      </div>
    );
  },
};
