import axios from "axios";

// const API = axios.create({ baseURL: process.env.BACKEND_URL });

// API.interceptors.request.use((req) => {
//     if(localStorage.getItem('profile')){
//         req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
//     }
//     return req;
// })

export const fetchInvoice = (id) => axios.get(`/invoices/${id}`)
export const addInvoice = (invoice) => axios.post('/invoices', invoice);
export const updateInvoice = (id, updatedInvoice) => axios.patch(`/invoices/${id}`, updatedInvoice);
export const deleteInvoice = (id) => axios.delete(`/invoices/${id}`);
export const fetchInvoicesByUser = (searchQuery) => axios.get(`/invoices/user?searchQuery=${searchQuery.search}`);

export const fetchClient = (id) => axios.get(`/clients/${id}`);
export const fetchClients = (page) => axios.get(`/clients?page=${page}`);
export const addClient = (client) => axios.post('/clients', client);
export const updateClient = (id, updatedClient) => axios.patch(`/clients/${id}`, updatedClient);
export const deleteClient = (id) => axios.delete(`/clients/${id}`);
export const fetchClientByUser = (searchQuery) => axios.get(`/clients/user?searchQuery=${searchQuery.search}`);

export const signIn = (formData) => axios.post('/users/signin', formData);
export const signUp = (formData) => axios.post('/users/signup', formData);
export const forgot = (formData) => axios.post('/users/forgot', formData);
export const reset = (formData) => axios.post('/users/reset', formData);
export const logout = () => axios.get('/users/logout');
export const loginStatus = () => axios.get('/users/loggedIn');


export const fetchProfilesBySearch = (searchQuery) => axios.get(`/profiles/search?searchQuery=${searchQuery.search || searchQuery.year || 'none'}`);
export const fetchProfile = (id) => axios.get(`/profiles/${id}`);
export const fetchProfiles = () => axios.get('/profiles');
export const fetchProfilesByUser = (searchQuery) => axios.get(`/profiles?searchQuery=${searchQuery.search}`);
export const createProfile = (newProfile) => axios.post('/profiles', newProfile);
export const updateProfile = (id, updatedProfile) => axios.patch(`/profiles/${id}`, updatedProfile);
export const deleteProfile = (id) => axios.delete(`/profiles/${id}`);


