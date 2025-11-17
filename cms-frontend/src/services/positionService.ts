import api from "./api";
import {
    Position,
    PositionFormData,
    PositionResponse,
    PositionStatus,
} from "../types";

export const positionService = {
    async getPosition(
        page: number = 1,
        size: number = 10,
        keyword: string = "",
        status?: string,
        signal?: AbortSignal
    ): Promise<PositionResponse> {
        try {
            const params: any = { page, size };

            if (keyword !== undefined && keyword !== "") {
                params.keyword = keyword;
            }

            if (status && status !== "all") {
                params.status = status;
            }

            const config = signal ? { params, signal } : { params };
            const response = await api.get("/positions", config);

            if (response.data.data && Array.isArray(response.data.data)) {
                return {
                    positions: response.data.data,
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
                    positions: [],
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
            console.error("Error fetching positions:", error);
            throw error;
        }
    },

    async getPositionStatuses(): Promise<PositionStatus[]> {
        try {
            const response = await api.get("/positions/statuses");
            return response.data.data;
        } catch (error) {
            console.error("Error fetching position statuses:", error);
            throw error;
        }
    },

    async createPosition(positionData: PositionFormData): Promise<Position> {
        try {
            const response = await api.post("/positions", positionData);
            return response.data;
        } catch (error) {
            console.error("Error creating position:", error);
            throw error;
        }
    },

    async updatePosition(
        _id: string,
        positionData: Partial<PositionFormData>
    ): Promise<Position> {
        try {
            const response = await api.put(`/positions/${_id}`, positionData);
            return response.data;
        } catch (error) {
            console.error("Error updating position:", error);
            throw error;
        }
    },

    async changePositionStatus(
        _id: string,
        status: "active" | "inactive"
    ): Promise<Position> {
        try {
            const response = await api.put(`/positions/${_id}/status`, {
                status,
            });
            return response.data;
        } catch (error) {
            console.error("Error changing position status:", error);
            throw error;
        }
    },
};
