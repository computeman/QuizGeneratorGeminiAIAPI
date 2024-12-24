import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { addQuizToHistory, getQuizHistory } from "../services/firebase";
import QuizForm from "../components/QuizForm";
import QuizHistory from "../components/QuizHistory";

const QuizPage = () => {
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [completedQuiz, setCompletedQuiz] = useState(null);
  const { user } = React.useContext(AuthContext);
  const GEMINI_API_URL = "http://localhost:8080/gemini"; // Replace with your actual Gemini API endpoint

  const fetchQuiz = useCallback(
    async (selectedTopic) => {
      if (!selectedTopic) {
        setError("Please select a valid topic or provide a custom one.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        if (!user) {
          setError("You must be logged in to start a quiz");
          setLoading(false);
          return;
        }
        const token = await user.getIdToken();
        const response = await fetch(GEMINI_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            topic: selectedTopic,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.quiz && data.quiz.length > 0) {
          setQuiz(data.quiz);
          setSelectedAnswers({});
          setScore(0);
          setQuizFinished(false);
          setCompletedQuiz(null);
        } else {
          setError("The generator returned no data.");
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [GEMINI_API_URL, user]
  );

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
          const history = await getQuizHistory(user.uid);
          // we need to add ids for rendering to work well
          const historyWithIds = history.map((quiz) => ({
            ...quiz,
            id: quiz.id,
          }));
          setQuizHistory(historyWithIds);
        } catch (e) {
          console.log(e);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [user]);

  const handleTopicSelect = (e) => {
    setTopic(e.target.value);
    setCustomTopic("");
  };
  const handleCustomTopicChange = (e) => {
    setCustomTopic(e.target.value);
    setTopic("");
  };

  const handleQuizStart = async () => {
    if (customTopic) {
      await fetchQuiz(customTopic);
    }
    if (topic) {
      await fetchQuiz(topic);
    }
  };
  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedAnswer,
    }));
  };

  const handleQuizSubmit = async () => {
    if (quiz) {
      let updatedQuiz = quiz.map((question, index) => ({
        ...question,
        selectedAnswer: selectedAnswers[index],
      }));
      const calculatedScore = updatedQuiz.reduce((acc, question) => {
        return question.correctAnswer === question.selectedAnswer
          ? acc + 1
          : acc;
      }, 0);
      setScore(calculatedScore);
      await handleQuizEnd(updatedQuiz, calculatedScore);
      setQuizFinished(true);
      setCompletedQuiz(updatedQuiz);
    }
  };
  const handleQuizEnd = async (updatedQuiz, calculatedScore) => {
    if (user && updatedQuiz) {
      const quizData = {
        topic: topic || customTopic,
        score: calculatedScore,
        timestamp: new Date(),
        questions: updatedQuiz,
        userId: user.uid,
      };
      try {
        await addQuizToHistory(user.uid, quizData);
        const history = await getQuizHistory(user.uid);
        // we need to add ids for rendering to work well
        const historyWithIds = history.map((quiz) => ({
          ...quiz,
          id: quiz.id,
        }));
        setQuizHistory(historyWithIds);
        setQuiz(null);
        setSelectedAnswers({});
      } catch (e) {
        setError("Could not save the quiz results.");
        console.error(e);
      }
    }
  };

  const toggleShowHistory = () => {
    setShowHistory((prev) => !prev);
  };

  return (
    <div>
      <QuizForm
        topic={topic}
        customTopic={customTopic}
        onTopicSelect={handleTopicSelect}
        onCustomTopicChange={handleCustomTopicChange}
        onStartQuiz={handleQuizStart}
        loading={loading}
      />
      <button onClick={toggleShowHistory} disabled={loading}>
        Show {showHistory ? "Active" : "History"}
      </button>
      {loading && <p>Generating the quiz...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {showHistory ? (
        <QuizHistory history={quizHistory} loading={loadingHistory} />
      ) : quizFinished ? (
        <>
          <p>
            Quiz completed, your score is {score}/{quiz?.length}
          </p>
          {completedQuiz &&
            completedQuiz.map((question, index) => (
              <div
                key={index}
                style={{ border: "1px solid lightgray", margin: 5, padding: 5 }}
              >
                <p>{question.question}</p>
                <p>Your answer: {question.selectedAnswer || "Not answered"}</p>
                <p>Correct answer: {question.correctAnswer}</p>
                <p
                  style={{
                    color:
                      question.selectedAnswer === question.correctAnswer
                        ? "green"
                        : "red",
                  }}
                >
                  {question.selectedAnswer === question.correctAnswer
                    ? "Correct!"
                    : "Incorrect!"}
                </p>
              </div>
            ))}
        </>
      ) : (
        quiz && (
          <div>
            {quiz &&
              quiz.map((question, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ddd",
                    padding: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <h3 style={{ marginBottom: 10 }}>{question.question}</h3>
                  <div style={{ marginBottom: 10 }}>
                    {question?.options?.map((option, optionIndex) => (
                      <div key={optionIndex}>
                        <label>
                          <input
                            type="radio"
                            name={`quiz-option-${index}`}
                            value={option}
                            checked={selectedAnswers[index] === option}
                            onChange={() => handleAnswerChange(index, option)}
                          />{" "}
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            {quiz && <button onClick={handleQuizSubmit}>Submit Answers</button>}
          </div>
        )
      )}
    </div>
  );
};

export default QuizPage;
