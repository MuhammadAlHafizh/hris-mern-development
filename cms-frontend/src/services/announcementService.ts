import api from "./api";
import {
    Announcement,
    AnnouncementsResponse,
    AnnouncementFormData,
    AnnouncementStatus,
} from "../types";

export const announcementService = {
    async getAnnouncements(
        page: number = 1,
        size: number = 10,
        keyword: string = "",
        status?: string,
        signal?: AbortSignal
    ): Promise<AnnouncementsResponse> {
        try {
            const params: any = { page, size };

            if (keyword && keyword.trim() !== "") {
                params.keyword = keyword.trim();
            }

            if (status && status !== "all") {
                params.status = status;
            }

            const config = signal ? { params, signal } : { params };
            const response = await api.get("/announcements", config);

            return {
                data: response.data.data || [],
                total: response.data.total || 0,
                page: response.data.page || page,
                totalPages:
                    response.data.totalPages ||
                    Math.ceil((response.data.total || 0) / size),
                hasNext:
                    response.data.hasNext ||
                    page < Math.ceil((response.data.total || 0) / size),
                hasPrev: response.data.hasPrev || page > 1,
            };
        } catch (error: any) {
            if (error.name === "CanceledError" || error.name === "AbortError") {
                throw new Error("Request aborted");
            }
            console.error("Error fetching announcements:", error);
            throw error;
        }
    },

    async getStatuses(): Promise<AnnouncementStatus[]> {
        try {
            const response = await api.get("/announcements/statuses");
            return response.data.data || [];
        } catch (error) {
            console.error("Error fetching announcement statuses:", error);
            throw error;
        }
    },

    async createAnnouncement(
        data: AnnouncementFormData
    ): Promise<Announcement> {
        try {
            const response = await api.post("/announcements", data);
            return response.data;
        } catch (error) {
            console.error("Error creating announcement:", error);
            throw error;
        }
    },

    async updateAnnouncement(
        _id: string,
        data: Partial<AnnouncementFormData>
    ): Promise<Announcement> {
        try {
            const response = await api.put(`/announcements/${_id}`, data);
            console.log(response)
            return response.data;
        } catch (error) {
            console.error("Error updating announcement:", error);
            throw error;
        }
    },

    async changeStatus(_id: string, statusId: string): Promise<Announcement> {
        try {
            const response = await api.put(`/announcements/${_id}/status`, {
                statusId,
            });
            console.log('status_id', statusId);
            console.log(response)
            return response.data;
        } catch (error) {
            console.error("Error changing announcement status:", error);
            throw error;
        }
    },
};
