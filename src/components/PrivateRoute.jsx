// src/components/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = React.useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;