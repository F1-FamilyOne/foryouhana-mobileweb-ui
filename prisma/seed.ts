import { True } from './../lib/generated/prisma/internal/prismaNamespace';
import {
  account_acc_type,
  account_status,
  fund_danger,
  fund_saving_type,
  fund_type,
  invest_type,
} from '../lib/generated/prisma/client';
import { prisma } from '../lib/prisma';

// [Helper] 날짜 계산 함수
function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}

async function main() {
  await prisma.read_auth.deleteMany();
  await prisma.history.deleteMany();
  await prisma.timeline.deleteMany();
  await prisma.auto_transfer.deleteMany();
  await prisma.account.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.fund.deleteMany();
  await prisma.user.deleteMany();
  await prisma.mydata.deleteMany();

  // 1. 기초 데이터
  const myData = await prisma.mydata.create({ data: {} });
  const parentUser = await prisma.user.create({
    data: {
        mydata_id: myData.id,
        name: '김부모',
        born_date: new Date('1990-01-01'),
        identity_hash: 'parent_hash',
      },
  });

  // -------------------------------------------------------
  // 2. 상품(Fund) 생성
  // -------------------------------------------------------

  // (1) [연저펀 전용] ETF
  const pensionEtf = await prisma.fund.create({
    data: {
      name: '하나없이하나마나ETF',
      danger: fund_danger.MID,
      type: fund_type.ETF,
      is_pension: true,
      saving_type: fund_saving_type.BOTH,
      company: '하나은행',
      total_fee: 0.015,
      sell_fee: 0.005,
      set_date: new Date('2024-01-01'),
      maturity_period: null,
      image: 'https://placehold.co/400x400?text=ETF',
      total_money: 1000000000n,
      plus_1: 5.5,
      plus_5: 20.2,
      plus_10: 45.0,
    },
  });

  // (2) [연저펀 전용] 채권형
  const pensionBond = await prisma.fund.create({
    data: {
      name: '하나암자 채권형 펀드',
      danger: fund_danger.LOW,
      type: fund_type.BOND,
      is_pension: true,
      saving_type: fund_saving_type.REGULAR,
      company: '하나은행',
      total_fee: 0.008,
      sell_fee: 0.001,
      set_date: new Date('2023-05-20'),
      maturity_period: 24, // 24개월
      image: 'https://placehold.co/400x400?text=HANA',
      total_money: 500000000n,
      plus_1: 3.2,
      plus_5: 12.5,
      plus_10: 28.0,
    },
  });

  // (3) [연저펀 전용] 주식형
  const pensionStock = await prisma.fund.create({
    data: {
      name: '하나글로벌울트라 TOP50 ETF',
      danger: fund_danger.HIGH,
      type: fund_type.STOCK,
      is_pension: true,
      saving_type: fund_saving_type.BOTH,
      company: '하나은행',
      total_fee: 0.025,
      sell_fee: 0.01,
      set_date: new Date('2024-02-15'),
      maturity_period: null,
      image: 'https://placehold.co/400x400?text=STOCK',
      total_money: 2000000000n,
      plus_1: 15.8,
      plus_5: 65.4,
      plus_10: 120.0,
    },
  });

  // (4) [연저펀 전용] AI 반도체
  await prisma.fund.create({
    data: {
      name: '하나 AI 반도체 ETF',
      danger: fund_danger.HIGH,
      type: fund_type.STOCK,
      is_pension: true,
      saving_type: fund_saving_type.BOTH,
      company: '하나은행',
      total_fee: 0.012,
      sell_fee: 0.005,
      set_date: new Date('2024-03-10'),
      maturity_period: null,
      image: 'https://placehold.co/400x400?text=AI+Semi',
      total_money: 3000000000n,
      plus_1: 25.4,
      plus_5: 0.0,
      plus_10: 0.0,
    },
  });

  // (5) [연저펀 전용] 국공채
  const pensionGovBond = await prisma.fund.create({
    data: {
      name: '하나 가족위한 국채 펀드',
      danger: fund_danger.LOW,
      type: fund_type.BOND,
      is_pension: true,
      saving_type: fund_saving_type.REGULAR,
      company: '하나은행',
      total_fee: 0.005,
      sell_fee: 0.000,
      set_date: new Date('2020-01-15'),
      maturity_period: 60, // 60개월
      image: 'https://placehold.co/400x400?text=BOND',
      total_money: 8000000000n,
      plus_1: 3.5,
      plus_5: 15.2,
      plus_10: 32.1,
    },
  });

  // -------------------------------------------------------
  // [추가] 신탁 상품 (TRUST) - 요청하신 부분!
  // -------------------------------------------------------
  const fundTrust = await prisma.fund.create({
    data: {
      name: '하나 30년같은 신탁',
      danger: fund_danger.LOW,
      type: fund_type.TRUST,
      is_pension: false,
      saving_type: fund_saving_type.REGULAR,
      company: '하나은행',
      total_fee: 0.3,
      sell_fee: 0.1,
      set_date: new Date('2019-01-01'),
      maturity_period: 36, // 36개월 만기
      image: 'https://placehold.co/400x400?text=TRUST',
      total_money: 100000000000n,
      plus_1: 4.5,
      plus_5: 18.0,
      plus_10: 35.0,
    },
  });

  // -------------------------------------------------------
  // [일반 투자 상품] 외부 인기 ETF 및 채권
  // ★ 중요: 여기서 변수(const)에 할당해야 아래 계좌 생성에서 씁니다.
  // -------------------------------------------------------

  // (7) TIGER 미국테크TOP10 (일반 ETF)
  const fundEtfTech = await prisma.fund.create({
    data: {
      name: 'TIGER 미국테크TOP10 INDXX',
      danger: fund_danger.HIGH,
      type: fund_type.STOCK,
      is_pension: false,
      saving_type: fund_saving_type.FREE,
      company: '미래에셋자산운용',
      total_fee: 0.0049,
      sell_fee: 0.0,
      set_date: new Date('2021-04-09'),
      maturity_period: null,
      image: 'https://placehold.co/400x400?text=TIGER',
      total_money: 50000000000n,
      plus_1: 38.2,
      plus_5: 120.5,
      plus_10: 0.0,
    },
  });

  // (8) ACE 미국배당다우존스 (일반 ETF - S&P500 대용으로 사용)
  const fundEtfSp500 = await prisma.fund.create({
    data: {
      name: 'ACE 미국배당다우존스',
      danger: fund_danger.MID,
      type: fund_type.STOCK,
      is_pension: false,
      saving_type: fund_saving_type.BOTH,
      company: '한국투자신탁운용',
      total_fee: 0.0006,
      sell_fee: 0.0,
      set_date: new Date('2022-11-15'),
      maturity_period: null,
      image: 'https://placehold.co/400x400?text=ACE',
      total_money: 1500000000n,
      plus_1: 12.1,
      plus_5: 0.0,
      plus_10: 0.0,
    },
  });

  // (9) KBSTAR 단기국공채액티브 (일반 채권)
  const fundBond = await prisma.fund.create({
    data: {
      name: 'KBSTAR 단기국공채액티브',
      danger: fund_danger.LOW,
      type: fund_type.BOND,
      is_pension: false,
      saving_type: fund_saving_type.FREE,
      company: 'KB자산운용',
      total_fee: 0.003,
      sell_fee: 0.0,
      set_date: new Date('2018-02-05'),
      maturity_period: 12, // 12개월
      image: 'https://placehold.co/400x400?text=KBSTAR',
      total_money: 2500000000n,
      plus_1: 3.8,
      plus_5: 14.2,
      plus_10: 25.4,
    },
  });

  // (10) 기타 상품들 (변수 할당 안해도 되는 것들)
  await prisma.fund.create({
    data: {
      name: 'KODEX 200',
      danger: fund_danger.MID,
      type: fund_type.STOCK,
      is_pension: false,
      saving_type: fund_saving_type.BOTH,
      company: '삼성자산운용',
      total_fee: 0.0015,
      sell_fee: 0.0,
      set_date: new Date('2002-10-14'),
      maturity_period: null,
      image: 'https://placehold.co/400x400?text=KODEX',
      total_money: 60000000000n,
      plus_1: 8.4,
      plus_5: 25.6,
      plus_10: 55.3,
    },
  });

  await prisma.fund.create({
    data: {
      name: 'ARIRANG 미국채30년액티브',
      danger: fund_danger.MID,
      type: fund_type.BOND,
      is_pension: false,
      saving_type: fund_saving_type.FREE,
      company: '한화자산운용',
      total_fee: 0.0025,
      sell_fee: 0.0,
      set_date: new Date('2023-05-25'),
      maturity_period: 360,
      image: 'https://placehold.co/400x400?text=ARIRANG',
      total_money: 1200000000n,
      plus_1: -2.5,
      plus_5: 0.0,
      plus_10: 0.0,
    },
  });


  // -------------------------------------------------------
  // 3. 자녀 생성
  // -------------------------------------------------------
  const child1 = await prisma.user.create({
    data: {
      name: '김첫째',
      profile_pic: '/file/자녀1.jpg',
      born_date: new Date('2018-05-05'),
      identity_hash: 'child1_hash',
      invest_type: invest_type.OFFENSIVE,
      is_promise_fixed: true,
      goal_money: 24000000n,
      monthly_money: 200000n,
      start_date: new Date('2024-01-01'),
      end_date: new Date('2034-01-01'),
    },
  });

  const child2 = await prisma.user.create({
    data: {
      name: '김둘째',
      profile_pic: '/file/자녀2.jpg',
      born_date: new Date('2000-01-01'),
      identity_hash: 'child2_hash',
      invest_type: invest_type.DEFENSIVE,
      goal_money: 30000000n,
      monthly_money: 200000n,
      start_date: new Date('2024-01-01'),
    },
  });

  await prisma.read_auth.createMany({
    data: [
      { reader_id: parentUser.id, provider_id: child1.id },
      { reader_id: parentUser.id, provider_id: child2.id },
    ],
  });

  // -------------------------------------------------------
  // 4. 입출금 통장 생성
  // -------------------------------------------------------
  const parentDeposit = await prisma.account.create({
    data: {
      user_id: parentUser.id,
      acc_num: '1002-PARENT-001',
      acc_type: account_acc_type.DEPOSIT,
      opened_at: new Date('2020-01-01'),
      deposit: 50000000n,
      status: account_status.ACTIVE,
    },
  });

  const child1Deposit = await prisma.account.create({
    data: {
      user_id: child1.id,
      acc_num: '1002-CHILD1-MAIN',
      acc_type: account_acc_type.GIFT_DEPOSIT,
      opened_at: new Date('2024-01-01'),
      deposit: 1000000n,
      status: account_status.ACTIVE,
    },
  });

  const child2Deposit = await prisma.account.create({
    data: {
      user_id: child2.id,
      acc_num: '1002-CHILD2-MAIN',
      acc_type: account_acc_type.GIFT_DEPOSIT,
      opened_at: new Date('2020-01-01'),
      deposit: 3000000n,
      status: account_status.ACTIVE,
    },
  });

  // -------------------------------------------------------
  // 5. [자녀 1] 연금저축 계좌 구성 (Root + 3 Subs)
  // -------------------------------------------------------
  
  // Root (예수금)
  const c1PensionRoot = await prisma.account.create({
    data: {
      user_id: child1.id,
      fund_id: null,
      parent_account_id: null,
      acc_num: '333-PENSION-ROOT',
      acc_type: account_acc_type.PENSION,
      opened_at: new Date('2024-02-01'),
      deposit: 50000n,
      status: account_status.ACTIVE,
    },
  });

  // Sub A (Tech ETF - 자유)
  const c1SubEtfTech = await prisma.account.create({
    data: {
      user_id: child1.id,
      fund_id: fundEtfTech.id, // 위에서 정의한 변수 사용
      parent_account_id: c1PensionRoot.id,
      acc_num: '333-PENSION-001',
      acc_type: account_acc_type.PENSION,
      opened_at: new Date('2024-02-05'),
      target_date: null,
      deposit: 500000n,
      plus_rate: 15.4,
      plus_money: 77000n,
      status: account_status.ACTIVE,
      in_type: true,
    },
  });

  // Sub B (S&P ETF - 정기)
  const c1SubEtfSp500 = await prisma.account.create({
    data: {
      user_id: child1.id,
      fund_id: fundEtfSp500.id, // 위에서 정의한 변수 사용
      parent_account_id: c1PensionRoot.id,
      acc_num: '333-PENSION-002',
      acc_type: account_acc_type.PENSION,
      opened_at: new Date('2024-02-05'),
      target_date: null,
      deposit: 300000n,
      plus_rate: 8.2,
      plus_money: 24600n,
      status: account_status.ACTIVE,
      in_type: false,
    },
  });

  // Sub C (Bond - 정기) - 여기는 연금용이니까 연금채권을 써도 되고 일반채권을 써도 되는데, 일단 KBSTAR 사용
  const c1SubBond = await prisma.account.create({
    data: {
      user_id: child1.id,
      fund_id: fundBond.id, // 위에서 정의한 변수 사용
      parent_account_id: c1PensionRoot.id,
      acc_num: '333-PENSION-003',
      acc_type: account_acc_type.PENSION,
      opened_at: new Date('2024-02-05'),
      target_date: fundBond.maturity_period ? addMonths(new Date('2024-02-05'), fundBond.maturity_period) : null,
      deposit: 200000n,
      plus_rate: 2.1,
      plus_money: 4200n,
      status: account_status.ACTIVE,
      in_type: false,
    },
  });

  // (1) 부모 -> 첫째 정기 증여
  await prisma.auto_transfer.create({
    data: { source_account_id: parentDeposit.id, target_account_id: child1Deposit.id, transfer_day: 10, transfer_count: 12, amount: 200000n },
  });
  
  // 자녀 1 자동이체
  await prisma.auto_transfer.create({
    data: { source_account_id: child1Deposit.id, target_account_id: c1SubEtfSp500.id, transfer_day: 10, transfer_count: 12, amount: 100000n },
  });
  await prisma.auto_transfer.create({
    data: { source_account_id: child1Deposit.id, target_account_id: c1SubBond.id, transfer_day: 10, transfer_count: 12, amount: 50000n },
  });

  // -------------------------------------------------------
  // 6. [자녀 2] 일반 펀드 계좌 구성
  // -------------------------------------------------------
  
  // Closed Bond (해지됨) - KBSTAR 채권 사용
  const c2AccBondClosed = await prisma.account.create({
    data: {
      user_id: child2.id,
      fund_id: fundBond.id,
      parent_account_id: null,
      acc_num: '555-FUND-CLOSED',
      acc_type: account_acc_type.FUND,
      opened_at: new Date('2022-01-01'),
      target_date: addMonths(new Date('2022-01-01'), fundBond.maturity_period!),
      closed_at: new Date('2025-01-05'),
      deposit: 0n,
      plus_rate: 12.5,
      plus_money: 120000n,
      status: account_status.MATURITY_TERMINATED,
      in_type: false,
    },
  });

  // Tech ETF (자유)
  const c2AccEtfTech = await prisma.account.create({
    data: {
      user_id: child2.id,
      fund_id: fundEtfTech.id,
      parent_account_id: null,
      acc_num: '555-FUND-FREE',
      acc_type: account_acc_type.FUND,
      opened_at: new Date('2024-03-01'),
      target_date: null,
      deposit: 500000n,
      plus_rate: 22.1,
      plus_money: 110500n,
      status: account_status.ACTIVE,
      in_type: true,
    },
  });

  // S&P ETF (정기)
  const c2AccEtfSp500 = await prisma.account.create({
    data: {
      user_id: child2.id,
      fund_id: fundEtfSp500.id,
      parent_account_id: null,
      acc_num: '555-FUND-AUTO',
      acc_type: account_acc_type.FUND,
      opened_at: new Date('2024-03-01'),
      target_date: null,
      deposit: 800000n,
      plus_rate: 9.5,
      plus_money: 76000n,
      status: account_status.ACTIVE,
      in_type: false,
    },
  });

  // 자녀 2 자동이체
  await prisma.auto_transfer.create({
    data: { source_account_id: child2Deposit.id, target_account_id: c2AccEtfSp500.id, transfer_day: 20, transfer_count: 24, amount: 150000n },
  });

  // -------------------------------------------------------
  // 7. 이력(History) 데이터 생성
  // -------------------------------------------------------

  // 1) 부모 -> 자녀 증여
  await prisma.history.createMany({
    data: [
      // 부모(1) -> 첫째(2) 정기 증여 이력
      { created_at: new Date('2024-01-10'), money: 200000n, source_account_id: parentDeposit.id, target_account_id: child1Deposit.id },
      { created_at: new Date('2024-02-10'), money: 200000n, source_account_id: parentDeposit.id, target_account_id: child1Deposit.id },
      { created_at: new Date('2024-03-10'), money: 200000n, source_account_id: parentDeposit.id, target_account_id: child1Deposit.id },
      { created_at: new Date('2024-04-10'), money: 200000n, source_account_id: parentDeposit.id, target_account_id: child1Deposit.id },
      { created_at: new Date('2026-01-10'), money: 200000n, source_account_id: parentDeposit.id, target_account_id: child1Deposit.id },
      { created_at: new Date('2026-01-20'), money: 80000n,  source_account_id: parentDeposit.id, target_account_id: child1Deposit.id },
    ]});

  await prisma.history.createMany({
    data: [
      { created_at: new Date('2024-10-31'), money: 9000000n, source_account_id: parentDeposit.id, target_account_id: child2Deposit.id },
      { created_at: new Date('2024-10-31'), money: 100000n,  source_account_id: parentDeposit.id, target_account_id: child2Deposit.id },
      { created_at: new Date('2024-10-31'), money: 80000n,   source_account_id: parentDeposit.id, target_account_id: child2Deposit.id },
      { created_at: new Date('2025-10-31'), money: 90000n,   source_account_id: parentDeposit.id, target_account_id: child2Deposit.id },
      { created_at: new Date('2025-11-08'), money: 10000n,   source_account_id: parentDeposit.id, target_account_id: child2Deposit.id },
      { created_at: new Date('2025-12-02'), money: 50000n,   source_account_id: parentDeposit.id, target_account_id: child2Deposit.id },
      { created_at: new Date('2026-01-02'), money: 70000n,   source_account_id: parentDeposit.id, target_account_id: child2Deposit.id },
  ]});

  // 2) [자녀 1] 입출금 -> 연금 Root (투자금 이동)
  await prisma.history.create({
    data: { money: 1000000n, source_account_id: child1Deposit.id, target_account_id: c1PensionRoot.id, created_at: new Date('2024-02-01T10:00:00') },
  });

  // 3) [자녀 1] 연금 Root -> ETF 상품 매수 (내부 이동)
  await prisma.history.create({
    data: { money: 500000n, source_account_id: c1PensionRoot.id, target_account_id: c1SubEtfTech.id, created_at: new Date('2024-02-05T10:30:00') },
  });

  // 4) [자녀 1] 입출금 -> ETF/채권 자동이체
  await prisma.history.create({
    data: { money: 100000n, source_account_id: child1Deposit.id, target_account_id: c1SubEtfSp500.id, created_at: new Date('2024-03-10T09:00:00') },
  });
  await prisma.history.create({
    data: { money: 50000n, source_account_id: child1Deposit.id, target_account_id: c1SubBond.id, created_at: new Date('2024-03-10T09:05:00') },
  });

  // 5) [자녀 2] 입출금 -> 채권 (가입했던 이력)
  await prisma.history.create({
    data: { money: 3000000n, source_account_id: child2Deposit.id, target_account_id: c2AccBondClosed.id, created_at: new Date('2022-01-01T14:00:00') },
  });
  
  // 6) [자녀 2] 채권 -> 입출금 (만기 해지 환급금)
  await prisma.history.create({
    data: { money: 3120000n, source_account_id: c2AccBondClosed.id, target_account_id: child2Deposit.id, created_at: new Date('2025-01-05T15:00:00') },
  });

  // 7) [자녀 2] 입출금 -> ETF 투자
  await prisma.history.create({
    data: { money: 500000n, source_account_id: child2Deposit.id, target_account_id: c2AccEtfTech.id, created_at: new Date('2024-03-01T11:00:00') },
  });
  await prisma.history.create({
    data: { money: 800000n, source_account_id: child2Deposit.id, target_account_id: c2AccEtfSp500.id, created_at: new Date('2024-03-01T11:05:00') },
  });


  // -------------------------------------------------------
  // 8. 타임라인(Timeline) 생성
  // -------------------------------------------------------
  
  await prisma.timeline.createMany({
    data: [
      // --- 자녀 1 타임라인 ---
      { 
        user_id: child1.id, 
        type: '입출금 통장 개설', 
        description: '자녀 증여용 통장 개설', 
        date: new Date('2024-01-01T09:00:00') 
      },
      { 
        user_id: child1.id, 
        type: '증여 입금', 
        description: '2,000,000원 증여 완료', 
        date: new Date('2024-01-01T09:05:00') 
      },
      { 
        user_id: child1.id, 
        type: '연금저축 개설', 
        description: '연금저축 통합계좌 개설', 
        date: new Date('2024-02-01T10:00:00') 
      },
      { 
        user_id: child1.id, 
        type: '펀드 투자', 
        description: '미국테크 ETF 500,000원 매수', 
        date: new Date('2024-02-05T10:30:00') 
      },
      { 
        user_id: child1.id, 
        type: '자동이체 등록', 
        description: 'S&P500 ETF, 국공채 펀드 정기납입 설정', 
        date: new Date('2024-02-05T11:00:00') 
      },
      { 
        user_id: child1.id, 
        type: '펀드 투자', 
        description: '정기 투자(자동이체) 150,000원 실행', 
        date: new Date('2024-03-10T09:00:00') 
      },

      // --- 자녀 2 타임라인 ---
      { 
        user_id: child2.id, 
        type: '입출금 통장 개설', 
        description: '자녀 증여용 통장 개설', 
        date: new Date('2020-01-01T09:00:00') 
      },
      { 
        user_id: child2.id, 
        type: '증여 입금', 
        description: '5,000,000원 증여 완료', 
        date: new Date('2020-01-01T09:05:00') 
      },
      { 
        user_id: child2.id, 
        type: '펀드 가입', 
        description: '하나 든든 국공채 펀드 가입 (3년)', 
        date: new Date('2022-01-01T14:00:00') 
      },
      { 
        user_id: child2.id, 
        type: '펀드 만기 해지', 
        description: '국공채 펀드 만기 해지 (수익률 12.5% 달성)', 
        date: new Date('2025-01-05T15:00:00') 
      },
      { 
        user_id: child2.id, 
        type: '펀드 가입', 
        description: '미국테크 ETF, S&P500 ETF 가입', 
        date: new Date('2024-03-01T11:00:00') 
      },
      { 
        user_id: child2.id, 
        type: '자동이체 등록', 
        description: 'S&P500 ETF 자동이체 설정 완료', 
        date: new Date('2024-03-02T10:00:00') 
      },
    ],
  });

  // -------------------------------------------------------
  // 8. 알림(Alert) 데이터 생성
  // -------------------------------------------------------
  await prisma.alert.create({
    data: {
      user_id: child1.id,
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
      user_id: child1.id,
      type: '2',
      title: '증여세 한도에 거의 도달했어요!',
      description: '현재 누적 증여금이 비과세 구간 90%에 도달했어요. 100% 이후, 증여세가 발생해요.',
      button_text: '확인',
      priority: 4,
      screen: 'home',
      status: false,
    },
  });

  await prisma.alert.create({
    data: {
      user_id: child1.id,
      type: '3',
      title: '펀드 만기에 도달했어요',
      description: '축하합니다! 펀드 만기의 순간을 메모로 남겨요!',
      button_text: '메모하기',
      priority: 6,
      screen: 'timeline',
      status: false,
    },
  });

  await prisma.alert.create({
    data: {
      user_id: child1.id,
      type: '4',
      title: '증여세 신고 기간이에요',
      description: '이때까지의 증여에 대해서 증여 신고를 해봐요! 필요한 서류와 방법은 아이앞으로가 도와드려요!',
      button_text: '확인',
      priority: 5,
      screen: 'home',
      status: false,
    },
  });

  console.log('✅ 시드 데이터 생성 완료!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });