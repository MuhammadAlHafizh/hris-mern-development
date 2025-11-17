import React, { useState } from 'react';
import { Edit2, ChevronLeft, ChevronRight, Settings, Check } from 'lucide-react';
import { User } from '../../../types';
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from '../../../components/UI/Table';
import { Button } from '../../../components/UI/Button';

interface UserTableProps {
    users: User[];
    loading: boolean;
    pagination: {
        page: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    onEditUser: (user: User) => void;
    onChangeStatus: (_id: string, status: 'active' | 'inactive') => void;
    onPageChange: (page: number) => void;
}

const getRoleBadgeColor = (role: string) => {
    switch (role) {
        case 'admin': return 'bg-red-100 text-red-800';
        case 'manager': return 'bg-blue-100 text-blue-800';
        case 'staff': return 'bg-purple-100 text-purple-800';
        default: return 'bg-green-100 text-green-800';
    }
};

const getStatusBadgeColor = (status: 'active' | 'inactive' | 'unknown') =>
    status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

export const UserTable: React.FC<UserTableProps> = ({
    users,
    loading,
    pagination,
    onEditUser,
    onChangeStatus,
    onPageChange
}) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleDropdown = (positionId: string) => {
        setActiveDropdown(activeDropdown === positionId ? null : positionId);
    };

    const handleStatusChange = async (id: string, status: 'active' | 'inactive') => {
        try {
            await onChangeStatus(id, status); // panggil fungsi dari parent
            setActiveDropdown(null); // dropdown otomatis tertutup setelah update
        } catch (error) {
            console.error("Failed to change status:", error);
        }
    };


    const getUserStatus = (user: User): 'active' | 'inactive' | 'unknown' => {
        if (!user.status_id) return 'unknown';

        // Jika status_id adalah object
        if (typeof user.status_id === 'object' && user.status_id.name) {
            const s = user.status_id.name.toLowerCase();
            return s === 'active' ? 'active' : s === 'inactive' ? 'inactive' : 'unknown';
        }

        return 'unknown';
    };

    React.useEffect(() => {
        const handleClickOutside = () => {
            setActiveDropdown(null);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>Email</TableHeadCell>
                        <TableHeadCell>Role</TableHeadCell>
                        <TableHeadCell>Position</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user, index) => (
                        <TableRow key={user._id || `user-${index}`}>
                            <TableCell>
                                <div className="font-medium">{user.name}</div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                                        typeof user.status_id === 'object' && user.status_id !== null
                                            ? user.status_id.name
                                            : 'Unknown'
                                    )}`}
                                >
                                    {user.role}
                                </span>
                            </TableCell>
                            <TableCell>
                                {user.position && typeof user.position === 'object' ? (
                                    <div className="flex flex-col">
                                        <span className="font-medium">{user.position.name}</span>
                                    </div>
                                ) : user.position ? (
                                    <span className="text-gray-400">Position ID: {user.position}</span>
                                ) : (
                                    <span className="text-gray-400">No position</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(getUserStatus(user))}`}
                                >
                                    {getUserStatus(user)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onEditUser(user)}
                                        title="Edit User"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>

                                    <div className="relative">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDropdown(user._id);
                                            }}
                                            title="Change Status"
                                            className={activeDropdown === user._id ? 'bg-gray-100' : ''}
                                        >
                                            <Settings className="h-4 w-4" />
                                        </Button>

                                        {activeDropdown === user._id && (
                                            <div
                                                className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="py-1">
                                                    <div className="px-3 py-1 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                                        Status
                                                    </div>

                                                    {/* Inactive Button */}
                                                    <button
                                                        onClick={() => handleStatusChange(user._id, 'inactive')}
                                                        disabled={getUserStatus(user) === 'inactive'}
                                                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between
                    ${getUserStatus(user) === 'inactive'
                                                                ? 'bg-gray-50 text-gray-700 font-medium cursor-not-allowed'
                                                                : 'hover:bg-gray-100 text-gray-700 cursor-pointer'}
                `}
                                                    >
                                                        <span>Inactive</span>
                                                        {getUserStatus(user) === 'inactive' && (
                                                            <Check className="h-4 w-4 text-gray-600" />
                                                        )}
                                                    </button>

                                                    {/* Active Button */}
                                                    <button
                                                        onClick={() => handleStatusChange(user._id, 'active')}
                                                        disabled={getUserStatus(user) === 'active'}
                                                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between
                                    ${getUserStatus(user) === 'active'
                                                                ? 'bg-green-50 text-green-700 font-medium cursor-not-allowed'
                                                                : 'hover:bg-gray-100 text-gray-700 cursor-pointer'}
                `}
                                                    >
                                                        <span>Active</span>
                                                        {getUserStatus(user) === 'active' && (
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

            {users.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                    No users found
                </div>
            )}

            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 px-4">
                    <div className="text-sm text-gray-600">
                        Showing {users.length} of {pagination.total} users
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
