import api from "./api";
import { User, UserFormData, UsersResponse, UserStatus } from "../types";

export const userService = {
    async getUsers(
        page: number = 1,
        size: number = 10,
        keyword: string = "",
        status?: string,
        signal?: AbortSignal
    ): Promise<UsersResponse> {
        try {
            const params: any = { page, size };

            if (keyword !== undefined && keyword !== "") {
                params.keyword = keyword;
            }

            if (status && status !== "all") {
                params.status = status;
            }

            const config = signal ? { params, signal } : { params };
            const response = await api.get("/users", config);

            if (response.data.data && Array.isArray(response.data.data)) {
                return {
                    users: response.data.data,
                    total: response.data.total,
                    page: response.data.page || page,
                    totalPages:
                        response.data.totalPages ||
                        Math.ceil(response.data.total / size),
                    hasNext:
                        response.data.hasNext ||
                        page < Math.ceil(response.data.total / size),
                    hasPrev: response.data.hasPrev || page > 1,
                };
            } else {
                console.warn(
                    "Unexpected API response structure:",
                    response.data
                );
                return {
                    users: [],
                    total: 0,
                    page: 1,
                    totalPages: 0,
                    hasNext: false,
                    hasPrev: false,
                };
            }
        } catch (error: any) {
            if (error.name === "CanceledError" || error.name === "AbortError") {
                throw new Error("Request aborted");
            }
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    async getUserStatuses(): Promise<UserStatus[]> {
        try {
            const response = await api.get("/users/statuses");
            return response.data.data;
        } catch (error) {
            console.error("Error fetching user statuses:", error);
            throw error;
        }
    },

    async createUser(userData: UserFormData): Promise<User> {
        try {
            const response = await api.post("/users", userData);
            return response.data;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    async updateUser(
        _id: string,
        userData: Partial<UserFormData>
    ): Promise<User> {
        try {
            const response = await api.put(`/users/${_id}`, userData);
            return response.data;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },

    async changeUserStatus(
        _id: string,
        status: "active" | "inactive"
    ): Promise<User> {
        try {
            const response = await api.put(`/users/${_id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error("Error changing user status:", error);
            throw error;
        }
    },
};
