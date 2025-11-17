import api from "./api";
import {
  Leave,
  ApplyLeaveData,
  LeaveActionData,
  LeaveHistoryResponseData,
  LeaveListResponse,
} from "../types/index";

export const leaveService = {
    // Apply leave (staff)
    async applyLeave(data: ApplyLeaveData): Promise<Leave> {
        const response = await api.post("/leaves/apply", data);
        return response.data.data;
    },

    // Cancel leave (staff - hanya untuk status pending)
    async cancelLeave(leaveId: string): Promise<Leave> {
        const response = await api.patch(`/leaves/cancel/${leaveId}`);
        return response.data.data;
    },

    // Get leave history (staff)
    async getLeaveHistory(
        year?: number,
        userId?: string
    ): Promise<LeaveHistoryResponseData> {
        const params: any = {};
        if (year) params.year = year;
        if (userId) params.userId = userId;

        const response = await api.get("/leaves/history", { params });
        return response.data;
    },

    // Get my leaves (staff - cuti sendiri)
    async getMyLeaves(filters?: {
        status?: string;
        year?: number;
        userId?: string;
    }): Promise<LeaveListResponse> {
        const response = await api.get("/leaves/my-leaves", { params: filters });
        return response.data;
    },

    // List leaves (admin - semua cuti) - GUNAKAN ENDPOINT YANG TEPAT
    async listLeaves(filters?: {
        status?: string;
        year?: number;
        mine?: boolean;
        userId?: string;
    }): Promise<LeaveListResponse> {
        // Coba endpoint yang berbeda
        try {
        // Coba endpoint admin khusus
        const response = await api.get("/leaves/admin", { params: filters });
        console.log(response);
        return response.data;
        } catch (error) {
        // Fallback ke endpoint biasa dengan parameter mine=false
        const params = { ...filters, mine: "false" };
        const response = await api.get("/leaves", { params });
        return response.data;
        }
    },

    // Atau gunakan endpoint my-leaves dengan parameter userId kosong untuk semua data
    async listAllLeaves(filters?: {
        status?: string;
        year?: number;
    }): Promise<LeaveListResponse> {
        const response = await api.get("/leaves/my-leaves", { params: filters });
        return response.data;
    },

    // Admin cancel leave (admin - bisa cancel semua status kecuali cancelled)
    async adminCancelLeave(
        leaveId: string,
        data?: LeaveActionData
    ): Promise<any> {
        const response = await api.patch(`/leaves/${leaveId}/admin-cancel`, data);
        return response.data;
    },

    // Confirm leave (admin - pending -> approved)
    async confirmLeave(leaveId: string, data?: LeaveActionData): Promise<any> {
        const response = await api.patch(`/leaves/${leaveId}/confirm`, data);
        return response.data;
    },

    // Reverse leave (admin - approved -> reverse)
    async reverseLeave(leaveId: string, data?: LeaveActionData): Promise<any> {
        const response = await api.patch(`/leaves/${leaveId}/reverse`, data);
        return response.data;
    },
};
