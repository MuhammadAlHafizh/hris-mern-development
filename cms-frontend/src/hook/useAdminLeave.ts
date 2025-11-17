import { useState, useEffect, useCallback, useRef } from "react";
import { Leave, LeaveActionData } from "../types/index";
import { leaveService } from "../services/leaveService";
import { toast } from "react-toastify";

export const useAdminLeave = () => {
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState<'confirm' | 'reject' | 'reverse' | 'cancel' | null>(null);
    const [managerNotes, setManagerNotes] = useState("");

    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
    });

    const isMountedRef = useRef(true);

    // Load leaves data - PERBAIKAN: Gunakan endpoint yang tepat
    const loadLeaves = useCallback(async () => {
        if (!isMountedRef.current) return;

        try {
            setLoading(true);
            const filters: any = { year: parseInt(selectedYear) };
            if (selectedStatus !== "all") {
                filters.status = selectedStatus;
            }

            let response;

            // Coba beberapa endpoint yang mungkin
            try {
                // Coba endpoint admin khusus
                response = await leaveService.listLeaves(filters);
            } catch (error) {
                console.log("Endpoint admin gagal, mencoba endpoint my-leaves...");
                // Fallback ke endpoint my-leaves tanpa userId untuk mendapatkan semua data
                response = await leaveService.listAllLeaves(filters);
            }

            const leavesData = Array.isArray(response.data) ? response.data : [];

            // Filter berdasarkan search term
            const filteredLeaves = leavesData.filter(leave =>
                leave.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                leave.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                leave.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setLeaves(filteredLeaves);
            setPagination(prev => ({
                ...prev,
                total: filteredLeaves.length,
                totalPages: Math.ceil(filteredLeaves.length / prev.size),
                hasNext: prev.page < Math.ceil(filteredLeaves.length / prev.size),
                hasPrev: prev.page > 1,
            }));

        } catch (error: any) {
            console.error("Failed to load leaves:", error);
            const errorMessage = error.response?.data?.message || "Failed to load leaves";
            toast.error(errorMessage);
            setLeaves([]);
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, [selectedYear, selectedStatus, searchTerm, pagination.page, pagination.size]);

    // Load data ketika filter/pagination berubah
    useEffect(() => {
        isMountedRef.current = true;
        loadLeaves();

        return () => {
            isMountedRef.current = false;
        };
    }, [loadLeaves]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination((prev) => ({ ...prev, page: 1 }));
        loadLeaves();
    };

    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handleAction = async () => {
        if (!selectedLeave || !actionType) return;

        try {
            const actionData: LeaveActionData = managerNotes ? { managerNotes } : {};

            switch (actionType) {
                case 'confirm':
                    await leaveService.confirmLeave(selectedLeave._id, actionData);
                    toast.success("Cuti berhasil dikonfirmasi");
                    break;
                case 'reverse':
                    await leaveService.reverseLeave(selectedLeave._id, actionData);
                    toast.success("Cuti berhasil di-reverse");
                    break;
                case 'cancel':
                    await leaveService.adminCancelLeave(selectedLeave._id, actionData);
                    toast.success("Cuti berhasil dibatalkan");
                    break;
            }

            setIsActionModalOpen(false);
            setSelectedLeave(null);
            setActionType(null);
            setManagerNotes("");
            await loadLeaves();
        } catch (error: any) {
            console.error(`Failed to ${actionType} leave:`, error);
            const errorMessage = error.response?.data?.message || `Failed to ${actionType} leave`;
            toast.error(errorMessage);
        }
    };

    const openActionModal = (leave: Leave, action: 'confirm' | 'reject' | 'reverse' | 'cancel') => {
        setSelectedLeave(leave);
        setActionType(action);
        setManagerNotes("");
        setIsActionModalOpen(true);
    };

    const openDetailModal = (leave: Leave) => {
        setSelectedLeave(leave);
        setIsDetailModalOpen(true);
    };

    const closeModals = () => {
        setIsDetailModalOpen(false);
        setIsActionModalOpen(false);
        setSelectedLeave(null);
        setActionType(null);
        setManagerNotes("");
    };

    const getAvailableActions = (leave: Leave) => {
        const actions = [];

        switch (leave.status?.name) {
            case 'Pending':
                actions.push(
                    { type: 'confirm' as const, label: 'Konfirmasi', color: 'text-green-600 hover:text-green-900' },
                    { type: 'reject' as const, label: 'Tolak', color: 'text-red-600 hover:text-red-900' }
                );
                break;
            case 'Approved':
                actions.push(
                    { type: 'reverse' as const, label: 'Reverse', color: 'text-orange-600 hover:text-orange-900' },
                    { type: 'cancel' as const, label: 'Batalkan', color: 'text-red-600 hover:text-red-900' }
                );
                break;
            case 'Reverse':
                actions.push(
                    { type: 'cancel' as const, label: 'Batalkan', color: 'text-red-600 hover:text-red-900' }
                );
                break;
        }

        return actions;
    };

    // Generate tahun untuk dropdown (3 tahun terakhir dan 1 tahun ke depan)
    const yearOptions = Array.from({ length: 5 }, (_, i) => {
        const year = new Date().getFullYear() - 2 + i;
        return { value: year.toString(), label: year.toString() };
    });

    return {
        // State
        leaves,
        loading,
        searchTerm,
        selectedYear,
        selectedStatus,
        selectedLeave,
        isDetailModalOpen,
        isActionModalOpen,
        actionType,
        managerNotes,
        pagination,
        yearOptions,

        // Setters
        setSearchTerm,
        setSelectedYear,
        setSelectedStatus,
        setManagerNotes,

        // Handlers
        handleSearch,
        handlePageChange,
        handleAction,
        openActionModal,
        openDetailModal,
        closeModals,
        getAvailableActions,
        loadLeaves,
    };
};
