# 📄 Airtable Form Builder — Assignment Submission

A fully working form builder web application that integrates with **Airtable using OAuth**.
Users can authenticate, select a base + table, choose fields, build a form, and share it publicly.
Form submissions sync directly to Airtable and are also stored in MongoDB.

---

## 🚀 Features

| Feature                                        | Status |
| ---------------------------------------------- | ------ |
| Secure Airtable OAuth login                    | ✅      |
| Fetch user Airtable Bases & Tables dynamically | ✅      |
| Fetch table fields using Airtable Meta API     | ✅      |
| Custom form builder UI                         | ✅      |
| Drag-and-drop field ordering                   | ✅      |
| Field editing (label, required toggle)         | ✅      |
| Save form configuration to database            | ✅      |
| Public form viewer page                        | ✅      |
| Submit responses → Airtable + MongoDB          | ✅      |
| Clean responsive UI (custom CSS, no Tailwind)  | ✅      |

---

## 🧠 How It Works

1. User logs in via **Airtable OAuth**
2. OAuth callback stores user record + refresh/access tokens
3. User selects:

   * An Airtable base
   * A table
   * The fields to expose
4. User renames labels, toggles required fields, reorders using drag-and-drop
5. Form is saved and becomes available as a public URL
6. Visitors can fill and submit the form
7. Submission is:

   * Stored in MongoDB
   * Written into Airtable as a record

---

## 🛠️ Tech Stack

| Layer                      | Tech                                      |
| -------------------------- | ----------------------------------------- |
| Frontend                   | React, React Router, Framer Motion, Fetch |
| Backend                    | Node.js, Express                          |
| Auth                       | Airtable OAuth 2.0                        |
| Database                   | MongoDB Atlas                             |
| Deployment-ready structure | ✔                                         |

---

## 📂 Project Structure

```
airtable-form-task/
 ├─ backend/
 │   ├─ models/
 │   ├─ routes/
 │   ├─ config/
 │   └─ index.js
 │
 └─ frontend/
     ├─ src/
     │   ├─ pages/
     │   ├─ components/
     │   ├─ hooks/
     │   └─ index.css
     └─ main.jsx
```

---

## ⚙️ Environment Setup

### 🔧 Backend `.env` file

```
PORT=4000
FRONTEND_URL=http://localhost:5173

AIRTABLE_CLIENT_ID=your_client_id
AIRTABLE_CLIENT_SECRET=your_client_secret
AIRTABLE_REDIRECT_URI=http://localhost:4000/auth/airtable/callback

MONGO_URI=your_mongo_connection_string
```

### 🔧 Frontend `.env` file

```
VITE_BACKEND_URL=http://localhost:4000
```

---

## ▶️ Run Locally

### 1️⃣ Install dependencies

Backend:

```sh
cd backend
npm install
npm run dev
```

Frontend:

```sh
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing Flow

1. Start backend + frontend
2. Navigate to:
   👉 `http://localhost:5173/`
3. Click **Connect Airtable** → complete OAuth flow
4. Build a form:

   * Select base
   * Select table
   * Choose fields
   * Rename + reorder
5. Submit
6. Test public form:
   👉 `http://localhost:5173/form/{formId}`
7. Confirm record appears in Airtable