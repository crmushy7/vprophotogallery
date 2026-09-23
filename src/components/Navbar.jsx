import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeMenu();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">

          {/* LOGO */}
          <Link
            to="/"
            className="navbar-logo"
            onClick={closeMenu}
          >
            <span className="logo-v">V</span>
            <span>PRO</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="desktop-nav">

            <Link
              to="/"
              className={isActive("/") ? "active" : ""}
            >
              Home
            </Link>

            <Link
              to="/gallery"
              className={
                location.pathname.startsWith("/gallery") ||
                location.pathname.startsWith("/album")
                  ? "active"
                  : ""
              }
            >
              Gallery
            </Link>

            <Link
              to="/about"
              className={isActive("/about") ? "active" : ""}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={isActive("/contact") ? "active" : ""}
            >
              Contact
            </Link>

            {!user ? (
              <Link
                to="/login"
                className="desktop-login"
              >
                Admin Login
              </Link>
            ) : (
              <button
                type="button"
                className="desktop-logout"
                onClick={handleLogout}
              >
                Admin Logout
              </button>
            )}

          </nav>

          {/* HAMBURGER */}
          <button
            type="button"
            className={`hamburger ${
              menuOpen ? "open" : ""
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open navigation"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>
      </header>

      {/* DARK OVERLAY */}
      <div
        className={`sidebar-overlay ${
          menuOpen ? "show" : ""
        }`}
        onClick={closeMenu}
      ></div>

      {/* MOBILE SIDEBAR */}
      <aside
        className={`mobile-sidebar ${
          menuOpen ? "open" : ""
        }`}
      >

        {/* SIDEBAR HEADER */}
        <div className="sidebar-header">

          <Link
            to="/"
            className="sidebar-logo"
            onClick={closeMenu}
          >
            <span>V</span>PRO
          </Link>

          <button
            type="button"
            className="sidebar-close"
            onClick={closeMenu}
            aria-label="Close navigation"
          >
            ×
          </button>

        </div>

        {/* SIDEBAR TITLE */}
        <div className="sidebar-title">
          <span>MENU</span>
          <p>Explore VPro Photography</p>
        </div>

        {/* SIDEBAR NAVIGATION */}
        <nav className="sidebar-nav">

          {/* HOME */}
          <Link
            to="/"
            onClick={closeMenu}
            className={
              isActive("/")
                ? "active"
                : ""
            }
          >
            <span className="sidebar-number">
              01
            </span>

            <div>
              <strong>Home</strong>
              <small>Karibu VPro</small>
            </div>

            <span className="sidebar-arrow">
              →
            </span>
          </Link>

          {/* GALLERY */}
          <Link
            to="/gallery"
            onClick={closeMenu}
            className={
              location.pathname.startsWith("/gallery") ||
              location.pathname.startsWith("/album")
                ? "active"
                : ""
            }
          >
            <span className="sidebar-number">
              02
            </span>

            <div>
              <strong>Gallery</strong>
              <small>Explore photographs</small>
            </div>

            <span className="sidebar-arrow">
              →
            </span>
          </Link>

          {/* ABOUT */}
          <Link
            to="/about"
            onClick={closeMenu}
            className={
              isActive("/about")
                ? "active"
                : ""
            }
          >
            <span className="sidebar-number">
              03
            </span>

            <div>
              <strong>About</strong>
              <small>Kuhusu VPro</small>
            </div>

            <span className="sidebar-arrow">
              →
            </span>
          </Link>

          {/* CONTACT */}
          <Link
            to="/contact"
            onClick={closeMenu}
            className={
              isActive("/contact")
                ? "active"
                : ""
            }
          >
            <span className="sidebar-number">
              04
            </span>

            <div>
              <strong>Contact</strong>
              <small>Wasiliana nasi</small>
            </div>

            <span className="sidebar-arrow">
              →
            </span>
          </Link>

        </nav>

        {/* LOGIN / LOGOUT */}
        <div className="sidebar-bottom">

          {!user ? (
            <Link
              to="/login"
              onClick={closeMenu}
              className="sidebar-login-button"
            >
              Admin Login
              <span>→</span>
            </Link>
          ) : (
            <>
              <div className="admin-status">

                <span className="admin-dot"></span>

                <div>
                  <strong>Admin Mode</strong>
                  <small>
                    Management controls enabled
                  </small>
                </div>

              </div>

              <button
                type="button"
                className="sidebar-logout-button"
                onClick={handleLogout}
              >
                Admin Logout
              </button>
            </>
          )}

          <p className="sidebar-footer">
            VPRO PHOTOGRAPHY
          </p>

        </div>

      </aside>
    </>
  );
}

export default Navbar;