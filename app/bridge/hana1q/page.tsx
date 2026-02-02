'use client';

import { useRouter } from 'next/navigation';

type MenuItem = {
  label: string;
  iconText?: string;
  tone: 'mint' | 'gray' | 'pink' | 'green' | 'teal' | 'beige' | 'sky' | 'blue';
  clickable?: boolean;
};

function toneClass(tone: MenuItem['tone']) {
  if (tone === 'mint') return 'bg-hana-mint-50 border-hana-mint-100';
  if (tone === 'gray') return 'bg-hana-gray-50 border-hana-gray-100';
  if (tone === 'pink') return 'bg-rose-50 border-rose-100';
  if (tone === 'green') return 'bg-emerald-50 border-emerald-100';
  if (tone === 'teal') return 'bg-teal-50 border-teal-100';
  if (tone === 'beige') return 'bg-amber-50 border-amber-100';
  if (tone === 'sky') return 'bg-cyan-50 border-cyan-100';
  return 'bg-blue-50 border-blue-100';
}

export default function EntryPage() {
  const router = useRouter();

  const items: MenuItem[] = [
    { label: '전체계좌', tone: 'mint', iconText: 'W' },
    { label: '메뉴 / 상품 검색', tone: 'gray', iconText: '🔍' },
    { label: '놀이터', tone: 'pink', iconText: '🐴' },
    { label: '아이앞으로', tone: 'green', iconText: '🌱', clickable: true },
    { label: '하나더넥스트', tone: 'teal', iconText: 'N' },
    { label: '국민연금 계좌관리', tone: 'beige', iconText: 'W' },
    { label: '하나더퍼스트 라운지', tone: 'sky', iconText: '🛋️' },
    { label: '모바일번호표', tone: 'blue', iconText: '01' },
  ];

  const handleEnter = () => {
    router.push('/onboarding/intro');
  };

  return (
    <main className="min-h-dvh bg-gradient-to-b from-hana-mint-50 via-white to-white">
      {/* 상단 탭 영역 */}
      <header className="sticky top-0 z-10 border-black/5 border-b backdrop-blur">
        <div className="mx-auto w-full max-w-md px-5 pt-5 pb-3">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-bold text-2xl text-black">로그인</h1>
              <span className="rounded-full bg-hana-mint-500 px-3 py-1 font-semibold text-sm text-white">
                전체계좌
              </span>
            </div>

            <nav className="flex items-center gap-3 font-semibold text-black/70 text-sm">
              <span className="rounded-full bg-hana-mint-500/15 px-3 py-1 text-hana-main">
                간편 홈
              </span>
              <span>지갑</span>
              <span>알림</span>
            </nav>
          </div>
        </div>
      </header>

      {/* 메뉴 리스트 */}
      <section className="mx-auto w-full max-w-md px-5 pt-6 pb-8">
        <div className="space-y-4">
          {items.map((it) => {
            const base =
              'flex w-full items-center gap-4 rounded-2xl border px-5 py-6 text-left shadow-sm';
            const tone = toneClass(it.tone);

            if (!it.clickable) {
              return (
                <div key={it.label} className={`${base} ${tone}`}>
                  <div
                    className="grid h-9 w-9 place-items-center rounded-xl font-bold text-black/70 text-sm"
                    aria-hidden="true"
                  >
                    {it.iconText ?? ''}
                  </div>
                  <div className="font-semibold text-black/80 text-lg">
                    {it.label}
                  </div>
                </div>
              );
            }

            return (
              <button
                key={it.label}
                type="button"
                onClick={handleEnter}
                className={`${base} ${tone}transition-all duration-150 hover:border-emerald-400 hover:bg-emerald-200/70 hover:shadow-lg active:scale-[0.99]`}
                aria-label="아이앞으로 이동"
              >
                <div
                  className="grid h-9 w-9 place-items-center rounded-xl font-bold text-black/70 text-sm"
                  aria-hidden="true"
                >
                  {it.iconText ?? ''}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-black/80 text-lg">
                    {it.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
