import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import FormBuilderPage from "./pages/FormBuilderPage";
import FormsListPage from "./pages/FormsListPage";
import PublicForm from "./pages/PublicForm";
import SubmissionSuccess from "./pages/SubmissionSuccess";
import LandingPage from "./pages/LandingPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forms/new" element={<FormBuilderPage />} />
        <Route path="/forms" element={<FormsListPage />} />
        <Route path="/forms/:formId" element={<PublicForm />} />
        <Route path="/submitted" element={<SubmissionSuccess />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
