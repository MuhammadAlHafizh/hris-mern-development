import React from 'react';
import { Card } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import { Plus } from 'lucide-react';
import { LeaveFilters } from './LeaveFilters';
import { LeaveTable } from './LeaveTable';
import { LeaveModal } from './LeaveModal';
import { useStaffLeave } from '../../../hook/useStaffLeave';

export const StaffLeave: React.FC = () => {
    const {
        leaves,
        leaveHistory,
        loading,
        searchTerm,
        selectedYear,
        selectedStatus,
        isCreateModalOpen,
        isEditModalOpen,
        formData,
        pagination,
        yearOptions,
        setSearchTerm,
        setSelectedYear,
        setSelectedStatus,
        setIsCreateModalOpen,
        setIsEditModalOpen,
        setEditingLeave,
        setFormData,
        handleCreateLeave,
        handleUpdateLeave,
        handleCancelLeave,
        handleReverseLeave,
        resetForm,
        handlePageChange,
        handleSearch
    } = useStaffLeave();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-black">Pengajuan Cuti</h1>
                    <p className="text-gray-600 mt-1">Kelola pengajuan cuti Anda</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajukan Cuti
                </Button>
            </div>

            {/* Leave Summary */}
            {leaveHistory && leaveHistory.data && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {leaveHistory.data.summary?.totalDays || 0}
                            </div>
                            <div className="text-sm text-blue-800">Total Hari</div>
                        </div>
                    </Card>
                    <Card className="bg-orange-50 border-orange-200">
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {leaveHistory.data.summary?.usedDays || 0}
                            </div>
                            <div className="text-sm text-orange-800">Terpakai</div>
                        </div>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {leaveHistory.data.summary?.remainingDays || 0}
                            </div>
                            <div className="text-sm text-green-800">Sisa</div>
                        </div>
                    </Card>
                </div>
            )}

            <Card>
                <LeaveFilters
                    searchTerm={searchTerm}
                    selectedYear={selectedYear}
                    selectedStatus={selectedStatus}
                    yearOptions={yearOptions}
                    onSearchTermChange={setSearchTerm}
                    onYearChange={setSelectedYear}
                    onStatusChange={setSelectedStatus}
                    onSearch={handleSearch}
                />

                <LeaveTable
                    leaves={leaves}
                    loading={loading}
                    pagination={pagination}
                    onCancelLeave={handleCancelLeave}
                    onEditLeave={(leave) => {
                        setEditingLeave(leave);
                        setFormData({
                            startDate: leave.startDate.split('T')[0],
                            endDate: leave.endDate.split('T')[0],
                            reason: leave.reason
                        });
                        setIsEditModalOpen(true);
                    }}
                    onReverseLeave={handleReverseLeave}
                    onPageChange={handlePageChange}
                />
            </Card>

            {/* Modal Create */}
            <LeaveModal
                isOpen={isCreateModalOpen}
                formData={formData}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    resetForm();
                }}
                onFormDataChange={setFormData}
                onSubmit={handleCreateLeave}
                title="Ajukan Cuti"
                submitText="Ajukan Cuti"
            />

            {/* Modal Edit */}
            <LeaveModal
                isOpen={isEditModalOpen}
                formData={formData}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingLeave(null);
                    resetForm();
                }}
                onFormDataChange={setFormData}
                onSubmit={handleUpdateLeave}
                title="Edit Pengajuan Cuti"
                submitText="Update Cuti"
            />
        </div>
    );
};
