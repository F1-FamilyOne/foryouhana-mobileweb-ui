import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * @page: CustomButton
 * @description:
 * 서비스 전반에서 공통으로 사용되는 버튼 컴포넌트입니다.
 *
 * UI에 공통적으로 사용되는 버튼들은
 * preset을 색상 + 길이 (혹은 모양) 이름 규칙으로 설정해서 사용할 수 있습니다.
 * 그 외에도 vairant로 추가 스타일을 조정할 수 있습니다.
 *
 * 사용 예시 ) <CustomButton preset="lightgrayshort">
 *
 * @author: 이정수
 * @date: 2026-01-23
 */

const SIZE = {
  long: 'h-[47px] w-[342px]',
  short: 'h-[42px] w-[155px]',
} as const;

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/40',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        long: SIZE.long,
        short: SIZE.short,
      },
      preset: {
        greenlong: `${SIZE.long} bg-hana-main hover:bg-hana-main/80 text-white`,
        graylong: `${SIZE.long} bg-hana-gray-400 hover:bg-hana-gray-400/80 text-white`,
        lightgraylong: `${SIZE.long} bg-hana-gray-300 hover:bg-hana-gray-300/80 text-black`,
        lightgreenlong: `${SIZE.long} bg-hana-light-green hover:bg-hana-light-green/70 text-black`,
        redlong: `${SIZE.long} bg-hana-red/90 hover:bg-hana-red/80 text-white`,
        lightgrayshort: `${SIZE.short} bg-hana-gray-300 hover:bg-hana-gray-300/70 text-black`,
        maingreenshort: `${SIZE.short} bg-hana-main hover:bg-hana-main/90`,
        badgegreenshort: `${SIZE.short} bg-hana-badge-green hover:bg-hana-badge-green/90`,
        lightgreenshort: `${SIZE.short} bg-hana-light-green hover:bg-hana-light-green/70 text-black`,
        grayround: `h-[30px] w-[138px] rounded-[30px] bg-hana-gray-400 hover:bg-hana-gray-400/70 text-black`,
      },
    },
    defaultVariants: {
      size: 'long',
      variant: 'default',
    },
  },
);

function CustomButton({
  className,
  variant = 'default',
  size = 'long',
  preset,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';
  const resolvedVariants = preset ? { preset, variant } : { variant, size };
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants(resolvedVariants), className)}
      {...props}
    />
  );
}

export { buttonVariants, CustomButton };
