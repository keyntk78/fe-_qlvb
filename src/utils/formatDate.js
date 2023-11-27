import { format, parse } from 'date-fns';
import viLocale from 'date-fns/locale/vi';
export function convertISODateToFormattedDate(isoDate) {
  const dateObject = new Date(isoDate);
  return format(dateObject, 'dd-MM-yyyy', { locale: viLocale });
}
export function convertFormattedDateToISODate(formattedDate) {
  const dateObject = parse(formattedDate, 'dd-MM-yyyy', new Date(), { locale: viLocale });
  return format(dateObject, 'yyyy-MM-dd', { locale: viLocale });
}
export function convertISODateTimeToFormattedDateTime(isoDate) {
  const dateObject = new Date(isoDate);
  return format(dateObject, 'dd-MM-yyyy HH:mm:ss', { locale: viLocale });
}

export function convertFormattedDateToISODateTime(formattedDate) {
  const dateObject = parse(formattedDate, 'dd-MM-yyyy HH:mm:ss', new Date(), { locale: viLocale });
  return format(dateObject, 'yyyy-MM-dd HH:mm:ss', { locale: viLocale });
}

export function convertDateTimeToDate(date) {
  const formatDate = new Date(date);
  return format(formatDate, 'yyyy-MM-dd', { locale: viLocale });
}
export function formatDate(date) {
  const dateString = date;
  const dateObject = new Date(dateString);

  const day = dateObject.getDate();
  const monthNames = [
    'tháng 01',
    'tháng 02',
    'tháng 3',
    'tháng 4',
    'tháng 5',
    'tháng 6',
    'tháng 7',
    'tháng 8',
    'tháng 9',
    'tháng 10',
    'tháng 11',
    'tháng 12'
  ];
  const monthIndex = dateObject.getMonth();
  const year = dateObject.getFullYear();

  return `ngày ${day} ${monthNames[monthIndex]} năm ${year}`;
}

export function formatDateTinTuc(dateString) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('vi-VN', options);
  const time = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const dayAndTime = `${formattedDate} | ${time}`;
  return dayAndTime.replace(/^\d+:/, '');
}
