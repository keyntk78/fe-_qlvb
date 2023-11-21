import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getAllMenu(params) {
  try {
    const response = await sendRequest(`Menu/GetAll?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Menu:', error);
    throw error;
  }
}

export async function getMenuById(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`Menu/GetById/${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Menu:', error);
    throw error;
  }
}

export async function createMenu(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest('Menu/Create', 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Menu:', error);
    throw error;
  }
}
export async function editMenu(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`Menu/Update`, 'PUT', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error edit Menu:', error);
    throw error;
  }
}
export async function deleteMenu(Id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`Menu/Delete?id=${Id}`, 'DELETE');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error edit Menu:', error);
    throw error;
  }
}
