import React from 'react';
import { Card } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import { Plus } from 'lucide-react';
import { AnnouncementTable } from './AnnouncementTable';
import { AnnouncementModal } from './AnnouncementModal';
import { AnnouncementFilters } from './AnnouncementFilters';
import { useAnnouncements } from '../../../hook/useAnnouncements';

export const Announcements: React.FC = () => {
    const {
        announcements,
        statuses,
        loading,
        searchTerm,
        selectedStatus,
        isCreateModalOpen,
        editingAnnouncement,
        formData,
        pagination,
        setSearchTerm,
        setSelectedStatus,
        setIsCreateModalOpen,
        setEditingAnnouncement,
        setFormData,
        handleCreateAnnouncement,
        handleUpdateAnnouncement,
        handleChangeStatus,
        resetForm,
        openEditModal,
        handlePageChange,
        handleSearch
    } = useAnnouncements();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Announcement
                </Button>
            </div>

            <Card>
                <AnnouncementFilters
                    searchTerm={searchTerm}
                    selectedStatus={selectedStatus}
                    statusOptions={statuses}
                    onSearchTermChange={setSearchTerm}
                    onStatusChange={setSelectedStatus}
                    onSearch={handleSearch}
                />

                <AnnouncementTable
                    announcements={announcements}
                    loading={loading}
                    statuses={statuses}
                    pagination={pagination}
                    onEditAnnouncement={openEditModal}
                    onChangeStatus={handleChangeStatus}
                    onPageChange={handlePageChange}
                />
            </Card>

            <AnnouncementModal
                isOpen={isCreateModalOpen || !!editingAnnouncement}
                editingAnnouncement={editingAnnouncement}
                formData={formData}
                statusOptions={statuses}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingAnnouncement(null);
                    resetForm();
                }}
                onFormDataChange={setFormData}
                onSubmit={editingAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement}
            />
        </div>
    );
};

export default Announcements;
