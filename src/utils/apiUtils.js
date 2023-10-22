import config from '../config';

const apiUrl = config.apiUrl;
const secretKey = config.secretKey;

const md5 = require('md5');

export async function sendRequest(url, method, data) {
    try {
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
        const username = user.username;
        const token = localStorage.getItem('token');
        const body = data == null ? '' : JSON.stringify(data);
        const response = await fetch(`${apiUrl}/${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Token': user && token ? `${username}.${token}.${md5(token + body + secretKey)}` : `${username}.${token}`,
                'Accept-Language': 'vi-VN'
            },
            body: method !== 'GET' ? JSON.stringify(data) : undefined
        });
    
        if (response.status >= 500) {
            return { statusCode: response.status };
        }
    
        if (response.isSuccess == false) {
        const response = await response.message;
        }
        const responseFinal = await response.json();
        responseFinal.statusCode = response.status;
    
        return responseFinal;
    } catch (error) {
        console.error('Error sending request:', error);
        throw error;
    }
}
  