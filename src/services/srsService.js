// Các khoảng thời gian ôn tập (tính bằng phút) cho mỗi cấp độ theo đề xuất mới
const REVIEW_INTERVALS_MINUTES = {
  1: 5,       // 5 phút
  2: 20,      // 20 phút
  3: 45,      // 45 phút
  4: 720,     // 12 giờ (12 * 60)
  5: 4320,    // 3 ngày (3 * 24 * 60)
};
const MAX_LEVEL = 5; // Cấp độ cao nhất, coi như đã thuộc
const NEW_WORDS_PER_SESSION = 10; // Số từ mới mỗi phiên học

/**
 * Lấy tiến độ học tập của một bài học từ localStorage.
 * @param {string} unitId - ID của bài học.
 * @returns {object} - Đối tượng chứa tiến độ của các từ.
 */
export const getProgress = (unitId) => {
  try {
    const progress = localStorage.getItem(`progress_${unitId}`);
    return progress ? JSON.parse(progress) : {};
  } catch (error) {
    console.error("Failed to parse progress from localStorage", error);
    return {};
  }
};

/**
 * Lưu tiến độ học tập vào localStorage.
 * @param {string} unitId - ID của bài học.
 * @param {object} progress - Đối tượng tiến độ cần lưu.
 */
export const saveProgress = (unitId, progress) => {
  try {
    localStorage.setItem(`progress_${unitId}`, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save progress to localStorage", error);
  }
};

/**
 * Tính toán cấp độ và ngày ôn tập tiếp theo dựa trên đánh giá của người dùng.
 * @param {object} wordProgress - Tiến độ hiện tại của từ { level, nextReview }.
 * @param {'again' | 'hard' | 'good' | 'easy'} rating - Đánh giá của người dùng.
 * @returns {object} - Tiến độ mới của từ.
 */
export const calculateNextReview = (wordProgress, rating) => {
  let currentLevel = wordProgress ? wordProgress.level : 0;
  let newLevel;

  switch (rating) {
    case 'again':
      newLevel = 1; // Reset về cấp độ 1
      break;
    case 'hard':
      // Giữ nguyên cấp độ nếu đang ôn, hoặc lên cấp 1 nếu là từ mới
      newLevel = Math.max(1, currentLevel); 
      break;
    case 'good':
      newLevel = Math.min(MAX_LEVEL, currentLevel + 1);
      break;
    case 'easy':
      // Tăng 2 cấp nếu dễ, nhưng không vượt quá cấp tối đa
      newLevel = Math.min(MAX_LEVEL, currentLevel + 2);
      break;
    default:
      newLevel = 1;
  }
  
  // Nếu từ đã đạt cấp độ cao nhất, không cần đặt lịch ôn nữa
  if (newLevel === MAX_LEVEL && rating !== 'hard' && rating !== 'again') {
    return {
        level: MAX_LEVEL,
        nextReview: null // Đánh dấu là đã thuộc, không cần review
    }
  }

  const nextReviewDate = new Date();
  const intervalMinutes = REVIEW_INTERVALS_MINUTES[newLevel] || 5;
  nextReviewDate.setMinutes(nextReviewDate.getMinutes() + intervalMinutes);

  return {
    level: newLevel,
    nextReview: nextReviewDate.toISOString(),
  };
};


/**
 * Tạo bộ thẻ cho phiên học, bao gồm từ cần ôn và từ mới.
 * @param {Array<object>} allWords - Danh sách tất cả từ vựng của bài học.
 * @param {object} progress - Tiến độ hiện tại.
 * @returns {Array<object>} - Danh sách các từ cho phiên học.
 */
export const createReviewDeck = (allWords, progress) => {
  const now = new Date();
  const reviewWords = [];
  const newWords = [];

  for (const word of allWords) {
    const wordProgress = progress[word.word];
    if (wordProgress) {
       // Chỉ thêm vào bộ ôn tập nếu có lịch và chưa đạt max level
      if (wordProgress.nextReview && new Date(wordProgress.nextReview) <= now) {
        reviewWords.push(word);
      }
    } else if (newWords.length < NEW_WORDS_PER_SESSION) {
      newWords.push(word);
    }
  }

  // Ưu tiên các từ cần ôn tập
  return [...reviewWords, ...newWords];
};

