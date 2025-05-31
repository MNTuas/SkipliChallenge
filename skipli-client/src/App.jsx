import { Routes, Route, Navigate } from "react-router-dom"
import PhoneLogin from "./Page/PhoneVerification"
import Dashboard from "./Page/Dashboard"
import "./index.css"

const App = () => {
  const phoneNumber = localStorage.getItem("phoneNumber")

  return (
    <Routes>
      <Route
        path="/"
        element={
          phoneNumber ? <Navigate to="/dashboard" replace /> : <PhoneLogin />
        }
      />
      <Route
        path="/dashboard"
        element={
          phoneNumber ? <Dashboard /> : <Navigate to="/" replace />
        }
      />
    </Routes>
  )
}

export default App
