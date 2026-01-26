import { prisma } from './lib/prisma';
import {
  account_acc_type,
  fund_danger,
  fund_type,
} from './lib/generated/prisma/client';

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
      total_money: 1000000000n,
      plus_1: 5.5,
      plus_5: 20.2,
      plus_10: 45.0,
    },
  });

  // 3. 자녀 2명 생성 (제약 조건 준수)
  // 자녀 1: 유기정기금 YES (goal_money, monthly_money 필수)
  const child1 = await prisma.child.create({
    data: {
      parent_id: parent.id,
      name: '김첫째',
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

  // 자녀 1의 입출금 계좌
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

  // 자녀 2의 펀드 계좌 1: 정기적립식 (in_type: 0)
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

  // 자녀 2의 펀드 계좌 2: 자유적립식 (in_type: 1 -> in_month 필수!)
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
