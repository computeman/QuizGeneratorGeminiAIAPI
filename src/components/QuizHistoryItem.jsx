// src/components/QuizHistoryItem.js
import React from 'react';

const QuizHistoryItem = ({ quiz }) => {
    return (
        <div style={{ border: '1px solid grey', padding: 10, margin: 5 }}>
            <p>Topic: {quiz.topic}</p>
            <p>Score: {quiz.score}/{quiz.questions.length}</p>
            {quiz.questions.map((question, index) => (
                <div key={index} style={{ border: "1px solid lightgray", margin: 5, padding: 5 }}>
                    <p>{question.question}</p>
                    <p>Your answer: {question.selectedAnswer}</p>
                    <p>Correct answer: {question.correctAnswer}</p>
                    <p style={{ color: question.selectedAnswer === question.correctAnswer ? 'green' : 'red'}}>
                        {question.selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect!'}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default QuizHistoryItem;