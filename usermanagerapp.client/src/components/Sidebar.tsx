/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react"
import "../assets/styles/sidebar.css"
import {
    LayoutDashboard,
    Database,
    Settings,
    Menu,
    X,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

interface SidebarProps {
    onSelectPage: (page: "users" | "logs") => void
    activePage: "users" | "logs"
}

export default function Sidebar({ onSelectPage, activePage }: SidebarProps) {
    const [active, setActive] = React.useState("Dashboard")
    const [isOpen, setIsOpen] = React.useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const items = [
        { name: "Dashboard", icon: <LayoutDashboard size={18} />, path:"/" },
        { name: "Logs", icon: <Database size={18} />, path: "/logs" },
    ]

    const handleNavigation = (path: string) => {
        navigate(path)
        setIsOpen(false)
    }

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="sidebar-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle sidebar"
            >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <aside className={`sidebar ${isOpen ? "open" : ""}`}>
            {/* Header */}
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <img src="/lock.png" alt="Logo" className="sidebar-logo" />
                    <span className="sidebar-title">User Management UI</span>
                </div>
                <span className="sidebar-version">v4.0</span>
            </div>

            {/* Menu items */}
            <ul className="sidebar-list">
                {items.map((item) => (
                    <li
                        key={item.name}
                        className={`sidebar-item ${location.pathname === item.path ? "active" : ""
                            }`}
                        onClick={() => handleNavigation(item.path)}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-text">{item.name}</span>
                    </li>
                ))}
            </ul>

            {/* Footer */}
            <div className="sidebar-footer">
                <button className="sidebar-btn">
                    <Settings size={18} />
                    <span>Settings</span>
                </button>
            </div>
            </aside>
            {/* Overlay outside open sidebar on mobile devices */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}
