import React from 'react';
import { Card } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import { Search, Filter, Calendar, Check, X, Undo, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from '../../../components/UI/Table';
import { Modal } from '../../../components/UI/Modal';
import { useAdminLeave } from '../../../hook/useAdminLeave';

export const AdminLeave: React.FC = () => {
    const {
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
    } = useAdminLeave();

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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-black">Kelola Pengajuan Cuti</h1>
                    <p className="text-gray-600 mt-1">Kelola pengajuan cuti seluruh staff</p>
                </div>
            </div>

            <Card>
                {/* Filters */}
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama, email, atau alasan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:border-transparent"
                        />
                    </div>

                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                        >
                            <option value="all">Semua Tahun</option>
                            {yearOptions.map((year) => (
                                <option key={year.value} value={year.value}>
                                    {year.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                        >
                            <option value="all">Semua Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Reverse">Reverse</option>
                        </select>
                    </div>

                    <Button type="submit">
                        Terapkan Filter
                    </Button>
                </form>

                {/* Table */}
                <Table>
                    <TableHeader>
                        <TableRow key={'header'}>
                            <TableHeadCell>Staff</TableHeadCell>
                            <TableHeadCell>Periode</TableHeadCell>
                            <TableHeadCell>Durasi</TableHeadCell>
                            <TableHeadCell>Alasan</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                            <TableHeadCell>Tanggal Pengajuan</TableHeadCell>
                            <TableHeadCell>Aksi</TableHeadCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaves.map((leave) => {
                            const availableActions = getAvailableActions(leave);

                            return (
                                <TableRow key={leave._id}>
                                    <TableCell>
                                        <div className="font-medium">{leave.user?.name}</div>
                                        <div className="text-sm text-gray-500">{leave.user?.email}</div>
                                        {leave.user?.position && (
                                            <div className="text-sm text-gray-500">{leave.user.position}</div>
                                        )}
                                    </TableCell>
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
                                        <div className="flex space-x-2">
                                            {/* Detail Button */}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => openDetailModal(leave)}
                                                title="Lihat Detail"
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            {/* Action Buttons */}
                                            {availableActions.map((action) => (
                                                <Button
                                                    key={action.type}
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => openActionModal(leave, action.type)}
                                                    title={action.label}
                                                    className={action.color}
                                                >
                                                    {action.type === 'confirm' && <Check className="h-4 w-4" />}
                                                    {action.type === 'reject' && <X className="h-4 w-4" />}
                                                    {action.type === 'reverse' && <Undo className="h-4 w-4" />}
                                                    {action.type === 'cancel' && <X className="h-4 w-4" />}
                                                </Button>
                                            ))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                {leaves.length === 0 && !loading && (
                    <div className="text-center py-12 text-gray-500">
                        Tidak ada pengajuan cuti
                    </div>
                )}

                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 px-4">
                        <div className="text-sm text-gray-600">
                            Menampilkan {leaves.length} dari {pagination.total} pengajuan cuti
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page - 1)}
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
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={!pagination.hasNext}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={closeModals}
                title="Detail Pengajuan Cuti"
                size="lg"
            >
                {selectedLeave && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-black mb-1">
                                    Nama Staff
                                </label>
                                <p className="text-gray-900">{selectedLeave.user?.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-black mb-1">
                                    Email
                                </label>
                                <p className="text-gray-900">{selectedLeave.user?.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-black mb-1">
                                    Periode
                                </label>
                                <p className="text-gray-900">
                                    {formatDate(selectedLeave.startDate)} - {formatDate(selectedLeave.endDate)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-black mb-1">
                                    Durasi
                                </label>
                                <p className="text-gray-900">{selectedLeave.days} hari</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-black mb-1">
                                    Status
                                </label>
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                        selectedLeave.status?.name || 'Unknown'
                                    )}`}
                                >
                                    {selectedLeave.status?.name || 'Unknown'}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-black mb-1">
                                    Tanggal Pengajuan
                                </label>
                                <p className="text-gray-900">{formatDate(selectedLeave.createdAt)}</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 text-black mb-1">
                                Alasan Cuti
                            </label>
                            <p className="text-gray-900 whitespace-pre-wrap">{selectedLeave.reason}</p>
                        </div>
                        {selectedLeave.managerNotes && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-black mb-1">
                                    Catatan Manager
                                </label>
                                <p className="text-gray-900 whitespace-pre-wrap">{selectedLeave.managerNotes}</p>
                            </div>
                        )}
                        {selectedLeave.approvedBy && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 text-black mb-1">
                                    Disetujui Oleh
                                </label>
                                <p className="text-gray-900">{selectedLeave.approvedBy.name}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Action Modal */}
            <Modal
                isOpen={isActionModalOpen}
                onClose={closeModals}
                title={actionType ? `${
                    actionType === 'confirm' ? 'Konfirmasi' :
                    actionType === 'reject' ? 'Tolak' :
                    actionType === 'reverse' ? 'Reverse' :
                    'Batalkan'
                } Cuti` : ''}
                size="md"
            >
                {selectedLeave && actionType && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-gray-700">
                                Anda akan <span className="font-semibold">{
                                    actionType === 'confirm' ? 'mengonfirmasi' :
                                    actionType === 'reject' ? 'menolak' :
                                    actionType === 'reverse' ? 'mereverse' :
                                    'membatalkan'
                                }</span> pengajuan cuti dari:
                            </p>
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium">{selectedLeave.user?.name}</p>
                                <p className="text-sm text-gray-600">
                                    {formatDate(selectedLeave.startDate)} - {formatDate(selectedLeave.endDate)}
                                    ({selectedLeave.days} hari)
                                </p>
                                <p className="text-sm text-gray-600 mt-1">{selectedLeave.reason}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 text-black mb-2">
                                Catatan (Opsional)
                            </label>
                            <textarea
                                value={managerNotes}
                                onChange={(e) => setManagerNotes(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                                placeholder="Masukkan catatan untuk staff..."
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeModals}
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleAction}
                                className={
                                    actionType === 'confirm' ? 'bg-green-600 hover:bg-green-700' :
                                    actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                                    actionType === 'reverse' ? 'bg-orange-600 hover:bg-orange-700' :
                                    'bg-red-600 hover:bg-red-700'
                                }
                            >
                                {
                                    actionType === 'confirm' ? 'Konfirmasi' :
                                    actionType === 'reject' ? 'Tolak' :
                                    actionType === 'reverse' ? 'Reverse' :
                                    'Batalkan'
                                }
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
