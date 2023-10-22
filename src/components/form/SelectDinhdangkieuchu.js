import { Autocomplete, Grid, MenuItem, TextField } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
// import { useEffect } from 'react';
// import PropTypes from 'prop-types';

const SelectList = ({ data, isFirst, formik, name, placeholder, value, optionName, request, openPopup }) => {
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
      <Autocomplete
        disablePortal
        options={data}
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
