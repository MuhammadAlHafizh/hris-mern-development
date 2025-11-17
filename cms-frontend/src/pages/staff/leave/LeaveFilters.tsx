import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';

interface LeaveFiltersProps {
    searchTerm: string;
    selectedYear: string;
    selectedStatus: string;
    yearOptions: { value: string; label: string }[];
    onSearchTermChange: (value: string) => void;
    onYearChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onSearch: (e: React.FormEvent) => void;
}

export const LeaveFilters: React.FC<LeaveFiltersProps> = ({
    searchTerm,
    selectedYear,
    selectedStatus,
    yearOptions,
    onSearchTermChange,
    onYearChange,
    onStatusChange,
    onSearch
}) => {
    return (
        <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Cari berdasarkan alasan..."
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:border-transparent"
                />
            </div>

            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                >
                    <option value="all">Semua Tahun</option>
                    {yearOptions.map((year) => (
                        <option key={year.value} value={year.value}>
                            {year.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                >
                    <option value="all">Semua Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Reverse">Reverse</option>
                </select>
            </div>
        </form>
    );
};
