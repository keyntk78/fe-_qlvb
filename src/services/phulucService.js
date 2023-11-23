import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchPhuLuc(params) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`PhuLuc/GetSerachPhuLuc?${params}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoigoc:', error);
    throw error;
  }
}
