import Image from 'next/image';

/**
 * @page: 가입안내 카드
 * @description: 타이틀, 내용, 이미지 소스 입력.
 * 내용에 줄바꿈 구간에 \n 넣어야 함.
 * ex) '가족관계증명서로\n 부모-아이를 확인해요.'
 *
 * 이미지 주소는 public 제외 /register/... 로 작성
 * ex) '/register/icon/register-heart.svg'
 *
 * @author: 승빈
 * @date: 2026-01-23
 */

type Props = {
  title: string;
  content: string;
  imageSrc: string;
};

export default function CardIcon({ title, content, imageSrc }: Props) {
  return (
    <div className="flex h-21.75 w-[320px] justify-between rounded-[19px] border border-[var(--color-hana-pastel-green)] bg-white p-3 px-4 shadow-md">
      <div className="w-50">
        <p className="font-hana-cm text-[16px]">{title}</p>
        <p className="h-9.25 whitespace-pre-line text-[var(--color-hana-light-gray)] text-[14px]">
          {content}
        </p>
      </div>
      <div>
        <Image src={imageSrc} alt="" width={70} height={70} />
      </div>
    </div>
  );
}
