import api from "./api";
import { AnnualLeave, AnnualLeaveFormData, AnnualLeavesResponse } from "../types";

export const annualLeaveService = {
    async getAnnualLeaves(
        page: number = 1,
        size: number = 10,
        keyword: string = "",
        year: string = "",
        userId: string = "",
        signal?: AbortSignal
    ): Promise<AnnualLeavesResponse> {
        try {
            const params: any = { page, size };

            if (keyword !== undefined && keyword !== "") {
                params.keyword = keyword;
            }

            if (year && year !== "all") {
                params.year = year;
            }

            if (userId && userId !== "all") {
                params.userId = userId;
            }

            const config = signal ? { params, signal } : { params };
            const response = await api.get("/annual-leaves", config);

            if (response.data.data && Array.isArray(response.data.data)) {
                const annualLeaves = response.data.data.map((item: AnnualLeave) => ({
                    ...item,
                    remainingDays: item.totalDays - item.usedDays
                }));

                return {
                    annualLeaves,
                    total: response.data.total,
                    page: response.data.page || page,
                    totalPages: response.data.totalPages || Math.ceil(response.data.total / size),
                    hasNext: response.data.hasNext || page < Math.ceil(response.data.total / size),
                    hasPrev: response.data.hasPrev || page > 1,
                };
            } else {
                console.warn("Unexpected API response structure:", response.data);
                return {
                    annualLeaves: [],
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
            console.error("Error fetching annual leaves:", error);
            throw error;
        }
    },

    async getAnnualLeave(id: string): Promise<AnnualLeave> {
        try {
            const response = await api.get(`/annual-leaves/${id}`);
            const data = response.data.data;
            return {
                ...data,
                remainingDays: data.totalDays - data.usedDays
            };
        } catch (error) {
            console.error("Error fetching annual leave:", error);
            throw error;
        }
    },

    async createAnnualLeave(annualLeaveData: AnnualLeaveFormData): Promise<AnnualLeave> {
        try {
            const response = await api.post("/annual-leaves", annualLeaveData);
            const data = response.data.data;
            return {
                ...data,
                remainingDays: data.totalDays - data.usedDays
            };
        } catch (error) {
            console.error("Error creating annual leave:", error);
            throw error;
        }
    },

    async updateAnnualLeave(id: string, annualLeaveData: Partial<AnnualLeaveFormData>): Promise<AnnualLeave> {
        try {
            const response = await api.put(`/annual-leaves/${id}`, annualLeaveData);
            const data = response.data.data;
            return {
                ...data,
                remainingDays: data.totalDays - data.usedDays
            };
        } catch (error) {
            console.error("Error updating annual leave:", error);
            throw error;
        }
    },

    async deleteAnnualLeave(id: string): Promise<void> {
        try {
            await api.delete(`/annual-leaves/${id}`);
        } catch (error) {
            console.error("Error deleting annual leave:", error);
            throw error;
        }
    },

    async getAnnualLeaveByUserAndYear(userId: string, year: number): Promise<AnnualLeave> {
        try {
            const response = await api.get(`/annual-leaves/user/${userId}/year/${year}`);
            const data = response.data.data;
            return {
                ...data,
                remainingDays: data.totalDays - data.usedDays
            };
        } catch (error) {
            console.error("Error fetching annual leave by user and year:", error);
            throw error;
        }
    }
};
