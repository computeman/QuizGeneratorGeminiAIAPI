import React, { useState } from "react";

const Quiz = ({
  quiz,
  handleAnswerChange,
  handleSubmit,
  quizFinished,
  score,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleOptionChange = (questionIndex, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
    handleAnswerChange(questionIndex, selectedOption);
  };

  return (
    <div>
      {quizFinished ? (
        <>
          <p>
            Quiz completed, your score is {score}/{quiz?.length}
          </p>
          {quiz &&
            quiz.map((question, index) => (
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
        <>
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
                          onChange={() => handleOptionChange(index, option)}
                        />{" "}
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          {quiz && <button onClick={handleSubmit}>Submit Answers</button>}
        </>
      )}
    </div>
  );
};

export default Quiz;
