import React, { useState, useEffect, useCallback } from 'react';
import { User, Position, UserFormData } from '../../../types'
import { Modal } from '../../../components/UI/Modal';
import { Button } from '../../../components/UI/Button';
import Select from 'react-select';
import api from '../../../services/api';

interface UserModalProps {
    isOpen: boolean;
    editingUser: User | null;
    formData: UserFormData;
    onClose: () => void;
    onFormDataChange: (data: UserFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
}

// Define option types for react-select
interface PositionOption {
    value: string;
    label: string;
}

export const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    editingUser,
    formData,
    onClose,
    onFormDataChange,
    onSubmit
}) => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [positionOptions, setPositionOptions] = useState<PositionOption[]>([]);
    const [positionLoading, setPositionLoading] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<PositionOption | null>(null);

    // Load positions from API
    const loadPositions = useCallback(async () => {
        try {
            setPositionLoading(true);
            const response = await api.get('/positions', {
                params: {
                    page: 1,
                    size: 100,
                    status: '68e4d5b1a2bc9ad871460e48'
                }
            });
            const positionsData = response.data.data || [];
            setPositions(positionsData);

            // Convert positions to options for react-select
            const options = positionsData.map((position: Position) => ({
                value: position._id,
                label: `${position.name}`
            }));
            setPositionOptions(options);
        } catch (error) {
            console.error('Failed to load positions:', error);
            setPositions([]);
            setPositionOptions([]);
        } finally {
            setPositionLoading(false);
        }
    }, []);

    // Set selected position when formData or positions change
    useEffect(() => {
        if (formData.position && positions.length > 0) {
            const position = positions.find(p => p._id === formData.position);
            if (position) {
                setSelectedPosition({
                    value: position._id,
                    label: `${position.name}`
                });
            }
        } else {
            setSelectedPosition(null);
        }
    }, [formData.position, positions]);

    // Load positions when modal opens
    useEffect(() => {
        if (isOpen) {
            loadPositions();
        }
    }, [isOpen, loadPositions]);

    const handlePositionChange = (selectedOption: PositionOption | null) => {
        setSelectedPosition(selectedOption);
        onFormDataChange({
            ...formData,
            position: selectedOption ? selectedOption.value : ''
        });
    };

    const handleModalClose = () => {
        setSelectedPosition(null);
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
            title={editingUser ? 'Edit User' : 'Create New User'}
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
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-black mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormDataChange({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg  focus:border-transparent"
                        placeholder='Enter Email'
                        required
                    />
                </div>
                {!editingUser && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 text-black mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormDataChange({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg  focus:border-transparent"
                            required
                            placeholder="Enter password"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-black mb-2">
                        Role
                    </label>
                    <select
                        value={formData.role}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFormDataChange({ ...formData, role: e.target.value as 'admin' | 'manager' | 'staff' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg  focus:border-transparent"
                    >
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* React-Select Position */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-black mb-2">
                        Position
                    </label>
                    {positionLoading ? (
                        <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                            <div className="text-gray-500">Loading positions...</div>
                        </div>
                    ) : (
                        <div className='relative'>
                            <Select
                                value={selectedPosition}
                                onChange={handlePositionChange}
                                options={positionOptions}
                                isClearable
                                placeholder="Select a position"
                                className="react-select-container absolute mb-10"
                                classNamePrefix="react-select"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '44px',
                                        borderColor: '#d1d5db',
                                        '&:hover': {
                                            borderColor: '#d1d5db'
                                        }
                                    })
                                }}
                            />
                        </div>
                    )}
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
                        {editingUser ? 'Update' : 'Create'} User
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
