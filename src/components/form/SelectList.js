import { Autocomplete, Grid, MenuItem, TextField, styled } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
// import { useEffect } from 'react';
// import PropTypes from 'prop-types';

const CustomAutocomplete = styled(Autocomplete)({
  '& .MuiAutocomplete-inputRoot': {
    backgroundColor: 'white' // Thay đổi màu nền của ô chọn Autocomplete ở trạng thái bình thường
  },
  '& .MuiInputBase-input': {
    backgroundColor: 'white' // Thay đổi màu chữ bên trong ô chọn Autocomplete
    // color: 'black'
  },
  '& .MuiAutocomplete-inputRoot.Mui-disabled': {
    backgroundColor: '#ededed' // Thay đổi màu nền của ô chọn Autocomplete ở trạng thái disable
  },
  '& .MuiInputBase-input.Mui-disabled': {
    backgroundColor: '#ededed' // Thay đổi màu chữ bên trong ô chọn Autocomplete
    // color: 'black'
  },
  '&.MuiAutocomplete-outlined.Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ededed !important' // Sử dụng !important để ghi đè styles mặc định của Material-UI cho đường viền
  }
});

const SelectList = ({ data, isFirst, formik, name, placeholder, value, optionName, request, openPopup, isDisables }) => {
  const [curentValue, setCurentValue] = useState('');

  useEffect(() => {
    if (!openPopup) {
      setCurentValue('');
    } else {
      // Kiểm tra xem giá trị hiện tại có tồn tại trong mảng dữ liệu không
      const defaultValue = data.find((item) => item[request] === formik.values[name]);
      setCurentValue(defaultValue !== 'undefined' ? defaultValue : '');
    }
  }, [openPopup, formik.values[name], data, request]);

  return (
    <Grid item xs={12} style={isFirst ? { marginTop: '10px' } : {}}>
      <CustomAutocomplete
        style={{
          backgroundColor: 'white',
          '&.MuiDisabled': {
            backgroundColor: '#ededed',
            color: 'black'
          },
          '& .MuiOutlinedInputRootMuiDisabled .MuiOutlinedInputNotchedOutline': {
            borderColor: '#ededed'
          }
        }}
        disablePortal
        options={data}
        disabled={isDisables}
        id={name}
        name={name}
        value={curentValue}
        onChange={(event, value) => {
          formik.setFieldValue(name, value ? value[request] : 0);
        }}
        getOptionLabel={(option) => option[optionName]} // Chỉ định tên thuộc tính dùng làm nhãn
        renderOption={(props, option) => (
          <MenuItem key={option[value]} value={option[value]} sx={{ justifyContent: 'space-between' }} {...props}>
            {option[optionName]}
          </MenuItem>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            disabled={isDisables}
            size="small"
            placeholder={placeholder}
            error={formik.touched[name] && Boolean(formik.errors[name])} // Xác định trạng thái lỗi
            helperText={formik.touched[name] && formik.errors[name]} // Hiển thị thông báo lỗi
          />
        )}
      />
    </Grid>
  );
};

export default SelectList;
