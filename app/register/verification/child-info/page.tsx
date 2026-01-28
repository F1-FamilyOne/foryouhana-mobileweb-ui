'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AgreeTerms } from '@/components/cmm/AgreeTerms';
import { CustomButton } from '@/components/cmm/CustomButton';
import Header from '@/components/cmm/Header';
import ProgressBar from '@/components/cmm/ProgressBar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * @page: ChildInfoPage
 * @description: 자녀 이름과 주민등록번호 입력, 이용약관 동의가 진행되는 화면
 * @author: minyoung
 * @date: 2026-01-26
 */

export default function ChildInfoPage() {
  const router = useRouter();

  const [serviceAgree, setServiceAgree] = useState(false);
  const [thirdPartyAgree, setThirdPartyAgree] = useState(false);

  const [signupBase, setSignupBase] = useState(false);
  const [signupPolicy, setSignupPolicy] = useState(false);
  const [signupAccount, setSignupAccount] = useState(false);

  const [investBase, setInvestBase] = useState(false);
  const [investPolicy, setInvestPolicy] = useState(false);
  const [investAccount, setInvestAccount] = useState(false);

  const isAllChecked =
    signupBase &&
    signupPolicy &&
    signupAccount &&
    investBase &&
    investPolicy &&
    investPolicy &&
    serviceAgree &&
    thirdPartyAgree;

  const [name, setName] = useState('');
  const [bornDate, setBornDate] = useState('');
  const [rrnBack, setRrnBack] = useState('');

  const handleNext = () => {
    if (bornDate.length !== 6 || rrnBack.length !== 7) {
      alert('주민등록번호를 정확히 입력해주세요.');
      return;
    }

    const rawData = sessionStorage.getItem('giftPlan');

    if (rawData) {
      try {
        const giftPlan = JSON.parse(rawData);
        giftPlan.child_name = {
          name: name,
        };
        sessionStorage.setItem('giftPlan', JSON.stringify(giftPlan));
        console.log('자녀 이름 추가 저장 완료:', giftPlan);
      } catch (error) {
        console.error('JSON 파싱 에러:', error);
      }
    } else {
      console.error("'giftPlan' 데이터가 세션 스토리지에 없습니다.");
    }

    router.push('/register/verification/family-check');
  };

  useEffect(() => {
    const stored = sessionStorage.getItem('giftPlan');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);

      if (parsed.child_name) {
        setName(parsed.child_name);
      }
    } catch (error) {
      console.error('데이터 로드 중 에러:', error);
    }
  }, []);

  return (
    <div>
      <Header content="아이앞으로 가입" />
      <div className="mt-6">
        <ProgressBar
          step="current"
          step2="pending"
          content1="가족관계 확인하기"
          content2="계좌 개설"
        />
      </div>
      <h1 className="mx-3 mt-5 font-hana-medium text-[24px] leading-tight">
        자녀 정보를 입력해주세요.
      </h1>
      <h1 className="mx-3 mt-5 font-hana-regular text-[16px] leading-tight">
        자녀 이름
      </h1>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mx-3 w-85 rounded-none border-0 border-b px-0 focus-visible:ring-0"
      />

      <h1 className="mx-3 mt-8 font-hana-regular text-[16px] leading-tight">
        자녀 주민등록번호
      </h1>
      <div className="flex items-center gap-3">
        <Input
          value={bornDate}
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={(e) => {
            const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
            setBornDate(onlyNumber);
          }}
          placeholder="앞 6자리"
          className="mx-3 mt-3 w-32 rounded-none border-0 border-b px-0 text-center focus-visible:ring-0"
        />
        <span className="text-gray-400">-</span>
        <Input
          value={rrnBack}
          maxLength={7}
          placeholder="*******"
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={(e) => {
            const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
            setRrnBack(onlyNumber);
          }}
          className="mt-3 w-40 rounded-none border-0 border-b px-0 text-center focus-visible:ring-0"
        />
      </div>
      <div className="mt-6">
        <AgreeTerms
          label="자녀의 회원가입을 위한 약관 전체 동의 [필수]"
          items={[
            {
              content:
                '[필수] 개인(신용) 정보 수집 및 이용 동의서(비여신 금융거래)',
              checked: signupBase,
              onCheckedChange: setSignupBase,
            },
            {
              content: '[필수] 고객정보 취급방침',
              checked: signupPolicy,
              onCheckedChange: setSignupPolicy,
            },
            {
              content:
                '[필수] 개인(신용)정보 수집 및 이용 동의서(비대면 계좌개설용)',
              checked: signupAccount,
              onCheckedChange: setSignupAccount,
            },
          ]}
        />
      </div>
      <div className="mt-6">
        <AgreeTerms
          label="법정대리인 자격 확인을 위한 정보 조회 전체 동의 [필수]"
          items={[
            {
              content:
                '[필수] 본인의 인증서를 통해 대법원에 자동 접속 후 자격 확인에 필요한 서류를 전자적 방식으로 제출하는 스크래핑 서비스 이용을 신청합니다. ',
              checked: investBase,
              onCheckedChange: setInvestBase,
            },
            {
              content:
                '[필수] 스크래핑 서비스를 통해 위 자녀 기준의 가족관계증명서와 기본증명서를 발급하고 제출하며, 서류의 발급 이력은 해당 기관 홈페이지에서 조회 가능합니다.',
              checked: investPolicy,
              onCheckedChange: setInvestPolicy,
            },
            {
              content:
                '[필수] 개인(신용)정보 수집 및 이용 동의서(비대면 계좌개설용)',
              checked: investAccount,
              onCheckedChange: setInvestAccount,
            },
          ]}
        />
      </div>
      <Label className="mx-3 mt-6 flex cursor-pointer items-center gap-2">
        <Checkbox
          className="border-gray-300 data-[state=checked]:border-hana-main data-[state=checked]:bg-hana-main data-[state=checked]:text-white"
          checked={serviceAgree}
          onCheckedChange={(checked) => setServiceAgree(checked === true)}
        />
        <span className="font-hana-light text-[14px]">
          [필수] "아이앞으로" 서비스를 통한 자녀관리를 위한 동의
        </span>
      </Label>
      <p className="mx-3.5 mt-2 font-hana-light text-[12px] text-hana-gray-600">
        * 해당 내용이 동의되어야 개설된 자녀의 계좌를 조회할 수 있습니다.
      </p>
      <Label className="mx-3 mt-5 flex cursor-pointer items-center gap-2">
        <Checkbox
          className="border-gray-300 data-[state=checked]:border-hana-main data-[state=checked]:bg-hana-main data-[state=checked]:text-white"
          checked={thirdPartyAgree}
          onCheckedChange={(checked) => setThirdPartyAgree(checked === true)}
        />
        <span className="font-hana-light text-[14px]">
          [필수] 개인정보 및 금융거래 정보 제 3자 제공 동의서
          (아이앞으로_자녀등록용)
        </span>
      </Label>
      <div className="mx-3.5 mt-3">
        <CustomButton
          preset="greenlong"
          onClick={handleNext}
          disabled={!isAllChecked}
        >
          다음
        </CustomButton>
      </div>
    </div>
  );
}
