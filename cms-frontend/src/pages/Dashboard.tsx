import React from 'react';
import { Users, Megaphone, Calendar, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '../components/UI/Card';

export const Dashboard: React.FC = () => {
    const stats = [
        {
            name: 'Total Users',
            value: '1,234',
            change: '+12%',
            changeType: 'positive' as const,
            icon: Users,
            color: 'blue'
        },
        {
            name: 'Active Announcements',
            value: '23',
            change: '+3',
            changeType: 'positive' as const,
            icon: Megaphone,
            color: 'green'
        },
        {
            name: 'Pending Leaves',
            value: '8',
            change: '-2',
            changeType: 'negative' as const,
            icon: Calendar,
            color: 'yellow'
        },
        {
            name: 'Monthly Reports',
            value: '42',
            change: '+5%',
            changeType: 'positive' as const,
            icon: TrendingUp,
            color: 'purple'
        }
    ];

    const recentActivities = [
        {
            id: 1,
            type: 'leave_request',
            message: 'John Doe submitted a leave request',
            time: '2 hours ago',
            icon: Clock,
            color: 'blue'
        },
        {
            id: 2,
            type: 'announcement',
            message: 'New system update announcement published',
            time: '4 hours ago',
            icon: CheckCircle,
            color: 'green'
        },
        {
            id: 3,
            type: 'user_created',
            message: 'New user Jane Smith was added',
            time: '6 hours ago',
            icon: Users,
            color: 'purple'
        },
        {
            id: 4,
            type: 'alert',
            message: 'Server maintenance scheduled for tonight',
            time: '1 day ago',
            icon: AlertTriangle,
            color: 'yellow'
        }
    ];

    const colorClasses: { [key: string]: string } = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        purple: 'bg-purple-500',
        red: 'bg-red-500'
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-black">Dashboard</h1>
                <p className="mt-2 text-gray-600 ">
                    Welcome back! Here's what's happening with your system today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.name} className="relative overflow-hidden">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-gray-500 ">
                                    {stat.name}
                                </p>
                                <p className="text-2xl font-semibold text-black">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600 ' : 'text-red-600 '
                                }`}>
                                {stat.change}
                            </span>
                            <span className="text-sm text-gray-500  ml-1">
                                from last month
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-medium text-black mb-4">
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center space-x-3">
                                <div className={`p-2 rounded-full ${colorClasses[activity.color]}`}>
                                    <activity.icon className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-black">
                                        {activity.message}
                                    </p>
                                    <p className="text-xs text-gray-500 ">
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <h3 className="text-lg font-medium text-black mb-4">
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-3 rounded-lg border border-gray-200  hover:bg-gray-50  transition-colors">
                            <div className="flex items-center space-x-3">
                                <Users className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-medium text-black">
                                    Add New User
                                </span>
                            </div>
                        </button>
                        <button className="w-full text-left p-3 rounded-lg border border-gray-200  hover:bg-gray-50  transition-colors">
                            <div className="flex items-center space-x-3">
                                <Megaphone className="h-5 w-5 text-green-500" />
                                <span className="text-sm font-medium text-black">
                                    Create Announcement
                                </span>
                            </div>
                        </button>
                        <button className="w-full text-left p-3 rounded-lg border border-gray-200  hover:bg-gray-50  transition-colors">
                            <div className="flex items-center space-x-3">
                                <Calendar className="h-5 w-5 text-purple-500" />
                                <span className="text-sm font-medium text-black">
                                    Review Leave Requests
                                </span>
                            </div>
                        </button>
                        <button className="w-full text-left p-3 rounded-lg border border-gray-200  hover:bg-gray-50  transition-colors">
                            <div className="flex items-center space-x-3">
                                <TrendingUp className="h-5 w-5 text-yellow-500" />
                                <span className="text-sm font-medium text-black">
                                    Generate Report
                                </span>
                            </div>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
