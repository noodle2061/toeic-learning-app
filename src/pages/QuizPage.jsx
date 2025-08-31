import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizData } from '../api/dataService';
import QuestionCard from '../components/features/quiz/QuestionCard';
import QuestionPalette from '../components/features/quiz/QuestionPalette';

const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'sans-serif',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '80vh',
    },
    header: {
        textAlign: 'center',
        marginBottom: '10px',
        borderBottom: '2px solid #eee',
        paddingBottom: '20px'
    },
    title: {
        fontSize: '2rem',
        margin: '0 0 10px 0'
    },
    quizBody: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    navigation: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px',
        padding: '0 20px'
    },
    navButton: {
        padding: '10px 20px',
        fontSize: '1rem',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#6c757d',
        color: 'white',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
    },
    actionButtons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginTop: 'auto', // Đẩy xuống dưới
        paddingTop: '20px',
        borderTop: '1px solid #eee'
    },
     paletteContainer: {
        marginTop: '20px',
        padding: '15px',
        borderTop: '2px solid #eee'
    }
};

const QuizPage = () => {
    const { unitId } = useParams();
    const navigate = useNavigate();

    const [originalQuestions, setOriginalQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unitTitle, setUnitTitle] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // Lưu trạng thái từng câu trả lời

    const shuffleArray = useCallback((array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }, []);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await getQuizData(unitId);
                if (data && data.questions) {
                    setOriginalQuestions(data.questions);
                    setQuestions(shuffleArray(data.questions)); // Trộn câu hỏi khi tải lần đầu
                    setUnitTitle(data.title);
                } else {
                     setQuestions([]);
                     setOriginalQuestions([]);
                }
            } catch (error) {
                console.error("Failed to fetch quiz data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [unitId, shuffleArray]);

    const handleAnswerSelect = (selectedIndex, selectedOption) => {
        // Không cho phép thay đổi đáp án đã chọn
        if (answers[selectedIndex]) return;

        const isCorrect = questions[selectedIndex].correctAnswer === selectedOption;
        
        setAnswers(prev => ({
            ...prev,
            [selectedIndex]: {
                selected: selectedOption,
                isCorrect: isCorrect
            }
        }));
    };

    const handleRetry = () => {
        setAnswers({});
        setCurrentQuestionIndex(0);
    };

    const handleShuffle = () => {
        setQuestions(shuffleArray(originalQuestions));
        setAnswers({});
        setCurrentQuestionIndex(0);
    };

    const navigateQuestion = (index) => {
        if (index >= 0 && index < questions.length) {
            setCurrentQuestionIndex(index);
        }
    };
    
    if (loading) {
        return <div style={styles.container}>Đang tải câu hỏi...</div>;
    }

    if (questions.length === 0) {
        return <div style={styles.container}>Không tìm thấy dữ liệu trắc nghiệm cho bài học này.</div>;
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Trắc nghiệm: {unitTitle}</h1>
                <p>Câu hỏi {currentQuestionIndex + 1} / {questions.length}</p>
            </header>
            
            <div style={styles.quizBody}>
                <QuestionCard
                    question={questions[currentQuestionIndex]}
                    questionState={answers[currentQuestionIndex]}
                    onAnswerSelect={(option) => handleAnswerSelect(currentQuestionIndex, option)}
                />

                <div style={styles.navigation}>
                    <button
                        style={styles.navButton}
                        onClick={() => navigateQuestion(currentQuestionIndex - 1)}
                        disabled={currentQuestionIndex === 0}
                    >
                        Câu trước
                    </button>
                    <div style={styles.actionButtons}>
                        <button style={{...styles.navButton, backgroundColor: '#007bff'}} onClick={() => navigate(`/vocabulary/${unitId}`)}>Quay lại</button>
                        <button style={{...styles.navButton, backgroundColor: '#28a745'}} onClick={handleShuffle}>Trộn câu hỏi</button>
                        <button style={{...styles.navButton, backgroundColor: '#ffc107', color: 'black'}} onClick={handleRetry}>Làm lại bài</button>
                    </div>
                    <button
                        style={styles.navButton}
                        onClick={() => navigateQuestion(currentQuestionIndex + 1)}
                        disabled={currentQuestionIndex === questions.length - 1}
                    >
                        Câu tiếp
                    </button>
                </div>
            </div>

            <div style={styles.paletteContainer}>
                 <QuestionPalette
                    questions={questions}
                    userAnswers={answers}
                    onQuestionSelect={navigateQuestion}
                    currentQuestionIndex={currentQuestionIndex}
                    isSubmitted={true}
                />
            </div>
        </div>
    );
};

export default QuizPage;

