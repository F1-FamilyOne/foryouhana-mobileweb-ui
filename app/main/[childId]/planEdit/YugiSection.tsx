'use client';
import { CustomButton } from '@/components/cmm/CustomButton';
import { HometaxReportCard } from '@/components/cmm/HometaxSupportCard';
import TitlePlanSelect from '@/components/cmm/TitlePlanSelect';
import {
  BLOCK_STATUS,
  type BlockStatus,
  YUGI_STATUS,
  type YugiStatus,
} from '@/constants/gift';

export default function YugiSection({
  isFixed,
  yugi,
  prev,
  onChange,
  onBlockedChange,
  setYugi,
}: {
  isFixed: boolean;
  yugi: YugiStatus;
  onChange: (v: boolean) => void;
  prev: boolean;
  onBlockedChange: (v: BlockStatus) => void;
  setYugi: (y: YugiStatus) => void;
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
                  isStop={true}
                  onReportComplete={() => {
                    setYugi(YUGI_STATUS.CHANGE);
                    onBlockedChange(BLOCK_STATUS.AFTERHOMETAX);
                    onChange(true);
                  }}
                  onStopComplete={() => {
                    setYugi(YUGI_STATUS.STOP);
                    onBlockedChange(BLOCK_STATUS.AFTERHOMETAX);
                    onChange(false);
                  }}
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
            <div>
              {yugi === YUGI_STATUS.CHANGE ? (
                <div>
                  <CustomButton
                    disabled
                    preset="lightgreenlong"
                    onClick={() => {
                      onChange(!isFixed);
                      onBlockedChange(BLOCK_STATUS.REVERT);
                    }}
                  >
                    신고 완료
                  </CustomButton>
                </div>
              ) : (
                <div>
                  <CustomButton
                    preset="lightgreenlong"
                    onClick={() => {
                      onChange(!isFixed);
                      onBlockedChange(BLOCK_STATUS.REVERT);
                    }}
                  >
                    신고하지 않기
                  </CustomButton>
                </div>
              )}
            </div>
          )}
          {isFixed && (
            <div className="flex items-center justify-center pt-4">
              <HometaxReportCard
                onReportComplete={() => {
                  setYugi(YUGI_STATUS.CHANGE);
                  onBlockedChange(BLOCK_STATUS.AFTERHOMETAX);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
