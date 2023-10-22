import { FormControl, InputLabel, OutlinedInput, FormHelperText } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';

const InputFormOutlined = ({ type, value, name, errors, touched, handleBlur, handleChange, label, sx, endAdornment, errorBE }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event) => {
    handleChange(event);
    setErrorMessage('');
  };

  useEffect(() => {
    if (errorBE && errorBE.length > 0) {
      const errorObj = errorBE.find((error) => error.key.toLowerCase() === name.toLowerCase());
      setErrorMessage(errorObj?.error);
    }
  }, [errorBE, name]);

  return (
    <FormControl fullWidth error={Boolean(touched && errors)} sx={sx}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <OutlinedInput
        id={name}
        type={type}
        value={value}
        name={name}
        onBlur={handleBlur}
        onChange={handleInputChange}
        label={label}
        inputProps={{}}
        endAdornment={endAdornment ? endAdornment : ''}
      />
      {touched && errors ? (
        <FormHelperText error id="standard-weight-helper-text-username-login">
          {errors ? errors : errorMessage ? errorMessage : ''}
        </FormHelperText>
      ) : (
        <FormHelperText error id="standard-weight-helper-text-username-login">
          {errors ? errors : errorMessage ? errorMessage : ''}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default InputFormOutlined;
