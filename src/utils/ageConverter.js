export const convertToGroup = (age, correction = 4) => {
  const kAge = age + correction;
  if (kAge <= 6) return "유아";     // 0~6세
  if (kAge <= 12) return "어린이";  // 7~12세
  if (kAge <= 19) return "청소년";  // 13~19세
  if (kAge <= 39) return "청년";    // 20~39세
  if (kAge <= 64) return "중년";    // 40~64세
  return "노년";                     // 65세 이상
};
