import mongoose from 'mongoose';
import Attendance from "../models/Attendance/Attendance.js";
import { logActivity, getIndonesianHolidays } from "../utility/Helper.js";
import { handleFileUpload } from "../utility/fileUpload.js";
import ExcelJS from 'exceljs';


export const clockIn = async (req, res, next) => {
    try {
        const { lat, lng, address, attendance_type = "onsite" } = req.body;
        const userId = req.user._id;

        console.log('User Location:', { lat, lng, attendance_type });

        // Untuk semua tipe absensi, wajib ada lokasi (kecuali sakit)
        if (attendance_type !== "sick") {
            if (!lat || !lng) {
                return res.status(400).json({
                    status: "error",
                    message: "Location data is required"
                });
            }
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingClockIn = await Attendance.findOne({
            user: userId,
            type: "clock_in",
            createdAt: { $gte: today }
        });

        if (existingClockIn) {
            return res.status(400).json({
                status: "error",
                message: "Anda sudah melakukan clock in hari ini"
            });
        }

        const attendance = new Attendance({
            user: userId,
            type: "clock_in",
            attendance_type,
            location: attendance_type !== "sick" ? {
                lat,
                lng,
                address: address || "Lokasi tidak diketahui"
            } : undefined
        });

        await attendance.save();
        await logActivity(attendance._id, "Clock In", userId, "Attendance");

        res.status(201).json({
            status: "success",
            message: `Clock in berhasil (${attendance_type})`,
            data: attendance
        });
    } catch (err) {
        next(err);
    }
};

export const clockOut = async (req, res, next) => {
    try {
        const { lat, lng, address } = req.body;
        const userId = req.user._id;

        console.log('User Location:', { lat, lng });

        // Wajib ada lokasi untuk clock out (kecuali jika clock in-nya sakit)
        if (!lat || !lng) {
            return res.status(400).json({
                status: "error",
                message: "Location data is required"
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Cari clock in hari ini untuk mendapatkan attendance_type
        const clockInRecord = await Attendance.findOne({
            user: userId,
            type: "clock_in",
            createdAt: { $gte: today }
        });

        if (!clockInRecord) {
            return res.status(400).json({
                status: "error",
                message: "Anda harus clock in terlebih dahulu sebelum clock out"
            });
        }

        // Jika clock in-nya sakit, tidak perlu clock out dengan lokasi
        if (clockInRecord.attendance_type === "sick") {
            return res.status(400).json({
                status: "error",
                message: "Tidak perlu clock out untuk izin sakit"
            });
        }

        const existingClockOut = await Attendance.findOne({
            user: userId,
            type: "clock_out",
            createdAt: { $gte: today }
        });

        if (existingClockOut) {
            return res.status(400).json({
                status: "error",
                message: "Anda sudah melakukan clock out hari ini"
            });
        }

        const attendance = new Attendance({
            user: userId,
            type: "clock_out",
            attendance_type: clockInRecord.attendance_type, // Gunakan type dari clock in
            location: {
                lat,
                lng,
                address: address || "Lokasi tidak diketahui"
            }
        });

        await attendance.save();
        await logActivity(attendance._id, "Clock Out", userId, "Attendance");

        res.status(201).json({
            status: "success",
            message: "Clock out berhasil",
            data: attendance
        });
    } catch (err) {
        next(err);
    }
};

export const sickLeave = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { description, start_date, end_date } = req.body;

        console.log('🏥 Sick leave request received:', {
            userId,
            description,
            start_date,
            end_date,
            hasFile: !!req.file
        });

        // Handle file upload
        let medicalCertificate = null;
        if (req.file) {
            console.log('📄 File details:', {
                originalname: req.file.originalname,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size
            });

            // Karena kita menggunakan diskStorage, file sudah disimpan
            // Kita hanya perlu menyimpan path-nya
            medicalCertificate = `/uploads/medical-certificates/${req.file.filename}`;
            console.log('Medical certificate path:', medicalCertificate);
        }

        if (!description || !start_date) {
            return res.status(400).json({
                status: "error",
                message: "Description and start date are required"
            });
        }

        const startDate = new Date(start_date);
        const endDate = end_date ? new Date(end_date) : new Date(start_date);

        // Validasi tanggal
        if (startDate > endDate) {
            return res.status(400).json({
                status: "error",
                message: "Start date cannot be after end date"
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Cek apakah sudah ada absensi untuk hari ini
        const existingAttendance = await Attendance.findOne({
            user: userId,
            type: { $in: ["clock_in", "sick_leave"] },
            createdAt: { $gte: today }
        });

        if (existingAttendance) {
            return res.status(400).json({
                status: "error",
                message: "Anda sudah melakukan absensi hari ini"
            });
        }

        // Buat record sakit
        const sickAttendance = new Attendance({
            user: userId,
            type: "sick_leave",
            attendance_type: "sick",
            sick_leave: {
                description,
                medical_certificate: medicalCertificate,
                start_date: startDate,
                end_date: endDate
            }
        });

        await sickAttendance.save();
        await logActivity(sickAttendance._id, "Sick Leave", userId, "Attendance");

        console.log('Sick leave created successfully:', sickAttendance._id);

        res.status(201).json({
            status: "success",
            message: "Izin sakit berhasil dicatat",
            data: sickAttendance
        });
    } catch (err) {
        console.error('❌ Error in sickLeave:', err);
        next(err);
    }
};


export const getTodayStatus = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const clockIn = await Attendance.findOne({
            user: userId,
            type: "clock_in",
            createdAt: { $gte: today }
        });

        const clockOut = await Attendance.findOne({
            user: userId,
            type: "clock_out",
            createdAt: { $gte: today }
        });

        const sickLeave = await Attendance.findOne({
            user: userId,
            type: "sick_leave",
            createdAt: { $gte: today }
        });

        res.status(200).json({
            status: "success",
            data: {
                clockIn: clockIn ? {
                    time: clockIn.createdAt,
                    location: clockIn.location,
                    attendance_type: clockIn.attendance_type
                } : null,
                clockOut: clockOut ? {
                    time: clockOut.createdAt,
                    location: clockOut.location,
                    attendance_type: clockOut.attendance_type
                } : null,
                sickLeave: sickLeave ? {
                    time: sickLeave.createdAt,
                    description: sickLeave.sick_leave?.description,
                    start_date: sickLeave.sick_leave?.start_date,
                    end_date: sickLeave.sick_leave?.end_date,
                    medical_certificate: sickLeave.sick_leave?.medical_certificate
                } : null,
                hasClockedIn: !!clockIn,
                hasClockedOut: !!clockOut,
                isSickLeave: !!sickLeave,
                todayStatus: sickLeave ? "sick" : clockIn ? "present" : "absent",
                currentType: clockIn?.attendance_type || sickLeave?.attendance_type || null
            }
        });
    } catch (err) {
        next(err);
    }
};

export const getAttendanceHistory = async (req, res, next) => {
    try {
        const userId = req.user._id;
        let { year, month } = req.query;

        const now = new Date();
        year = parseInt(year) || now.getFullYear();
        month = parseInt(month) || now.getMonth() + 1;

        const holidays = await getIndonesianHolidays(year);
        const calendarData = {};

        const daysInMonth = new Date(year, month, 0).getDate();

        // Buat calendar data
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

            const isHoliday = holidays.some((h) => h.date === dateString);

            calendarData[dateString] = {
                date: dateString,
                clockIn: null,
                clockOut: null,
                sickLeave: null,
                status: isHoliday ? "holiday" : "absent",
                attendance_type: null,
                isHoliday,
                holidayName: holidays.find((h) => h.date === dateString)?.name || null
            };
        }

        // Cari semua attendance user di bulan tersebut
        const attendance = await Attendance.find({
            user: userId,
            createdAt: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1)
            }
        }).sort({ createdAt: 1 });

        console.log('Total records:', attendance.length);

        attendance.forEach((record) => {
            const recordDate = new Date(record.createdAt);
            const dateString = `${recordDate.getFullYear()}-${(recordDate.getMonth() + 1).toString().padStart(2, "0")}-${recordDate.getDate().toString().padStart(2, "0")}`;

            if (calendarData[dateString]) {
                if (record.type === "clock_in") {
                    calendarData[dateString].clockIn = record.createdAt;
                    calendarData[dateString].attendance_type = record.attendance_type;
                    if (calendarData[dateString].status === "absent") {
                        calendarData[dateString].status = "present";
                    }
                } else if (record.type === "clock_out") {
                    calendarData[dateString].clockOut = record.createdAt;
                } else if (record.type === "sick_leave") {
                    calendarData[dateString].sickLeave = {
                        description: record.sick_leave?.description,
                        medical_certificate: record.sick_leave?.medical_certificate
                    };
                    calendarData[dateString].status = "sick";
                    calendarData[dateString].attendance_type = "sick";
                }
            }
        });

        res.status(200).json({
            status: "success",
            data: {
                attendance: Object.values(calendarData),
                holidays: holidays.map((h) => h.date),
                currentMonth: month,
                currentYear: year,
                daysInMonth
            }
        });
    } catch (err) {
        next(err);
    }
};

