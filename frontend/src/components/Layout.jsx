import { Link } from "react-router-dom";

export default function Layout({ children }) {
  const loggedIn = localStorage.getItem("userId");

  return (
    <>
      {loggedIn && (
        <div className="navbar">
          <div className="nav-left">Airtable Forms</div>

          <div className="nav-right">
            <Link to="/forms/new">Create Form</Link>
            <Link to="/forms">My Forms</Link>
            <button
              className="btn-outline"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {children}
    </>
  );
}
