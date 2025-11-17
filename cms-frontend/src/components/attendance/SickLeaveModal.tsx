import { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { Calendar, FileText } from 'lucide-react';

interface SickLeaveModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    isLoading: boolean;
}

export const SickLeaveModal = ({ show, onClose, onSubmit, isLoading }: SickLeaveModalProps) => {
    const [formData, setFormData] = useState({
        description: '',
        start_date: '',
        end_date: '',
        medical_certificate: null as File | null
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            setFormData({ description: '', start_date: '', end_date: '', medical_certificate: null });
            onClose();
        } catch (error) {
            // Error sudah dihandle di parent
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, medical_certificate: file }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <Modal
            isOpen={show}
            onClose={onClose}
            title="Izin Sakit"
            size="md"
            disableBackdropClick={isLoading} // Prevent closing when loading
        >
            <div className="p-6">
                {/* Informasi tambahan di bawah title */}
                <div className="flex items-center space-x-2 mb-6">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <p className="text-gray-600 text-sm">Ajukan izin sakit dengan mengisi form berikut</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi Sakit *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Jelaskan gejala sakit Anda..."
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Mulai *
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                min={today}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tanggal Selesai
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                min={formData.start_date || today}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Surat Dokter (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="hidden"
                                id="medical_certificate"
                            />
                            <label htmlFor="medical_certificate" className="cursor-pointer">
                                <span className="text-blue-600 hover:text-blue-700 font-medium">
                                    Pilih file
                                </span>
                                <span className="text-gray-500 text-sm block">
                                    JPG, PNG, PDF (maks. 5MB)
                                </span>
                            </label>
                            {formData.medical_certificate && (
                                <p className="text-sm text-green-600 mt-2">
                                    {formData.medical_certificate.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-orange-600 hover:bg-orange-700"
                        >
                            {isLoading ? 'Mengajukan...' : 'Ajukan Izin'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
