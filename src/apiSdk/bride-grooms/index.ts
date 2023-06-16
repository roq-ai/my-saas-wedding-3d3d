import axios from 'axios';
import queryString from 'query-string';
import { BrideGroomInterface, BrideGroomGetQueryInterface } from 'interfaces/bride-groom';
import { GetQueryInterface } from '../../interfaces';

export const getBrideGrooms = async (query?: BrideGroomGetQueryInterface) => {
  const response = await axios.get(`/api/bride-grooms${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBrideGroom = async (brideGroom: BrideGroomInterface) => {
  const response = await axios.post('/api/bride-grooms', brideGroom);
  return response.data;
};

export const updateBrideGroomById = async (id: string, brideGroom: BrideGroomInterface) => {
  const response = await axios.put(`/api/bride-grooms/${id}`, brideGroom);
  return response.data;
};

export const getBrideGroomById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/bride-grooms/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBrideGroomById = async (id: string) => {
  const response = await axios.delete(`/api/bride-grooms/${id}`);
  return response.data;
};
