import {
  account_acc_type,
  fund_danger,
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
      name: '우리 아이 희망 지수 ETF',
      danger: fund_danger.MID,
      type: fund_type.ETF,
      company: '우리자산운용',
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
      name: '우리아이 튼튼 채권 펀드',
      danger: fund_danger.LOW,
      type: fund_type.BOND,
      company: '우리자산운용',
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
      name: '글로벌 혁신 기업 주식 펀드',
      danger: fund_danger.HIGH,
      type: fund_type.STOCK,
      company: '우리자산운용',
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
      name: '김첫째',
      profile_pic: '/file/자녀1.jpg', //자녀 프로필 이미지 경로 명시
      born_date: new Date('2015-01-01'),
      is_promise_fixed: true,
      goal_money: 20000000n,
      monthly_money: 100000n,
      identity_hash: 'hash_child_1_unique',
    },
  });

  const child2 = await prisma.child.create({
    data: {
      parent_id: parent.id,
      name: '김둘째',
      profile_pic: '/file/자녀2.jpg',
      born_date: new Date('2018-05-05'),
      is_promise_fixed: false, // 0이므로
      goal_money: null, // 반드시 null
      monthly_money: null, // 반드시 null
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

  console.log('✅ 모든 시드 데이터가 성공적으로 생성되었습니다!');
}

main()
  .catch((e) => {
    console.error('❌ 시딩 중 에러 발생:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
