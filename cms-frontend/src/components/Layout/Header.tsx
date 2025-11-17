import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    return (
        <header className="bg-white  shadow-md border-b">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                <div className="flex items-center">
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-md hover:bg-gray-100  lg:hidden"
                    >
                        <Menu className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex items-center space-x-4">
                    {/* User Menu */}
                    <div className="relative group">
                        <button className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 ">
                        <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                            {user?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <span className="hidden md:block text-sm font-medium text-gray-700 text-black">
                            {user?.name}
                        </span>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white  rounded-md shadow-lg border border-gray-200  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <button
                                onClick={logout}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 text-black hover:bg-gray-50 "
                            >
                                <LogOut className="mr-3 h-4 w-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
