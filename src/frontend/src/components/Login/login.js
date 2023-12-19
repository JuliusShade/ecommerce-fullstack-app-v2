import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import "./login.css";

const clientId = process.env.GOOGLE_CLIENT_ID;

export const LoginGoogle = ({ setAuth }) => {
  const onSuccess = async (googleData) => {
    try {
      console.log("Google data received on client:", googleData);
      const { credential } = googleData;

      const response = await fetch(
        `https://${process.env.HOST_NAME}/api/v1/auth/oauth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: credential }), // Send the ID token as access_token
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const parseRes = await response.json();

      localStorage.setItem("token", parseRes.token);
      setAuth(true);
    } catch (err) {
      console.error("Error during login: ", err);
      alert("Failed to log in with Google."); // Alert the user of a failed Google login
    }
  };

  const onFailure = (res) => {
    console.log("LOGIN FAILED! Response: ", res);
    alert("Google login failed. Please try again."); // Alert the user of a failed Google login
  };

  return (
    <div id="signInButton">
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={false}
      />
    </div>
  );
};

export const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // State to hold the error message

  const { email, password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password };

      const response = await fetch(
        `https://${process.env.HOST_NAME}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const parseRes = await response.json();

      if (!response.ok) {
        // If the credentials are invalid, show an error message
        setErrorMessage("Invalid Login Credentials");
        alert("Invalid Login Credentials"); // Using an alert for simplicity
      } else {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
      }
    } catch (err) {
      console.error(err.message);
      setErrorMessage(err.message);
      alert(err.message); // Show the error message as an alert
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>User Login</h1>
        <form onSubmit={onSubmitForm} className="login-form">
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Username"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <Link to="/register" className="register-link">
          Register
        </Link>
        <div className="google-auth">
          <LoginGoogle setAuth={setAuth} />
        </div>
        {/* Display error message if there is one */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Login;
