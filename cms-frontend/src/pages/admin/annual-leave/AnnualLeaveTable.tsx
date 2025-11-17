import React from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnnualLeave } from '../../../types';
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from '../../../components/UI/Table';
import { Button } from '../../../components/UI/Button';

interface AnnualLeaveTableProps {
    annualLeaves: AnnualLeave[];
    loading: boolean;
    pagination: {
        page: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    onEditAnnualLeave: (annualLeave: AnnualLeave) => void;
    onDeleteAnnualLeave: (id: string) => void;
    onPageChange: (page: number) => void;
}

const getRemainingDaysColor = (remainingDays: number, totalDays: number) => {
    const percentage = (remainingDays / totalDays) * 100;
    if (percentage < 25) return 'bg-red-100 text-red-800';
    if (percentage < 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
};

export const AnnualLeaveTable: React.FC<AnnualLeaveTableProps> = ({
    annualLeaves,
    loading,
    pagination,
    onEditAnnualLeave,
    onDeleteAnnualLeave,
    onPageChange
}) => {
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
                        <TableHeadCell>Employee</TableHeadCell>
                        <TableHeadCell>Year</TableHeadCell>
                        <TableHeadCell>Total Days</TableHeadCell>
                        <TableHeadCell>Used Days</TableHeadCell>
                        <TableHeadCell>Remaining Days</TableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {annualLeaves.map((annualLeave) => (
                        <TableRow key={annualLeave._id}>
                            <TableCell>
                                <div className="font-medium">{annualLeave.user.name}</div>
                                <div className="text-sm text-gray-500">{annualLeave.user.email}</div>
                            </TableCell>
                            <TableCell>
                                <span className="font-medium">{annualLeave.year}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-gray-900">{annualLeave.totalDays} days</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-gray-900">{annualLeave.usedDays} days</span>
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRemainingDaysColor(
                                        annualLeave.remainingDays,
                                        annualLeave.totalDays
                                    )}`}
                                >
                                    {annualLeave.remainingDays} days
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onEditAnnualLeave(annualLeave)}
                                        title="Edit Annual Leave"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onDeleteAnnualLeave(annualLeave._id)}
                                        title="Delete Annual Leave"
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {annualLeaves.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                    No annual leaves found
                </div>
            )}

            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 px-4">
                    <div className="text-sm text-gray-600">
                        Showing {annualLeaves.length} of {pagination.total} annual leaves
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
                            Page {pagination.page} of {pagination.totalPages}
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
