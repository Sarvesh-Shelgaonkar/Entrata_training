import API from "./axios";

export const getMyProfile = () => API.get("/profiles/me");

export const getProfileByUserId = (userId) => API.get(`/profiles/${userId}`);

export const createProfile = (data) => API.post("/profiles", data);

export const updateProfile = (data) => API.put("/profiles/me", data);

export const deleteProfile = () => API.delete("/profiles/me");
