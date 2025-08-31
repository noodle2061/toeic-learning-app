// Giả sử bạn có 2 file json trong public/data/vocabulary/
const VOCAB_UNITS = ['day01', 'day02'];

/**
 * Lấy thông tin cơ bản của tất cả các bài học từ vựng.
 * Trong một ứng dụng thực tế, bạn có thể có một file index.json
 * để không cần phải hardcode danh sách các bài học.
 */
export const getVocabularyUnits = async () => {
  const unitsInfo = [];
  for (const unitId of VOCAB_UNITS) {
    try {
      const response = await fetch(`/data/vocabulary/${unitId}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      unitsInfo.push({
        unitId: data.unitId,
        title: data.title,
      });
    } catch (error) {
      console.error(`Could not fetch ${unitId}.json:`, error);
    }
  }
  return unitsInfo;
};

/**
 * Lấy toàn bộ dữ liệu của một bài học từ vựng cụ thể.
 * @param {string} unitId - ID của bài học (ví dụ: 'day01')
 */
export const getVocabUnitDetails = async (unitId) => {
  try {
    const response = await fetch(`/data/vocabulary/${unitId}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Could not fetch details for ${unitId}.json:`, error);
    return null; // Trả về null nếu có lỗi
  }
};

