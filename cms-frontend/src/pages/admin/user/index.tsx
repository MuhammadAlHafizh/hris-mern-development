import React from 'react';
import { Card } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import { Plus } from 'lucide-react';
import { UserTable } from './UserTable';
import { UserFilters } from './UserFilters';
import { UserModal } from './UserModal';
import { useUsers } from '../../../hook/useUsers';

export const Users: React.FC = () => {
    const {
        users,
        statusOptions,
        loading,
        searchTerm,
        selectedStatus,
        isCreateModalOpen,
        editingUser,
        formData,
        pagination,
        setSearchTerm,
        setSelectedStatus,
        setIsCreateModalOpen,
        setEditingUser,
        setFormData,
        handleCreateUser,
        handleUpdateUser,
        handleChangeStatus,
        resetForm,
        openEditModal,
        handlePageChange,
        handleSearch
    } = useUsers();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-black">Users</h1>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                </Button>
            </div>

            <Card>
                <UserFilters
                    searchTerm={searchTerm}
                    selectedStatus={selectedStatus}
                    statusOptions={statusOptions}
                    onSearchTermChange={setSearchTerm}
                    onStatusChange={setSelectedStatus}
                    onSearch={handleSearch}
                />

                <UserTable
                    users={users}
                    loading={loading}
                    pagination={pagination}
                    onEditUser={openEditModal}
                    onChangeStatus={handleChangeStatus}
                    onPageChange={handlePageChange}
                />
            </Card>

            <UserModal
                isOpen={isCreateModalOpen || !!editingUser}
                editingUser={editingUser}
                formData={formData}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingUser(null);
                    resetForm();
                }}
                onFormDataChange={setFormData}
                onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            />
        </div>
    );
};
