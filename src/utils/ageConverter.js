export const convertToGroup = (age) => {
  // 저장된 나이 보정값 가져오기
  const savedCorrection = localStorage.getItem('ageCorrection');
  const correction = savedCorrection ? parseInt(savedCorrection, 10) : 4;
  
  const kAge = age + correction;
  if (kAge <= 6) return "영유아(0~6세)";
  if (kAge <= 12) return "어린이(7~12세)";
  if (kAge <= 19) return "청소년(13~19세)";
  if (kAge <= 39) return "청년(20세~39세)";
  if (kAge <= 49) return "중년(40~49세)";
  return "장년(50세~)";
};
