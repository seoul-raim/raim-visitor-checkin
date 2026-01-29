export const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || "0000";

export const RAIM_COLORS = {
  TEAL: '#1FBDC6', 
  SKY: '#00BFDF', 
  MUTED: '#508EBC', 
  MEDIUM: '#276FB7',
  DARK: '#00448B', 
  BLACK: '#000000', 
  BG: '#F0F4F8', 
  DANGER: '#EF4444',
  GRAY_BG: '#F3F4F6', 
  GRAY_TXT: '#374151'
};

export const ageGroups = [
  { label: "영유아", sub: "0~7세", key: "infant" },
  { label: "어린이", sub: "8~13세", key: "child" },
  { label: "청소년", sub: "14~19세", key: "teen" },
  { label: "청년", sub: "20~34세", key: "youth" },
  { label: "중년", sub: "35~59세", key: "middleAge" },
  { label: "노년", sub: "60세 이상", key: "senior" }
];

// 나이 그룹 라벨 매핑 (최적화: 매번 문자열 비교 대신 맵 사용)
export const AGE_GROUP_LABELS = {
  '영유아': '영유아(0~7세)',
  '어린이': '어린이(8~13세)',
  '청소년': '청소년(14~19세)',
  '청년': '청년(20~34세)',
  '중년': '중년(35~59세)',
  '노년': '노년(60세 이상)',
  '장년': '노년(60세 이상)' // 레거시 지원
};

export const roomLocations = [
  "상설전시",
  "기획전시",
  "사일런트 도슨트",
  "전시연계",
  "다목적실-1",
  "다목적실-2",
  "다목적실-3"
];
