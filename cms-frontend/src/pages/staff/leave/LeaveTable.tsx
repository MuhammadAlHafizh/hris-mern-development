import React from 'react';
import {  ChevronLeft, ChevronRight, Edit2, Undo, X } from 'lucide-react';
import { Leave } from '../../../types/index';
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from '../../../components/UI/Table';
import { Button } from '../../../components/UI/Button';

interface LeaveTableProps {
    leaves: Leave[] | undefined | null;
    loading: boolean;
    pagination: {
        page: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    onCancelLeave: (id: string) => void;
    onEditLeave: (leave: Leave) => void;
    onReverseLeave: (id: string) => void;
    onPageChange: (page: number) => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Approved': return 'bg-green-100 text-green-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        case 'Reverse': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (error) {
        return 'Invalid Date';
    }
};

export const LeaveTable: React.FC<LeaveTableProps> = ({
    leaves,
    loading,
    pagination,
    onCancelLeave,
    onEditLeave,
    onReverseLeave,
    onPageChange
}) => {
    // Pastikan leaves selalu array
    const safeLeaves = Array.isArray(leaves) ? leaves : [];

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
                    <TableRow key={'header'}>
                        <TableHeadCell>Periode</TableHeadCell>
                        <TableHeadCell>Durasi</TableHeadCell>
                        <TableHeadCell>Alasan</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell>Tanggal Pengajuan</TableHeadCell>
                        <TableHeadCell>Approve By</TableHeadCell>
                        <TableHeadCell>Reason Manager | Admin</TableHeadCell>
                        <TableHeadCell>Aksi</TableHeadCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {safeLeaves.map((leave) => (
                        <TableRow key={leave._id}>
                            <TableCell>
                                <div className="font-medium">{formatDate(leave.startDate)}</div>
                                <div className="text-sm text-gray-500">sampai</div>
                                <div className="font-medium">{formatDate(leave.endDate)}</div>
                            </TableCell>
                            <TableCell>
                                <span className="font-medium text-gray-900">{leave.days} hari</span>
                            </TableCell>
                            <TableCell>
                                <div className="max-w-xs">
                                    <p className="text-gray-900 line-clamp-2">{leave.reason}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                        leave.status?.name || 'Unknown'
                                    )}`}
                                >
                                    {leave.status?.name || 'Unknown'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-gray-900">{formatDate(leave.createdAt)}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-gray-900">{leave.approvedBy?.name}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-gray-900">{leave.managerNotes}</span>
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    {/* Edit Button - hanya untuk status Pending */}
                                    {leave.status?.name === 'Pending' && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onEditLeave(leave)}
                                            title="Edit Pengajuan"
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    )}

                                    {/* Cancel Button - hanya untuk status Pending */}
                                    {leave.status?.name === 'Pending' && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                if (window.confirm("Apakah Anda yakin ingin membatalkan pengajuan cuti ini?")) {
                                                    onCancelLeave(leave._id);
                                                }
                                            }}
                                            title="Batalkan Pengajuan"
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {safeLeaves.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                    Tidak ada pengajuan cuti
                </div>
            )}

            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 px-4">
                    <div className="text-sm text-gray-600">
                        Menampilkan {safeLeaves.length} dari {pagination.total} pengajuan cuti
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(pagination.page - 1)}
                            disabled={!pagination.hasPrev}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <span className="text-sm text-gray-600">
                            Halaman {pagination.page} dari {pagination.totalPages}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(pagination.page + 1)}
                            disabled={!pagination.hasNext}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};
