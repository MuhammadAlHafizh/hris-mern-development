import React, { useState } from 'react';
import { ApplyLeaveData } from '../../../types/index';
import { Modal } from '../../../components/UI/Modal';
import { Button } from '../../../components/UI/Button';

interface LeaveModalProps {
    isOpen: boolean;
    formData: ApplyLeaveData;
    onClose: () => void;
    onFormDataChange: (data: ApplyLeaveData) => void;
    onSubmit: (e: React.FormEvent) => void;
    title: string;
    submitText: string;
}

export const LeaveModal: React.FC<LeaveModalProps> = ({
    isOpen,
    formData,
    onClose,
    onFormDataChange,
    onSubmit,
    title,
    submitText
}) => {
    const [errors, setErrors] = useState<{ dateRange?: string }>({});

    const calculateDays = () => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }
        return 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi tanggal
        if (!formData.startDate || !formData.endDate) {
            setErrors({ dateRange: 'Tanggal mulai dan selesai harus diisi' });
            return;
        }

        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);

        if (end < start) {
            setErrors({ dateRange: 'Tanggal selesai tidak boleh sebelum tanggal mulai' });
            return;
        }

        // Validasi tidak bisa apply untuk tanggal yang sudah lewat (hanya untuk create)
        if (title === 'Ajukan Cuti') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (start < today) {
                setErrors({ dateRange: 'Tidak bisa mengajukan cuti untuk tanggal yang sudah lewat' });
                return;
            }
        }

        // Reset errors dan submit
        setErrors({});
        onSubmit(e);
    };

    const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
        // Reset error ketika user mulai mengubah nilai
        if (errors.dateRange) {
            setErrors({});
        }
        onFormDataChange({ ...formData, [field]: value });
    };

    const totalDays = calculateDays();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="md"
            disableBackdropClick={true}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tanggal Mulai */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-black mb-2">
                        Tanggal Mulai
                    </label>
                    <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleDateChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                        required
                        min={title === 'Ajukan Cuti' ? new Date().toISOString().split('T')[0] : undefined}
                    />
                </div>

                {/* Tanggal Selesai */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-black mb-2">
                        Tanggal Selesai
                    </label>
                    <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleDateChange('endDate', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:border-transparent ${
                            errors.dateRange ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        required
                        min={formData.startDate || (title === 'Ajukan Cuti' ? new Date().toISOString().split('T')[0] : undefined)}
                    />
                    {errors.dateRange && (
                        <p className="text-red-600 text-xs mt-1">{errors.dateRange}</p>
                    )}
                </div>

                {/* Total Hari */}
                <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 text-black mb-1">
                        Total Hari
                    </label>
                    <div className="text-lg font-semibold text-gray-900">
                        {totalDays} hari
                    </div>
                </div>

                {/* Alasan Cuti */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 text-black mb-2">
                        Alasan Cuti
                    </label>
                    <textarea
                        value={formData.reason}
                        onChange={(e) => onFormDataChange({ ...formData, reason: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                        placeholder="Masukkan alasan pengajuan cuti..."
                        required
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        disabled={!formData.startDate || !formData.endDate || !formData.reason}
                    >
                        {submitText}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
