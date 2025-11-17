import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, LoginResponse } from '../services/api';

// Define AuthUser type
export interface AuthUser {
    _id: string;
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
    refreshToken: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        const refreshToken = localStorage.getItem('refresh_token');

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser({
                    ...parsedUser,
                    token,
                    refreshToken: refreshToken || ''
                });
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
                localStorage.removeItem('refresh_token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);

        try {
            const response: LoginResponse = await authApi.login(email, password);

            const authUser: AuthUser = {
                _id: response.user.id,
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
                role: response.user.role,
                token: response.accessToken,
                refreshToken: response.refreshToken
            };

            setUser(authUser);
            localStorage.setItem('auth_token', authUser.token);
            localStorage.setItem('refresh_token', authUser.refreshToken);
            localStorage.setItem('user_data', JSON.stringify({
                id: authUser.id,
                name: authUser.name,
                email: authUser.email,
                role: authUser.role
            }));

            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_data');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
