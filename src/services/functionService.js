import { sendRequest } from 'utils/apiUtils';
//import { axiosClient } from './axiosClient';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getFunctions(params) {
  try {
    const response = await sendRequest(`Function/GetAllByParams?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating function:', error);
    throw error;
  }
}

export async function getFunctionById(id) {
  try {
    store.dispatch(setLoading(true))
    const response = await sendRequest(`Function/${id}`, 'GET');
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating function:', error);
    throw error;
  }
}

export async function createFunction(data) {
  try {
    store.dispatch(setLoading(true))
    const response = await sendRequest('Function/Create', 'POST', data);
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function editFunction(data) {
  try {
    store.dispatch(setLoading(true))
    const response = await sendRequest('Function/Update', 'PUT', data);
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error edit function:', error);
    throw error;
  }
}

export async function deleteFunction(functionId) {
  try {
    store.dispatch(setLoading(true))
    const response = await sendRequest(`Function/Delete?id=${functionId}`, 'DELETE');
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating function:', error);
    throw error;
  }
}
