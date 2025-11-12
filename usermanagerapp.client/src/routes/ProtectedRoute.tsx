import React from "react"
import { Navigate } from "react-router-dom"
import type { JSX } from "react/jsx-dev-runtime"

interface ProtectedRouteProps {
    children: JSX.Element
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    // If not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute
