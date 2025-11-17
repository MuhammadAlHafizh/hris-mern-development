import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { announcementService } from "../services/announcementService";
import {
    Announcement,
    AnnouncementStatus,
    AnnouncementFormData,
} from "../types";

export function useAnnouncements() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [statuses, setStatuses] = useState<AnnouncementStatus[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] =
        useState<Announcement | null>(null);
    const [formData, setFormData] = useState<AnnouncementFormData>({
        title: "",
        body: "",
        statusId: "",
    });

    const [pagination, setPagination] = useState({
        page: 1,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
    });

    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await announcementService.getAnnouncements(
                pagination.page,
                10,
                searchTerm,
                selectedStatus === "all" ? undefined : selectedStatus
            );

            setAnnouncements(response.data);
            setPagination({
                page: response.page,
                total: response.total,
                totalPages: response.totalPages,
                hasNext: response.hasNext,
                hasPrev: response.hasPrev,
            });
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || "Failed to fetch announcements";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error("Error fetching announcements:", err);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, searchTerm, selectedStatus]);

    const fetchStatuses = useCallback(async () => {
        try {
            const data = await announcementService.getStatuses();
            setStatuses(data);
        } catch (err) {
            const errorMessage = "Failed to fetch announcement statuses";
            toast.error(errorMessage);
            console.error("Error fetching announcement statuses:", err);
        }
    }, []);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    useEffect(() => {
        fetchStatuses();
    }, [fetchStatuses]);

    const handleCreateAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await announcementService.createAnnouncement(formData);
            await fetchAnnouncements();
            setIsCreateModalOpen(false);
            resetForm();
            toast.success("Announcement created successfully!");
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || "Failed to create announcement";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error("Error creating announcement:", err);
        }
    };

    const handleUpdateAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAnnouncement) return;

        try {
            await announcementService.updateAnnouncement(
                editingAnnouncement._id,
                formData
            );
            await fetchAnnouncements();
            setEditingAnnouncement(null);
            resetForm();
            toast.success("Announcement updated successfully!");
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || "Failed to update announcement";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error("Error updating announcement:", err);
        }
    };

    const handleChangeStatus = async (id: string, statusId: string) => {
        try {
            await announcementService.changeStatus(id, statusId);
            await fetchAnnouncements();

            const statusName = statuses.find((s) => s._id === statusId)?.name;
            toast.success(`Status changed to ${statusName}`);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                "Failed to change announcement status";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error("Error changing announcement status:", err);
        }
    };

    const openEditModal = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setFormData({
            title: announcement.title,
            body: announcement.body,
            statusId: announcement.status._id,
        });
    };

    const resetForm = () => {
        setFormData({
            title: "",
            body: "",
            statusId: statuses[0]?._id || "",
        });
    };

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, page }));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination((prev) => ({ ...prev, page: 1 }));
        fetchAnnouncements();
    };

    return {
        announcements,
        statuses,
        loading,
        error,
        searchTerm,
        selectedStatus,
        isCreateModalOpen,
        editingAnnouncement,
        formData,
        pagination,
        setSearchTerm,
        setSelectedStatus,
        setIsCreateModalOpen,
        setEditingAnnouncement,
        setFormData,
        handleCreateAnnouncement,
        handleUpdateAnnouncement,
        handleChangeStatus,
        resetForm,
        openEditModal,
        handlePageChange,
        handleSearch,
        refetch: fetchAnnouncements,
    };
}
