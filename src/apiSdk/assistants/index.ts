import axios from 'axios';
import queryString from 'query-string';
import { AssistantInterface, AssistantGetQueryInterface } from 'interfaces/assistant';
import { GetQueryInterface } from '../../interfaces';

export const getAssistants = async (query?: AssistantGetQueryInterface) => {
  const response = await axios.get(`/api/assistants${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createAssistant = async (assistant: AssistantInterface) => {
  const response = await axios.post('/api/assistants', assistant);
  return response.data;
};

export const updateAssistantById = async (id: string, assistant: AssistantInterface) => {
  const response = await axios.put(`/api/assistants/${id}`, assistant);
  return response.data;
};

export const getAssistantById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/assistants/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAssistantById = async (id: string) => {
  const response = await axios.delete(`/api/assistants/${id}`);
  return response.data;
};
