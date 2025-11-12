/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import AddUserModal from "../components/modals/AddUserModal"
import EditUserModal from "../components/modals/EditUserModal"
import DeleteUserModal from "../components/modals/DeleteUserModal"
import ViewUserModal from "../components/modals/ViewUserModal"
import "../assets/styles/modal.css"
import "../assets/styles/table.css"
import { MoreVertical, Filter, UserPlus, Edit3, Trash2 } from "lucide-react"
import type { ToastType } from "./toast/Toast"

interface User {
    id: number
    userName: string
    fullName: string
    email: string
    access: string[]
    phone: string
    language: string
    culture: string
}

interface TableProps {
    showToast: (type: ToastType, title: string, message: string) => void
}

export default function Table({ showToast }: TableProps) {
    const [users, setUsers] = React.useState<User[]>([])
    const [showAddModal, setShowAddModal] = React.useState(false)
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
    const [showEditModal, setShowEditModal] = React.useState(false)
    const [openDropdown, setOpenDropdown] = React.useState<number | null>(null)
    const [showDeleteModal, setShowDeleteModal] = React.useState(false)
    const [userToDelete, setUserToDelete] = React.useState<User | null>(null)
    const [showViewModal, setShowViewModal] = React.useState(false)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const itemsPerPage = 6

    const totalPages = Math.ceil(users.length / itemsPerPage)
    const paginated = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    // Fetch users on mount
    const firstLoad = React.useRef(true)
    React.useEffect(() => {
        if (!firstLoad.current) return
        firstLoad.current = false
        const token = localStorage.getItem("token")
        if (!token) {
            showToast("error", "Unauthorized", "You must log in first.")
            setTimeout(() => {
                window.location.href = "/login"
            }, 2000)
        } else {
            fetchUsers()
        }
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            setError(null)

            const token = localStorage.getItem("token")
            if (!token) throw new Error("Missing token — please log in again.")

            const response = await fetch("http://localhost:5015/api/users", {
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": "12345-ABCDE-APIKEY",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("token")
                showToast("error", "Session Expired", "Please log in again.")
                setTimeout(() => {
                    window.location.href = "/login"
                }, 2000)
                return
            }

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

            const data = await response.json()
            const mapped = data.map((u: any) => ({
                id: u.id,
                userName: u.userName,
                fullName: u.fullName,
                email: u.email,
                access: ["Data Export", "Data Import"],
                phone: u.phone,
                language: u.language,
                culture: u.culture,
            }))
            setUsers(mapped.sort((a: User, b: User) => b.id - a.id))
        } catch (err: any) {
            setError(err.message)
            showToast("error", "Error Loading Users", err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (user: User) => {
        setSelectedUser(user)
        setShowEditModal(true)
        setOpenDropdown(null)
    }

    const handleEditSubmit = async (updatedUser: any) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const response = await fetch(`http://localhost:5015/api/users/${updatedUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": "12345-ABCDE-APIKEY",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedUser),
            })

            if (!response.ok) throw new Error("Failed to update user")

            await fetchUsers()
            setShowEditModal(false)
            showToast("success", "User Updated", `${updatedUser.fullName} updated successfully.`)
        } catch (error: any) {
            showToast("error", "Update Failed", error.message)
            console.error("Error updating user:", error)
        }
    }

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user)
        setShowDeleteModal(true)
    }

    const confirmDelete = async (userId: number) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const response = await fetch(`http://localhost:5015/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                    "X-API-KEY": "12345-ABCDE-APIKEY",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) throw new Error("Failed to delete user")

            await fetchUsers()
            setShowDeleteModal(false)
            showToast("success", "User Deleted", "The user has been removed successfully.")
        } catch (error: any) {
            showToast("error", "Delete Failed", error.message)
            console.error("Error deleting user:", error)
        }
    }

    const handleRowClick = (user: User) => {
        setSelectedUser(user)
        setShowViewModal(true)
    }

    return (
        <div className="table-container">
            <div className="table-header">
                <h3>
                    All users <span>{users.length}</span>
                </h3>

                <div className="table-actions">
                    <div className="search-box">
                        <input type="text" placeholder="Search" />
                    </div>
                    <button className="filter-btn">
                        <Filter size={16} />
                        Filters
                    </button>

                    <button className="add-btn" onClick={() => setShowAddModal(true)}>
                        <UserPlus size={16} />
                        Add user
                    </button>
                </div>
            </div>

            {/* Feedback */}
            {loading && <p style={{ textAlign: "center" }}>Loading users...</p>}
            {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

            {/* Table */}
            <table className="user-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" className="checkbox" /></th>
                        <th>User name</th>
                        <th>Access</th>
                        <th>Phone</th>
                        <th>Language</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginated.map((user) => (
                        <tr key={user.id} onClick={() => handleRowClick(user)} className="clickable-row">
                            <td onClick={(e) => e.stopPropagation()}>
                                <input type="checkbox" className="checkbox" />
                            </td>
                            <td className="user-cell">
                                <div>
                                    <p className="name">{user.fullName}</p>
                                    <p className="email">{user.email}</p>
                                </div>
                            </td>
                            <td>
                                <div className="badge-group">
                                    {user.access.map((a, i) => (
                                        <span
                                            key={i}
                                            className={`badge ${a === "Admin"
                                                    ? "badge-green"
                                                    : a === "Data Export"
                                                        ? "badge-blue"
                                                        : "badge-purple"
                                                }`}
                                        >
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td>{user.phone}</td>
                            <td>{user.language}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                                <div className="dropdown-wrapper">
                                    <MoreVertical
                                        size={18}
                                        className="more-icon"
                                        onClick={() =>
                                            setOpenDropdown(openDropdown === user.id ? null : user.id)
                                        }
                                    />
                                    {openDropdown === user.id && (
                                        <div className="dropdown-menu">
                                            <button onClick={() => handleEdit(user)}>
                                                <Edit3 size={14} /> Edit
                                            </button>
                                            <button onClick={() => handleDeleteClick(user)}>
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Modals */}
            <AddUserModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onUserAdded={fetchUsers} />
            <EditUserModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} userData={selectedUser} onSubmit={handleEditSubmit} />
            <DeleteUserModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} userData={userToDelete} onConfirm={confirmDelete} />
            <ViewUserModal isOpen={showViewModal} onClose={() => setShowViewModal(false)} userData={selectedUser} />
        </div>
    )
}
