import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "./assets/styles/global.css"
import Home from "./pages/Home"
import Login from "./pages/Login"
import ProtectedRoute from "./routes/ProtectedRoute"
import Logs from "./pages/Logs"

function App() {
    return (
        <Router>
            <Routes>
                {/* Protected route */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/logs"
                    element={
                        <ProtectedRoute>
                            <Logs />
                        </ProtectedRoute>
                    }
                />

                {/* Public route */}
                <Route path="/login" element={<Login />} />

                {/* Redirect anything else to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    )
}

export default App
