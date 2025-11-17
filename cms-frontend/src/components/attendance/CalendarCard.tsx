import { Card } from '../UI/Card';
import Calendar, { CalendarProps } from 'react-calendar';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

interface CalendarCardProps {
    value: any;
    selectedMonth: number;
    selectedYear: number;
    isLoading: boolean;
    attendanceHistory: any;
    onTileClick: (value: any) => void;
    onActiveStartDateChange: ({ activeStartDate }: { activeStartDate: Date | null }) => void;
    getAttendanceData: (date: Date) => any;
}

const getCurrentMonthYear = (month: number, year: number): string => {
    return new Date(year, month - 1).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric'
    });
};

export const CalendarCard = ({
    value,
    selectedMonth,
    selectedYear,
    isLoading,
    onTileClick,
    onActiveStartDateChange,
    getAttendanceData
}: CalendarCardProps) => {
    const tileContent: CalendarProps['tileContent'] = ({ date, view }) => {
        if (view !== 'month') return null;
        const attendanceData = getAttendanceData(date);
        if (!attendanceData) return null;

        let statusColor = '';
        let statusText = '';

        if (attendanceData.status === 'holiday') {
            statusColor = 'bg-red-500';
            statusText = 'Libur';
        } else if (attendanceData.status === 'weekend' && date.getDay() === 0) {
            statusColor = 'bg-red-400';
            statusText = 'Weekend';
        } else if (attendanceData.status === 'present') {
            statusColor = 'bg-green-500';
            statusText = 'Hadir';
        } else {
            statusColor = 'bg-gray-300';
            statusText = 'Absen';
        }

        return (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                <div className={`w-2 h-2 rounded-full ${statusColor} shadow-sm`} title={statusText} />
            </div>
        );
    };

    const tileClassName: CalendarProps['tileClassName'] = ({ date, view }) => {
        if (view !== 'month') return '';
        const attendanceData = getAttendanceData(date);
        const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
        const isToday = date.toDateString() === today.toDateString();

        let className = 'relative cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md text-sm md:text-base';
        if (isToday) className += ' bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 shadow-lg';

        if (attendanceData) {
            if (attendanceData.status === 'holiday') {
                className += ' text-red-600 font-semibold bg-red-50';
            } else if (attendanceData.status === 'weekend' && date.getDay() === 0) {
                className += ' text-red-600 font-semibold bg-red-50';
            } else if (attendanceData.status === 'present') {
                className += ' text-green-600 bg-green-50';
            }
        }

        return className;
    };

    return (
        <Card className="rounded-2xl shadow-lg border-0 bg-white h-full">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <CalendarIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Kalender Absensi</h3>
                            <p className="text-gray-600">{getCurrentMonthYear(selectedMonth, selectedYear)}</p>
                        </div>
                    </div>
                    {isLoading && (
                        <div className="flex items-center text-blue-600">
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            <span className="text-sm font-medium">Memuat...</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-center">
                    <div className="w-full">
                        <Calendar
                            onChange={onTileClick}
                            onActiveStartDateChange={onActiveStartDateChange}
                            value={value}
                            tileContent={tileContent}
                            tileClassName={tileClassName}
                            locale="id-ID"
                            className="w-full h-auto text-lg custom-calendar"
                            showNeighboringMonth={true}
                        />
                    </div>
                </div>

                <div className="text-center mt-6 mb-4">
                    <p className="text-sm text-gray-500 font-medium">
                        💡 Klik pada tanggal untuk melihat detail absensi
                    </p>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 justify-center">
                    <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                        <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                        <span className="text-sm font-medium text-gray-700">Hadir</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                        <div className="w-3 h-3 bg-gray-300 rounded-full shadow-sm"></div>
                        <span className="text-sm font-medium text-gray-700">Absen</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                        <div className="w-3 h-3 border-2 border-blue-500 bg-blue-50 rounded-full shadow-sm"></div>
                        <span className="text-sm font-medium text-gray-700">Hari Ini</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};
