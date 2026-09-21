
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav>
      <div>
        <Link to="/">VPro Photo Gallery</Link>
      </div>

      <div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {user ? (
          <>
            <Link to="/gallery">Admin</Link>

            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;