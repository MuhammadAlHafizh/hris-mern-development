import { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { CheckCircle, Navigation, XCircle, MapPin, Calendar, FileText, Stethoscope, Building2, Home } from 'lucide-react';
import { formatTimeFromString } from '../../utils/dateFormatter';
import { SickLeaveModal } from './SickLeaveModal';

interface ActionCardProps {
    todayStatus: any;
    isLoading: boolean;
    isTodayHoliday: boolean;
    isTodayWeekend: boolean;
    location: any;
    locationError: string | null;
    onClockIn: (type: "onsite" | "hybrid") => void;
    onClockOut: () => void;
    onSickLeave: (data: any) => Promise<void>;
}

export const ActionCard = ({
    todayStatus,
    isLoading,
    isTodayHoliday,
    isTodayWeekend,
    location,
    locationError,
    onClockIn,
    onClockOut,
    onSickLeave
}: ActionCardProps) => {
    const [showSickLeaveModal, setShowSickLeaveModal] = useState(false);
    const [clockInType, setClockInType] = useState<"onsite" | "hybrid">("onsite");

    const canClockIn = !todayStatus?.hasClockedIn && !todayStatus?.isSickLeave;
    const canClockOut = todayStatus?.hasClockedIn && !todayStatus?.hasClockedOut && !todayStatus?.isSickLeave;
    const canSickLeave = !todayStatus?.hasClockedIn && !todayStatus?.isSickLeave;

    const getStatusColor = () => {
        if (todayStatus?.isSickLeave) return 'bg-orange-100 border-orange-200 text-orange-800';
        if (todayStatus?.hasClockedIn) return 'bg-green-100 border-green-200 text-green-800';
        return 'bg-gray-100 border-gray-200 text-gray-800';
    };

    const getStatusText = () => {
        if (todayStatus?.isSickLeave) return 'Izin Sakit';
        if (todayStatus?.hasClockedIn && todayStatus?.hasClockedOut) return 'Absensi Selesai';
        if (todayStatus?.hasClockedIn) return 'Sudah Clock In';
        return 'Belum Absen';
    };

    const getAttendanceType = () => {
        if (todayStatus?.isSickLeave) return 'Sick Leave';
        return todayStatus?.clockIn?.attendance_type === 'hybrid' ? 'Hybrid Work' : 'Onsite Work';
    };

    const handleClockIn = () => {
        onClockIn(clockInType);
    };

    return (
        <>
            <Card className="rounded-2xl shadow-lg border-0 bg-white">
                <div className="p-6">
                    {/* Status Badge */}
                    <div className={`flex items-center justify-between p-3 rounded-xl border mb-4 ${getStatusColor()}`}>
                        <div>
                            <p className="font-semibold">{getStatusText()}</p>
                            <p className="text-sm opacity-80">{getAttendanceType()}</p>
                        </div>
                        {todayStatus?.isSickLeave && <Stethoscope className="h-5 w-5" />}
                        {todayStatus?.hasClockedIn && !todayStatus?.isSickLeave && (
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                    </div>

                    {/* Clock In Options */}
                    {canClockIn && !isTodayHoliday && !isTodayWeekend && (
                        <div className="space-y-4 mb-4">
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setClockInType("onsite")}
                                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                                        clockInType === "onsite"
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                    }`}
                                >
                                    <Building2 className="h-6 w-6 mx-auto mb-2" />
                                    <span className="text-sm font-medium">Onsite</span>
                                </button>
                                <button
                                    onClick={() => setClockInType("hybrid")}
                                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                                        clockInType === "hybrid"
                                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                    }`}
                                >
                                    <Home className="h-6 w-6 mx-auto mb-2" />
                                    <span className="text-sm font-medium">Hybrid</span>
                                </button>
                            </div>

                            <Button
                                onClick={handleClockIn}
                                disabled={isLoading}
                                className={`w-full py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-105 ${
                                    clockInType === "onsite"
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                                } text-white`}
                            >
                                {isLoading ? (
                                    <>
                                        <Navigation className="h-5 w-5 mr-2 animate-spin" />
                                        Mendapatkan Lokasi...
                                    </>
                                ) : (
                                    `🟢 Clock In ${clockInType === "onsite" ? "Onsite" : "Hybrid"}`
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Clock Out */}
                    {canClockOut && (
                        <div className="space-y-4 mb-4">
                            <div className="text-center">
                                <p className="text-gray-600 text-sm mb-2">
                                    Anda clock in pada <span className="font-semibold text-green-600">
                                        {todayStatus.clockIn && formatTimeFromString(todayStatus.clockIn.time)}
                                    </span>
                                </p>
                                <Button
                                    onClick={onClockOut}
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                                >
                                    {isLoading ? (
                                        <>
                                            <Navigation className="h-5 w-5 mr-2 animate-spin" />
                                            Mendapatkan Lokasi...
                                        </>
                                    ) : (
                                        '🔴 Clock Out'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Completed Attendance */}
                    {todayStatus?.hasClockedIn && todayStatus?.hasClockedOut && (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl">
                                    <CheckCircle className="h-12 w-12 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Absensi Selesai</h3>
                            <p className="text-gray-600 text-sm">Anda telah menyelesaikan absensi hari ini</p>
                            <div className="space-y-3 text-sm bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Clock In:</span>
                                    <span className="font-semibold text-green-600">
                                        {todayStatus.clockIn && formatTimeFromString(todayStatus.clockIn.time)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Clock Out:</span>
                                    <span className="font-semibold text-green-600">
                                        {todayStatus.clockOut && formatTimeFromString(todayStatus.clockOut.time)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Tipe:</span>
                                    <span className="font-semibold text-blue-600">
                                        {todayStatus.clockIn?.attendance_type === 'hybrid' ? 'Hybrid Work' : 'Onsite Work'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sick Leave Status */}
                    {todayStatus?.isSickLeave && (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="p-4 bg-gradient-to-br from-orange-100 to-amber-200 rounded-2xl">
                                    <Stethoscope className="h-12 w-12 text-orange-600" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Izin Sakit</h3>
                            <p className="text-gray-600 text-sm mb-2">{todayStatus.sickLeave?.description}</p>
                            <div className="space-y-2 text-sm bg-orange-50 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Tanggal Mulai:</span>
                                    <span className="font-semibold text-orange-600">
                                        {todayStatus.sickLeave && new Date(todayStatus.sickLeave.start_date).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                                {todayStatus.sickLeave?.end_date && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Tanggal Selesai:</span>
                                        <span className="font-semibold text-orange-600">
                                            {new Date(todayStatus.sickLeave.end_date).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Sick Leave Button */}
                    {canSickLeave && !isTodayHoliday && !isTodayWeekend && (
                        <Button
                            onClick={() => setShowSickLeaveModal(true)}
                            disabled={isLoading}
                            variant="outline"
                            className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 py-3 rounded-xl font-semibold transition-all duration-200"
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Izin Sakit
                        </Button>
                    )}

                    {/* Holiday/Weekend Message */}
                    {(isTodayHoliday || isTodayWeekend) && (
                        <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <Calendar className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                            <p className="text-yellow-800 font-medium">
                                {isTodayHoliday ? 'Hari Libur' : 'Weekend'}
                            </p>
                            <p className="text-yellow-600 text-sm mt-1">
                                Tidak perlu melakukan absensi hari ini
                            </p>
                        </div>
                    )}

                    {/* Location Info */}
                    {locationError && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <div className="flex items-center text-red-800">
                                <XCircle className="h-5 w-5 mr-2" />
                                <span className="text-sm font-medium">{locationError}</span>
                            </div>
                        </div>
                    )}

                    {location && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <div className="flex items-center text-blue-800">
                                <MapPin className="h-5 w-5 mr-2" />
                                <span className="text-sm font-medium">Lokasi: {location.address}</span>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Sick Leave Modal */}
            <SickLeaveModal
                show={showSickLeaveModal}
                onClose={() => setShowSickLeaveModal(false)}
                onSubmit={onSickLeave}
                isLoading={isLoading}
            />
        </>
    );
};
