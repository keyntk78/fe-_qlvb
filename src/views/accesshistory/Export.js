import { FormControl, Grid, MenuItem, Select, TextField } from '@mui/material';
import ImportButton from 'components/button/ImportButton';
import ExitButton from 'components/button/ExitButton';
import FormControlComponent from 'components/form/FormControlComponent ';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ExportAccessHistory, GetAllUserInAccessHistory } from 'services/accesshistoryService';
import { openPopupSelector } from 'store/selectors';
import { convertISODateTimeToFormattedDateTime } from 'utils/formatDate';
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';

const Export = () => {
  const openPopup = useSelector(openPopupSelector);

  useEffect(() => {
    if (openPopup) {
      setIdUser(0);
      setFromDate('');
      setToDate('');
    }
  }, [openPopup]);
  const [data, setData] = useState([]);
  const [idUser, setIdUser] = useState(0);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const { t } = useTranslation();
  const [toDateError, setToDateError] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetAllUserInAccessHistory();
      setData(response.data);
    };
    fetchData();
  }, [openPopup]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      setToDateError('Ngày trước không thể lớn hơn ngày sau');
      return;
    }
    setToDateError('');
    const body = {
      userId: idUser == 0 ? null : idUser,
      fromDate: fromDate == '' ? null : fromDate,
      toDate: toDate == '' ? null : toDate
    };
    const response = await ExportAccessHistory(body);
    const formattedData = response.data.map((item) => ({
      STT: item.rowIndex,
      'Họ và Tên': item.fullName,
      'Tài Khoản': item.userName,
      'Thời gian truy cập': convertISODateTimeToFormattedDateTime(item.loginOn),
      'Thời gian ngừng truy cập': convertISODateTimeToFormattedDateTime(item.lastLoginTime)
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'HistoryAccessData');
    // Điều chỉnh chiều rộng của các cột trong file xuất ra
    const columnsWidth = [
      { wch: 10 }, // Chiều rộng cột 'serial'
      { wch: 30 }, // Chiều rộng cột 'user.field.fullname'
      { wch: 30 }, // Chiều rộng cột 'user.field.username'
      { wch: 40 }, // Chiều rộng cột 'LoginOn'
      { wch: 40 } // Chiều rộng cột 'LastLogin'
    ];

    worksheet['!cols'] = columnsWidth;
    XLSX.writeFile(workbook, 'history_access_data.xlsx');
  };
  const handleUserNameChange = (event) => {
    const Value = event.target.value;
    const userId = Value === 'TaiKhoan' ? '' : Value;
    setIdUser(userId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item container xs={10} spacing={2} my={1} ml={13}>
          <FormControlComponent xsLabel={2} xsForm={6} label="Tài khoản">
            <FormControl fullWidth variant="outlined">
              <Select
                placeholder={'Tài khoản'}
                size="small"
                name="userId"
                value={idUser === 0 ? 'TaiKhoan' : idUser}
                onChange={handleUserNameChange}
                onBlur={() => setToDateError('')}
                label="Tài khoản"
              >
                <MenuItem value="TaiKhoan">Tất cả người dùng</MenuItem>
                {data && data.length > 0 ? (
                  data.map((taikhoan) => (
                    <MenuItem key={taikhoan.userId} value={taikhoan.userId}>
                      {taikhoan.userName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No data available</MenuItem>
                )}
              </Select>
            </FormControl>
          </FormControlComponent>
          <FormControlComponent xsLabel={2} xsForm={6} label={t('fromDate')}>
            <FormControl fullWidth variant="outlined">
              <TextField
                size="small"
                name="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                onBlur={() => setToDateError('')}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
          </FormControlComponent>
          <FormControlComponent xsLabel={2} xsForm={6} label={t('toDate')}>
            <FormControl fullWidth variant="outlined">
              <TextField
                size="small"
                name="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                onBlur={() => setToDateError('')}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
            {toDateError && <p style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}>{toDateError}</p>}
          </FormControlComponent>
        </Grid>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
            <Grid item>
              <ImportButton />
            </Grid>
            <Grid item>
              <ExitButton />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default Export;
