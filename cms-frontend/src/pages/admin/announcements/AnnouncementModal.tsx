import React from 'react';
import { Announcement, AnnouncementStatus, AnnouncementFormData } from '../../../types'
import { Modal } from '../../../components/UI/Modal';
import { Button } from '../../../components/UI/Button';

interface AnnouncementModalProps {
    isOpen: boolean;
    editingAnnouncement: Announcement | null;
    formData: AnnouncementFormData;
    statusOptions: AnnouncementStatus[];
    onClose: () => void;
    onFormDataChange: (data: AnnouncementFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
    isOpen,
    editingAnnouncement,
    formData,
    statusOptions,
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

    if (!isOpen) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleModalClose}
            title={editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            size="lg"
            disableBackdropClick={true}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-black mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onFormDataChange({ ...formData, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                        placeholder="Enter announcement title"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 text-black mb-2">
                        Content
                    </label>
                    <textarea
                        value={formData.body}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            onFormDataChange({ ...formData, body: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                        placeholder="Enter announcement content"
                        rows={6}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 text-black mb-2">
                        Status
                    </label>
                    <select
                        value={formData.statusId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            onFormDataChange({ ...formData, statusId: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                        required
                    >
                        <option value="">Select Status</option>
                        {statusOptions.map((status) => (
                            <option key={status._id} value={status._id}>
                                {status.name}
                            </option>
                        ))}
                    </select>
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
                        {editingAnnouncement ? 'Update' : 'Create'} Announcement
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
