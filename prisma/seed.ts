import {
  account_acc_type,
  fund_danger,
  fund_saving_type,
  fund_type,
  invest_type,
} from '../lib/generated/prisma/client';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🧹 기존 데이터 정리 중...');
  // 삭제 순서 최적화 (에러 방지)
  await prisma.history.deleteMany();
  await prisma.timeline.deleteMany();
  await prisma.account.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.chatlog.deleteMany();
  await prisma.child.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.fund.deleteMany();

  console.log('🚀 시딩 시작: 부모, 자녀, 계좌 및 이력 데이터...');

  // 1. MyData & 부모 생성
  const myData = await prisma.mydata.create({ data: {} });
  const parent = await prisma.parent.create({
    data: { mydata_id: myData.id },
  });
  // 2. 연저펀 전용 펀드 상품 생성
  const baseFund = await prisma.fund.create({
    data: {
      name: '하나없이하나마나ETF',
      danger: fund_danger.MID,
      type: fund_type.ETF,
      is_pension: true, // 연저펀 전용
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

  const bondFund = await prisma.fund.create({
    data: {
      name: '하나암자 채권형 펀드',
      danger: fund_danger.LOW,
      type: fund_type.BOND,
      is_pension: true, // 연저펀 전용
      saving_type: fund_saving_type.REGULAR,
      company: '하나은행',
      total_fee: 0.008, // 낮은 수수료
      sell_fee: 0.001,
      set_date: new Date('2023-05-20'),
      image: 'https://placehold.co/400x400?text=HANA',
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
      is_pension: true, // 연저펀 전용
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

  await prisma.fund.create({
    data: {
      name: '하나 100년 연금 AI 반도체',
      danger: fund_danger.HIGH,
      type: fund_type.STOCK,
      is_pension: true, 
      saving_type: fund_saving_type.BOTH,
      company: '하나은행',
      total_fee: '0.012', // 운용 보수
      sell_fee: '0.005',
      set_date: new Date('2024-03-10'),
      image: 'https://placehold.co/400x400?text=AI+Semi',
      total_money: 3000000000n,
      plus_1: '25.4',
      plus_5: '0.0', // 신생 펀드라 5년 데이터 없음
      plus_10: '0.0',
    },
  });

  // 2. 안정 추구형 (국공채)
  await prisma.fund.create({
    data: {
      name: '하나 든든한 국공채 펀드',
      danger: fund_danger.LOW,
      type: fund_type.BOND,
      is_pension: true, // ✅ 연저펀 전용
      saving_type: fund_saving_type.REGULAR,
      company: '하나은행',
      total_fee: '0.005',
      sell_fee: '0.000',
      set_date: new Date('2020-01-15'),
      image: 'https://placehold.co/400x400?text=BOND',
      total_money: 8000000000n,
      plus_1: '3.5',
      plus_5: '15.2',
      plus_10: '32.1',
    },
  });

  // -------------------------------------------------------
  // [추가 2] 일반 투자 상품 (외부 인기 ETF 및 채권) - 5개 추가
  // -------------------------------------------------------

  // 1. TIGER 미국테크TOP10 (미래에셋)
  await prisma.fund.create({
    data: {
      name: 'TIGER 미국테크TOP10 INDXX',
      danger: fund_danger.HIGH,
      type: fund_type.STOCK, // ETF지만 주식형으로 분류
      is_pension: false, // ❌ 일반 상품
      saving_type: fund_saving_type.FREE, // 자유 적립
      company: '미래에셋자산운용',
      total_fee: '0.0049',
      sell_fee: '0.0',
      set_date: new Date('2021-04-09'),
      image: 'https://placehold.co/400x400?text=TIGER',
      total_money: 50000000000n, // 규모 큼
      plus_1: '38.2',
      plus_5: '120.5',
      plus_10: '0.0',
    },
  });

  // 2. KODEX 200 (삼성)
  await prisma.fund.create({
    data: {
      name: 'KODEX 200',
      danger: fund_danger.MID,
      type: fund_type.STOCK,
      is_pension: false,
      saving_type: fund_saving_type.BOTH,
      company: '삼성자산운용',
      total_fee: '0.0015',
      sell_fee: '0.0',
      set_date: new Date('2002-10-14'),
      image: 'https://placehold.co/400x400?text=KODEX',
      total_money: 60000000000n,
      plus_1: '8.4',
      plus_5: '25.6',
      plus_10: '55.3',
    },
  });

  // 3. ACE 미국배당다우존스 (한국투자)
  await prisma.fund.create({
    data: {
      name: 'ACE 미국배당다우존스',
      danger: fund_danger.MID,
      type: fund_type.STOCK,
      is_pension: false,
      saving_type: fund_saving_type.BOTH,
      company: '한국투자신탁운용',
      total_fee: '0.0006', // 매우 낮은 수수료
      sell_fee: '0.0',
      set_date: new Date('2022-11-15'),
      image: 'https://placehold.co/400x400?text=ACE',
      total_money: 1500000000n,
      plus_1: '12.1',
      plus_5: '0.0',
      plus_10: '0.0',
    },
  });

  // 4. KBSTAR 단기국공채액티브 (KB - 채권)
  await prisma.fund.create({
    data: {
      name: 'KBSTAR 단기국공채액티브',
      danger: fund_danger.LOW,
      type: fund_type.BOND,
      is_pension: false,
      saving_type: fund_saving_type.FREE,
      company: 'KB자산운용',
      total_fee: '0.003',
      sell_fee: '0.0',
      set_date: new Date('2018-02-05'),
      image: 'https://placehold.co/400x400?text=KBSTAR',
      total_money: 2500000000n,
      plus_1: '3.8',
      plus_5: '14.2',
      plus_10: '25.4',
    },
  });

  // 5. ARIRANG 미국채30년액티브 (한화 - 채권)
  await prisma.fund.create({
    data: {
      name: 'ARIRANG 미국채30년액티브',
      danger: fund_danger.MID, // 장기채라 변동성 있음
      type: fund_type.BOND,
      is_pension: false,
      saving_type: fund_saving_type.FREE,
      company: '한화자산운용',
      total_fee: '0.0025',
      sell_fee: '0.0',
      set_date: new Date('2023-05-25'),
      image: 'https://placehold.co/400x400?text=ARIRANG',
      total_money: 1200000000n,
      plus_1: '-2.5', // 금리 영향으로 마이너스 가능성 반영
      plus_5: '0.0',
      plus_10: '0.0',
    },
  });

  const child1 = await prisma.child.upsert({
    where: { identity_hash: 'hash_child_1_unique' }, // 중복 체크 기준
    update: {
      name: '하나둘',
      profile_pic: '/file/자녀1.jpg',
      is_promise_fixed: true,
      goal_money: 20000000n,
      monthly_money: 100000n,
      invest_type: invest_type.OFFENSIVE,
    },
    create: {
      parent_id: parent.id,
      name: '하나둘',
      profile_pic: '/file/자녀1.jpg',
      born_date: new Date('2015-01-01'),
      is_promise_fixed: true,
      goal_money: 20000000n,
      monthly_money: 100000n,
      invest_type: invest_type.OFFENSIVE,
      identity_hash: 'hash_child_1_unique',
      start_date: new Date('2024-01-01'),
      end_date: new Date('2033-12-31'),
    },
  });

  // 자녀 2: 유기정기금 NO (성인 가정)
  const child2 = await prisma.child.upsert({
    where: { identity_hash: 'hash_child_2_unique' }, // 중복 체크 기준
    update: {
      name: '하나셋',
      profile_pic: '/file/자녀2.jpg',
      invest_type: invest_type.DEFENSIVE,
    },
    create: {
      parent_id: parent.id,
      name: '하나셋',
      profile_pic: '/file/자녀2.jpg',
      born_date: new Date('2005-05-05'),
      is_promise_fixed: false,
      goal_money: null,
      monthly_money: null,
      invest_type: invest_type.DEFENSIVE,
      identity_hash: 'hash_child_2_unique',
      start_date: new Date('2024-01-01'),
      end_date: new Date('2028-12-31'),
    },
  });

  // 4. 계좌 생성 (부모 1, 자녀 1, 자녀 펀드 2)
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
      plus_money: 6400n,
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
      in_type: true, // 0: 정기
      in_month: 12, // 제약 조건에 따라 필수 입력
      plus_rate: 4.5,
      plus_money: 6750n,
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
      plus_money: 6000n,
      in_type: false, // 자유
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
      plus_money: 50400n,
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
      priority: 4,
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
      priority: 6,
      screen: 'timeline',
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
      priority: 5,
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
        description: '500000원',
        date: new Date('2024-01-01'), 
      },

      // 2. 연금저축펀드(주식형) 가입
      {
        child_id: child1.id,
        type: '연금저축펀드 가입',
        description: globalStockFund.name, // '하나글로벌울트라 TOP50 ETF'
        date: new Date('2024-02-01T10:05:00'),
      },

      {
        child_id: child1.id,
        type: '증여 입금',
        description: '100,000원 증여 완료!',
        date: new Date('2024-05-05'),
      },

      {
        child_id: child1.id,
        type: '증여 입금',
        description: '50,000원 증여 완료!', // history.money와 동일
        date: new Date(), // 이건 가장 최근에 떠야 하니 현재 시간으로!
      },

      {
        child_id: child2.id,
        type: '입출금 통장 개설',
        description: '우리 아기 첫 통장',
        date: new Date('2010-05-05'), 
      },

      {
        child_id: child2.id,
        type: '성년의 날',
        description: '50000원 증여 완료!',
        date: new Date('2024-05-20'), 
      },

      {
        child_id: child2.id,// 애기 id
        type: '펀드 가입',
        description: '하나없이하나마나ETF 가입 완료, 매월 150,000원 납입',
        date: new Date('2025-01-01'), 
      },

      // 4. 펀드 배당금 입금
      {
        child_id: child2.id,
        type: '펀드 배당금 입금',
        description: '12,500원 입금 완료!',
        date: new Date('2026-01-15'), 
      },
    ],
  });

  console.log('✅ 모든 시드 데이터가 성공적으로 생성되었습니다!');
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
