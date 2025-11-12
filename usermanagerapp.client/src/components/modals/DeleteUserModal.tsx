/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import Toast, {type ToastType } from "../toast/Toast"
import "../../assets/styles/modal.css"

interface DeleteUserModalProps {
    isOpen: boolean
    onClose: () => void
    userData: any | null
    onConfirm: (userId: number) => void
}

export default function DeleteUserModal({
    isOpen,
    onClose,
    userData,
    onConfirm,
}: DeleteUserModalProps) {
    const [loading, setLoading] = React.useState(false)
    const [toast, setToast] = React.useState<{
        type: ToastType
        title: string
        message: string
    } | null>(null)

    const handleConfirm = async () => {
        if (!userData?.id) return
        setLoading(true)

        try {
            await onConfirm(userData.id)
            setToast({
                type: "success",
                title: "User Deleted",
                message: `${userData.fullName || userData.userName} has been deleted successfully.`,
            })
            onClose()
        } catch (err: any) {
            console.error("❌ Error deleting user:", err)
            setToast({
                type: "error",
                title: "Delete Failed",
                message: err.message || "Failed to delete user. Please try again.",
            })
        } finally {
            setLoading(false)
        }
    }

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
                className="modal small"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>Delete User</h2>
                    <button className="close-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="modal-content">
                    <p>
                        Are you sure you want to delete{" "}
                        <strong>{userData.fullName || userData.userName}</strong>?
                        <br />
                        This action cannot be undone.
                    </p>
                </div>

                <div className="modal-actions">
                    <button type="button" className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="button" className="delete-btn" onClick={handleConfirm}>
                        Delete
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
