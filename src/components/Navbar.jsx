import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
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
              className={isActive("/gallery") ? "active" : ""}
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
                Login
              </Link>
            ) : (
              <button
                className="desktop-logout"
                onClick={onLogout}
              >
                Logout
              </button>
            )}
          </nav>


          {/* HAMBURGER */}
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open navigation"
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

        <div className="sidebar-header">

          <Link
            to="/"
            className="sidebar-logo"
            onClick={closeMenu}
          >
            <span>V</span>PRO
          </Link>

          <button
            className="sidebar-close"
            onClick={closeMenu}
          >
            ×
          </button>

        </div>


        <div className="sidebar-title">
          <span>MENU</span>
          <p>Explore VPro Photography</p>
        </div>


        <nav className="sidebar-nav">

          <Link
            to="/"
            onClick={closeMenu}
            className={isActive("/") ? "active" : ""}
          >
            <span className="sidebar-number">01</span>

            <div>
              <strong>Home</strong>
              <small>Karibu VPro</small>
            </div>

            <span className="sidebar-arrow">→</span>
          </Link>


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
            <span className="sidebar-number">02</span>

            <div>
              <strong>Gallery</strong>
              <small>Explore photographs</small>
            </div>

            <span className="sidebar-arrow">→</span>
          </Link>


          <Link
            to="/about"
            onClick={closeMenu}
            className={isActive("/about") ? "active" : ""}
          >
            <span className="sidebar-number">03</span>

            <div>
              <strong>About</strong>
              <small>Kuhusu VPro</small>
            </div>

            <span className="sidebar-arrow">→</span>
          </Link>


          <Link
            to="/contact"
            onClick={closeMenu}
            className={isActive("/contact") ? "active" : ""}
          >
            <span className="sidebar-number">04</span>

            <div>
              <strong>Contact</strong>
              <small>Wasiliana nasi</small>
            </div>

            <span className="sidebar-arrow">→</span>
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
                  <small>Management controls enabled</small>
                </div>
              </div>

              <button
                className="sidebar-logout-button"
                onClick={() => {
                  closeMenu();

                  if (onLogout) {
                    onLogout();
                  }
                }}
              >
                Logout
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