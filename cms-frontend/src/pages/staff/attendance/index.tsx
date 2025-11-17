import { useState, useEffect } from 'react';
import { RefreshCw, Building2 } from 'lucide-react';
import { Button } from '../../../components/UI/Button';
import { useAttendance } from '../../../hook/useAttendance';
import { AttendanceModal } from '../../../components/attendance/AttendanceModal';
import { TimeCard } from '../../../components/attendance/TimeCard';
import { ActionCard } from '../../../components/attendance/ActionCard';
import { StatsCard } from '../../../components/attendance/StatsCard';
import { CalendarCard } from '../../../components/attendance/CalendarCard';
import '../../../components/attendance/calendarStyles.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const StaffAttendance = () => {
    const {
        todayStatus,
        attendanceHistory,
        isLoading,
        location,
        locationError,
        handleClockIn,
        handleClockOut,
        handleSickLeave,
        loadAttendanceHistory,
        refreshAllData,
    } = useAttendance();

    const [currentTime, setCurrentTime] = useState(new Date());
    const [value, setValue] = useState<Value>(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [showDetail, setShowDetail] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState<any>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            const jakartaTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
            setCurrentTime(jakartaTime);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Load initial data
    useEffect(() => {
        refreshAllData();
    }, []);

    // Auto-load attendance history ketika month/year berubah
    useEffect(() => {
        loadAttendanceHistory(selectedYear, selectedMonth);
    }, [selectedMonth, selectedYear, loadAttendanceHistory]);

    const handleRefresh = () => {
        refreshAllData();
    };

    // Handler untuk activeStartDateChange (ketika user navigate calendar)
    const handleActiveStartDateChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {
        if (activeStartDate) {
            const newMonth = activeStartDate.getMonth() + 1;
            const newYear = activeStartDate.getFullYear();

            if (newMonth !== selectedMonth || newYear !== selectedYear) {
                setSelectedMonth(newMonth);
                setSelectedYear(newYear);
            }
        }
    };

    const handleTileClick = (value: Value) => {
        if (value instanceof Date) {
            const attendanceData = getAttendanceData(value);
            if (attendanceData) {
                setSelectedAttendance(attendanceData);
                setShowDetail(true);
            }
        }
    };

    const getTodayData = () => {
        const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
        const todayString = today.toISOString().split('T')[0];
        return attendanceHistory?.attendance.find((day: any) => day.date === todayString);
    };

    const isTodayHoliday = (): boolean => {
        const todayData = getTodayData();
        return todayData?.status === 'holiday' || false;
    };

    const isTodayWeekend = (): boolean => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
    };

    const getTodayStatusMessage = (): string | null => {
        const todayData = getTodayData();
        if (todayData?.status === 'holiday') {
            return `Libur: ${todayData?.holidayName || ''}`;
        } else if (isTodayWeekend()) {
            return 'Weekend';
        }
        return null;
    };

    const getAttendanceData = (date: Date) => {
        if (!attendanceHistory?.attendance) return undefined;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        return attendanceHistory.attendance.find((day: any) => day.date === dateString);
    };

    // Button untuk kembali ke bulan saat ini
    const handleBackToCurrentMonth = () => {
        const now = new Date();
        setSelectedMonth(now.getMonth() + 1);
        setSelectedYear(now.getFullYear());
        setValue(now);
    };

    // Hitung statistik kehadiran
    const getAttendanceStats = () => {
        if (!attendanceHistory?.attendance) return { present: 0, absent: 0, sick: 0, total: 0 };

        const present = attendanceHistory.attendance.filter((day: any) => day.status === 'present').length;
        const absent = attendanceHistory.attendance.filter((day: any) => day.status === 'absent').length;
        const sick = attendanceHistory.attendance.filter((day: any) => day.status === 'sick').length;
        const total = attendanceHistory.attendance.length;

        return { present, absent, sick, total };
    };

    const stats = getAttendanceStats();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Attendance Detail Modal */}
            <AttendanceModal
                showDetail={showDetail}
                selectedAttendance={selectedAttendance}
                onClose={() => setShowDetail(false)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <Building2 className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Absensi Saya</h1>
                            <p className="text-gray-600 mt-1 text-lg">Rekam kehadiran harian Anda dengan mudah</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            onClick={handleBackToCurrentMonth}
                            disabled={isLoading}
                            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl font-medium shadow-sm transition-all duration-200"
                        >
                            📅 Bulan Ini
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl font-medium shadow-sm transition-all duration-200"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Time & Attendance Action */}
                    <div className="lg:col-span-1 space-y-6">
                        <TimeCard
                            currentTime={currentTime}
                            todayStatusMessage={getTodayStatusMessage()}
                        />

                        <ActionCard
                            todayStatus={todayStatus}
                            isLoading={isLoading}
                            isTodayHoliday={isTodayHoliday()}
                            isTodayWeekend={isTodayWeekend()}
                            location={location}
                            locationError={locationError}
                            onClockIn={handleClockIn}
                            onClockOut={handleClockOut}
                            onSickLeave={handleSickLeave}
                        />

                        <StatsCard
                            selectedMonth={selectedMonth}
                            selectedYear={selectedYear}
                            stats={stats}
                        />
                    </div>

                    {/* Right Column - Calendar */}
                    <div className="lg:col-span-2">
                        <CalendarCard
                            value={value}
                            selectedMonth={selectedMonth}
                            selectedYear={selectedYear}
                            isLoading={isLoading}
                            attendanceHistory={attendanceHistory}
                            onTileClick={handleTileClick}
                            onActiveStartDateChange={handleActiveStartDateChange}
                            getAttendanceData={getAttendanceData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
