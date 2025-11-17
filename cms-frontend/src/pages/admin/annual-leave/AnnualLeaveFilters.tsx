import React from 'react';
import { Search, Filter } from 'lucide-react';

interface AnnualLeaveFiltersProps {
    searchTerm: string;
    selectedYear: string;
    selectedUser: string;
    users: any[];
    yearOptions: { value: string; label: string }[];
    usersLoading: boolean;
    onSearchTermChange: (value: string) => void;
    onYearChange: (value: string) => void;
    onUserChange: (value: string) => void;
    onSearch: (e: React.FormEvent) => void;
}

export const AnnualLeaveFilters: React.FC<AnnualLeaveFiltersProps> = ({
    searchTerm,
    selectedYear,
    selectedUser,
    users,
    yearOptions,
    usersLoading,
    onSearchTermChange,
    onYearChange,
    onUserChange,
    onSearch
}) => {
    return (
        <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by employee name..."
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:border-transparent"
                />
            </div>

            <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                >
                    <option value="all">All Years</option>
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
                    value={selectedUser}
                    onChange={(e) => onUserChange(e.target.value)}
                    disabled={usersLoading}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-transparent disabled:bg-gray-100"
                >
                    <option value="all">All Employees</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>
        </form>
    );
};
