'use client';

import { AgreeTerms } from '@/components/cmm/AgreeTerms';
import CardIcon from '@/components/cmm/CardIcon';
import CardTimeline from '@/components/cmm/CardTimeline';
import { CustomButton } from '@/components/cmm/CustomButton';
import { useState } from 'react';

export default function ComponentPreviewPage() {
  // State for AgreeTerms
  const [agreeItems, setAgreeItems] = useState([
    { content: '개인정보 처리방침 (필수)', checked: false },
    { content: '서비스 이용약관 (필수)', checked: false },
    { content: '마케팅 정보 수신 동의 (선택)', checked: false },
  ]);

  const handleAgreeChange = (index: number, nextChecked: boolean) => {
    setAgreeItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, checked: nextChecked } : item))
    );
  };

  const agreeTermsItems = agreeItems.map((item, index) => ({
    ...item,
    onCheckedChange: (checked: boolean) => handleAgreeChange(index, checked),
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Component Preview</h1>

      <div className="space-y-12">
        {/* AgreeTerms Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">AgreeTerms</h2>
          <div className="max-w-md">
            <AgreeTerms
               label="약관에 모두 동의합니다"
               items={agreeTermsItems}
            />
          </div>
        </section>

        {/* CardIcon Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">CardIcon</h2>
          <div className="flex flex-wrap gap-4">
            <CardIcon
              title="가입안내"
              content={'가족관계증명서로\n부모-아이를 확인해요.'}
              imageSrc="/register/icon/register-heart.png"
            />
          </div>
        </section>

        {/* CardTimeline Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">CardTimeline</h2>
          <div className="flex flex-wrap gap-4">
             {/* General Investment */}
            <CardTimeline
              date={new Date()}
              movedMoney={100000}
              fundName="하나 AI 펀드"
              title="투자 완료"
            />
             {/* Message Type */}
            <CardTimeline
              date={new Date()}
              movedMoney={50000}
              message="용돈 고마워요!"
              isMessage={true}
            />
          </div>
        </section>

        {/* CustomButton Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">CustomButton</h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm text-gray-500">Presets</h3>
              <div className="flex flex-wrap gap-2">
                <CustomButton preset="greenlong">greenlong</CustomButton>
                <CustomButton preset="graylong">graylong</CustomButton>
                <CustomButton preset="lightgraylong">lightgraylong</CustomButton>
                <CustomButton preset="redlong">redlong</CustomButton>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <CustomButton preset="lightgrayshort">lightgrayshort</CustomButton>
                <CustomButton preset="maingreenshort">maingreenshort</CustomButton>
                <CustomButton preset="badgegreenshort">badgegreenshort</CustomButton>
                <CustomButton preset="lightgreenshort">lightgreenshort</CustomButton>
                <CustomButton preset="grayround">grayround</CustomButton>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
