import React from 'react';
import { Position, PositionFormData } from '../../../types'
import { Modal } from '../../../components/UI/Modal';
import { Button } from '../../../components/UI/Button';

interface PositionModalProps {
    isOpen: boolean;
    editingPosition: Position | null;
    formData: PositionFormData;
    onClose: () => void;
    onFormDataChange: (data: PositionFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
}


export const PositionModal: React.FC<PositionModalProps> = ({
    isOpen,
    editingPosition,
    formData,
    onClose,
    onFormDataChange,
    onSubmit
}) => {

    const handleModalClose = () => {
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(e);
    };

    // Jika modal tidak terbuka, jangan render apa-apa
    if (!isOpen) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleModalClose}
            title={editingPosition ? 'Edit Position' : 'Create New Position'}
            size="lg"
            disableBackdropClick={true}
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-black mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormDataChange({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg  focus:border-transparent"
                        placeholder='Enter Name'
                        required
                    />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleModalClose}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">
                        {editingPosition ? 'Update' : 'Create'} Position
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
