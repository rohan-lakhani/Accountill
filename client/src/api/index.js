import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

const token = JSON.parse(localStorage.getItem("profile"))?.token;
console.log(token);

axios.defaults.headers.common["Authorization"] = token;

// const API = axios.create({ baseURL: process.env.BACKEND_URL });

// API.interceptors.request.use((req) => {
//     if(localStorage.getItem('profile')){
//         req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
//     }
//     return req;
// })

export const fetchInvoice = (id) => axios.get(`/api/invoices/${id}`);
export const addInvoice = (invoice) => axios.post("/api/invoices", invoice);
export const updateInvoice = (id, updatedInvoice) => axios.patch(`/api/invoices/${id}`, updatedInvoice);
export const deleteInvoice = (id) => axios.delete(`/api/invoices/${id}`);
export const fetchInvoicesByUser = (searchQuery) => axios.get(`/api/invoices/user?searchQuery=${searchQuery.search}`);

export const fetchClient = (id) => axios.get(`/api/clients/${id}`);
export const fetchClients = (page) => axios.get(`/api/clients?page=${page}`);
export const addClient = (client) => axios.post("/api/clients", client);
export const updateClient = (id, updatedClient) => axios.patch(`/api/clients/${id}`, updatedClient);
export const deleteClient = (id) => axios.delete(`/api/clients/${id}`);
export const fetchClientByUser = (searchQuery) => axios.get(`/api/clients/user?searchQuery=${searchQuery.search}`);

export const signIn = (formData) => axios.post("/api/users/signin", formData);
export const signUp = (formData) => axios.post("/api/users/signup", formData);
export const forgot = (formData) => axios.post("/api/users/forgot", formData);
export const reset = (formData) => axios.put("/api/users/reset", formData);
export const logout = () => axios.get("/api/users/logout");
export const loginStatus = () => axios.get("/api/users/loggedIn");

export const fetchProfilesBySearch = (searchQuery) =>
    axios.get(`/api/profiles/search?searchQuery=${searchQuery.search || searchQuery.year || "none"}`);
export const fetchProfile = (id) => axios.get(`/api/profiles/${id}`);
export const fetchProfiles = () => axios.get("/api/profiles");
export const fetchProfilesByUser = (searchQuery) => axios.get(`/api/profiles?searchQuery=${searchQuery.search}`);
export const createProfile = (newProfile) => axios.post("/api/profiles", newProfile);
export const updateProfile = (id, updatedProfile) => axios.patch(`/api/profiles/${id}`, updatedProfile);
export const deleteProfile = (id) => axios.delete(`/api/profiles/${id}`);
