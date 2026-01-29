export const GIFT_METHOD = {
  REGULAR: 'REGULAR', // 정기 이체
  FLEXIBLE: 'FLEXIBLE', //자유 이제
} as const;

export const YUGI_STATUS = {
  STOP: 'STOP',
  CHANGE: 'CHANGE',
  SAME: 'SAME',
} as const;

export const BLOCK_STATUS = {
  BLOCK: 'BLOCK',
  NONBLOCK: 'NONBLOCK',
  AFTERHOMETAX: 'AFTERHOMETAX',
  REVERT: 'REVERT',
} as const;

export type GiftMethod = (typeof GIFT_METHOD)[keyof typeof GIFT_METHOD];

export type YugiStatus = (typeof YUGI_STATUS)[keyof typeof YUGI_STATUS];

export type BlockStatus = (typeof BLOCK_STATUS)[keyof typeof BLOCK_STATUS];
