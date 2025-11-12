import * as React from "react"
import "../../assets/styles/viewlogsmodal.css"

interface ViewLogsModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    content: string
}

export default function ViewLogsModal({ isOpen, onClose, title, content }: ViewLogsModalProps) {
    if (!isOpen) return null

    return (
        <div className="viewlogs-overlay" onClick={onClose}>
            <div
                className="viewlogs-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="viewlogs-header">
                    <h2>{title || "Log Viewer"}</h2>
                    <button className="viewlogs-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="viewlogs-body">
                    <pre>{content || "No log content available."}</pre>
                </div>
            </div>
        </div>
    )
}
