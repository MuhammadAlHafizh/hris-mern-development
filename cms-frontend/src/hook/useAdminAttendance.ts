import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../services/attendanceService';
import { AttendanceRecord } from '../types';

export const useAdminAttendance = () => {
    const [todayAttendances, setTodayAttendances] = useState<AttendanceRecord[]>([]);
    const [allAttendances, setAllAttendances] = useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadTodayAttendances = useCallback(async () => {
        try {
            setIsLoading(true);
            const today = new Date().toISOString().split('T')[0];
            console.log('Loading attendances for date:', today);

            const response = await attendanceService.getAllAttendance(
                1,
                100,
                today,
                today,
                'all'
            );

            console.log('Raw API response:', response);

            // Filter hanya record hari ini dan pastikan ada user data
            const todayRecords = response.data.filter((record: AttendanceRecord) => {
                const recordDate = new Date(record.createdAt).toISOString().split('T')[0];
                const isTodayRecord = recordDate === today;
                const hasUserData = record.user && record.user.name;

                console.log('Record check:', {
                    id: record._id,
                    type: record.type,
                    recordDate,
                    today,
                    isTodayRecord,
                    hasUserData,
                    userName: record.user?.name
                });

                return isTodayRecord && hasUserData;
            });

            console.log('Filtered today records:', todayRecords);
            setTodayAttendances(todayRecords);
        } catch (error) {
            console.error('Error loading today attendances:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadAllAttendances = useCallback(async (
        page: number = 1,
        size: number = 10,
        filters: any = {}
    ) => {
        try {
            setIsLoading(true);
            const response = await attendanceService.getAllAttendance(
                page,
                size,
                filters.startDate,
                filters.endDate,
                filters.userId,
                filters.type,
                filters.attendance_type,
                filters.keyword
            );

            setAllAttendances(response.data);
            return response;
        } catch (error) {
            console.error('Error loading all attendances:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTodayAttendances();
    }, [loadTodayAttendances]);

    return {
        todayAttendances,
        allAttendances,
        isLoading,
        loadTodayAttendances,
        loadAllAttendances
    };
};
