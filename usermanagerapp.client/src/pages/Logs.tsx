/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import Toast, { type ToastType } from "../components/toast/Toast"
import ViewLogsModal from "../components/modals/ViewLogsModal"
import "../assets/styles/table.css"
import "../assets/styles/home.css"

interface Log {
    id: number
    name: string
    createdAt: string
    updatedAt: string
}

export default function Logs() {
    const [logs, setLogs] = React.useState<Log[]>([])
    const [selectedLogContent, setSelectedLogContent] = React.useState<string>("")
    const [showLogModal, setShowLogModal] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [toasts, setToasts] = React.useState<
        { id: number; type: ToastType; title: string; message: string }[]
    >([])

    const showToast = (type: ToastType, title: string, message: string) => {
        const id = Date.now()
        setToasts((prev) => [...prev, { id, type, title, message }])
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
    }

    // Fetch list of log files
    const fetchLogs = async () => {
        try {
            setLoading(true)
            setError(null)

            const token = localStorage.getItem("token")
            if (!token) throw new Error("Missing token — please log in again.")

            const response = await fetch("http://localhost:5015/api/logs", {
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": "12345-ABCDE-APIKEY",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

            const data = await response.json()
            const logsArray = Array.isArray(data) ? data : data.data || []
            // Add an auto-generated ID if not provided by the backend
            setLogs(
                logsArray.map((log: any, idx: number) => ({
                    id: idx,
                    name: log.name,
                    createdAt: log.createdAt,
                    updatedAt: log.updatedAt,
                }))
            )
        } catch (err: any) {
            setError(err.message)
            showToast("error", "Error Loading Logs", err.message)
        } finally {
            setLoading(false)
        }
    }

    // Fetch content of a single log file
    const fetchLogContent = async (fileName: string) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("Missing token — please log in again.")

            const response = await fetch(`http://localhost:5015/api/logs/${fileName}`, {
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": "12345-ABCDE-APIKEY",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

            const data = await response.text()
            setSelectedLogContent(data)
            setShowLogModal(true)
        } catch (err: any) {
            showToast("error", "Error Opening Log", err.message)
        }
    }

    React.useEffect(() => {
        fetchLogs()
    }, [])

    return (
        <div className="home-container">
            <Sidebar onSelectPage={() => { }} activePage="logs" />
            <main className="home-content">
                <Topbar />

                <header className="home-header">
                    <h1>System Logs</h1>
                    <p>View and monitor system or user activity logs.</p>
                </header>

                {loading && <p style={{ textAlign: "center" }}>Loading logs...</p>}
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                {!loading && logs.length === 0 && (
                    <p style={{ textAlign: "center", opacity: 0.7 }}>No logs found.</p>
                )}
                <div className="table-container">
                {!loading && logs.length > 0 && (
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Log File</th>
                                <th>Created</th>
                                <th>Last Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr
                                    key={log.id}
                                    className="clickable-row"
                                    onClick={() => fetchLogContent(log.name)}
                                >
                                    <td>{log.name}</td>
                                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                                    <td>{new Date(log.updatedAt).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="view-btn"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                fetchLogContent(log.name)
                                            }}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>

                {/* Landscape scrollable modal for viewing log content */}
                <ViewLogsModal
                    isOpen={showLogModal}
                    onClose={() => setShowLogModal(false)}
                    title="Log Details"
                    content={selectedLogContent}
                />

                {/* Toast notifications */}
                <div className="toast-container">
                    {toasts.map((t) => (
                        <Toast
                            key={t.id}
                            type={t.type}
                            title={t.title}
                            message={t.message}
                            onClose={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                        />
                    ))}
                </div>
            </main>
        </div>
    )
}
