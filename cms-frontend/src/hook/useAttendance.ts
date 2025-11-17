import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
    TodayStatus,
    AttendanceHistory,
    AttendanceLocation,
    SickLeaveData,
} from "../types/index";
import { attendanceService } from "../services/attendanceService";

export const useAttendance = () => {
    const [todayStatus, setTodayStatus] = useState<TodayStatus | null>(null);
    const [attendanceHistory, setAttendanceHistory] =
        useState<AttendanceHistory | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState<{
        lat: number;
        lng: number;
        address: string;
    } | null>(null);
    const [locationError, setLocationError] = useState<string>("");
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const getCurrentLocation = useCallback((): Promise<{
        lat: number;
        lng: number;
        address: string;
    }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(
                    new Error("Geolocation tidak didukung oleh browser ini.")
                );
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    let address = "Area Kantor";
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();
                        address = data.display_name || "Area Kantor";
                    } catch (error) {
                        console.error("Error getting address:", error);
                    }

                    resolve({
                        lat: latitude,
                        lng: longitude,
                        address,
                    });
                },
                (error) => {
                    let errorMessage = "Tidak dapat mendapatkan lokasi. ";
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage +=
                                "Harap aktifkan layanan lokasi di pengaturan browser Anda.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += "Informasi lokasi tidak tersedia.";
                            break;
                        case error.TIMEOUT:
                            errorMessage += "Permintaan lokasi timeout.";
                            break;
                        default:
                            errorMessage +=
                                "Terjadi kesalahan yang tidak diketahui.";
                            break;
                    }
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        });
    }, []);

    const loadTodayStatus = useCallback(async () => {
        try {
            const status = await attendanceService.getTodayStatus();
            setTodayStatus(status);
        } catch (error) {
            console.error("Error loading today status:", error);
        }
    }, []);

    const loadAttendanceHistory = useCallback(
        async (year?: number, month?: number) => {
            try {
                const targetYear = year || currentYear;
                const targetMonth = month || currentMonth;

                const history = await attendanceService.getAttendanceHistory(
                    targetYear,
                    targetMonth
                );
                setAttendanceHistory(history);

                if (year) setCurrentYear(year);
                if (month) setCurrentMonth(month);
            } catch (error) {
                console.error("Error loading attendance history:", error);
            }
        },
        [currentMonth, currentYear]
    );

    const refreshAllData = useCallback(async () => {
        await Promise.all([
            loadTodayStatus(),
            loadAttendanceHistory(currentYear, currentMonth),
        ]);
    }, [loadTodayStatus, loadAttendanceHistory, currentYear, currentMonth]);

    const handleClockIn = async (
        attendanceType: "onsite" | "hybrid" = "onsite"
    ) => {
        setIsLoading(true);
        setLocationError("");

        try {
            const currentLocation = await getCurrentLocation();
            setLocation(currentLocation);

            const locationData: AttendanceLocation = {
                ...currentLocation,
                attendance_type: attendanceType,
            };

            await attendanceService.clockIn(locationData);
            await refreshAllData();

            toast.success(`Clock in berhasil (${attendanceType})!`);
        } catch (error: any) {
            console.error("Error during clock in:", error);
            setLocationError(error.message);
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Gagal melakukan clock in"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleClockOut = async () => {
        setIsLoading(true);
        setLocationError("");

        try {
            const currentLocation = await getCurrentLocation();
            setLocation(currentLocation);

            await attendanceService.clockOut(currentLocation);
            await refreshAllData();

            toast.success("Clock out berhasil!");
        } catch (error: any) {
            console.error("Error during clock out:", error);
            setLocationError(error.message);
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Gagal melakukan clock out"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSickLeave = async (sickData: SickLeaveData) => {
        setIsLoading(true);
        try {
            await attendanceService.sickLeave(sickData);
            await refreshAllData();
            toast.success("Izin sakit berhasil dicatat!");
        } catch (error: any) {
            console.error("Error during sick leave:", error);
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Gagal mengajukan izin sakit"
            );
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTodayStatus();
        loadAttendanceHistory();
    }, [loadTodayStatus, loadAttendanceHistory]);

    return {
        todayStatus,
        attendanceHistory,
        isLoading,
        location,
        locationError,
        handleClockIn,
        handleClockOut,
        handleSickLeave,
        loadTodayStatus,
        loadAttendanceHistory,
        refreshAllData,
        getCurrentLocation,
        currentMonth,
        currentYear,
    };
};
