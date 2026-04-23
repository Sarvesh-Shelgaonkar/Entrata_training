import API from "./axios";

export const getPosts = (params = {}) => API.get("/posts", { params });

export const getPostById = (id) => API.get(`/posts/${id}`);

export const createPost = (data) => API.post("/posts", data);

export const updatePost = (id, data) => API.put(`/posts/${id}`, data);

export const deletePost = (id) => API.delete(`/posts/${id}`);

export const upvotePost = (id) => API.post(`/posts/${id}/upvote`);

export const downvotePost = (id) => API.post(`/posts/${id}/downvote`);
