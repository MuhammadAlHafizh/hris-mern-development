import { useState, useEffect, useCallback, useRef } from "react";
import { Leave, ApplyLeaveData, LeaveHistoryResponseData } from "../types/index";
import { leaveService } from "../services/leaveService";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext"; // Import auth context

export const useStaffLeave = () => {
    const { user } = useAuth(); // Get current user from auth context
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [leaveHistory, setLeaveHistory] = useState<LeaveHistoryResponseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingLeave, setEditingLeave] = useState<Leave | null>(null);
    const [formData, setFormData] = useState<ApplyLeaveData>({
        startDate: "",
        endDate: "",
        reason: ""
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

    // Load leave history dan my leaves
    const loadData = useCallback(async () => {
        if (!isMountedRef.current) return;
        if (!user) {
            console.log("User not found, waiting for authentication...");
            return;
        }

        try {
            setLoading(true);

            // Load leave history untuk summary - kirim user ID
            const history = await leaveService.getLeaveHistory(parseInt(selectedYear), user._id);
            setLeaveHistory(history);

            // Load my leaves untuk table - kirim user ID
            const filters: any = {
                year: parseInt(selectedYear),
                userId: user._id // Tambahkan user ID di filters
            };
            if (selectedStatus !== "all") {
                filters.status = selectedStatus;
            }

            const myLeavesResponse = await leaveService.getMyLeaves(filters);

            // myLeavesResponse adalah { data: Leave[], statusCode, message }
            const leavesData = Array.isArray(myLeavesResponse.data) ? myLeavesResponse.data : [];

            console.log("Fetched leaves data for user:", user._id, leavesData);
            setLeaves(leavesData);

            // Set pagination
            setPagination(prev => ({
                ...prev,
                total: leavesData.length,
                totalPages: Math.ceil(leavesData.length / prev.size),
                hasNext: prev.page < Math.ceil(leavesData.length / prev.size),
                hasPrev: prev.page > 1,
            }));

        } catch (error: any) {
            console.error("Failed to load leave data:", error);
            const errorMessage = error.response?.data?.message || "Failed to load leave data";
            toast.error(errorMessage);

            // Set default empty array jika error
            setLeaves([]);
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, [selectedYear, selectedStatus, pagination.page, pagination.size, user]); // Tambahkan user dependency

    // Load data ketika filter/pagination berubah
    useEffect(() => {
        isMountedRef.current = true;
        if (user) {
            loadData();
        }

        return () => {
            isMountedRef.current = false;
        };
    }, [loadData, user]); // Tambahkan user dependency

    const handleCreateLeave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("User not found");
            return;
        }

        try {
            await leaveService.applyLeave(formData);
            await loadData();
            setIsCreateModalOpen(false);
            resetForm();
            toast.success("Pengajuan cuti berhasil dikirim");
        } catch (error: any) {
            console.error("Failed to create leave:", error);
            const errorMessage = error.response?.data?.message || "Failed to create leave";
            toast.error(errorMessage);
        }
    };

    const handleUpdateLeave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLeave || !user) return;

        try {
            // Untuk update, kita perlu API khusus atau gunakan cancel + create baru
            // Sementara kita cancel yang lama dan buat yang baru
            await leaveService.cancelLeave(editingLeave._id);
            await leaveService.applyLeave(formData);
            await loadData();
            setIsEditModalOpen(false);
            setEditingLeave(null);
            resetForm();
            toast.success("Pengajuan cuti berhasil diupdate");
        } catch (error: any) {
            console.error("Failed to update leave:", error);
            const errorMessage = error.response?.data?.message || "Failed to update leave";
            toast.error(errorMessage);
        }
    };

    const handleCancelLeave = async (id: string) => {
        if (!window.confirm("Apakah Anda yakin ingin membatalkan pengajuan cuti ini?")) {
            return;
        }

        try {
            await leaveService.cancelLeave(id);
            await loadData();
            toast.success("Pengajuan cuti berhasil dibatalkan");
        } catch (error: any) {
            console.error("Failed to cancel leave:", error);
            const errorMessage = error.response?.data?.message || "Failed to cancel leave";
            toast.error(errorMessage);
        }
    };

    const handleReverseLeave = async (id: string) => {
        if (!window.confirm("Apakah Anda yakin ingin melakukan reverse cuti ini? Cuti yang sudah approved akan dikembalikan ke status pending.")) {
            return;
        }

        try {
            await leaveService.reverseLeave(id);
            await loadData();
            toast.success("Cuti berhasil di-reverse");
        } catch (error: any) {
            console.error("Failed to reverse leave:", error);
            const errorMessage = error.response?.data?.message || "Failed to reverse leave";
            toast.error(errorMessage);
        }
    };

    const resetForm = () => {
        setFormData({
            startDate: "",
            endDate: "",
            reason: ""
        });
    };

    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    // Generate tahun untuk dropdown (3 tahun terakhir dan 1 tahun ke depan)
    const yearOptions = Array.from({ length: 5 }, (_, i) => {
        const year = new Date().getFullYear() - 2 + i;
        return { value: year.toString(), label: year.toString() };
    });

    return {
        leaves,
        leaveHistory,
        loading,
        searchTerm,
        selectedYear,
        selectedStatus,
        isCreateModalOpen,
        isEditModalOpen,
        editingLeave,
        formData,
        pagination,
        yearOptions,
        setSearchTerm,
        setSelectedYear,
        setSelectedStatus,
        setIsCreateModalOpen,
        setIsEditModalOpen,
        setEditingLeave,
        setFormData,
        handleCreateLeave,
        handleUpdateLeave,
        handleCancelLeave,
        handleReverseLeave,
        resetForm,
        handlePageChange,
        handleSearch,
    };
};
