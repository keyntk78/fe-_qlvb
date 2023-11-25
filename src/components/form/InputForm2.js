import React, { useState } from 'react';
import { Grid, TextField, InputAdornment, IconButton, styled } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const CustomTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    backgroundColor: 'white'
  },
  '& .MuiInputBase-input.Mui-disabled': {
    backgroundColor: '#ededed',
    color: 'success'
  },
  '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ededed'
  }
});

const InputForm2 = ({ formik, name, label, type, isFirst, isDisabled, placeholder, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (event) => {
    formik.handleChange(event); // Xử lý sự kiện thay đổi giá trị của trường bằng formik.handleChange
    setErrorMessage(''); // Đặt lại errorMessage thành rỗng
  };

  useEffect(() => {
    if (errors && errors.length > 0) {
      const errorObj = errors.find((error) => error.key.toLowerCase() === name.toLowerCase());
      setErrorMessage(errorObj?.error);
    }
  }, [errors, name]);

  return (
    <Grid item xs={12} style={isFirst ? { marginTop: '10px' } : {}}>
      <CustomTextField
        fullWidth
        size="small"
        id={name}
        name={name}
        value={formik.values[name] || ''}
        onChange={handleInputChange}
        onBlur={formik.handleBlur}
        variant="outlined"
        label={label}
        placeholder={placeholder}
        error={formik.touched[name] && Boolean(formik.errors[name])}
        helperText={formik.touched[name] && formik.errors[name] ? formik.errors[name] : errorMessage ? errorMessage : ''}
        type={showPassword ? 'text' : type}
        disabled={isDisabled}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </Grid>
  );
};

InputForm2.propTypes = {
  formik: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  isFirst: PropTypes.bool,
  isDisabled: PropTypes.bool,
  placeholder: PropTypes.string,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      error: PropTypes.string.isRequired
    })
  )
};

export default InputForm2;
