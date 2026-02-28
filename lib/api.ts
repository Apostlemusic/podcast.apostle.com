import api from "@/lib/axios"

// --- Authentication ---
export const register = (data: any) => api.post("/api/podcaster/register", data);
export const login = (data: any) => api.post("/api/podcaster/login", data);
export const verifyOtp = (data: any) => api.post("/api/podcaster/verifyOtp", data);
export const resendOtp = (data: any) => api.post("/api/podcaster/resendOtp", data);
export const forgotPassword = (data: any) => api.post("/api/podcaster/forgotPassword", data);
export const resetPassword = (data: any) => api.post("/api/podcaster/resetPassword", data);
export const isVerified = (email: string) => api.get(`/api/podcaster/isVerified?email=${email}`);
export const logout = () => api.post("/api/podcaster/logout");

// --- Profile ---
export const getMe = () => api.get("/api/podcaster/profile/me");
export const editProfile = (data: any) => api.post("/api/podcaster/profile/edit", data);

// --- Search ---
export const searchArtists = (query: string) => api.get(`/api/podcaster/getPodcasterByName/${query}`);

// --- Podcast Management ---
export const uploadPodcast = (data: any) => api.post("/api/podcaster/podcast/upload", data);
export const editPodcast = (data: any) => api.post("/api/podcaster/podcast/edit", data);
export const removePodcast = (id: string) => api.post("/api/podcaster/podcast/remove", { podcastId: id });
export const hidePodcast = (id: string) => api.post("/api/podcaster/podcast/hide", { podcastId: id });
export const unhidePodcast = (id: string) => api.post("/api/podcaster/podcast/unhide", { podcastId: id });
export const getMyPodcasts = () => api.get("/api/podcaster/podcast/my");

// --- Account ---
export const deleteAccount = () => api.delete("/api/podcaster/account");

// --- podcasterApi Object ---
export const podcasterApi = {
    // Auth & Account
    register,
    login,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    isVerified,
    logout,
    deleteAccount,

    // Profile
    getMe,
    editProfile,


    // Podcast Management
    uploadPodcast,
    editPodcast,
    removePodcast,
    hidePodcast,
    unhidePodcast,
    getMyPodcasts,

    // Search
    searchArtists,
};

export const api_named = podcasterApi;
export { podcasterApi as api };

export default {
    ...podcasterApi,
    podcaster: podcasterApi,
}
