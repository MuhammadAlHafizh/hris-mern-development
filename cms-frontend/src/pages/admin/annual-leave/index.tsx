import React from 'react';
import { Card } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import { Plus } from 'lucide-react';
import { AnnualLeaveFilters } from './AnnualLeaveFilters';
import { AnnualLeaveTable } from './AnnualLeaveTable';
import { AnnualLeaveModal } from './AnnualLeaveModal';
import { useAnnualLeave } from '../../../hook/useAnnualLeave';

export const AnnualLeave: React.FC = () => {
    const {
        annualLeaves,
        users,
        loading,
        usersLoading,
        searchTerm,
        selectedYear,
        selectedUser,
        isCreateModalOpen,
        editingAnnualLeave,
        formData,
        pagination,
        yearOptions,
        setSearchTerm,
        setSelectedYear,
        setSelectedUser,
        setIsCreateModalOpen,
        setEditingAnnualLeave,
        setFormData,
        handleCreateAnnualLeave,
        handleUpdateAnnualLeave,
        handleDeleteAnnualLeave,
        resetForm,
        openEditModal,
        handlePageChange,
        handleSearch
    } = useAnnualLeave();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-black">Annual Leave</h1>
                    <p className="text-gray-600 mt-1">Manage employee annual leave allocations</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Annual Leave
                </Button>
            </div>

            <Card>
                <AnnualLeaveFilters
                    searchTerm={searchTerm}
                    selectedYear={selectedYear}
                    selectedUser={selectedUser}
                    users={users}
                    yearOptions={yearOptions}
                    usersLoading={usersLoading}
                    onSearchTermChange={setSearchTerm}
                    onYearChange={setSelectedYear}
                    onUserChange={setSelectedUser}
                    onSearch={handleSearch}
                />

                <AnnualLeaveTable
                    annualLeaves={annualLeaves}
                    loading={loading}
                    pagination={pagination}
                    onEditAnnualLeave={openEditModal}
                    onDeleteAnnualLeave={handleDeleteAnnualLeave}
                    onPageChange={handlePageChange}
                />
            </Card>

            <AnnualLeaveModal
                isOpen={isCreateModalOpen || !!editingAnnualLeave}
                editingAnnualLeave={editingAnnualLeave}
                formData={formData}
                users={users}
                usersLoading={usersLoading}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingAnnualLeave(null);
                    resetForm();
                }}
                onFormDataChange={setFormData}
                onSubmit={editingAnnualLeave ? handleUpdateAnnualLeave : handleCreateAnnualLeave}
            />
        </div>
    );
};
