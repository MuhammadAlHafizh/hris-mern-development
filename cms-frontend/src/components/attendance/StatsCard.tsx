import { Card } from '../UI/Card';
import { User } from 'lucide-react';

interface StatsCardProps {
    selectedMonth: number;
    selectedYear: number;
    stats: {
        present: number;
        absent: number;
        total: number;
    };
}

const getCurrentMonthYear = (month: number, year: number): string => {
    return new Date(year, month - 1).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric'
    });
};

export const StatsCard = ({ selectedMonth, selectedYear, stats }: StatsCardProps) => {
    return (
        <Card className="rounded-2xl shadow-lg border-0 bg-white">
            <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                    Statistik {getCurrentMonthYear(selectedMonth, selectedYear)}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
                        <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                        <p className="text-xs text-green-700 font-medium">Hadir</p>
                    </div>
                    <div className="text-center p-3 bg-gray-100 rounded-xl border border-gray-300">
                        <p className="text-2xl font-bold text-gray-600">{stats.absent}</p>
                        <p className="text-xs text-gray-700 font-medium">Absen</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                        <p className="text-xs text-blue-700 font-medium">Total</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};
