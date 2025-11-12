import * as React from "react"
import "../assets/styles/topbar.css"
import { ChevronDown, LogOut } from "lucide-react"

export default function Topbar() {
    const [menuOpen, setMenuOpen] = React.useState(false)
    const [user, setUser] = React.useState<{ name: string; email: string; avatar: string }>({
        name: "",
        email: "",
        avatar: "/user.png"
    })

    // Load logged-in user from localStorage
    React.useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            const parsed = JSON.parse(storedUser)
            setUser({
                name: parsed.fullName || parsed.userName || "User",
                email: parsed.email || "unknown@example.com",
                avatar: "/user.png"
            })
        } else {
            // No user? Redirect to login
            window.location.href = "/login"
        }
    }, [])

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"
    }

    return (
        <header className="topbar">
            <div className="topbar-right">
                <div
                    className="user-menu"
                    onClick={() => setMenuOpen((prev) => !prev)}
                >
                    <img src={user.avatar} alt="User avatar" className="user-avatar" />
                    <span className="user-name">{user.name}</span>
                    <ChevronDown size={16} className="chevron" />
                </div>

                {menuOpen && (
                    <div className="user-dropdown">
                        <div className="user-info">
                            <img src={user.avatar} alt="User avatar" />
                            <div>
                                <p className="name">{user.name}</p>
                                <p className="email">{user.email}</p>
                            </div>
                        </div>
                        <hr />
                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}
