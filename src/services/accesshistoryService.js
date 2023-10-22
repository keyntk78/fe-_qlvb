import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getHistoryAccess(params) {
  try {
    const response = await sendRequest(`AccessHistory/GetAllByParams?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating history access:', error);
    throw error;
  }
}
export async function ExportAccessHistory(data) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`AccessHistory/ExportAccessHistory`, 'POST', data);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error export access history:', error);
    throw error;
  }
}

export async function GetAllUserInAccessHistory() {
  try {
    const response = await sendRequest(`AccessHistory/GetAllUserInAccessHistory`, 'GET');
    return response;
  } catch (error) {
    console.error('Error get all user in access history:', error);
    throw error;
  }
}
