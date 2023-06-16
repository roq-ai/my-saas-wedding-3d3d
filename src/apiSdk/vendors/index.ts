import axios from 'axios';
import queryString from 'query-string';
import { VendorInterface, VendorGetQueryInterface } from 'interfaces/vendor';
import { GetQueryInterface } from '../../interfaces';

export const getVendors = async (query?: VendorGetQueryInterface) => {
  const response = await axios.get(`/api/vendors${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createVendor = async (vendor: VendorInterface) => {
  const response = await axios.post('/api/vendors', vendor);
  return response.data;
};

export const updateVendorById = async (id: string, vendor: VendorInterface) => {
  const response = await axios.put(`/api/vendors/${id}`, vendor);
  return response.data;
};

export const getVendorById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/vendors/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteVendorById = async (id: string) => {
  const response = await axios.delete(`/api/vendors/${id}`);
  return response.data;
};
