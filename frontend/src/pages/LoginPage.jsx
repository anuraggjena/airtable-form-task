import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function LoginPage() {
  const { loggedIn } = useAuth();

  useEffect(() => {
    if (loggedIn) window.location.href = "/dashboard";
  }, [loggedIn]);

  return (
    <div className="center-screen">
      <h1>Airtable Form Builder</h1>

      <p className="max-w-xl text-gray-400">
        Build beautiful forms and automatically sync every submission to Airtable — no manual work required.
      </p>

      <button
        className="btn-primary text-lg px-8 py-4 rounded-2xl"
        onClick={() => (window.location.href = `${BACKEND_URL}/auth/airtable/login`)}
      >
        Connect Airtable
      </button>

      <p className="text-gray-600 text-xs">
        🔒 OAuth Secure — No passwords stored.
      </p>
    </div>
  );
}
