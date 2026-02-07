// 현장 특성에 맞춘 나이 보정 (어린이, 청년, 중년 중심)
export const convertToGroup = (age, correction = 4) => {
  let adjustedAge = age + correction;
  
  // 어린이/청소년 구간은 보정 강화 (+1~2세)
  if (age < 20) {
    adjustedAge = age + correction + 1;
  }
  // 청년/중년 구간은 기본 보정
  else if (age >= 20 && age < 50) {
    adjustedAge = age + correction;
  }
  // 중년 후반/노년은 보정 약화 (-1세)
  else {
    adjustedAge = age + correction - 1;
  }
  
  if (adjustedAge <= 6) return "toddler";     // 0~6세
  if (adjustedAge <= 12) return "child";      // 7~12세
  if (adjustedAge <= 19) return "teen";       // 13~19세
  if (adjustedAge <= 39) return "youth";      // 20~39세
  if (adjustedAge <= 64) return "middleAge";  // 40~64세
  return "senior";                            // 65세 이상
};
