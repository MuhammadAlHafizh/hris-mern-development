import { useState, useEffect, useCallback, useRef } from "react";
import { AnnualLeave, AnnualLeaveFormData, User } from "../types";
import { annualLeaveService } from "../services/annualLeaveService";
import { userService } from "../services/userService";
import { toast } from "react-toastify";

export const useAnnualLeave = () => {
    const [annualLeaves, setAnnualLeaves] = useState<AnnualLeave[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState<string>("all");
    const [selectedUser, setSelectedUser] = useState<string>("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingAnnualLeave, setEditingAnnualLeave] =
        useState<AnnualLeave | null>(null);
    const [formData, setFormData] = useState<AnnualLeaveFormData>({
        user: "",
        year: new Date().getFullYear(),
        totalDays: 12,
        usedDays: 0,
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

    // Load users untuk dropdown
    const loadUsers = useCallback(async () => {
        try {
            setUsersLoading(true);
            const response = await userService.getUsers(1, 10, "", "68e52943333a814467823d48");
            if (isMountedRef.current) {
                setUsers(response.users);
            }
        } catch (error) {
            console.error("Failed to load users:", error);
            toast.error("Failed to load users");
        } finally {
            if (isMountedRef.current) {
                setUsersLoading(false);
            }
        }
    }, []);

    // Load annual leaves
    const loadAnnualLeaves = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        if (!isMountedRef.current) return;

        try {
            setLoading(true);
            const response = await annualLeaveService.getAnnualLeaves(
                pagination.page,
                pagination.size,
                searchTerm,
                selectedYear,
                selectedUser,
                abortControllerRef.current.signal
            );

            if (isMountedRef.current) {
                setAnnualLeaves(response.annualLeaves);
                setPagination((prev) => ({
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
            console.error("Failed to load annual leaves:", error);
            toast.error("Failed to load annual leaves");
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
            abortControllerRef.current = null;
        }
    }, [
        pagination.page,
        pagination.size,
        searchTerm,
        selectedYear,
        selectedUser,
    ]);

    // Load users saat pertama kali
    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Load annual leaves ketika filter/pagination berubah
    useEffect(() => {
        isMountedRef.current = true;

        const timer = setTimeout(() => {
            loadAnnualLeaves();
        }, 300);

        return () => {
            clearTimeout(timer);
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [loadAnnualLeaves]);

    const handleCreateAnnualLeave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await annualLeaveService.createAnnualLeave(formData);
            await loadAnnualLeaves();
            setIsCreateModalOpen(false);
            resetForm();
            toast.success("Annual leave created successfully");
        } catch (error: any) {
            console.error("Failed to create annual leave:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Failed to create annual leave";
            toast.error(errorMessage);
        }
    };

    const handleUpdateAnnualLeave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAnnualLeave) return;

        try {
            await annualLeaveService.updateAnnualLeave(
                editingAnnualLeave._id,
                formData
            );
            await loadAnnualLeaves();
            setEditingAnnualLeave(null);
            resetForm();
            toast.success("Annual leave updated successfully");
        } catch (error: any) {
            console.error("Failed to update annual leave:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Failed to update annual leave";
            toast.error(errorMessage);
        }
    };

    const handleDeleteAnnualLeave = async (id: string) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this annual leave?"
            )
        ) {
            return;
        }

        try {
            await annualLeaveService.deleteAnnualLeave(id);
            await loadAnnualLeaves();
            toast.success("Annual leave deleted successfully");
        } catch (error: any) {
            console.error("Failed to delete annual leave:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Failed to delete annual leave";
            toast.error(errorMessage);
        }
    };

    const resetForm = () => {
        setFormData({
            user: "",
            year: new Date().getFullYear(),
            totalDays: 12,
            usedDays: 0,
        });
    };

    const openEditModal = (annualLeave: AnnualLeave) => {
        setEditingAnnualLeave(annualLeave);
        setFormData({
            user: annualLeave.user._id,
            year: annualLeave.year,
            totalDays: annualLeave.totalDays,
            usedDays: annualLeave.usedDays,
        });
    };

    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    // Generate tahun untuk dropdown (5 tahun terakhir dan 5 tahun ke depan)
    const yearOptions = Array.from({ length: 11 }, (_, i) => {
        const year = new Date().getFullYear() - 5 + i;
        return { value: year.toString(), label: year.toString() };
    });

    return {
        annualLeaves,
        users,
        loading,
        usersLoading,
        searchTerm,
        selectedYear,
        selectedUser,
        isCreateModalOpen,
        editingAnnualLeave,
        formData,
        pagination,
        yearOptions,
        setSearchTerm,
        setSelectedYear,
        setSelectedUser,
        setIsCreateModalOpen,
        setEditingAnnualLeave,
        setFormData,
        handleCreateAnnualLeave,
        handleUpdateAnnualLeave,
        handleDeleteAnnualLeave,
        resetForm,
        openEditModal,
        handlePageChange,
        handleSearch,
    };
};
