// src/components/QuizDisplay.js
import React from "react";
import Quiz from "./Quiz";

const QuizDisplay = ({ quiz, handleAnswerChange, handleSubmit, quizFinished, score }) => {
    return (
        <div>
            {quizFinished ? (
                <>
                    <p>
                        Quiz completed, your score is {score}/{quiz?.length}
                    </p>
                     {quiz && quiz.map((question, index) => (
                         <div key={index} style={{ border: "1px solid lightgray", margin: 5, padding: 5 }}>
                             <p>{question.question}</p>
                             <p>Your answer: {question.selectedAnswer || 'Not answered'}</p>
                             <p>Correct answer: {question.correctAnswer}</p>
                            <p style={{ color: question.selectedAnswer === question.correctAnswer ? 'green' : 'red'}}>
                             {question.selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect!'}
                           </p>
                         </div>
                       ))}
                </>
            ) : (
                quiz && (
                  <Quiz
                    quiz={quiz}
                    handleAnswerChange={handleAnswerChange}
                    handleSubmit={handleSubmit}
                  />
                )
            )}
        </div>
    );
};

export default QuizDisplay;