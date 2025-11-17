import activityLogSchema from "../models/activityLogSchema.js";

/**
 * Buat catatan trail aktivitas user
 * @param {ObjectId} userId - user yang terpengaruh (misal yang diupdate/dihapus)
 * @param {String} action - aksi yang dilakukan ("Insert", "Update", "Delete", "Change Status")
 * @param {ObjectId} performedBy - user yang melakukan aksi
 * @param {String} moduleName - nama modul, contoh: "Users"
 */
export const logActivity = async (userId, action, performedBy, moduleName = "General") => {
    try {
        await activityLogSchema.create({
            user: userId,
            action,
            performedBy,
            module: moduleName
        });
    } catch (err) {
        console.error("Error creating trail:", err.message);
    }
};

export const getIndonesianHolidays = async (year = 2024) => {
    const holidaysByYear = {
        // 2024: [{
        //         date: '2024-01-01',
        //         name: 'Tahun Baru 2024'
        //     },
        //     {
        //         date: '2024-02-08',
        //         name: 'Isra Mikraj'
        //     },
        //     {
        //         date: '2024-02-10',
        //         name: 'Tahun Baru Imlek 2575'
        //     },
        //     {
        //         date: '2024-03-11',
        //         name: 'Hari Suci Nyepi'
        //     },
        //     {
        //         date: '2024-03-29',
        //         name: 'Wafat Isa Almasih'
        //     },
        //     {
        //         date: '2024-03-31',
        //         name: 'Hari Paskah'
        //     },
        //     {
        //         date: '2024-04-10',
        //         name: 'Hari Raya Idul Fitri 1445 H'
        //     },
        //     {
        //         date: '2024-04-11',
        //         name: 'Hari Raya Idul Fitri 1445 H'
        //     },
        //     {
        //         date: '2024-05-01',
        //         name: 'Hari Buruh Internasional'
        //     },
        //     {
        //         date: '2024-05-09',
        //         name: 'Kenaikan Isa Almasih'
        //     },
        //     {
        //         date: '2024-05-23',
        //         name: 'Hari Raya Waisak 2568'
        //     },
        //     {
        //         date: '2024-06-01',
        //         name: 'Hari Lahir Pancasila'
        //     },
        //     {
        //         date: '2024-06-17',
        //         name: 'Hari Raya Idul Adha 1445 H'
        //     },
        //     {
        //         date: '2024-07-07',
        //         name: 'Tahun Baru Islam 1446 H'
        //     },
        //     {
        //         date: '2024-08-17',
        //         name: 'Hari Kemerdekaan RI'
        //     },
        //     {
        //         date: '2024-09-16',
        //         name: 'Maulid Nabi Muhammad SAW'
        //     },
        //     {
        //         date: '2024-12-25',
        //         name: 'Hari Raya Natal'
        //     },
        // ],
        // 2025: [{
        //         date: '2025-01-01',
        //         name: 'Tahun Baru 2025'
        //     },
        //     {
        //         date: '2025-01-28',
        //         name: 'Isra Mikraj'
        //     },
        //     {
        //         date: '2025-01-29',
        //         name: 'Cuti Bersama Isra Mikraj'
        //     },
        //     {
        //         date: '2025-01-29',
        //         name: 'Tahun Baru Imlek 2576'
        //     },
        //     {
        //         date: '2025-03-29',
        //         name: 'Hari Suci Nyepi'
        //     },
        //     {
        //         date: '2025-04-18',
        //         name: 'Wafat Isa Almasih'
        //     },
        //     {
        //         date: '2025-04-20',
        //         name: 'Hari Paskah'
        //     },
        //     {
        //         date: '2025-03-31',
        //         name: 'Hari Raya Idul Fitri 1446 H'
        //     },
        //     {
        //         date: '2025-04-01',
        //         name: 'Hari Raya Idul Fitri 1446 H'
        //     },
        //     {
        //         date: '2025-05-01',
        //         name: 'Hari Buruh Internasional'
        //     },
        //     {
        //         date: '2025-05-29',
        //         name: 'Kenaikan Isa Almasih'
        //     },
        //     {
        //         date: '2025-06-05',
        //         name: 'Hari Raya Waisak 2569'
        //     },
        //     {
        //         date: '2025-06-01',
        //         name: 'Hari Lahir Pancasila'
        //     },
        //     {
        //         date: '2025-06-07',
        //         name: 'Hari Raya Idul Adha 1446 H'
        //     },
        //     {
        //         date: '2025-06-27',
        //         name: 'Tahun Baru Islam 1447 H'
        //     },
        //     {
        //         date: '2025-08-17',
        //         name: 'Hari Kemerdekaan RI'
        //     },
        //     {
        //         date: '2025-09-05',
        //         name: 'Maulid Nabi Muhammad SAW'
        //     },
        //     {
        //         date: '2025-12-25',
        //         name: 'Hari Raya Natal'
        //     },
        // ],
        // 2026: [{
        //         date: '2026-01-01',
        //         name: 'Tahun Baru 2026'
        //     },
        //     {
        //         date: '2026-01-17',
        //         name: 'Isra Mikraj'
        //     },
        //     {
        //         date: '2026-02-17',
        //         name: 'Tahun Baru Imlek 2577'
        //     },
        //     {
        //         date: '2026-03-19',
        //         name: 'Hari Suci Nyepi'
        //     },
        //     {
        //         date: '2026-04-03',
        //         name: 'Wafat Isa Almasih'
        //     },
        //     {
        //         date: '2026-04-05',
        //         name: 'Hari Paskah'
        //     },
        //     {
        //         date: '2026-03-20',
        //         name: 'Hari Raya Idul Fitri 1447 H'
        //     },
        //     {
        //         date: '2026-03-21',
        //         name: 'Hari Raya Idul Fitri 1447 H'
        //     },
        //     {
        //         date: '2026-05-01',
        //         name: 'Hari Buruh Internasional'
        //     },
        //     {
        //         date: '2026-05-14',
        //         name: 'Kenaikan Isa Almasih'
        //     },
        //     {
        //         date: '2026-05-24',
        //         name: 'Hari Raya Waisak 2570'
        //     },
        //     {
        //         date: '2026-06-01',
        //         name: 'Hari Lahir Pancasila'
        //     },
        //     {
        //         date: '2026-05-27',
        //         name: 'Hari Raya Idul Adha 1447 H'
        //     },
        //     {
        //         date: '2026-07-17',
        //         name: 'Tahun Baru Islam 1448 H'
        //     },
        //     {
        //         date: '2026-08-17',
        //         name: 'Hari Kemerdekaan RI'
        //     },
        //     {
        //         date: '2026-08-25',
        //         name: 'Maulid Nabi Muhammad SAW'
        //     },
        //     {
        //         date: '2026-12-25',
        //         name: 'Hari Raya Natal'
        //     },
        // ],
        // 2027: [{
        //         date: '2027-01-01',
        //         name: 'Tahun Baru 2027'
        //     },
        //     {
        //         date: '2027-02-06',
        //         name: 'Isra Mikraj'
        //     },
        //     {
        //         date: '2027-02-06',
        //         name: 'Tahun Baru Imlek 2578'
        //     },
        //     {
        //         date: '2027-03-08',
        //         name: 'Hari Suci Nyepi'
        //     },
        //     {
        //         date: '2027-03-26',
        //         name: 'Wafat Isa Almasih'
        //     },
        //     {
        //         date: '2027-03-28',
        //         name: 'Hari Paskah'
        //     },
        //     {
        //         date: '2027-03-09',
        //         name: 'Hari Raya Idul Fitri 1448 H'
        //     },
        //     {
        //         date: '2027-03-10',
        //         name: 'Hari Raya Idul Fitri 1448 H'
        //     },
        //     {
        //         date: '2027-05-01',
        //         name: 'Hari Buruh Internasional'
        //     },
        //     {
        //         date: '2027-05-06',
        //         name: 'Kenaikan Isa Almasih'
        //     },
        //     {
        //         date: '2027-05-13',
        //         name: 'Hari Raya Waisak 2571'
        //     },
        //     {
        //         date: '2027-06-01',
        //         name: 'Hari Lahir Pancasila'
        //     },
        //     {
        //         date: '2027-05-17',
        //         name: 'Hari Raya Idul Adha 1448 H'
        //     },
        //     {
        //         date: '2027-07-07',
        //         name: 'Tahun Baru Islam 1449 H'
        //     },
        //     {
        //         date: '2027-08-17',
        //         name: 'Hari Kemerdekaan RI'
        //     },
        //     {
        //         date: '2027-08-15',
        //         name: 'Maulid Nabi Muhammad SAW'
        //     },
        //     {
        //         date: '2027-12-25',
        //         name: 'Hari Raya Natal'
        //     },
        // ],
        // 2028: [{
        //         date: '2028-01-01',
        //         name: 'Tahun Baru 2028'
        //     },
        //     {
        //         date: '2028-01-26',
        //         name: 'Isra Mikraj'
        //     },
        //     {
        //         date: '2028-01-26',
        //         name: 'Tahun Baru Imlek 2579'
        //     },
        //     {
        //         date: '2028-03-28',
        //         name: 'Hari Suci Nyepi'
        //     },
        //     {
        //         date: '2028-04-14',
        //         name: 'Wafat Isa Almasih'
        //     },
        //     {
        //         date: '2028-04-16',
        //         name: 'Hari Paskah'
        //     },
        //     {
        //         date: '2028-02-27',
        //         name: 'Hari Raya Idul Fitri 1449 H'
        //     },
        //     {
        //         date: '2028-02-28',
        //         name: 'Hari Raya Idul Fitri 1449 H'
        //     },
        //     {
        //         date: '2028-05-01',
        //         name: 'Hari Buruh Internasional'
        //     },
        //     {
        //         date: '2028-05-25',
        //         name: 'Kenaikan Isa Almasih'
        //     },
        //     {
        //         date: '2028-05-02',
        //         name: 'Hari Raya Waisak 2572'
        //     },
        //     {
        //         date: '2028-06-01',
        //         name: 'Hari Lahir Pancasila'
        //     },
        //     {
        //         date: '2028-05-06',
        //         name: 'Hari Raya Idul Adha 1449 H'
        //     },
        //     {
        //         date: '2028-06-26',
        //         name: 'Tahun Baru Islam 1450 H'
        //     },
        //     {
        //         date: '2028-08-17',
        //         name: 'Hari Kemerdekaan RI'
        //     },
        //     {
        //         date: '2028-08-04',
        //         name: 'Maulid Nabi Muhammad SAW'
        //     },
        //     {
        //         date: '2028-12-25',
        //         name: 'Hari Raya Natal'
        //     },
        // ],
        // 2029: [{
        //         date: '2029-01-01',
        //         name: 'Tahun Baru 2029'
        //     },
        //     {
        //         date: '2029-02-13',
        //         name: 'Isra Mikraj'
        //     },
        //     {
        //         date: '2029-02-13',
        //         name: 'Tahun Baru Imlek 2580'
        //     },
        //     {
        //         date: '2029-03-16',
        //         name: 'Hari Suci Nyepi'
        //     },
        //     {
        //         date: '2029-03-30',
        //         name: 'Wafat Isa Almasih'
        //     },
        //     {
        //         date: '2029-04-01',
        //         name: 'Hari Paskah'
        //     },
        //     {
        //         date: '2029-02-14',
        //         name: 'Hari Raya Idul Fitri 1450 H'
        //     },
        //     {
        //         date: '2029-02-15',
        //         name: 'Hari Raya Idul Fitri 1450 H'
        //     },
        //     {
        //         date: '2029-05-01',
        //         name: 'Hari Buruh Internasional'
        //     },
        //     {
        //         date: '2029-05-10',
        //         name: 'Kenaikan Isa Almasih'
        //     },
        //     {
        //         date: '2029-05-20',
        //         name: 'Hari Raya Waisak 2573'
        //     },
        //     {
        //         date: '2029-06-01',
        //         name: 'Hari Lahir Pancasila'
        //     },
        //     {
        //         date: '2029-05-25',
        //         name: 'Hari Raya Idul Adha 1450 H'
        //     },
        //     {
        //         date: '2029-06-14',
        //         name: 'Tahun Baru Islam 1451 H'
        //     },
        //     {
        //         date: '2029-08-17',
        //         name: 'Hari Kemerdekaan RI'
        //     },
        //     {
        //         date: '2029-07-24',
        //         name: 'Maulid Nabi Muhammad SAW'
        //     },
        //     {
        //         date: '2029-12-25',
        //         name: 'Hari Raya Natal'
        //     },
        // ],
        // 2030: [{
        //         date: '2030-01-01',
        //         name: 'Tahun Baru 2030'
        //     },
        //     {
        //         date: '2030-02-03',
        //         name: 'Isra Mikraj'
        //     },
        //     {
        //         date: '2030-02-03',
        //         name: 'Tahun Baru Imlek 2581'
        //     },
        //     {
        //         date: '2030-03-05',
        //         name: 'Hari Suci Nyepi'
        //     },
        //     {
        //         date: '2030-04-19',
        //         name: 'Wafat Isa Almasih'
        //     },
        //     {
        //         date: '2030-04-21',
        //         name: 'Hari Paskah'
        //     },

        //     // Idul Fitri pertama (1451 H)
        //     {
        //         date: '2030-01-23',
        //         name: 'Hari Raya Idul Fitri 1451 H'
        //     },
        //     {
        //         date: '2030-01-24',
        //         name: 'Hari Raya Idul Fitri 1451 H'
        //     },

        //     {
        //         date: '2030-12-13',
        //         name: 'Hari Raya Idul Fitri 1452 H'
        //     },
        //     {
        //         date: '2030-12-14',
        //         name: 'Hari Raya Idul Fitri 1452 H'
        //     },

        //     {
        //         date: '2030-05-01',
        //         name: 'Hari Buruh Internasional'
        //     },
        //     {
        //         date: '2030-05-30',
        //         name: 'Kenaikan Isa Almasih'
        //     },
        //     {
        //         date: '2030-05-09',
        //         name: 'Hari Raya Waisak 2574'
        //     },
        //     {
        //         date: '2030-06-01',
        //         name: 'Hari Lahir Pancasila'
        //     },
        //     {
        //         date: '2030-05-15',
        //         name: 'Hari Raya Idul Adha 1451 H'
        //     },
        //     {
        //         date: '2030-06-04',
        //         name: 'Tahun Baru Islam 1452 H'
        //     },
        //     {
        //         date: '2030-08-17',
        //         name: 'Hari Kemerdekaan RI'
        //     },
        //     {
        //         date: '2030-07-13',
        //         name: 'Maulid Nabi Muhammad SAW'
        //     },
        //     {
        //         date: '2030-12-25',
        //         name: 'Hari Raya Natal'
        //     },
        // ],

    };

    return holidaysByYear[year] || [];
};

// Filter libur berdasarkan bulan
export const getHolidaysByMonth = async (year, month) => {
    const allHolidays = await getIndonesianHolidays(year);
    return allHolidays.filter(holiday => {
        const holidayMonth = parseInt(holiday.date.split('-')[1]);
        return holidayMonth === month;
    });
};
