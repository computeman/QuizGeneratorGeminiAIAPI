// src/components/QuizHistory.js
import React, { useState } from "react";
import QuizHistoryItem from "./QuizHistoryItem";

const QuizHistory = ({ history, loading }) => {
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  if (loading) {
    return <p>Loading History...</p>;
  }
  if (!history || history.length === 0) {
    return <p>No quiz history available.</p>;
  }

  const handleTopicClick = (quizId) => {
    setSelectedQuizId(quizId);
  };

  const handleCloseItem = () => {
    setSelectedQuizId(null);
  };

  return (
    <div>
      {selectedQuizId === null ? (
        <ul>
          {history.map((quiz) => (
            <li
              key={quiz.id}
              style={{ cursor: "pointer" }}
              onClick={() => handleTopicClick(quiz.id)}
            >
              {quiz.topic}
            </li>
          ))}
        </ul>
      ) : (
        <>
          <QuizHistoryItem
            quiz={history.find((quiz) => quiz.id === selectedQuizId)}
          />
          <button onClick={handleCloseItem}> Close </button>
        </>
      )}
    </div>
  );
};

export default QuizHistory;
