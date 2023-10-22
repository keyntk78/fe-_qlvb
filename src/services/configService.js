import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getConfigs(params) {
  try {
    const response = await sendRequest(`Config/GetAllByParams?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Config:', error);
    throw error;
  }
}

export async function getAllConfigs() {
  try {
    const response = await sendRequest(`Config/GetAll`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Config:', error);
    throw error;
  }
}

export async function getConfigById(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`Config/${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Config:', error);
    throw error;
  }
}

export async function createConfig(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient('Config/Create', 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Config:', error);
    throw error;
  }
}

export async function editConfig(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient('Config/Update', 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error edit Config:', error);
    throw error;
  }
}

export async function deleteConfig(functionId) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`Config/Delete?id=${functionId}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Config:', error);
    throw error;
  }
}
