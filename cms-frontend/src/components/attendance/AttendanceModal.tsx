import { Button } from '../UI/Button';
import { X, Clock as ClockIcon, CalendarDays } from 'lucide-react';
import { formatTimeFromString } from '../../utils/dateFormatter';

interface AttendanceModalProps {
    showDetail: boolean;
    selectedAttendance: any;
    onClose: () => void;
}

const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const AttendanceModal = ({ showDetail, selectedAttendance, onClose }: AttendanceModalProps) => {
    if (!showDetail || !selectedAttendance) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <CalendarDays className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Detail Absensi</h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-600 font-medium mb-1">Tanggal</p>
                        <p className="text-lg font-bold text-gray-900">
                            {formatDisplayDate(selectedAttendance.date)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                            <div className="p-2 bg-white rounded-lg w-12 h-12 mx-auto mb-3 shadow-sm">
                                <ClockIcon className="h-6 w-6 text-blue-600 mx-auto" />
                            </div>
                            <p className="text-sm text-blue-700 font-medium mb-1">Masuk</p>
                            <p className="text-xl font-bold text-gray-900">
                                {selectedAttendance.clockIn
                                    ? formatTimeFromString(selectedAttendance.clockIn)
                                    : '-'
                                }
                            </p>
                        </div>

                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm">
                            <div className="p-2 bg-white rounded-lg w-12 h-12 mx-auto mb-3 shadow-sm">
                                <ClockIcon className="h-6 w-6 text-green-600 mx-auto" />
                            </div>
                            <p className="text-sm text-green-700 font-medium mb-1">Pulang</p>
                            <p className="text-xl font-bold text-gray-900">
                                {selectedAttendance.clockOut
                                    ? formatTimeFromString(selectedAttendance.clockOut)
                                    : '-'
                                }
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600 font-medium mb-2 text-center">Status Kehadiran</p>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mx-auto ${
                            selectedAttendance.status === 'present'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                                : selectedAttendance.status === 'holiday'
                                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                                : selectedAttendance.status === 'weekend'
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                : 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg'
                        }`}>
                            {selectedAttendance.status === 'present' && '✓ Hadir'}
                            {selectedAttendance.status === 'absent' && '✗ Absen'}
                            {selectedAttendance.status === 'holiday' && '🎉 Libur'}
                            {selectedAttendance.status === 'weekend' && '🏖️ Weekend'}
                        </div>
                    </div>

                    {selectedAttendance.holidayName && (
                        <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                            <p className="text-sm text-yellow-700 font-medium mb-1 text-center">Keterangan Libur</p>
                            <p className="text-sm font-semibold text-yellow-800 text-center">
                                {selectedAttendance.holidayName}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={onClose}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        Tutup Detail
                    </Button>
                </div>
            </div>
        </div>
    );
};
