
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setMessage("Login successful.");
    } catch (error) {
      setMessage("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      <div className="login-container">

        <p className="login-label">
          ADMINISTRATION
        </p>

        <h1>Admin Login</h1>

        <p className="login-description">
          Sign in to manage albums, folders, and photos.
        </p>

        {user ? (
          <div className="login-message">
            <p>You are logged in as administrator.</p>
            <p>{user.email}</p>
          </div>
        ) : (
          <form onSubmit={handleLogin}>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

          </form>
        )}

        {message && !user && (
          <p className="login-message">
            {message}
          </p>
        )}

      </div>

    </main>
  );
}

export default Login;
