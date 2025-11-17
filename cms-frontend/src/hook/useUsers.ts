import { useState, useEffect, useCallback, useRef } from "react";
import { User, UserFormData, UserStatus } from "../types";
import { userService } from "../services/userService";
import { toast } from 'react-toastify';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [statusOptions, setStatusOptions] = useState<UserStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        email: "",
        role: "staff",
        position: "",
        password: "",
    });
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
    });

    const isMountedRef = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Load status options - hanya sekali saat mount
    const loadStatusOptions = useCallback(async () => {
        try {
            setStatusLoading(true);
            const statuses = await userService.getUserStatuses();
            if (isMountedRef.current) {
                setStatusOptions(statuses);
            }
        } catch (error) {
            console.error("Failed to load status options:", error);
            toast.error("Failed to load status options");
        } finally {
            if (isMountedRef.current) {
                setStatusLoading(false);
            }
        }
    }, []);

    const loadUsers = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        if (!isMountedRef.current) return;

        try {
            setLoading(true);
            const response = await userService.getUsers(
                pagination.page,
                pagination.size,
                searchTerm,
                selectedStatus !== "all" ? selectedStatus : undefined,
                abortControllerRef.current.signal
            );

            if (isMountedRef.current) {
                setUsers(response.users);
                setPagination(prev => ({
                    ...prev,
                    total: response.total,
                    totalPages: response.totalPages,
                    hasNext: response.hasNext,
                    hasPrev: response.hasPrev,
                }));
            }
        } catch (error: any) {
            if (error.name === "AbortError" || error.name === "CanceledError") {
                console.log("Request cancelled");
                return;
            }
            console.error("Failed to load users:", error);
            toast.error("Failed to load users");
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
            abortControllerRef.current = null;
        }
    }, [pagination.page, pagination.size, searchTerm, selectedStatus]);

    // useEffect untuk load status options (hanya sekali)
    useEffect(() => {
        loadStatusOptions();
    }, [loadStatusOptions]);

    // useEffect untuk load users (tergantung perubahan filter/pagination)
    useEffect(() => {
        isMountedRef.current = true;

        const timer = setTimeout(() => {
            loadUsers();
        }, 300); // Debounce sedikit lebih lama

        return () => {
            clearTimeout(timer);
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [loadUsers]); // Hanya depend on loadUsers

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await userService.createUser(formData);
            await loadUsers();
            setIsCreateModalOpen(false);
            resetForm();
            toast.success("User created successfully");
        } catch (error: any) {
            console.error("Failed to create user:", error);
            const errorMessage = error.response?.data?.message || "Failed to create user";
            toast.error(errorMessage);
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            await userService.updateUser(editingUser._id, formData);
            await loadUsers();
            setEditingUser(null);
            resetForm();
            toast.success("User updated successfully");
        } catch (error: any) {
            console.error("Failed to update user:", error);
            const errorMessage = error.response?.data?.message || "Failed to update user";
            toast.error(errorMessage);
        }
    };

    const handleChangeStatus = async (_id: string, status: "active" | "inactive") => {
        try {
            await userService.changeUserStatus(_id, status);

            // Update local state dengan type yang benar
            setUsers(prev =>
                prev.map(user => {
                    if (user._id === _id) {
                        // Jika status_id adalah object, update name-nya
                        if (typeof user.status_id === 'object' && user.status_id !== null) {
                            return {
                                ...user,
                                status_id: {
                                    ...user.status_id,
                                    name: status
                                }
                            };
                        }
                        // Jika status_id adalah string, biarkan seperti semula
                        return user;
                    }
                    return user;
                })
            );
            toast.success(`User status changed to ${status}`);
        } catch (error: any) {
            console.error("Failed to change user status:", error);
            const errorMessage = error.response?.data?.message || "Failed to change user status";
            toast.error(errorMessage);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            role: "staff",
            position: "",
            password: "",
        });
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            position: typeof user.position === "object" ? user.position?._id ?? "" : user.position || "",
            password: "",
        });
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    return {
        users,
        statusOptions,
        loading,
        statusLoading,
        searchTerm,
        selectedStatus,
        isCreateModalOpen,
        editingUser,
        formData,
        pagination,
        setSearchTerm,
        setSelectedStatus,
        setIsCreateModalOpen,
        setEditingUser,
        setFormData,
        handleCreateUser,
        handleUpdateUser,
        handleChangeStatus,
        resetForm,
        openEditModal,
        handlePageChange,
        handleSearch,
    };
};
