import { useState } from "react";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser(form);

      localStorage.setItem("devcareer_token", data.token);
      localStorage.setItem("devcareer_user", JSON.stringify(data.user));

      navigate("/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">D</div>
          <span>DevCareerOS</span>
        </div>

        <h1>Create your account</h1>

        <p className="auth-subtitle">
          Start managing your career journey from one place.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Full Name
            <div className="auth-input">
              <UserRound size={17} />

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Sheetal Patel"
                required
              />
            </div>
          </label>

          <label>
            Email
            <div className="auth-input">
              <Mail size={17} />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
          </label>

          <label>
            Password
            <div className="auth-input">
              <LockKeyhole size={17} />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                minLength="8"
                required
              />
            </div>
          </label>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
