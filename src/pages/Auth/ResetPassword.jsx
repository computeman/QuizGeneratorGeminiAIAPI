// src/pages/Auth/ResetPassword.js
import React, { useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
     const { resetPassword } = React.useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault();
          setMessage('');
         setError('');
        try {
            await resetPassword(email);
            setMessage('Password reset email sent!');
        } catch (err) {
             setError(err.message)
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                 {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;