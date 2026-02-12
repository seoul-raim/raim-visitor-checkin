/**
 * 고유한 ID를 생성합니다.
 * @returns {string} 고유 ID (timestamp_counter_randomstring 형식)
 */
let idCounter = 0;
export const generateUniqueId = () => {
  idCounter = (idCounter + 1) % 10000; // 10000까지 순환
  return `${Date.now()}_${idCounter}_${Math.random().toString(36).substring(2, 11)}`;
};
