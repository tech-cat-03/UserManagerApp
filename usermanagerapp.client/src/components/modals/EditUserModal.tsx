/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import "../../assets/styles/modal.css"
import Toast, {type ToastType } from "../toast/Toast"

interface EditUserModalProps {
    isOpen: boolean
    onClose: () => void
    userData: any | null
    onSubmit: (userData: any) => void
}

export default function EditUserModal({ isOpen, onClose, userData, onSubmit }: EditUserModalProps) {
    const [formData, setFormData] = React.useState({
        id: 0,
        userName: "",
        fullName: "",
        email: "",
        phone: "",
        language: "",
        culture: "",
        password: "",
    })

    const [loading, setLoading] = React.useState(false)
    const [toast, setToast] = React.useState<{
        type: ToastType
        title: string
        message: string
    } | null>(null)

    // Prefill form when modal opens
    React.useEffect(() => {
        if (userData) {
            setFormData({
                id: userData.id || 0,
                userName: userData.userName || "",
                fullName: userData.fullName || "",
                email: userData.email || "",
                phone: userData.phone || "",
                language: userData.language || "",
                culture: userData.culture || "",
                password: "",
            })
        }
    }, [userData])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onSubmit(formData)
            setToast({
                type: "success",
                title: "User Updated",
                message: `${formData.fullName || formData.userName} was successfully updated.`,
            })
            onClose()
        } catch (err: any) {
            console.error("❌ Error updating user:", err)
            setToast({
                type: "error",
                title: "Update Failed",
                message: err.message || "Failed to update user. Please try again.",
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

    if (!isOpen) return null

    return (
        <>
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>Edit User</h2>
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
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="text"
                            name="phone"
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
                                <option value="AE">UAE</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="(Leave blank to keep current password)"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn">
                            Save Changes
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
