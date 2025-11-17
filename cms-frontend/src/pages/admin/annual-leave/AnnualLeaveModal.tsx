import React, { useState } from 'react';
import { AnnualLeave, AnnualLeaveFormData } from '../../../types';
import { Modal } from '../../../components/UI/Modal';
import { Button } from '../../../components/UI/Button';

interface AnnualLeaveModalProps {
    isOpen: boolean;
    editingAnnualLeave: AnnualLeave | null;
    formData: AnnualLeaveFormData;
    users: any[];
    usersLoading: boolean;
    onClose: () => void;
    onFormDataChange: (data: AnnualLeaveFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const AnnualLeaveModal: React.FC<AnnualLeaveModalProps> = ({
    isOpen,
    editingAnnualLeave,
    formData,
    users,
    usersLoading,
    onClose,
    onFormDataChange,
    onSubmit
}) => {
    const [errors, setErrors] = useState<{ totalDays?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi
        if (formData.totalDays > 12) {
            setErrors({ totalDays: 'Total days cannot exceed 12 days' });
            return;
        }

        // Reset errors dan submit
        setErrors({});
        onSubmit(e);
    };

    const handleTotalDaysChange = (value: number) => {
        // Reset error ketika user mulai mengubah nilai
        if (errors.totalDays) {
            setErrors({});
        }
        onFormDataChange({ ...formData, totalDays: value });
    };

    // Hanya tahun ini saja
    const currentYear = new Date().getFullYear();

    // Cari user yang sedang dipilih untuk ditampilkan namanya saat edit
    const selectedUser = users.find(user => user._id === formData.user);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingAnnualLeave ? 'Edit Annual Leave' : 'Create New Annual Leave'}
            size="md"
            disableBackdropClick={true}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Employee Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-black mb-2">
                        Employee
                    </label>
                    {editingAnnualLeave ? (
                        // Tampilkan info user saja saat edit (readonly)
                        <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                            <div className="text-gray-900 font-medium">
                                {selectedUser ? `${selectedUser.name} (${selectedUser.email})` : 'Loading...'}
                            </div>
                        </div>
                    ) : usersLoading ? (
                        // Loading state untuk create
                        <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                            <div className="text-gray-500">Loading employees...</div>
                        </div>
                    ) : (
                        // Dropdown untuk create
                        <select
                            value={formData.user}
                            onChange={(e) => onFormDataChange({ ...formData, user: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                            required
                        >
                            <option value="">Select Employee</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Year Selection - HANYA TAHUN INI */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-black mb-2">
                        Year
                    </label>
                    <select
                        value={formData.year}
                        onChange={(e) => onFormDataChange({ ...formData, year: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent bg-gray-50"
                        required
                        disabled={!!editingAnnualLeave}
                    >
                        <option value={currentYear}>{currentYear}</option>
                    </select>
                    {editingAnnualLeave && (
                        <p className="text-xs text-gray-500 mt-1">
                            Year cannot be changed when editing
                        </p>
                    )}
                </div>

                {/* Total Days */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-black mb-2">
                        Total Days
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="12"
                        value={formData.totalDays}
                        onChange={(e) => handleTotalDaysChange(parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg focus:border-transparent ${errors.totalDays
                                ? 'border-red-300 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        required
                    />
                    {errors.totalDays && (
                        <p className="text-red-600 text-xs mt-1">{errors.totalDays}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                        Maximum 12 days allowed
                    </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">
                        {editingAnnualLeave ? 'Update' : 'Create'} Annual Leave
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
