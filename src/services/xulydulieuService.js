import { sendRequest } from 'utils/apiUtils';

export async function GetCauHinhImportDanhMuc() {
  try {
    const response = await sendRequest(`XuLyDuLieu/GetCauHinhImportDanhMuc`, 'GET', null);
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}
