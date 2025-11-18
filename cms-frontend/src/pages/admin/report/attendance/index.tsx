import React, { useState, useEffect } from "react";
import { Download, Filter, Users, Calendar } from "lucide-react";
import { Card } from "../../../../components/UI/Card";
import { Button } from "../../../../components/UI/Button";
import { attendanceService } from "../../../../services/attendanceService";
import { userService } from "../../../../services/userService";

export const ReportsAttendance: React.FC = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load users untuk dropdown
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await userService.getUsers();
                setUsers(response.users);
            } catch (error) {
                console.error("Failed to load users:", error);
            }
        };
        loadUsers();
    }, []);

    const validateDates = () => {
        if (!startDate || !endDate) {
            alert("Please select both start date and end date");
            return false;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            alert("Start date cannot be after end date");
            return false;
        }

        return true;
    };

    const exportAttendanceReport = async () => {
        if (!validateDates()) {
            return;
        }

        setIsLoading(true);
        try {
            const filters = {
                startDate,
                endDate,
                userId: selectedUser || undefined
            };

            // Generate report via service
            const response = await attendanceService.exportAttendanceReport(filters);

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Set filename dengan timestamp
            const filename = `attendance_report_${startDate}_to_${endDate}.xlsx`;
            link.setAttribute('download', filename);

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error: any) {
            console.error("Export failed:", error);
            alert(error.response?.data?.message || "Failed to export attendance report");
        } finally {
            setIsLoading(false);
        }
    };

    const clearFilters = () => {
        setStartDate("");
        setEndDate("");
        setSelectedUser("");
    };

    const hasFilters = startDate || endDate || selectedUser;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-black">Attendance Report</h1>
                    <p className="mt-2 text-gray-600">
                        Export attendance data to Excel format
                    </p>
                </div>
            </div>

            {/* Filter Card */}
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filter Criteria
                    </h3>
                    {hasFilters && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                        >
                            Clear All
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date *
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date *
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* User Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            User (Optional)
                        </label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="">All Users</option>
                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.name} - {user.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Export Button */}
                <div className="mt-8 flex">
                    <Button
                        onClick={exportAttendanceReport}
                        disabled={isLoading || !startDate || !endDate}
                        size="lg"
                        className="min-w-[200px] flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className="h-5 w-5" />
                                Export to Excel
                            </>
                        )}
                    </Button>
                </div>

            </Card>
        </div>
    );
};
