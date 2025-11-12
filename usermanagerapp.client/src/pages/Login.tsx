/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import "../assets/styles/login.css"
import { useState } from "react"

export default function Login() {
    const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")
    const [formData, setFormData] = useState({
        userName: "",
        fullName: "",
        email: "",
        phone: "",
        language: "",
        culture: "",
        password: "",
        role: "",
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            if (activeTab === "signin") {
                // LOGIN
                const response = await fetch("http://localhost:5015/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-KEY": "12345-ABCDE-APIKEY",
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                })

                if (!response.ok) throw new Error("Invalid email or password")

                const data = await response.json()
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))

                setMessage("✅ Login successful! Redirecting...")
                setTimeout(() => {
                    window.location.href = "/"
                }, 1000)
            } else {
                // SIGN UP
                const response = await fetch("http://localhost:5015/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-KEY": "12345-ABCDE-APIKEY",
                    },
                    body: JSON.stringify({
                        userName: formData.userName,
                        fullName: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        language: formData.language,
                        culture: formData.culture,
                        password: formData.password,
                    }),
                })

                if (!response.ok) throw new Error("Failed to create account")

                setMessage("✅ Account created! Please sign in.")
                setActiveTab("signin")
            }
        } catch (err: any) {
            setMessage("❌ " + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            {/* Left side (brand) */}
            <div className="login-left">
                <div className="login-brand">
                    <img src="/lock.png" alt="Logo" className="brand-logo" />
                    <h1>Welcome to Your User Management System</h1>
                    <p>
                        Simplify access control, manage users efficiently, and keep your organization secure — all in one place.
                    </p>
                    <button className="see-sql">Sign in to continue</button>
                </div>
                <img src="/original.png" alt="Login illustration" className="login-decor" />
            </div>

            {/* Right side (form) */}
            <div className="login-right">
                <div className="login-card">

                    {/* Tabs */}
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === "signin" ? "active" : ""}`}
                            onClick={() => setActiveTab("signin")}
                            type="button"
                        >
                            Sign In
                        </button>
                        <button
                            className={`tab ${activeTab === "signup" ? "active" : ""}`}
                            onClick={() => setActiveTab("signup")}
                            type="button"
                        >
                            Create New Account
                        </button>
                    </div>

                    <p className="login-description">
                        The fastest way to get up and running with your user management dashboard.
                        Manage accounts, roles, and permissions in one secure place.
                    </p>

                    {/* Message Box */}
                    {message && (
                        <div
                            style={{
                                backgroundColor: message.startsWith("✅") ? "#e7f9ef" : "#fdecea",
                                color: message.startsWith("✅") ? "#1b5e20" : "#b71c1c",
                                padding: "10px",
                                borderRadius: "8px",
                                marginBottom: "10px",
                                fontSize: "0.9rem",
                                textAlign: "center",
                            }}
                        >
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        {activeTab === "signup" && (
                            <>
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    placeholder="johndoe"
                                    required
                                />

                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                />

                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                />

                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="0000000000"
                                    required
                                />

                                <label>Language</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Language</option>
                                    <option value="en">English</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    <option value="es">Spanish</option>
                                </select>

                                <label>Culture</label>
                                <select
                                    name="culture"
                                    value={formData.culture}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Culture</option>
                                    <option value="US">United States</option>
                                    <option value="FR">France</option>
                                    <option value="DE">Germany</option>
                                </select>

                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="*********"
                                    required
                                />
                            </>
                        )}

                        {activeTab === "signin" && (
                            <>
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                />

                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="*********"
                                    required
                                />

                                <div className="forgot">
                                    <a href="#">Forgot Password?</a>
                                </div>
                            </>
                        )}

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading
                                ? "Please wait..."
                                : activeTab === "signin"
                                    ? "Login to Dashboard"
                                    : "Create Account"}
                        </button>

                        <div className="divider">OR</div>

                        <button type="button" className="github-btn">
                            <img
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                                alt="GitHub"
                            />
                            {activeTab === "signin" ? "Login with GitHub" : "Sign up with GitHub"}
                        </button>
                    </form>

                    <p className="terms">
                        By signing in you agree to our <a href="#">Terms of Service</a> and{" "}
                        <a href="#">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    )
}
