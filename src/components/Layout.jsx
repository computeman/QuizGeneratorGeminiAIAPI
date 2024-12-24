// src/components/Layout.js
import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = React.useContext(AuthContext);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          backgroundColor: "lightgrey",
        }}
      >
        <h1>Quiz App</h1>
        <ul
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          {user ? (
            <>
              <li style={{ margin: 5 }}>
                <Link to="/quiz">Quiz</Link>
              </li>
              <li style={{ margin: 5 }}>
                <Link onClick={logout} to="/login">
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li style={{ margin: 5 }}>
                <Link to="/login">Login</Link>
              </li>
              <li style={{ margin: 5 }}>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <main style={{ padding: 20 }}>{children}</main>
    </div>
  );
};

export default Layout;
