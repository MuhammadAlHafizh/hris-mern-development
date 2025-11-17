import api from "./api";
import {
    AttendanceLocation,
    TodayStatus,
    AttendanceHistory,
    AttendanceListResponse,
    SickLeaveData,
} from "../types/index";

export const attendanceService = {
    async clockIn(location: AttendanceLocation): Promise<any> {
        const response = await api.post("/attendance/clock-in", location);
        return response.data;
    },

    async clockOut(location: AttendanceLocation): Promise<any> {
        const response = await api.post("/attendance/clock-out", location);
        return response.data;
    },

    async sickLeave(data: SickLeaveData): Promise<any> {
        const formData = new FormData();
        formData.append("description", data.description);
        formData.append("start_date", data.start_date);

        if (data.end_date) {
            formData.append("end_date", data.end_date);
        }

        if (data.medical_certificate) {
            formData.append("medical_certificate", data.medical_certificate);
        }

        const response = await api.post("/attendance/sick-leave", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    async getTodayStatus(): Promise<TodayStatus> {
        const response = await api.get("/attendance/today-status");
        return response.data.data;
    },

    async getAttendanceHistory(
        year?: number,
        month?: number
    ): Promise<AttendanceHistory> {
        const params: any = {};
        if (year) params.year = year;
        if (month) params.month = month;

        const response = await api.get("/attendance/history", { params });
        return response.data.data;
    },

    async getAllAttendance(
        page: number = 1,
        size: number = 10,
        startDate?: string,
        endDate?: string,
        userId?: string,
        type?: string,
        attendance_type?: string,
        keyword?: string
    ): Promise<AttendanceListResponse> {
        const params: any = { page, size };
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (userId && userId !== "all") params.userId = userId;
        if (type && type !== "all") params.type = type;
        if (attendance_type && attendance_type !== "all")
            params.attendance_type = attendance_type;
        if (keyword) params.keyword = keyword;

        console.log("API call params:", params);

        const response = await api.get("/attendance", { params });
        console.log("API response:", response.data);

        return response.data;
    },
};
