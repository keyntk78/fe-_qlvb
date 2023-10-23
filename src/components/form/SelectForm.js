import React from 'react';
import { FormControl, FormHelperText, MenuItem, Select, styled } from '@mui/material';
import { convertISODateToFormattedDate } from 'utils/formatDate';

const CustomSelect = styled(Select)({
  '& .MuiSelect-select': {
    backgroundColor: 'white'
  },
  '& .MuiSelect-select.Mui-disabled': {
    backgroundColor: '#ededed',
    color: 'black'
  },
  '&.MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ededed'
  }
});

function SelectForm({
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  label,
  disabled,
  item,
  formik,
  keyProp,
  valueProp,
  fullWidth,
  convert,
  nochoose
}) {
  const hasFormik = !!formik; // Kiểm tra xem formik có tồn tại hay không

  return (
    <FormControl fullWidth={fullWidth}>
      <CustomSelect
        fullWidth={fullWidth}
        placeholder={placeholder}
        size="small"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        label={label}
        disabled={disabled}
        error={hasFormik && formik.touched[name] && Boolean(formik.errors[name])}
      >
        {nochoose && <MenuItem value="nochoose">Không thuộc đơn vị nào</MenuItem>}
        {item && item.length > 0 ? (
          item.map((data) => (
            <MenuItem key={data[keyProp]} value={data[keyProp]}>
              {convert ? convertISODateToFormattedDate(data[valueProp]) : data[valueProp]}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="">Không có dữ liệu</MenuItem>
        )}
      </CustomSelect>
      {hasFormik && formik.touched[name] && Boolean(formik.errors[name]) && <FormHelperText error>{formik.errors[name]}</FormHelperText>}
    </FormControl>
  );
}

export default SelectForm;
