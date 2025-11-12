import * as React from "react"
import "../../assets/styles/toast.css"
import { CheckCircle, AlertTriangle, Info, XCircle, X } from "lucide-react"

export type ToastType = "success" | "info" | "warning" | "error"

interface ToastProps {
    type: ToastType
    title: string
    message: string
    onClose: () => void
}

export default function Toast({ type, title, message, onClose }: ToastProps) {
    const icons = {
        success: <CheckCircle className="toast-icon success" size={20} />,
        info: <Info className="toast-icon info" size={20} />,
        warning: <AlertTriangle className="toast-icon warning" size={20} />,
        error: <XCircle className="toast-icon error" size={20} />,
    }

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">
                {icons[type]}
                <div className="toast-text">
                    <strong>{title}</strong>
                    <p>{message}</p>
                </div>
            </div>
            <button className="toast-close" onClick={onClose}>
                <X size={16} />
            </button>
        </div>
    )
}
