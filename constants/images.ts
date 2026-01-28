/**
 * @file IMAGES_PATH
 * @description
 * 서비스 전반에서 공통으로 사용하는 이미지 리소스 경로 상수 모음
 * 이미지 경로를 한 곳에서 관리하여 유지보수성과 일관성을 높이기 위한 목적
 *
 * - 컴포넌트 내 하드코딩된 이미지 경로 사용을 지양한다.
 * - 이미지 경로 변경 시 해당 파일만 수정하도록 한다.
 * - 여러 도메인(타임라인, 챗봇 등)에서 재사용되는 이미지를 포함한다.
 *
 * @author minyoung
 * @date 2026-01-25
 */

export const IMAGES_PATH = {
  STAR_BG: '/timeline/star_bg.png',
  STAR_ICON: '/timeline/icon/star.png',
  POPUP_ILLUSTRATION: '/timeline/timeline_popupImg.png',
  REGIST_STARBOT_ICON: '/chatbot/icon/regist_starbot.svg',
  REGIST_CALC_ICON: '/register/icon/calc.svg',
  REGIST_NOTE_ICON: '/register/icon/note.svg',
  REGIST_PROTECT_ICON: '/register/icon/protect.svg',
  STARBOT: '/chatbot/icon/starbot.svg',
  PROGRESS_CHECK: '/PrgressBar/icon/StepSuccess.svg',
  STARBOT3D: '/chatbot/icon/starbot3D.svg',
  REGIST_HEART: '/register/icon/register-heart.svg',
  REGIST_MONEY_ICON: '/register/icon/money.svg',
  REGIST_FUNDACCOUNT_ICON: '/register/icon/fundAccount.svg',
  REGIST_FUNDPRODUCT_ICON: '/register/icon/fundProduct.svg',
  REGIST_STARSPRING_IMG: '/register/img/starSpring.svg',
  LOADING_HANABOT_IMG: '/ai/hanabot.svg',
  FAMILYCHECK_SCOURT_ICON: '/register/icon/verification_family.svg',
  FAMILYCHECK_HANA_ICON: '/register/icon/hana_verify.svg',
  LADDER_CUTE: '/register/icon/ladder-cute.svg',
  REGISTER_STAR: '/register/icon/register-star.svg',
  CUTE_DANCE: '/home/icon/cuteDance.svg',
  CUTE_GOOD: '/home/icon/cuteGood.svg',
  CUTE_HEART: '/home/icon/cuteHeart.svg',
  CUTE_HI: '/home/icon/cuteHi.svg',
  CUTE_WATER: '/home/icon/cuteWater.svg',
  CUTE_WINK: '/home/icon/cuteWink.svg',
  BEFORE_TEST: '/beforeJoin/icon/beforeTest.svg',
  BEFORE_TEST_ICON: '/beforeJoin/icon/beforeTestIcon.svg',
  STARDOLL_3D: '/beforeJoin/icon/stardoll3D.svg',
  AFTER_TEST: '/beforeJoin/icon/afterTest.svg',
} as const;
