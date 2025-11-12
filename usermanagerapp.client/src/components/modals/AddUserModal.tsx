/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import "../../assets/styles/modal.css"
import Toast, { type ToastType } from "../toast/Toast"

interface AddUserModalProps {
    isOpen: boolean
    onClose: () => void
    onUserAdded: () => void
}

export default function AddUserModal({ isOpen, onClose, onUserAdded }: AddUserModalProps) {
    const [formData, setFormData] = React.useState({
        userName: "",
        fullName: "",
        email: "",
        phone: "",
        language: "",
        culture: "",
        password: "",
    })

    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [toast, setToast] = React.useState<{
        type: ToastType
        title: string
        message: string
    } | null>(null)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch("http://localhost:5015/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": "12345-ABCDE-APIKEY"
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to add user`)
            }

            setToast({
                type: "success",
                title: "User Added",
                message: `${formData.fullName} was successfully added.`,
            })

            setLoading(false)
            onUserAdded()
            onClose()
            setFormData({
                userName: "",
                fullName: "",
                email: "",
                phone: "",
                language: "",
                culture: "",
                password: "",
            })
        } catch (err: any) {
            console.error("❌ Error adding user:", err)
            setError("Failed to add user. Please try again.")
            setToast({
                type: "error",
                title: "Failed to Add User",
                message: err.message || "Something went wrong.",
            })
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <>
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>Add New User</h2>
                    <button className="close-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="userName"
                            placeholder="JohnDoe"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            placeholder="+1 234 567 890"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
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
                                <option value="zh">Chinese</option>
                                <option value="ar">Arabic</option>
                            </select>
                        </div>

                        <div className="form-group">
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
                                <option value="ES">Spain</option>
                                <option value="CN">China</option>
                                <option value="AE">United Arab Emirates</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="********"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? "Adding..." : "Add User"}
                        </button>
                    </div>
                </form>
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
