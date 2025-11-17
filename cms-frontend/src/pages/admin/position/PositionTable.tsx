import React, { useState } from "react";
import {
    Edit2,
    ChevronLeft,
    ChevronRight,
    Settings,
    Check,
} from "lucide-react";
import { Position } from "../../../types";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeadCell,
    TableCell,
} from "../../../components/UI/Table";
import { Button } from "../../../components/UI/Button";

interface PositionTableProps {
    position: Position[];
    loading: boolean;
    pagination: {
        page: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    onEditPosition: (position: Position) => void;
    onChangeStatus: (_id: string, status: "active" | "inactive") => void;
    onPageChange: (page: number) => void;
}

const getStatusBadgeColor = (status: "active" | "inactive" | "unknown") =>
    status === "active"
        ? "bg-green-100 text-green-800"
        : "bg-gray-100 text-gray-800";

export const PositionTable: React.FC<PositionTableProps> = ({
    position,
    loading,
    pagination,
    onEditPosition,
    onChangeStatus,
    onPageChange,
}) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleDropdown = (positionId: string) => {
        setActiveDropdown(activeDropdown === positionId ? null : positionId);
    };

    const handleStatusChange = async (
        id: string,
        status: "active" | "inactive"
    ) => {
        try {
            await onChangeStatus(id, status); // panggil fungsi dari parent
            setActiveDropdown(null); // dropdown otomatis tertutup setelah update
        } catch (error) {
            console.error("Failed to change status:", error);
        }
    };

    const getPositionStatus = (
        position: Position
    ): "active" | "inactive" | "unknown" => {
        if (!position.status_id) return "unknown";
        const s = position.status_id.name.toLowerCase();
        return s === "active"
            ? "active"
            : s === "inactive"
                ? "inactive"
                : "unknown";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {position.map((raw) => (
                        <TableRow key={raw._id}>
                            <TableCell>{raw.name}</TableCell>
                            <TableCell>
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                                        getPositionStatus(raw)
                                    )}`}
                                >
                                    {getPositionStatus(raw)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onEditPosition(raw)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>

                                    <div className="relative">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDropdown(raw._id);
                                            }}
                                            title="Change Status"
                                            className={
                                                activeDropdown === raw._id
                                                    ? "bg-gray-100"
                                                    : ""
                                            }
                                        >
                                            <Settings className="h-4 w-4" />
                                        </Button>

                                        {activeDropdown === raw._id && (
                                            <div
                                                className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <div className="py-1">
                                                    <div className="px-3 py-1 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                                        Status
                                                    </div>

                                                    {/* Inactive Button */}
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                raw._id,
                                                                "inactive"
                                                            )
                                                        }
                                                        disabled={
                                                            getPositionStatus(
                                                                raw
                                                            ) === "inactive"
                                                        }
                                                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between
                    ${getPositionStatus(raw) === "inactive"
                                                                ? "bg-gray-50 text-gray-700 font-medium cursor-not-allowed"
                                                                : "hover:bg-gray-100 text-gray-700 cursor-pointer"
                                                            }
                `}
                                                    >
                                                        <span>Inactive</span>
                                                        {getPositionStatus(
                                                            raw
                                                        ) === "inactive" && (
                                                                <Check className="h-4 w-4 text-gray-600" />
                                                            )}
                                                    </button>

                                                    {/* Active Button */}
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                raw._id,
                                                                "active"
                                                            )
                                                        }
                                                        disabled={
                                                            getPositionStatus(
                                                                raw
                                                            ) === "active"
                                                        }
                                                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between
                    ${getPositionStatus(raw) === "active"
                                                                ? "bg-green-50 text-green-700 font-medium cursor-not-allowed"
                                                                : "hover:bg-gray-100 text-gray-700 cursor-pointer"
                                                            }
                `}
                                                    >
                                                        <span>Active</span>
                                                        {getPositionStatus(
                                                            raw
                                                        ) === "active" && (
                                                                <Check className="h-4 w-4 text-green-600" />
                                                            )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {position.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No positions found
                </div>
            )}

            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 px-4">
                    <Button
                        onClick={() => onPageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrev}
                    >
                        <ChevronLeft />
                    </Button>
                    <span>
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                        onClick={() => onPageChange(pagination.page + 1)}
                        disabled={!pagination.hasNext}
                    >
                        <ChevronRight />
                    </Button>
                </div>
            )}
        </>
    );
};
