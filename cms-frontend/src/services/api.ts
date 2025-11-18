import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import process from "process";

// Define your API response types
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

export interface ApiError {
    message: string;
    status?: number;
}

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "https://10.230.68.195:4000/api",
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || "1000"),
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling and token refresh
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh_token");
                if (refreshToken) {
                    // Try to refresh token
                    const response = await axios.post(
                        `${
                            process.env.REACT_APP_API_BASE_URL ||
                            "https://10.230.68.195:4000/api"
                        }/auth/refresh`,
                        { refreshToken }
                    );

                    const { accessToken } = response.data;
                    localStorage.setItem("auth_token", accessToken);

                    // Set Authorization header for the failed request
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                // If refresh token fails, logout user
                localStorage.removeItem("auth_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user_data");
                window.location.href = "/login";
            }
        }

        if (error.response?.status === 401) {
            // Clear invalid token and redirect to login
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user_data");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// API methods
export const authApi = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        try {
            const response: AxiosResponse<LoginResponse> = await api.post(
                "/auth/login",
                {
                    email,
                    password,
                }
            );
            console.log("Login successful:", response.data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            throw new Error(
                axiosError.response?.data?.message || "Login failed"
            );
        }
    },

    logout: async (): Promise<void> => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user_data");
        }
    },
};

export default api;
