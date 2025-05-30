import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Citas
export const getCitas = () => axios.get(`${API_URL}/citas`);
export const createCita = (data) => axios.post(`${API_URL}/citas`, data);
export const updateCita = (id, data) => axios.put(`${API_URL}/citas/${id}`, data);
export const deleteCita = (id) => axios.delete(`${API_URL}/citas/${id}`);

// Barberos
export const getBarberos = () => axios.get(`${API_URL}/barberos`);
export const createBarbero = (data) => axios.post(`${API_URL}/barberos`, data);
export const updateBarbero = (id, data) => axios.put(`${API_URL}/barberos/${id}`, data);
export const deleteBarbero = (id) => axios.delete(`${API_URL}/barberos/${id}`);

// Clientes
export const getClientes = () => axios.get(`${API_URL}/clientes`);
export const createCliente = (data) => axios.post(`${API_URL}/clientes`, data);
export const updateCliente = (id, data) => axios.put(`${API_URL}/clientes/${id}`, data);
export const deleteCliente = (id) => axios.delete(`${API_URL}/clientes/${id}`);