import React, { useState } from "react";
import {
    Download,
    FileText,
    Users,
    Calendar,
    Megaphone,
    TrendingUp,
    PieChart,
} from "lucide-react";
import { Card } from "../components/UI/Card";
import { Button } from "../components/UI/Button";

export const Reports: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("month");
    const [selectedReport, setSelectedReport] = useState("overview");

    const reportTypes = [
        { id: "overview", name: "Overview", icon: TrendingUp },
        { id: "users", name: "User Activity", icon: Users },
        { id: "leave", name: "Leave Analysis", icon: Calendar },
        { id: "announcements", name: "Announcements", icon: Megaphone },
    ];

    const periods = [
        { value: "week", label: "Last Week" },
        { value: "month", label: "Last Month" },
        { value: "quarter", label: "Last Quarter" },
        { value: "year", label: "Last Year" },
    ];

    const overviewStats = [
        {
            label: "Total Users",
            value: "1,234",
            change: "+12%",
            positive: true,
        },
        {
            label: "Active Sessions",
            value: "892",
            change: "+8%",
            positive: true,
        },
        {
            label: "Leave Requests",
            value: "156",
            change: "-5%",
            positive: false,
        },
        { label: "Announcements", value: "23", change: "+15%", positive: true },
    ];

    const leaveStats = [
        { type: "Annual Leave", count: 45, percentage: 65 },
        { type: "Sick Leave", count: 18, percentage: 26 },
        { type: "Personal Leave", count: 6, percentage: 9 },
        { type: "Emergency Leave", count: 0, percentage: 0 },
    ];

    const userActivityData = [
        { department: "IT", users: 85, active: 78 },
        { department: "HR", users: 32, active: 30 },
        { department: "Sales", users: 124, active: 110 },
        { department: "Marketing", users: 45, active: 42 },
        { department: "Finance", users: 28, active: 25 },
    ];

    const generateReport = () => {
        // In a real application, this would generate and download an actual report
        alert(
            `Generating ${
                reportTypes.find((r) => r.id === selectedReport)?.name
            } report for ${
                periods.find((p) => p.value === selectedPeriod)?.label
            }`
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-black">Reports</h1>
                    <p className="mt-2 text-gray-600 ">
                        Generate and view system reports and analytics
                    </p>
                </div>
                <div className="flex space-x-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-4 py-2 border border-gray-300  rounded-lg focus:border-transparent "
                    >
                        {periods.map((period) => (
                            <option key={period.value} value={period.value}>
                                {period.label}
                            </option>
                        ))}
                    </select>
                    <Button onClick={generateReport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Report Type Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportTypes.map((type) => (
                    <Card
                        key={type.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedReport === type.id
                                ? "ring-2 ring-blue-500 bg-blue-50 "
                                : "hover:bg-gray-50 "
                        }`}
                        onClick={() => setSelectedReport(type.id)}
                        padding="sm"
                    >
                        <div className="flex items-center space-x-3">
                            <div
                                className={`p-2 rounded-lg ${
                                    selectedReport === type.id
                                        ? "bg-blue-100 dark:bg-blue-800"
                                        : "bg-gray-100 "
                                }`}
                            >
                                <type.icon
                                    className={`h-5 w-5 ${
                                        selectedReport === type.id
                                            ? "text-blue-600 "
                                            : "text-gray-600 "
                                    }`}
                                />
                            </div>
                            <span
                                className={`font-medium ${
                                    selectedReport === type.id
                                        ? "text-blue-900 dark:text-blue-300"
                                        : "text-black"
                                }`}
                            >
                                {type.name}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Report Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {selectedReport === "overview" && (
                    <>
                        {/* Overview Stats */}
                        <div className="lg:col-span-3">
                            <Card>
                                <h3 className="text-lg font-semibold text-black mb-4">
                                    System Overview
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {overviewStats.map((stat, index) => (
                                        <div
                                            key={index}
                                            className="text-center p-4 bg-gray-50  rounded-lg"
                                        >
                                            <div className="text-2xl font-bold text-black">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-gray-600  mb-2">
                                                {stat.label}
                                            </div>
                                            <div
                                                className={`text-sm font-medium ${
                                                    stat.positive
                                                        ? "text-green-600 "
                                                        : "text-red-600 "
                                                }`}
                                            >
                                                {stat.change}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                )}

                {selectedReport === "users" && (
                    <Card className="lg:col-span-3">
                        <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                            <Users className="h-5 w-5 mr-2" />
                            User Activity by Department
                        </h3>
                        <div className="space-y-4">
                            {userActivityData.map((dept, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-gray-50  rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium text-black">
                                                {dept.department}
                                            </span>
                                            <span className="text-sm text-gray-600 ">
                                                {dept.active}/{dept.users}{" "}
                                                active
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${
                                                        (dept.active /
                                                            dept.users) *
                                                        100
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {selectedReport === "leave" && (
                    <Card className="lg:col-span-3">
                        <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                            <Calendar className="h-5 w-5 mr-2" />
                            Leave Request Analysis
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {leaveStats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-gray-50  rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium text-black">
                                                    {stat.type}
                                                </span>
                                                <span className="text-sm text-gray-600 ">
                                                    {stat.count}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${stat.percentage}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center p-8 bg-gray-50  rounded-lg">
                                <PieChart className="h-32 w-32 text-gray-400" />
                            </div>
                        </div>
                    </Card>
                )}

                {selectedReport === "announcements" && (
                    <Card className="lg:col-span-3">
                        <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                            <Megaphone className="h-5 w-5 mr-2" />
                            Announcement Statistics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-6 bg-blue-50  rounded-lg">
                                <div className="text-3xl font-bold text-blue-600 ">
                                    23
                                </div>
                                <div className="text-sm text-gray-600 ">
                                    Total Published
                                </div>
                            </div>
                            <div className="text-center p-6 bg-yellow-50  rounded-lg">
                                <div className="text-3xl font-bold text-yellow-600 ">
                                    5
                                </div>
                                <div className="text-sm text-gray-600 ">
                                    Draft
                                </div>
                            </div>
                            <div className="text-center p-6 bg-gray-50  rounded-lg">
                                <div className="text-3xl font-bold text-gray-600 ">
                                    12
                                </div>
                                <div className="text-sm text-gray-600 ">
                                    Archived
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {/* Recent Reports */}
            <Card>
                <h3 className="text-lg font-semibold text-black mb-4">
                    Recent Reports
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50  rounded-lg">
                        <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600 " />
                            <div>
                                <div className="font-medium text-black">
                                    Monthly User Report
                                </div>
                                <div className="text-sm text-gray-600 ">
                                    Generated on Jan 15, 2024
                                </div>
                            </div>
                        </div>
                        <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50  rounded-lg">
                        <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-green-600 " />
                            <div>
                                <div className="font-medium text-black">
                                    Leave Analysis Report
                                </div>
                                <div className="text-sm text-gray-600 ">
                                    Generated on Jan 12, 2024
                                </div>
                            </div>
                        </div>
                        <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50  rounded-lg">
                        <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-purple-600 " />
                            <div>
                                <div className="font-medium text-black">
                                    System Overview Report
                                </div>
                                <div className="text-sm text-gray-600 ">
                                    Generated on Jan 10, 2024
                                </div>
                            </div>
                        </div>
                        <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
