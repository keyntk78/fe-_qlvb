import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function getSearchPhuLuc(iddanhmuc, idtruong, params) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`PhuLuc/GetSerachPhuLuc?IdDanhMucTotNghiep=${iddanhmuc}&IdTruong=${idtruong}&${params}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating Phoigoc:', error);
    throw error;
  }
}