export const getAllAttendance = async (req, res, next) => {
    try {
        let {
            page = 1,
            size = 10,
            startDate,
            endDate,
            userId,
            type,
            attendance_type,
            keyword
        } = req.query;

        page = parseInt(page);
        size = parseInt(size);

        // Build aggregation pipeline
        const pipeline = [];

        // Match stage untuk filter dasar
        const matchStage = {};

        // Filter by user ID
        if (userId && userId !== "all") {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid user ID format"
                });
            }
            matchStage.user = new mongoose.Types.ObjectId(userId);
        }

        // Filter by type
        if (type && type !== "all") {
            matchStage.type = type;
        }

        // Filter by attendance_type
        if (attendance_type && attendance_type !== "all") {
            matchStage.attendance_type = attendance_type;
        }

        // Filter by date range
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                matchStage.createdAt.$gte = start;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                matchStage.createdAt.$lte = end;
            }
        }

        // Add initial match stage
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        // Lookup user data
        pipeline.push({
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        });

        // Unwind user array
        pipeline.push({ $unwind: "$user" });

        // Filter by keyword setelah punya user data
        if (keyword) {
            pipeline.push({
                $match: {
                    $or: [
                        { "user.name": { $regex: keyword, $options: "i" } },
                        { "user.email": { $regex: keyword, $options: "i" } },
                    ]
                }
            });
        }

        // Projection untuk format response yang clean
        pipeline.push({
            $project: {
                type: 1,
                attendance_type: 1,
                location: 1,
                sick_leave: 1,
                createdAt: 1,
                updatedAt: 1,
                user: {
                    _id: "$user._id",
                    name: "$user.name",
                    email: "$user.email",
                    position: "$user.position",
                    department: "$user.department"
                }
            }
        });

        // Sort, skip, limit untuk pagination
        pipeline.push(
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * size },
            { $limit: size }
        );

        console.log('Aggregation pipeline:', JSON.stringify(pipeline, null, 2));

        // Execute aggregation untuk data
        const attendance = await Attendance.aggregate(pipeline);

        // Get total count (tanpa pagination)
        const countPipeline = [...pipeline];
        countPipeline.splice(countPipeline.length - 3, 3); // Remove sort, skip, limit
        countPipeline.push({ $count: "total" });

        const totalResult = await Attendance.aggregate(countPipeline);
        const total = totalResult.length > 0 ? totalResult[0].total : 0;

        res.status(200).json({
            status: "success",
            message: "Attendance data retrieved successfully",
            total,
            data: attendance,
        });
    } catch (err) {
        console.error('Error in getAllAttendance:', err);
        next(err);
    }
};


