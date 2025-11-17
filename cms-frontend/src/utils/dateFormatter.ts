export const formatTime = (date: Date): string => {
    const jakartaDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    return jakartaDate.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

export const formatDate = (date: Date): string => {
    const jakartaDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    return jakartaDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatTimeFromString = (timeString: string): string => {
    const date = new Date(new Date(timeString).toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });
};
