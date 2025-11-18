import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Users, Clock, MapPin, RefreshCw, Building2, Home, Stethoscope } from 'lucide-react';
import { AttendanceRecord } from '../../types';

interface StaffListCardProps {
    todayAttendances: AttendanceRecord[];
    isLoading: boolean;
    onRefresh: () => void;
}

export const StaffListCard = ({ todayAttendances, isLoading, onRefresh }: StaffListCardProps) => {
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'onsite': return 'bg-blue-100 text-blue-800';
            case 'hybrid': return 'bg-purple-100 text-purple-800';
            case 'sick': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'onsite': return <Building2 className="h-3 w-3" />;
            case 'hybrid': return <Home className="h-3 w-3" />;
            case 'sick': return <Stethoscope className="h-3 w-3" />;
            default: return '❓';
        }
    };

    // Helper function untuk mendapatkan nama position
    const getPositionName = (position: any): string => {
        if (!position) return 'Staff';
        if (typeof position === 'string') return position;
        if (typeof position === 'object' && position.name) return position.name;
        return 'Staff';
    };

    // Filter hanya record hari ini
    const todayRecords = todayAttendances.filter(attendance => {
        const recordDate = new Date(attendance.createdAt).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        return recordDate === today;
    });

    // Hitung statistik
    const onsiteCount = todayRecords.filter(a => a.attendance_type === 'onsite').length;
    const hybridCount = todayRecords.filter(a => a.attendance_type === 'hybrid').length;
    const sickCount = todayRecords.filter(a => a.attendance_type === 'sick').length;
    const totalUsers = new Set(todayRecords.map(a => a.user?._id).filter(Boolean)).size;
    return (
        <Card className="rounded-2xl shadow-lg border-0 bg-white h-full">
            <div className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Status Staff Hari Ini</h3>
                            <p className="text-gray-600 text-sm">
                                {new Date().toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                })}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {todayRecords.length > 0 ? (
                        todayRecords.map((attendance, index) => (
                            <div key={`${attendance._id}-${index}`} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                            {attendance.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm truncate">
                                                {attendance.user?.name || 'Unknown User'}
                                            </p>
                                            <p className="text-xs text-gray-600 truncate">
                                                {getPositionName(attendance.user?.position)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getTypeColor(attendance.attendance_type)}`}>
                                        {getTypeIcon(attendance.attendance_type)}
                                        <span className="capitalize">{attendance.attendance_type}</span>
                                    </span>
                                </div>

                                {attendance.type === 'sick_leave' ? (
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <Stethoscope className="h-3 w-3 text-orange-600" />
                                            <span className="text-xs text-gray-700 truncate">
                                                {attendance.sick_leave?.description || 'Izin sakit'}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-3 w-3 text-orange-600" />
                                            <span className="text-xs text-gray-700">
                                                {formatTime(attendance.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-3 w-3 text-blue-600" />
                                            <span className="text-xs text-gray-700">
                                                {formatTime(attendance.createdAt)} - {attendance.type === 'clock_in' ? 'Masuk' : 'Pulang'}
                                            </span>
                                        </div>
                                        {attendance.location && (
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="h-3 w-3 text-green-600" />
                                                <span className="text-xs text-gray-700 truncate">
                                                    {attendance.location.address || 'Lokasi tidak diketahui'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6">
                            <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">Belum ada aktivitas staff hari ini</p>
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-4 gap-2 text-center">
                        <div>
                            <p className="text-lg font-bold text-blue-600">{onsiteCount}</p>
                            <p className="text-xs text-gray-600">Onsite</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-purple-600">{hybridCount}</p>
                            <p className="text-xs text-gray-600">Hybrid</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-orange-600">{sickCount}</p>
                            <p className="text-xs text-gray-600">Sick</p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-green-600">{totalUsers}</p>
                            <p className="text-xs text-gray-600">Total Staff</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
