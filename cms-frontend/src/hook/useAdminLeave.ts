import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Leave, LeaveActionData } from "../types/index";
import { leaveService } from "../services/leaveService";
import { toast } from "react-toastify";

type ActionType = "confirm" | "reject" | "reverse" | "cancel";

export const useAdminLeave = () => {
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedStatus, setSelectedStatus] = useState<string>("all");

    const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState<ActionType | null>(null);
    const [managerNotes, setManagerNotes] = useState("");

    // pagination (client side)
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
    });

    const isMountedRef = useRef(true);

    const loadLeaves = useCallback(async () => {
        if (!isMountedRef.current) return;

        try {
            setLoading(true);

            // ✅ filters to backend
            const filters: any = {};
            if (selectedYear !== "all") filters.year = parseInt(selectedYear);
            if (selectedStatus !== "all") filters.status = selectedStatus;

            let response;
            try {
                response = await leaveService.listLeaves(filters);
            } catch (error) {
                console.log("Endpoint admin gagal, mencoba fallback listAllLeaves...");
                response = await leaveService.listAllLeaves(filters);
            }

            const leavesData = Array.isArray(response?.data) ? response.data : [];

            const term = searchTerm.trim().toLowerCase();
            const filteredLeaves = term
                ? leavesData.filter((leave: Leave) => {
                    const reason = (leave.reason || "").toLowerCase();
                    const name = (leave.user?.name || "").toLowerCase();
                    const email = (leave.user?.email || "").toLowerCase();
                    return reason.includes(term) || name.includes(term) || email.includes(term);
                })
                : leavesData;

            const total = filteredLeaves.length;
            const totalPages = Math.max(1, Math.ceil(total / pagination.size));

            const safePage = Math.min(pagination.page, totalPages);

            const hasPrev = safePage > 1;
            const hasNext = safePage < totalPages;

            const startIndex = (safePage - 1) * pagination.size;
            const pageData = filteredLeaves.slice(startIndex, startIndex + pagination.size);

            setLeaves(pageData);
            setPagination((prev) => ({
                ...prev,
                page: safePage,
                total,
                totalPages,
                hasPrev,
                hasNext,
            }));
        } catch (error: any) {
            console.error("Failed to load leaves:", error);
            const errorMessage = error.response?.data?.message || "Failed to load leaves";
            toast.error(errorMessage);
            setLeaves([]);
            setPagination((prev) => ({
                ...prev,
                total: 0,
                totalPages: 1,
                hasPrev: false,
                hasNext: false,
                page: 1,
            }));
        } finally {
            if (isMountedRef.current) setLoading(false);
        }
    }, [selectedYear, selectedStatus, searchTerm, pagination.page, pagination.size]);

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
        // loadLeaves akan terpanggil via effect karena pagination.page berubah,
        // tapi biar responsif, kita panggil langsung juga:
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
                case "confirm":
                    await leaveService.confirmLeave(selectedLeave._id, actionData);
                    toast.success("Cuti berhasil dikonfirmasi");
                    break;

                case "reverse":
                    await leaveService.reverseLeave(selectedLeave._id, actionData);
                    toast.success("Cuti berhasil di-reverse");
                    break;

                case "cancel":
                    await leaveService.adminCancelLeave(selectedLeave._id, actionData);
                    toast.success("Cuti berhasil dibatalkan");
                    break;

                case "reject":
                    await leaveService.adminCancelLeave(selectedLeave._id, actionData);
                    toast.success("Pengajuan cuti ditolak");
                    break;

                default:
                    toast.error("Action tidak dikenali");
                    return;
            }

            // close modal & refresh
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

    const openActionModal = (leave: Leave, action: ActionType) => {
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
        const actions: { type: ActionType; label: string; color: string }[] = [];

        switch (leave.status?.name) {
            case "Pending":
                actions.push(
                    { type: "confirm", label: "Konfirmasi", color: "text-green-600 hover:text-green-900" },
                    { type: "reject", label: "Tolak", color: "text-red-600 hover:text-red-900" }
                );
                break;

            case "Approved":
                actions.push(
                    { type: "reverse", label: "Reverse", color: "text-orange-600 hover:text-orange-900" },
                    { type: "cancel", label: "Batalkan", color: "text-red-600 hover:text-red-900" }
                );
                break;

            case "Reverse":
                actions.push({ type: "cancel", label: "Batalkan", color: "text-red-600 hover:text-red-900" });
                break;

            default:
                break;
        }

        return actions;
    };

    // tahun dropdown (boleh kamu ubah)
    const yearOptions = useMemo(() => {
        return Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - 2 + i;
            return { value: year.toString(), label: year.toString() };
        });
    }, []);

    return {
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

        setSearchTerm,
        setSelectedYear,
        setSelectedStatus,
        setManagerNotes,

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
