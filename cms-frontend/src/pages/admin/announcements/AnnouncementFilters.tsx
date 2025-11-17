import React from 'react';
import { Search, Filter } from 'lucide-react';
import { AnnouncementStatus } from '../../../types';

interface AnnouncementFiltersProps {
    searchTerm: string;
    selectedStatus: string;
    statusOptions: AnnouncementStatus[];
    onSearchTermChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onSearch: (e: React.FormEvent) => void;
}

export const AnnouncementFilters: React.FC<AnnouncementFiltersProps> = ({
    searchTerm,
    selectedStatus,
    statusOptions,
    onSearchTermChange,
    onStatusChange,
    onSearch
}) => {
    return (
        <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">All Status</option>
                    {statusOptions.map((status) => (
                        <option key={status._id} value={status._id}>
                            {status.name}
                        </option>
                    ))}
                </select>
            </div>
        </form>
    );
};
