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



    const colorClasses: { [key: string]: string } = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        purple: 'bg-purple-500',
        red: 'bg-red-500'
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
        </div>
    );
};
