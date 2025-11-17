import { Card } from '../UI/Card';
import { Clock } from 'lucide-react';
import { formatTime, formatDate } from '../../utils/dateFormatter';

interface TimeCardProps {
    currentTime: Date;
    todayStatusMessage: string | null;
}

export const TimeCard = ({ currentTime, todayStatusMessage }: TimeCardProps) => {
    return (
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-2xl border-0 overflow-hidden">
            <div className="p-6">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-blue-100 text-sm font-medium">Waktu Saat Ini</p>
                            <p className="text-3xl font-bold tracking-tight">{formatTime(currentTime)}</p>
                        </div>
                    </div>
                    <div className="bg-white bg-opacity-10 rounded-lg p-3">
                        <p className="text-blue-100 text-sm font-medium">Tanggal</p>
                        <p className="text-lg font-semibold">{formatDate(currentTime)}</p>
                    </div>
                </div>

                {todayStatusMessage && (
                    <div className="mt-4 bg-white bg-opacity-20 rounded-xl p-3 text-center backdrop-blur-sm">
                        <p className="text-sm font-semibold">
                            {todayStatusMessage}
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
};
