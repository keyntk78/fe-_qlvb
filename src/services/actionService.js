import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getAction(id, params) {
  try {
    const response = await sendRequest(`FunctionAction/GetActionsByFunctionId/${id}?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Action:', error);
    throw error;
  }
}

export async function getActionByidFunctionAction(id) {
  try {
    store.dispatch(setLoading(true))
    const response = await sendRequest(`FunctionAction/${id}`, 'GET');
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating Action:', error);
    throw error;
  }
}

export async function createAction(data) {
  try {
    store.dispatch(setLoading(true))
    const response = await sendRequest('FunctionAction/Create', 'POST', data);
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating Action:', error);
    throw error;
  }
}

export async function editAction(data) {
  try {
    store.dispatch(setLoading(true))
    const response = await sendRequest('FunctionAction/Update', 'PUT', data);
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error edit Action:', error);
    throw error;
  }
}

export async function deleteAction(functionactionId) {
  try {
    store.dispatch(setLoading(true))
    const response = await sendRequest(`FunctionAction/Delete?id=${functionactionId}`, 'DELETE');
    store.dispatch(setLoading(false))
    return response;
  } catch (error) {
    console.error('Error creating Action:', error);
    throw error;
  }
}
