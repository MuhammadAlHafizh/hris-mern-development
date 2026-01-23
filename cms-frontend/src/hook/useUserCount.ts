import { useEffect, useState } from "react";
import { userService } from "../services/userService";

export const useUserCount = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [loadingUsers, setLoadingUsers] = useState(true);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setLoadingUsers(true);

                // ambil 1 data aja, yg penting TOTAL dari backend
                // kalau kamu mau semua status, ganti "active" jadi undefined
                const res = await userService.getUsers();
                console.log(res)
                if (mounted) setTotalUsers(res.total || 0);
            } catch (e) {
                if (mounted) setTotalUsers(0);
            } finally {
                if (mounted) setLoadingUsers(false);
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, []);

    return { totalUsers, loadingUsers };
};
