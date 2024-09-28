import React from "react";

function LoginPage({ onLogin }) {
  const handleLoginClick = () => {
    // Simulate a login process
    onLogin(); // This function will set `isLoggedIn` to true in the App component
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLoginClick}>Login</button>
    </div>
  );
}

export default LoginPage;
