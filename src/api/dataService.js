/**
 * Lấy thông tin cơ bản của tất cả các bài học từ vựng từ tệp manifest.
 * Bằng cách này, ứng dụng sẽ tự động nhận diện tất cả các bài học
 * được khai báo trong manifest.json mà không cần hardcode.
 */
export const getVocabularyUnits = async () => {
  try {
    const response = await fetch('/data/manifest.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const unitsInfo = await response.json();
    return unitsInfo;
  } catch (error) {
    console.error("Could not fetch vocabulary units manifest:", error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
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

/**
 * Lấy dữ liệu trắc nghiệm của một bài học từ vựng.
 * Đường dẫn đã được cập nhật để trỏ đến thư mục /data/quizz/
 * @param {string} unitId - ID của bài học (ví dụ: 'day01')
 */
export const getQuizData = async (unitId) => {
    try {
        // THAY ĐỔI: Đường dẫn đã được cập nhật tới thư mục "quizz" mới
        const response = await fetch(`/data/quizz/${unitId}_quiz.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Could not fetch quiz data for ${unitId}:`, error);
        return null;
    }
};
