import { useState, useEffect, useCallback, useRef } from "react";
import { Position, PositionFormData, PositionStatus } from "../types";
import { positionService } from "../services/positionService";
import { toast } from 'react-toastify';

export const usePosition = () => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [statusOptions, setStatusOptions] = useState<PositionStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState<Position | null>(null);
    const [formData, setFormData] = useState<PositionFormData>({ name: "" });
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

    // Load status options
    const loadStatusOptions = useCallback(async () => {
        try {
            setStatusLoading(true);
            const statuses = await positionService.getPositionStatuses();
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

    const loadPositions = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        if (!isMountedRef.current) return;

        try {
            setLoading(true);
            const response = await positionService.getPosition(
                pagination.page,
                pagination.size,
                searchTerm,
                selectedStatus !== "all" ? selectedStatus : undefined,
                abortControllerRef.current.signal
            );

            if (isMountedRef.current) {
                setPositions(response.positions);
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
            console.error("Failed to load positions:", error);
            toast.error("Failed to load positions");
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
            abortControllerRef.current = null;
        }
    }, [pagination.page, pagination.size, searchTerm, selectedStatus]);

    // Load status options once on mount
    useEffect(() => {
        loadStatusOptions();
    }, [loadStatusOptions]);

    // Load positions with debounce
    useEffect(() => {
        isMountedRef.current = true;

        const timer = setTimeout(() => {
            loadPositions();
        }, 300);

        return () => {
            clearTimeout(timer);
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [loadPositions]);

    const handleCreatePosition = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await positionService.createPosition(formData);
            await loadPositions();
            setIsCreateModalOpen(false);
            resetForm();
            toast.success("Position created successfully");
        } catch (error: any) {
            console.error("Failed to create position:", error);
            const errorMessage = error.response?.data?.message || "Failed to create position";
            toast.error(errorMessage);
        }
    };

    const handleUpdatePosition = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPosition) return;
        try {
            await positionService.updatePosition(editingPosition._id, formData);
            await loadPositions();
            setEditingPosition(null);
            resetForm();
            toast.success("Position updated successfully");
        } catch (error: any) {
            console.error("Failed to update position:", error);
            const errorMessage = error.response?.data?.message || "Failed to update position";
            toast.error(errorMessage);
        }
    };

    const handleChangeStatus = async (_id: string, status: "active" | "inactive") => {
        try {
            await positionService.changePositionStatus(_id, status);
            // Update local state
            setPositions(prev =>
                prev.map(p => {
                    if (p._id === _id) {
                        if (typeof p.status_id === 'object' && p.status_id !== null) {
                            return {
                                ...p,
                                status_id: {
                                    ...p.status_id,
                                    name: status
                                }
                            };
                        }
                        return p;
                    }
                    return p;
                })
            );
            toast.success(`Position status changed to ${status}`);
        } catch (error: any) {
            console.error("Failed to change position status:", error);
            const errorMessage = error.response?.data?.message || "Failed to change position status";
            toast.error(errorMessage);
        }
    };

    const resetForm = () => setFormData({ name: "" });

    const openEditModal = (position: Position) => {
        setEditingPosition(position);
        setFormData({ name: position.name });
    };

    const handlePageChange = (newPage: number) =>
        setPagination(prev => ({ ...prev, page: newPage }));

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    return {
        position: positions, // KEMBALIKAN KE position (singular)
        statusOptions,
        loading,
        statusLoading,
        searchTerm,
        selectedStatus,
        isCreateModalOpen,
        editingPosition,
        formData,
        pagination,
        setSearchTerm,
        setSelectedStatus,
        setIsCreateModalOpen,
        setEditingPosition,
        setFormData,
        handleCreatePosition,
        handleUpdatePosition,
        handleChangeStatus,
        resetForm,
        openEditModal,
        handlePageChange,
        handleSearch,
    };
};
