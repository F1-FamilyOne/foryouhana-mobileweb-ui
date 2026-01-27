import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/cmm/Header';
import { Button } from '@/components/ui/button';
import { IMAGES_PATH } from '@/constants/images';

export default function investTest() {
  const route = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  return (
    <>
      <Header content="자녀 펀드 만들기" />
      <div className="flex h-[85%] items-center justify-center font-hana-cm">
        <div className="flex h-[500px] w-[345px] flex-col items-center gap-5 rounded-[16px] border border-hana-gray-200 p-5">
          <div className="flex h-[350px] items-center justify-center">
            <Image
              src={IMAGES_PATH.BEFORE_TEST}
              width={270}
              height={200}
              alt="beforeTest"
            />
          </div>
          <div className="flex w-full justify-start gap-3">
            <Image
              src={IMAGES_PATH.BEFORE_TEST_ICON}
              width={48}
              height={48}
              alt="icon"
            />
            <div>
              <p className="text-[16px]">자녀 투자성향 분석</p>
              <p className="text-[14px] text-hana-gray-600">
                올바른 투자성향을 분석합니다.
              </p>
            </div>
          </div>
          <Button
            onClick={() =>
              route.push(`/main/${childId}/beforeJoin/test-analysis`)
            }
            className="h-[45px] w-full rounded-[14px] bg-hana-light-mint text-[18px] hover:cursor-pointer hover:bg-hana-light-mint/70"
          >
            자녀 투자성향 분석하기
          </Button>
        </div>
      </div>
    </>
  );
}
