import axios from 'axios';
import queryString from 'query-string';
import { QuoteRequestInterface, QuoteRequestGetQueryInterface } from 'interfaces/quote-request';
import { GetQueryInterface } from '../../interfaces';

export const getQuoteRequests = async (query?: QuoteRequestGetQueryInterface) => {
  const response = await axios.get(`/api/quote-requests${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createQuoteRequest = async (quoteRequest: QuoteRequestInterface) => {
  const response = await axios.post('/api/quote-requests', quoteRequest);
  return response.data;
};

export const updateQuoteRequestById = async (id: string, quoteRequest: QuoteRequestInterface) => {
  const response = await axios.put(`/api/quote-requests/${id}`, quoteRequest);
  return response.data;
};

export const getQuoteRequestById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/quote-requests/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteQuoteRequestById = async (id: string) => {
  const response = await axios.delete(`/api/quote-requests/${id}`);
  return response.data;
};
