import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

const Register = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });

  const { email, password, firstname, lastname } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const body = { email, password, firstname, lastname };

      const response = await fetch(
        `https://${process.env.HOST_NAME}/api/v1/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const parseRes = await response.json();

      localStorage.setItem("token", parseRes.token);

      setAuth(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Register</h1>
        <form onSubmit={onSubmitForm}>
          <div className="register-input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control"
              value={email}
              onChange={onChange}
            />
          </div>
          <div className="register-input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={onChange}
            />
          </div>
          <div className="register-input-group">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              className="form-control"
              value={firstname}
              onChange={onChange}
            />
          </div>
          <div className="register-input-group">
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              className="form-control"
              value={lastname}
              onChange={onChange}
            />
          </div>
          <button type="submit" className="register-submit">
            Submit
          </button>
        </form>
        <Link to="/login" className="register-link">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
