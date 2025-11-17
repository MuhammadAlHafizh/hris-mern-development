export interface PositionStatus {
    _id: string;
    name: string;
    id: number;
}

export interface Position {
    _id: string;
    name: string;
    status_id: PositionStatus;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserStatus {
    _id: string;
    name: string;
    id: number;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "manager" | "staff";
    position?: Position | string | null;
    status_id: UserStatus | string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface UsersResponse {
    users: User[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PositionFormData {
    name: string;
}

export interface UserFormData {
    name: string;
    email: string;
    role: "admin" | "manager" | "staff";
    position: string;
    password: string;
}

export interface PositionResponse {
    positions: Position[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
}

export interface AnnouncementStatus {
    _id: string;
    name: string;
    isFinal: boolean;
}

export interface Announcement {
    _id: string;
    title: string;
    body: string;
    status: AnnouncementStatus;
    createdBy: User;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface AnnouncementsResponse {
    status?: string;
    message?: string;
    total: number;
    page: number;
    totalPages: number;
    data: Announcement[];
    hasNext: boolean;
    hasPrev: boolean;
}

export interface AnnouncementFormData {
    title: string;
    body: string;
    statusId: string;
}

export interface AnnualLeave {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    year: number;
    totalDays: number;
    usedDays: number;
    remainingDays: number;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface AnnualLeaveFormData {
    user: string;
    year: number;
    totalDays: number;
    usedDays?: number;
}

export interface AnnualLeavesResponse {
    annualLeaves: AnnualLeave[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface AnnualLeaveListResponse {
    status: string;
    message: string;
    total: number;
    data: AnnualLeave[];
}

export interface AttendanceLocation {
    lat: number;
    lng: number;
    address?: string;
    attendance_type?: "onsite" | "hybrid";
}

export interface TodayStatus {
    clockIn: {
        time: string;
        location: AttendanceLocation;
        attendance_type: "onsite" | "hybrid";
    } | null;
    clockOut: {
        time: string;
        location: AttendanceLocation;
        attendance_type: "onsite" | "hybrid";
    } | null;
    sickLeave: {
        time: string;
        description: string;
        start_date: string;
        end_date: string;
        medical_certificate: string | null;
    } | null;
    hasClockedIn: boolean;
    hasClockedOut: boolean;
    isSickLeave: boolean;
    todayStatus: "present" | "absent" | "sick";
    currentType: "onsite" | "hybrid" | "sick" | null;
}

export interface CalendarDay {
    date: string;
    clockIn: string | null;
    clockOut: string | null;
    sickLeave: {
        description: string;
        medical_certificate: string | null;
    } | null;
    status: "present" | "absent" | "holiday" | "sick";
    attendance_type: "onsite" | "hybrid" | "sick" | null;
    isHoliday: boolean;
    holidayName: string | null;
}

export interface AttendanceHistory {
    attendance: CalendarDay[];
    holidays: string[];
    currentMonth: number;
    currentYear: number;
    daysInMonth: number;
}

export interface SickLeaveData {
    description: string;
    start_date: string;
    end_date?: string;
    medical_certificate?: File | null;
}

export interface AttendanceRecord {
    _id: string;
    user: User;
    type: "clock_in" | "clock_out" | "sick_leave";
    attendance_type: "onsite" | "hybrid" | "sick";
    timestamp: string;
    location?: AttendanceLocation;
    sick_leave?: {
        description: string;
        medical_certificate: string | null;
        start_date: string;
        end_date: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface AttendanceListResponse {
    status: string;
    message: string;
    data: AttendanceRecord[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}


