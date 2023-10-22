import { sendRequest } from 'utils/apiUtils';
import { setLoading } from 'store/actions';
import { store } from '../store/index';
import { axiosClient } from './axiosClient';

export async function GetAllNotificationByParams(params) {
  try {
    const response = await sendRequest(`Notification/GetAllByParams?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function GetNotificationById(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`Notification/${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getTop10Message(userId, pageSize) {
  try {
    const response = await axiosClient(`TrangChu/GetTop10Message?userId=${userId}&pageSize=${pageSize}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getAllMessage(userId) {
  try {
    const response = await sendRequest(`TrangChu/GetAllMessage?userId=${userId}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getUnreadMessagesCount(userId) {
  try {
    const response = await axiosClient(`TrangChu/GetUnreadMessagesCount?userId=${userId}`, 'POST');
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function updateReadStatus(id) {
  try {
    const response = await axiosClient(`TrangChu/UpdateReadStatus?idMessage=${id}`, 'POST');
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function updateAllReadStatus(id) {
  try {
    const response = await axiosClient(`TrangChu/updateAllReadStatus?userId=${id}`, 'POST');
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function GetAllMessagesByUserId(params) {
  try {
    const response = await axiosClient(`Notification/GetAllMessagesByUserId?${params}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
