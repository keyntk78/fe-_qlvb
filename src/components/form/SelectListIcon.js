import { Autocomplete, Grid, TextField, styled } from '@mui/material';
import { Box } from '@mui/system';
import iconArray from '../../utils/iconArray';
import icons from '../../utils/icons';
import React from 'react';
import PropTypes from 'prop-types';

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

const SelectListIcon = ({ formik, name, placeholder, isFirst }) => {
  const defaultValue = iconArray.find((icon) => icon.name === formik.values[name]) || null;
  return (
    <Grid item xs={12} style={isFirst ? { marginTop: '10px' } : {}}>
      <CustomAutocomplete
        fullWidth
        options={iconArray}
        id={name}
        name={name}
        autoHighlight
        value={defaultValue} // Set the default value
        onChange={(event, value) => {
          formik.setFieldValue(name, value ? value.name : '');
        }}
        getOptionLabel={(option) => option.name}
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            {icons[option.name] && React.createElement(icons[option.name])}
            <span style={{ margin: '0.5rem' }}>{option.name}</span>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            fullWidth
            {...params}
            placeholder={placeholder}
            size="small"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password' // disable autocomplete and autofill
            }}
          />
        )}
      />
    </Grid>
  );
};

SelectListIcon.propTypes = {
  formik: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  isFirst: PropTypes.bool
};

export default SelectListIcon;
