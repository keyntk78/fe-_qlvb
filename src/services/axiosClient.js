import axios from 'axios';
import config from '../config';
import md5 from 'md5';
import { convertFormDataToJson } from 'utils/convertFormDataToJson';

export async function axiosClient(url, method, data) {
  try {
    const isFormData = data !== null && data instanceof FormData;

    let dataBody = '';
    if (isFormData) {
      dataBody = await convertFormDataToJson(data);
    } else {
      dataBody = data;
    }
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
    const username = user.username;
    const token = localStorage.getItem('token');
    const body = data === null || data === undefined ? '' : JSON.stringify(dataBody);
    const apiUrl = config.apiUrl;
    const secretKey = config.secretKey;

    const response = await axios({
      url: `${apiUrl}/${url}`,
      method: method,
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        Token: user && token ? `${username}.${token}.${md5(token + body + secretKey)}` : `${username}.${token}`,
        'Accept-Language': 'vi-VN'
      },
      data: data
    });

    const responseFinal = response.data;
    responseFinal.statusCode = response.status;

    return responseFinal;
  } catch (error) {
    const responseFinal = error.response.data;
    responseFinal.statusCode = error.response.status;

    return responseFinal;
  }
}
