/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import "../../assets/styles/modal.css"
import Toast, {type ToastType } from "../toast/Toast"

interface ViewUserModalProps {
    isOpen: boolean
    onClose: () => void
    userData: any | null
}

export default function ViewUserModal({ isOpen, onClose, userData }: ViewUserModalProps) {
    const [toast, setToast] = React.useState<{
        type: ToastType
        title: string
        message: string
    } | null>(null)

    React.useEffect(() => {
        if (isOpen && userData) {
            setToast({
                type: "info",
                title: "User Details Loaded",
                message: `Viewing details for ${userData.fullName || userData.userName}`,
            })
        }
    }, [isOpen, userData])

    React.useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000)
            return () => clearTimeout(timer)
        }
    }, [toast])

    if (!isOpen || !userData) return null

    return (
        <>
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal view"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>User Details</h2>
                    <button className="close-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="view-user-content">
                    <div className="view-row">
                        <span className="label">Username:</span>
                        <span className="value">{userData.userName || "—"}</span>
                    </div>

                    <div className="view-row">
                        <span className="label">Full Name:</span>
                        <span className="value">{userData.fullName || "—"}</span>
                    </div>

                    <div className="view-row">
                        <span className="label">Email:</span>
                        <span className="value">{userData.email || "—"}</span>
                    </div>

                    <div className="view-row">
                        <span className="label">Phone:</span>
                        <span className="value">{userData.phone || "—"}</span>
                    </div>

                    <div className="view-row">
                        <span className="label">Language:</span>
                        <span className="value">{userData.language || "—"}</span>
                    </div>

                    <div className="view-row">
                        <span className="label">Culture:</span>
                        <span className="value">{userData.culture || "—"}</span>
                    </div>
                </div>

                <div className="modal-actions center">
                    <button type="button" className="cancel-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
            </div>
            {toast && (
                <Toast
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    )
}
