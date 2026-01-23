const getBackendOrigin = () => {
    const apiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;

    if (!apiBase) return "";

    return apiBase.replace(/\/api\/?$/, "");
};

export const toFileUrl = (pathOrUrl?: string) => {
    if (!pathOrUrl) return "";

    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

    const normalized = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;

    const origin = getBackendOrigin();
    if (!origin) return normalized;

    return `${origin}${normalized}`;
};
