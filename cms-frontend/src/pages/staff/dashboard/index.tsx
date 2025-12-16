import React from 'react';
import {
    Clock,
    Calendar,
    CheckCircle,
    TrendingUp,
    RefreshCw
} from 'lucide-react';
import { Card } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import { useAttendance } from '../../../hook/useAttendance';
import { useStaffLeave } from '../../../hook/useStaffLeave';

export const StaffDashboard: React.FC = () => {
    const {
        todayStatus,
        isLoading: attendanceLoading,
        refreshAllData
    } = useAttendance();

    const {
        leaves,
        leaveHistory,
        loading: leaveLoading
    } = useStaffLeave();

    // Hitung statistik cuti
    const pendingLeaves = leaves.filter(leave => leave.status?.name === 'Pending').length;
    const approvedLeaves = leaves.filter(leave => leave.status?.name === 'Approved').length;
    const totalLeaveDays = leaveHistory?.data?.summary?.totalDays || 0;
    const usedLeaveDays = leaveHistory?.data?.summary?.usedDays || 0;
    const remainingLeaveDays = leaveHistory?.data?.summary?.remainingDays || 0;

    // Check if user has clocked in today - perbaikan tipe data
    const hasClockedIn = todayStatus?.clockIn?.time;
    const clockInTime = todayStatus?.clockIn?.time;

    const stats = [
        {
            name: 'Status Hari Ini',
            value: hasClockedIn ? 'Sudah Absen' : 'Belum Absen',
            change: hasClockedIn ? '✅' : '⏰',
            changeType: hasClockedIn ? 'positive' as const : 'negative' as const,
            icon: Clock,
            color: hasClockedIn ? 'green' : 'yellow',
            description: hasClockedIn && clockInTime
                ? `Check-in: ${new Date(clockInTime).toLocaleTimeString('id-ID')}`
                : 'Silakan lakukan absen'
        },
        {
            name: 'Cuti Pending',
            value: pendingLeaves.toString(),
            change: pendingLeaves > 0 ? `+${pendingLeaves}` : '0',
            changeType: pendingLeaves > 0 ? 'negative' as const : 'positive' as const,
            icon: Calendar,
            color: 'yellow',
            description: 'Menunggu persetujuan'
        },
        {
            name: 'Cuti Disetujui',
            value: approvedLeaves.toString(),
            change: approvedLeaves > 0 ? `+${approvedLeaves}` : '0',
            changeType: 'positive' as const,
            icon: CheckCircle,
            color: 'green',
            description: 'Tahun ini'
        },
        {
            name: 'Sisa Cuti',
            value: remainingLeaveDays.toString(),
            change: `${usedLeaveDays}/${totalLeaveDays}`,
            changeType: 'positive' as const,
            icon: TrendingUp,
            color: 'blue',
            description: 'Hari tersedia'
        }
    ];

    // Data pengajuan cuti terbaru (3 terbaru)
    const recentLeaves = leaves
        .slice(0, 3)
        .map(leave => ({
            id: leave._id,
            date: `${new Date(leave.startDate).toLocaleDateString('id-ID')} - ${new Date(leave.endDate).toLocaleDateString('id-ID')}`,
            days: leave.days,
            status: leave.status?.name.toLowerCase() || 'pending',
            reason: leave.reason
        }));

    const colorClasses: { [key: string]: string } = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        purple: 'bg-purple-500',
        red: 'bg-red-500'
    };

    const statusColors: { [key: string]: string } = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        reverse: 'bg-orange-100 text-orange-800',
        cancelled: 'bg-gray-100 text-gray-800'
    };

    const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            pending: 'Pending',
            approved: 'Disetujui',
            rejected: 'Ditolak',
            reverse: 'Reverse',
            cancelled: 'Dibatalkan'
        };
        return statusMap[status] || status;
    };

    // Handler untuk tombol absen
    if (attendanceLoading || leaveLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat data dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-black">Dashboard Saya</h1>
                    <p className="mt-2 text-gray-600">
                        Ringkasan absensi dan cuti Anda hari ini.
                    </p>
                </div>
                <Button
                    onClick={refreshAllData}
                    variant="outline"
                    disabled={attendanceLoading}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${attendanceLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.name} className="relative overflow-hidden">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-gray-500">
                                    {stat.name}
                                </p>
                                <p className="text-2xl font-semibold text-black">
                                    {stat.value}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {stat.description}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className={`text-sm font-medium ${
                                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {stat.change}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Absensi Hari Ini */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-black">
                            Absensi Hari Ini
                        </h3>
                        <span className="text-sm text-gray-500">
                            {new Date().toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>

                    {/* <div className="space-y-4">
                        {hasClockedIn ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-green-800">Sudah Absen Masuk</p>
                                        <p className="text-sm text-green-600 mt-1">
                                            Waktu: {clockInTime ? new Date(clockInTime).toLocaleTimeString('id-ID') : '-'}
                                        </p>
                                        {todayStatus?.clockIn?.location && (
                                            <p className="text-xs text-green-500 mt-1">
                                                Lokasi: {typeof todayStatus.clockIn.location === 'string'
                                                    ? todayStatus.clockIn.location
                                                    : todayStatus.clockIn.location.address || 'Lokasi tercatat'}
                                            </p>
                                        )}
                                    </div>
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                </div>

                                {!hasClockedOut && canTakeAttendance() && (
                                    <Button
                                        onClick={handleClockOutClick}
                                        disabled={attendanceLoading}
                                        className="w-full mt-4 bg-green-600 hover:bg-green-700"
                                    >
                                        {attendanceLoading ? 'Memproses...' : 'Absen Pulang'}
                                    </Button>
                                )}

                                {hasClockedOut && (
                                    <div className="mt-3 p-3 bg-green-100 rounded border border-green-200">
                                        <p className="text-sm text-green-800">
                                            Sudah absen pulang: {clockOutTime ? new Date(clockOutTime).toLocaleTimeString('id-ID') : '-'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {canTakeAttendance() ? (
                                    <>
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-yellow-800">Belum Absen</p>
                                                    <p className="text-sm text-yellow-600 mt-1">
                                                        Silakan lakukan absen masuk
                                                    </p>
                                                    {locationError && (
                                                        <p className="text-xs text-red-500 mt-1">
                                                            {locationError}
                                                        </p>
                                                    )}
                                                </div>
                                                <Clock className="h-8 w-8 text-yellow-500" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                onClick={handleClockInClick}
                                                disabled={attendanceLoading}
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                {attendanceLoading ? 'Memproses...' : 'Absen Masuk'}
                                            </Button>
                                            <Button
                                                onClick={handleSickLeaveClick}
                                                disabled={attendanceLoading}
                                                variant="outline"
                                                className="border-red-300 text-red-700 hover:bg-red-50"
                                            >
                                                Izin Sakit
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-800">Hari Libur</p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Tidak perlu absen di hari weekend
                                                </p>
                                            </div>
                                            <Calendar className="h-8 w-8 text-gray-500" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div> */}
                </Card>

                {/* Pengajuan Cuti Terbaru */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-black">
                            Pengajuan Cuti Terbaru
                        </h3>
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                            Lihat Semua →
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recentLeaves.length > 0 ? (
                            recentLeaves.map((leave) => (
                                <div key={leave.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-black">
                                            {leave.date}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {leave.days} hari • {leave.reason}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[leave.status]}`}>
                                            {getStatusText(leave.status)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                <p>Belum ada pengajuan cuti</p>
                                <p className="text-sm mt-1">Ajukan cuti pertama Anda</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Info Cuti */}
                    {leaveHistory && leaveHistory.data && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-blue-800 mb-2">Info Kuota Cuti</h4>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <div className="text-lg font-bold text-blue-600">{totalLeaveDays}</div>
                                    <div className="text-xs text-blue-700">Total</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-orange-600">{usedLeaveDays}</div>
                                    <div className="text-xs text-orange-700">Terpakai</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-green-600">{remainingLeaveDays}</div>
                                    <div className="text-xs text-green-700">Sisa</div>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Ringkasan Cuti */}
            <Card>
                <h3 className="text-lg font-medium text-black mb-4">
                    Ringkasan Cuti {new Date().getFullYear()}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{totalLeaveDays}</div>
                        <div className="text-sm text-blue-700">Total Hari</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{approvedLeaves}</div>
                        <div className="text-sm text-green-700">Disetujui</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{pendingLeaves}</div>
                        <div className="text-sm text-yellow-700">Pending</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{usedLeaveDays}</div>
                        <div className="text-sm text-orange-700">Terpakai</div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
