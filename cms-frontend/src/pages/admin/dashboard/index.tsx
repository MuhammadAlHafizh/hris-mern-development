import React from 'react';
import {
    Users,
    Calendar,
    CheckCircle,
    TrendingUp
} from 'lucide-react';
import { Card } from '../../../components/UI/Card';
import { useAdminAttendance } from '../../../hook/useAdminAttendance';
import { useAdminLeave } from '../../../hook/useAdminLeave';

export const Dashboard: React.FC = () => {
    const { todayAttendances, isLoading: attendanceLoading } = useAdminAttendance();
    const { leaves, loading: leaveLoading } = useAdminLeave();

    // Hitung statistik dari data real
    const pendingLeaves = leaves.filter(leave => leave.status?.name === 'Pending').length;
    const approvedLeaves = leaves.filter(leave => leave.status?.name === 'Approved').length;

    // Hitung statistik absensi hari ini
    const totalEmployees = 10; // Ini bisa dari API users nanti

    // Filter untuk clock_in saja dan hitung yang sudah absen
    const clockInRecords = todayAttendances.filter(att => att.type === 'clock_in');
    const presentToday = clockInRecords.length;
    const attendancePercentage = totalEmployees > 0
        ? Math.round((presentToday / totalEmployees) * 100)
        : 0;

    const lateToday = clockInRecords.filter(att => {
        if (att.createdAt) {
            const checkInTime = new Date(att.createdAt);
            const hours = checkInTime.getHours();
            const minutes = checkInTime.getMinutes();
            // Anggap terlambat jika checkin setelah jam 9:00
            return hours > 9 || (hours === 9 && minutes > 0);
        }
        return false;
    }).length;

    const stats = [
        {
            name: 'Total Karyawan',
            value: totalEmployees.toString(),
            change: '+5%',
            changeType: 'positive' as const,
            icon: Users,
            color: 'blue',
            description: 'Aktif'
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
            name: 'Absensi Hari Ini',
            value: `${attendancePercentage}%`,
            change: '+3%',
            changeType: 'positive' as const,
            icon: CheckCircle,
            color: 'green',
            description: `${presentToday} hadir, ${lateToday} terlambat`
        },
        {
            name: 'Cuti Disetujui',
            value: approvedLeaves.toString(),
            change: approvedLeaves > 0 ? `+${approvedLeaves}` : '0',
            changeType: 'positive' as const,
            icon: TrendingUp,
            color: 'purple',
            description: 'Bulan ini'
        }
    ];

    // Data pengajuan cuti terbaru (5 terbaru)
    const recentLeaves = leaves
        .slice(0, 5)
        .map(leave => ({
            id: leave._id,
            name: leave.user?.name || 'Unknown User',
            date: `${new Date(leave.startDate).toLocaleDateString('id-ID')} - ${new Date(leave.endDate).toLocaleDateString('id-ID')}`,
            days: leave.days,
            type: 'Tahunan',
            status: leave.status?.name.toLowerCase() || 'pending',
        }));

    // Data absensi terkini dari hook

    // Ringkasan cuti bulan ini
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyLeaves = leaves.filter(leave => {
        const leaveDate = new Date(leave.startDate);
        return leaveDate.getMonth() === currentMonth && leaveDate.getFullYear() === currentYear;
    });

    // Filter status yang valid untuk leave
    const monthlyLeaveSummary = {
        total: monthlyLeaves.length,
        approved: monthlyLeaves.filter(leave => leave.status?.name === 'Approved').length,
        pending: monthlyLeaves.filter(leave => leave.status?.name === 'Pending').length,
        rejected: monthlyLeaves.filter(leave =>
            leave.status?.name === 'Cancelled' || leave.status?.name === 'Reverse'
        ).length
    };

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
        cancelled: 'bg-gray-100 text-gray-800',
        ontime: 'bg-green-100 text-green-800',
        late: 'bg-yellow-100 text-yellow-800',
        absent: 'bg-red-100 text-red-800'
    };

    const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            pending: 'Pending',
            approved: 'Disetujui',
            rejected: 'Ditolak',
            reverse: 'Reverse',
            cancelled: 'Dibatalkan',
            ontime: 'Tepat Waktu',
            late: 'Terlambat',
            absent: 'Tidak Absen'
        };
        return statusMap[status] || status;
    };

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
            <div>
                <h1 className="text-2xl font-bold text-black">Dashboard Admin</h1>
                <p className="mt-2 text-gray-600">
                    Ringkasan sistem absensi dan pengajuan cuti hari ini.
                </p>
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
                            <span className="text-sm text-gray-500 ml-1">
                                from last month
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pengajuan Cuti Terbaru */}
                <Card className="lg:col-span-2">
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
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <Calendar className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-black">
                                                {leave.name}
                                            </p>
                                        </div>
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
                                <p>Tidak ada pengajuan cuti</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Ringkasan Cuti Bulan Ini */}
                <Card>
                    <h3 className="text-lg font-medium text-black mb-4">
                        Ringkasan Cuti - {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Pengajuan</span>
                            <span className="text-sm font-medium text-black">{monthlyLeaveSummary.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Disetujui</span>
                            <span className="text-sm font-medium text-green-600">{monthlyLeaveSummary.approved}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Pending</span>
                            <span className="text-sm font-medium text-yellow-600">{monthlyLeaveSummary.pending}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Ditolak/Dibatalkan</span>
                            <span className="text-sm font-medium text-red-600">{monthlyLeaveSummary.rejected}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
