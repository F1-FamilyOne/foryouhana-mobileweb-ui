import {
  account_acc_type,
  fund_danger,
  fund_saving_type,
  fund_type,
} from '../lib/generated/prisma/client';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🚀 시딩 시작: 부모, 자녀, 계좌 및 이력 데이터...');

  // 1. MyData & 부모 생성
  const myData = await prisma.mydata.create({ data: {} });
  const parent = await prisma.parent.create({
    data: { mydata_id: myData.id },
  });

  // 2. 펀드 상품 생성 (계좌 연결용)
  const baseFund = await prisma.fund.create({
    data: {
      name: '하나없이하나마나ETF',
      danger: fund_danger.MID,
      type: fund_type.ETF,
      saving_type: fund_saving_type.BOTH,
      company: '하나은행',
      total_fee: 0.015,
      sell_fee: 0.005,
      set_date: new Date('2024-01-01'),
      image: 'https://placehold.co/400x400?text=ETF',
      total_money: 1000000000n,
      plus_1: 5.5,
      plus_5: 20.2,
      plus_10: 45.0,
    },
  });

  // 펀드 추가 - 0125
  const bondFund = await prisma.fund.create({
    data: {
      name: '하나암자 채권형 펀드',
      danger: fund_danger.LOW,
      type: fund_type.BOND,
      saving_type: fund_saving_type.REGULAR,
      company: '하나은행',
      total_fee: 0.008, // 낮은 수수료
      sell_fee: 0.001,
      set_date: new Date('2023-05-20'),
      image: 'https://placehold.co/400x400?text=BOND',
      total_money: 500000000n,
      plus_1: 3.2,
      plus_5: 12.5,
      plus_10: 28.0,
    },
  });

  const globalStockFund = await prisma.fund.create({
    data: {
      name: '하나글로벌울트라 TOP50 ETF',
      danger: fund_danger.HIGH,
      type: fund_type.STOCK,
      saving_type: fund_saving_type.BOTH,
      company: '하나은행',
      total_fee: 0.025, // 높은 수익률만큼 높은 수수료
      sell_fee: 0.01,
      set_date: new Date('2024-02-15'),
      image: 'https://placehold.co/400x400?text=STOCK',
      total_money: 2000000000n,
      plus_1: 15.8, // 변동성 큼
      plus_5: 65.4,
      plus_10: 120.0,
    },
  });
  // 3. 자녀 2명 생성 (제약 조건 준수)
  // 자녀 1: 유기정기금 YES (goal_money, monthly_money 필수)
  const child1 = await prisma.child.create({
    data: {
      parent_id: parent.id,
      name: '하나둘',
      profile_pic: '/file/자녀1.jpg', //자녀 프로필 이미지 경로 명시
      born_date: new Date('2015-01-01'),
      is_promise_fixed: true,
      goal_money: 20000000n,
      monthly_money: 100000n,
      invest_type: fund_danger.MID,
      identity_hash: 'hash_child_1_unique',
    },
  });

  const child2 = await prisma.child.create({
    data: {
      parent_id: parent.id,
      name: '하나셋',
      profile_pic: '/file/자녀2.jpg',
      born_date: new Date('2005-05-05'),
      is_promise_fixed: false, // 0이므로
      goal_money: null, // 반드시 null
      monthly_money: null, // 반드시 null
      invest_type: fund_danger.LOW,
      identity_hash: 'hash_child_2_unique',
    },
  });

  // 4. 계좌 생성 (부모 1, 자녀 1, 자녀 펀드 2)
  // 부모의 입출금 계좌 (스키마상 child_id가 필수이므로 첫째에게 연결)
  const parentDeposit = await prisma.account.create({
    data: {
      child_id: child1.id,
      acc_num: '1002-123-456789',
      acc_type: account_acc_type.DEPOSIT,
      opened_at: new Date('2020-01-01'),
      deposit: 5000000n,
      in_type: false, // 정기
    },
  });

  // 자녀 1의 입출금 계좌 != 연금저축펀드계좌
  const child1Deposit = await prisma.account.create({
    data: {
      child_id: child1.id,
      acc_num: '1002-999-000001',
      acc_type: account_acc_type.DEPOSIT,
      opened_at: new Date('2024-01-01'),
      deposit: 50000n,
      in_type: false,
    },
  });

  // 자녀 2의 펀드 계좌 1: 자유 (in_type: 0)
  const child2RegularFund = await prisma.account.create({
    data: {
      child_id: child2.id,
      fund_id: baseFund.id,
      acc_num: '555-001-1111',
      acc_type: account_acc_type.FUND,
      opened_at: new Date(),
      deposit: 200000n,
      in_type: false, // 0: 정기
      plus_rate: 3.2,
    },
  });

  // 자녀 2의 펀드 계좌 2: 정기적립식 (in_type: 1 -> in_month 필수!)
  const child2FreeFund = await prisma.account.create({
    data: {
      child_id: child2.id,
      fund_id: baseFund.id,
      acc_num: '555-002-2222',
      acc_type: account_acc_type.FUND,
      opened_at: new Date(),
      deposit: 150000n,
      in_type: true, // 1: 자유
      in_month: 12, // 제약 조건에 따라 필수 입력
      plus_rate: 4.5,
    },
  });

  // 연저펀
  const child1PensionPart1 = await prisma.account.create({
    data: {
      child_id: child1.id,
      fund_id: bondFund.id, // 위에서 만든 채권형 펀드 ID
      acc_num: '123-PENSION-001', // 계좌번호 동일
      acc_type: account_acc_type.PENSION,
      opened_at: new Date('2024-02-01'),
      deposit: 400000n, // 채권 펀드에 들어있는 금액
      plus_rate: 1.5,
      in_type: false,
    },
  });

  // 2. 연금저축펀드 - 주식형 상품 부분
  const child1PensionPart2 = await prisma.account.create({
    data: {
      child_id: child1.id,
      fund_id: globalStockFund.id, // 위에서 만든 주식형 펀드 ID
      acc_num: '123-PENSION-001', // 계좌번호 동일!
      acc_type: account_acc_type.PENSION,
      opened_at: new Date('2024-02-01'),
      deposit: 600000n, // 주식 펀드에 들어있는 금액
      plus_rate: 8.4,
      in_type: false,
    },
  });

  // 5. 알림(Alert) 데이터 생성
  await prisma.alert.create({
    data: {
      child_id: child1.id,
      type: '1',
      title: '이번 달 증여가 완료됐어요!',
      description: '아이 계좌로 50000원이 입금되었어요. 메모를 남겨보세요',
      button_text: '메모하기',
      priority: 7,
      screen: 'home',
      status: false,
    },
  });

  await prisma.alert.create({
    data: {
      child_id: child1.id,
      type: '2',
      title: '증여세 한도에 거의 도달했어요!',
      description:
        '현재 누적 증여금이 비과세 구간 90%에 도달했어요. 100% 이후, 증여세가 발생해요. 미리 확인하고, 절세 방법을 준비해보세요.',
      button_text: '확인',
      priority: 7,
      screen: 'home',
      status: false,
    },
  });

  await prisma.alert.create({
    data: {
      child_id: child1.id,
      type: '3',
      title: '펀드 만기에 도달했어요',
      description: '축하합니다! 펀드 만기의 순간을 메모로 남겨요!',
      button_text: '메모하기',
      priority: 7,
      screen: 'timeline', // 타임라인으로 이동해야함. 이름 수정
      status: false,
    },
  });

  await prisma.alert.create({
    data: {
      child_id: child1.id,
      type: '4',
      title: '증여세 신고 기간이에요',
      description:
        '이때까지의 증여에 대해서 증여 신고를 해봐요! 필요한 서류와 방법은 아이앞으로가 도와드려요!',
      button_text: '확인',
      priority: 7,
      screen: 'home',
      status: false,
    },
  });
  // 추가 팝업도 만들 것!

  // 6. 송금 이력(History) 생성: 부모 계좌 -> 자녀 1 입출금 계좌
  await prisma.history.create({
    data: {
      money: 50000n,
      source_account_id: parentDeposit.id,
      target_account_id: child1Deposit.id,
      created_at: new Date(),
    },
  });

  await prisma.timeline.createMany({
    data: [
      // 1. 입출금 통장 개설 (계좌 opened_at: 2024-01-01과 일치)
      {
        child_id: child1.id,
        type: '입출금 통장 개설', 
        description: '첫 금융 생활의 시작',
        memo: '하나둘 첫 통장 만든 날',
        date: new Date('2024-01-01'), 
      },

      // 2. 연금저축펀드(주식형) 가입
      {
        child_id: child1.id,
        type: '연금저축펀드 가입',
        description: globalStockFund.name, // '하나글로벌울트라 TOP50 ETF'
        memo: '테x라 우주가보자',
        date: new Date('2024-02-01T10:05:00'),
      },

      // 3. 어린이날 용돈 (과거 이벤트)
      {
        child_id: child1.id,
        type: '용돈 입금',
        description: '100,000원',
        memo: '행복한 어린이날 선물 🎁',
        date: new Date('2024-05-05'),
      },

      {
        child_id: child1.id,
        type: '용돈 입금',
        description: '50,000원', // history.money와 동일
        memo: '할머니가 주신 용돈 저축하기',
        date: new Date(), // 이건 가장 최근에 떠야 하니 현재 시간으로!
      },

      // 성인 자식의 경우
      // 1. 아주 옛날 입출금 통장 개설
      {
        child_id: child2.id,
        type: '입출금 통장 개설',
        description: '우리 아기 첫 통장',
        memo: '자라나라 머리머리',
        date: new Date('2010-05-05'), 
      },

      // 2. 성년의 날 축하 (가상)
      {
        child_id: child2.id,
        type: '성년의 날',
        description: '축하합니다',
        memo: '성인 축하해',
        date: new Date('2024-05-20'), 
      },

      // 3. 펀드 계좌 개설 (최근)
      {
        child_id: child2.id,
        type: '펀드 가입',
        description: baseFund.name, // '하나없이하나마나ETF'
        memo: 'ETF로 돈 좀 벌게 해줄게',
        date: new Date('2025-01-01'), 
      },

      // 4. 펀드 배당금 입금 (최근)
      {
        child_id: child2.id,
        type: '펀드 배당금 입금',
        description: '12,500원',
        memo: '첫 투자 배당금 받음!',
        date: new Date('2026-01-15'), 
      },
    ],
  });

  console.log('✅ 모든 시드 데이터가 성공적으로 생성되었습니다!');
}

main()
  .catch((e) => {
    console.error('❌ 시딩 중 에러 발생:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
