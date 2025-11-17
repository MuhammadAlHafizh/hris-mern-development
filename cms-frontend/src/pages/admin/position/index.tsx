import React from 'react';
import { Card } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import { Plus } from 'lucide-react';
import { PositionTable } from './PositionTable';
import { PositionFilters } from './PositionFilters';
import { PositionModal } from './PositionModal';
import { usePosition } from '../../../hook/usePosition';

export const Position: React.FC = () => {
    const {
        position, // Kembali ke position (singular)
        statusOptions,
        loading,
        searchTerm,
        selectedStatus,
        isCreateModalOpen,
        editingPosition,
        formData,
        pagination,
        setSearchTerm,
        setSelectedStatus,
        setIsCreateModalOpen,
        setEditingPosition,
        setFormData,
        handleCreatePosition,
        handleUpdatePosition,
        handleChangeStatus,
        resetForm,
        openEditModal,
        handlePageChange,
        handleSearch
    } = usePosition();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-black">Position</h1>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Position
                </Button>
            </div>

            <Card>
                <PositionFilters
                    searchTerm={searchTerm}
                    selectedStatus={selectedStatus}
                    statusOptions={statusOptions}
                    onSearchTermChange={setSearchTerm}
                    onStatusChange={setSelectedStatus}
                    onSearch={handleSearch}
                />

                <PositionTable
                    position={position} // Tetap position (singular)
                    loading={loading}
                    pagination={pagination}
                    onEditPosition={openEditModal}
                    onChangeStatus={handleChangeStatus}
                    onPageChange={handlePageChange}
                />
            </Card>

            <PositionModal
                isOpen={isCreateModalOpen || !!editingPosition}
                editingPosition={editingPosition}
                formData={formData}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingPosition(null);
                    resetForm();
                }}
                onFormDataChange={setFormData}
                onSubmit={editingPosition ? handleUpdatePosition : handleCreatePosition}
            />
        </div>
    );
};
