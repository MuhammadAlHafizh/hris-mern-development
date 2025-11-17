import React, { useState } from 'react';
import { Edit2, Settings, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Announcement } from "../../../types";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeadCell,
    TableCell,
} from "../../../components/UI/Table";
import { Button } from "../../../components/UI/Button";

interface AnnouncementTableProps {
    announcements: Announcement[];
    loading: boolean;
    pagination: {
        page: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    statuses: any[]; // Tambahkan prop statuses
    onEditAnnouncement: (announcement: Announcement) => void;
    onChangeStatus: (id: string, statusId: string) => void;
    onPageChange: (page: number) => void;
}

const getStatusBadgeColor = (statusName: string) => {
    switch (statusName.toLowerCase()) {
        case 'published':
            return 'bg-green-100 text-green-800';
        case 'draft':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export const AnnouncementTable: React.FC<AnnouncementTableProps> = ({
    announcements,
    loading,
    pagination,
    statuses, // Terima prop statuses
    onEditAnnouncement,
    onChangeStatus,
    onPageChange,
}) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleDropdown = (announcementId: string) => {
        setActiveDropdown(activeDropdown === announcementId ? null : announcementId);
    };

    const handleStatusChange = async (id: string, statusId: string) => {
        try {
            await onChangeStatus(id, statusId);
            setActiveDropdown(null);
        } catch (error) {
            console.error("Failed to change status:", error);
        }
    };

    // Helper function untuk mendapatkan status ID berdasarkan nama
    const getStatusIdByName = (statusName: string): string => {
        const status = statuses.find(s => s.name.toLowerCase() === statusName.toLowerCase());
        return status?._id || '';
    };

    // Helper function untuk mengecek apakah status adalah final (tidak bisa diubah)
    const isStatusFinal = (announcement: Announcement): boolean => {
        return announcement.status.isFinal === true;
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
                        <TableHeadCell>Title</TableHeadCell>
                        <TableHeadCell>Content</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell>Created By</TableHeadCell>
                        <TableHeadCell>Created At</TableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {announcements.map((announcement) => (
                        <TableRow key={announcement._id}>
                            <TableCell className="font-medium">
                                {announcement.title}
                            </TableCell>
                            <TableCell>
                                <div className="max-w-xs truncate">
                                    {announcement.body}
                                </div>
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                                        announcement.status.name
                                    )}`}
                                >
                                    {announcement.status.name}
                                    {isStatusFinal(announcement) && (
                                        <span className="ml-1 text-xs">🔒</span>
                                    )}
                                </span>
                            </TableCell>
                            <TableCell>
                                {announcement.createdBy?.name || 'Unknown'}
                            </TableCell>
                            <TableCell>
                                {new Date(announcement.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onEditAnnouncement(announcement)}
                                        disabled={isStatusFinal(announcement)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>

                                    <div className="relative">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => toggleDropdown(announcement._id)}
                                            className={activeDropdown === announcement._id ? "bg-gray-100" : ""}
                                            disabled={isStatusFinal(announcement)}
                                        >
                                            <Settings className="h-4 w-4" />
                                        </Button>

                                        {activeDropdown === announcement._id && !isStatusFinal(announcement) && (
                                            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                                <div className="py-1">
                                                    <div className="px-3 py-1 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                                        Change Status
                                                    </div>

                                                    {/* Draft Option */}
                                                    <button
                                                        onClick={() => handleStatusChange(announcement._id, getStatusIdByName('draft'))}
                                                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-100 ${
                                                            announcement.status.name.toLowerCase() === 'draft'
                                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                                : 'text-gray-700'
                                                        }`}
                                                        disabled={announcement.status.name.toLowerCase() === 'draft'}
                                                    >
                                                        <span>Draft</span>
                                                        {announcement.status.name.toLowerCase() === 'draft' && (
                                                            <Check className="h-4 w-4" />
                                                        )}
                                                    </button>

                                                    {/* Published Option */}
                                                    <button
                                                        onClick={() => handleStatusChange(announcement._id, getStatusIdByName('published'))}
                                                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-100 ${
                                                            announcement.status.name.toLowerCase() === 'published'
                                                                ? 'bg-green-50 text-green-700 font-medium'
                                                                : 'text-gray-700'
                                                        }`}
                                                        disabled={announcement.status.name.toLowerCase() === 'published'}
                                                    >
                                                        <span>Published</span>
                                                        {announcement.status.name.toLowerCase() === 'published' && (
                                                            <Check className="h-4 w-4" />
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

            {announcements.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                    No announcements found
                </div>
            )}

            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 px-4">
                    <Button
                        onClick={() => onPageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrev}
                        variant="outline"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-700">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                        onClick={() => onPageChange(pagination.page + 1)}
                        disabled={!pagination.hasNext}
                        variant="outline"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </>
    );
};