export const exportAttendanceReport = async (req, res, next) => {
    try {
        const {
            startDate,
            endDate,
            userId
        } = req.query;

        // Validasi required fields
        if (!startDate || !endDate) {
            return res.status(400).json({
                status: "error",
                message: "Start date and end date are required"
            });
        }

        // Build aggregation pipeline
        const pipeline = [];

        // Match stage untuk filter dasar
        const matchStage = {};

        // Filter by user ID
        if (userId && userId !== "all") {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid user ID format"
                });
            }
            matchStage.user = new mongoose.Types.ObjectId(userId);
        }

        // Filter by date range
        if (startDate && endDate) {
            matchStage.createdAt = {};
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            matchStage.createdAt.$gte = start;

            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            matchStage.createdAt.$lte = end;
        }

        // Add initial match stage
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        // Lookup user data
        pipeline.push({
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        });

        // Unwind user array
        pipeline.push({ $unwind: "$user" });

        // Projection untuk format response yang clean
        pipeline.push({
            $project: {
                type: 1,
                attendance_type: 1,
                location: 1,
                sick_leave: 1,
                createdAt: 1,
                updatedAt: 1,
                "user.name": 1,
                "user.email": 1,
                "user.position": 1,
                "user.department": 1
            }
        });

        // Sort by date
        pipeline.push({ $sort: { createdAt: 1 } });

        console.log('Export pipeline:', JSON.stringify(pipeline, null, 2));

        // Execute aggregation
        const attendanceData = await Attendance.aggregate(pipeline);

        // Jika tidak ada data
        if (attendanceData.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No attendance data found for the selected criteria"
            });
        }

        // Create Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendance Report');

        // Set column headers
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 12 },
            { header: 'Time', key: 'time', width: 10 },
            { header: 'Employee Name', key: 'employeeName', width: 20 },
            { header: 'Employee Email', key: 'employeeEmail', width: 25 },
            { header: 'Position', key: 'position', width: 15 },
            { header: 'Department', key: 'department', width: 15 },
            { header: 'Type', key: 'type', width: 12 },
            { header: 'Attendance Type', key: 'attendanceType', width: 12 },
            { header: 'Location', key: 'location', width: 30 },
            { header: 'Sick Description', key: 'sickDescription', width: 25 },
            { header: 'Sick Start Date', key: 'sickStartDate', width: 12 },
            { header: 'Sick End Date', key: 'sickEndDate', width: 12 }
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' }
        };

        // Add data rows
        attendanceData.forEach(record => {
            const row = worksheet.addRow({
                date: new Date(record.createdAt).toLocaleDateString('id-ID'),
                time: new Date(record.createdAt).toLocaleTimeString('id-ID'),
                employeeName: record.user.name,
                employeeEmail: record.user.email,
                position: record.user.position || 'N/A',
                department: record.user.department || 'N/A',
                type: record.type === 'clock_in' ? 'Clock In' :
                      record.type === 'clock_out' ? 'Clock Out' :
                      record.type === 'sick_leave' ? 'Sick Leave' : record.type,
                attendanceType: record.attendance_type === 'onsite' ? 'Onsite' :
                              record.attendance_type === 'hybrid' ? 'Hybrid' :
                              record.attendance_type === 'sick' ? 'Sick' : record.attendance_type,
                location: record.location ?
                         `${record.location.address} (${record.location.lat}, ${record.location.lng})` :
                         'N/A',
                sickDescription: record.sick_leave?.description || 'N/A',
                sickStartDate: record.sick_leave?.start_date ?
                              new Date(record.sick_leave.start_date).toLocaleDateString('id-ID') :
                              'N/A',
                sickEndDate: record.sick_leave?.end_date ?
                            new Date(record.sick_leave.end_date).toLocaleDateString('id-ID') :
                            'N/A'
            });

            // Add border to each cell in the row
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        // Set response headers untuk download Excel
        const fileName = `attendance_report_${startDate}_to_${endDate}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        // Write Excel to response
        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error('Error in exportAttendanceReport:', err);
        next(err);
    }
};

