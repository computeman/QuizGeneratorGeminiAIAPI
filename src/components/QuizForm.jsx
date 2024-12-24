// src/components/QuizForm.js
import React from 'react';

const QuizForm = ({ topic, customTopic, onTopicSelect, onCustomTopicChange, onStartQuiz, loading }) => {
    return (
        <div>
            <h2>Quiz Page</h2>
            <div>
                <label>
                    Select a topic
                    <select value={topic} onChange={onTopicSelect}>
                        <option value="">Select a topic</option>
                        <option value="javascript">JavaScript</option>
                        <option value="react">React</option>
                        <option value="python">Python</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                    </select>
                </label>
            </div>
            <div>
                <label>Or provide a custom topic</label>
                <input type="text" value={customTopic} onChange={onCustomTopicChange} />
            </div>
            <button onClick={onStartQuiz} disabled={loading}>Start Quiz</button>
        </div>
    );
};

export default QuizForm;