/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import Table from "../components/Table"
import Logs from "../pages/Logs"
import "../assets/styles/home.css"
import Toast from "../components/toast/Toast"
import type { ToastType } from "../components/toast/Toast"

export default function Home() {
    const [activePage, setActivePage] = React.useState<"users" | "logs">("users")
    const [toasts, setToasts] = React.useState<
        { id: number; type: ToastType; title: string; message: string }[]
    >([])

    const showToast = (type: ToastType, title: string, message: string) => {
        const id = Date.now()
        setToasts((prev) => [...prev, { id, type, title, message }])

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 4000)
    }

    return (
        <div className="home-container">
            {/* Left Sidebar */}
            <Sidebar onSelectPage={(page) => setActivePage(page)} activePage={activePage} />

            {/* Main content area */}
            <main className="home-content">
                {/* Topbar at the top of main content */}
                <Topbar />

                {/* Header */}
                <header className="home-header">
                    {activePage === "users" ? (
                        <>
                            <h1>User Management</h1>
                            <p>Manage your users and their account permissions here.</p>
                        </>
                    ) : (
                        <>
                            <h1>System Logs</h1>
                            <p>View and monitor system or user activity logs.</p>
                        </>
                    )}
                </header>
                {activePage === "users" ? (
                    <Table showToast={showToast} />
                ) : (
                    <Logs />
                )}
                {/* Toast container */}
                <div className="toast-container">
                    {toasts.map((t) => (
                        <Toast
                            key={t.id}
                            type={t.type}
                            title={t.title}
                            message={t.message}
                            onClose={() =>
                                setToasts((prev) => prev.filter((x) => x.id !== t.id))
                            }
                        />
                    ))}
                </div>
            </main>
        </div>
    )
}
