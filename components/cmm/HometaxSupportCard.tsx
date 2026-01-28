'use client';

import { ExternalLink, FileDownIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

/**
 * @page: HometaxReportCard
 * @description: 유기정기금 홈택스 신고 내역 표시 및 신고 관리 카드 컴포넌트 (파일 탐색기 및 신고 완료 기능 포함)
 * @example <HometaxReportCard onReportComplete={() => console.log('완료')} />
 * @author: minyoung
 * @date: 2026-01-23
 */

interface HometaxReportCardProps {
  onReportComplete: () => void;
}

export const HometaxReportCard = ({
  onReportComplete,
}: HometaxReportCardProps) => {
  return (
    <Card className="h-[230px] w-[345px] rounded-2xl border-0 bg-hana-gray-50">
      <CardContent className="space-y-1 rounded-2xl bg-hana-gray-50 p-3 pt-0">
        <div className="space-y-0">
          <p className="font-hana-medium text-[15px]">
            1. 아래의 신고 서류를 다운받으세요.
          </p>

          <label
            htmlFor="file-upload"
            className="inline-flex cursor-pointer items-center gap-1 pl-3 font-hana-medium text-[13px] text-hana-gray-600 hover:opacity-80"
          >
            <span>유기정기금 신고 자료 다운</span>
            <FileDownIcon className="h-3 w-3" />
          </label>

          <input id="file-upload" type="file" className="hidden" />
        </div>

        <div className="space-y-0">
          <p className="font-hana-medium text-[15px]">
            2. 홈택스에서 유기정기금 신고를 진행하세요.
          </p>

          <a
            href="https://www.hometax.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 pl-3 font-hana-medium text-[13px] text-hana-gray-600 underline underline-offset-4"
          >
            <span>홈택스 바로가기</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="space-y-2 pt-0">
          <p className="font-hana-medium text-[15px]">
            3. 신고 후 아래의 버튼을 눌러 본 서비스에 변경 <br />
            <span className="mx-2">내용을 적용해주세요.</span>
          </p>

          <div className="flex justify-center">
            <Button
              onClick={onReportComplete}
              className="mt-1 h-8 w-52.5 bg-hana-blue text-[13px] hover:bg-hana-blue"
            >
              신고 완료
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
