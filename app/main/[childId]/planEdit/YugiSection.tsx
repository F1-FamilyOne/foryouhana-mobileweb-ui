'use client';
import { CustomButton } from '@/components/cmm/CustomButton';
import { HometaxReportCard } from '@/components/cmm/HometaxSupportCard';
import TitlePlanSelect from '@/components/cmm/TitlePlanSelect';
import { BLOCK_STATUS } from './MainSection';

export default function YugiSection({
  isFixed,
  prev,
  onChange,
  onBlockedChange,
}: {
  isFixed: boolean;
  onChange: (v: boolean) => void;
  prev: boolean;
  onBlockedChange: (v: BLOCK_STATUS) => void;
}) {
  return (
    <div>
      <TitlePlanSelect title="유기정기금" />
      {prev ? (
        <div>
          {isFixed ? (
            <CustomButton
              preset="redlong"
              onClick={() => {
                onChange(!isFixed);
                onBlockedChange(BLOCK_STATUS.BLOCK);
              }}
            >
              중단 및 변경하기
            </CustomButton>
          ) : (
            <div>
              <CustomButton
                preset="greenlong"
                onClick={() => {
                  onChange(!isFixed);
                  onBlockedChange(BLOCK_STATUS.REVERT);
                }}
              >
                변경 취소하기
              </CustomButton>
              <div className="flex items-center justify-center pt-4">
                <HometaxReportCard
                  onReportComplete={() =>
                    onBlockedChange(BLOCK_STATUS.AFTERHOMETAX)
                  }
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {!isFixed ? (
            <CustomButton
              preset="lightgreenlong"
              onClick={() => {
                onChange(!isFixed);
                onBlockedChange(BLOCK_STATUS.BLOCK);
              }}
            >
              신고하기
            </CustomButton>
          ) : (
            <CustomButton
              preset="lightgreenlong"
              onClick={() => {
                onChange(!isFixed);
                onBlockedChange(BLOCK_STATUS.REVERT);
              }}
            >
              신고하지 않기
            </CustomButton>
          )}
          {isFixed && (
            <div className="flex items-center justify-center pt-4">
              <HometaxReportCard
                onReportComplete={() =>
                  onBlockedChange(BLOCK_STATUS.AFTERHOMETAX)
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
