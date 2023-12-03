import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';

export async function backupData(nguoiThucHien) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`DataBackup/Backup?nguoiThucHien=${nguoiThucHien}`, 'POST');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function getBackupData() {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest('DataBackup/GetHistoryBackup', 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}
