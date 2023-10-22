import React from 'react';
import { Grid, TextField, styled } from '@mui/material';
import PropTypes from 'prop-types';

const CustomTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    backgroundColor: 'white'
  },
  '& .MuiInputBase-input.Mui-disabled': {
    backgroundColor: '#ededed'
    // color: 'red'
  },
  '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ededed'
  }
});

const InputForm = ({ formik, name, label, placeholder, type, isFirst, isDisabled, w, value, isMulltiline, rows, minRows, maxRows }) => {
  return (
    <Grid item xs={w ? 6 : 12} style={isFirst ? { marginTop: '10px' } : {}}>
      <CustomTextField
        fullWidth
        id={name}
        name={name}
        size="small"
        label={label}
        value={value ? value : formik.values[name] || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        variant="outlined"
        placeholder={placeholder}
        error={formik.touched[name] && Boolean(formik.errors[name])}
        helperText={formik.touched[name] && formik.errors[name] ? formik.errors[name] : ''}
        type={type || 'text'}
        inputProps={{
          min: type === 'number' ? 0 : undefined
        }}
        disabled={isDisabled}
        multiline={isMulltiline}
        minRows={minRows}
        maxRows={maxRows}
        rows={rows}
      />
    </Grid>
  );
};

InputForm.propTypes = {
  formik: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  isFirst: PropTypes.bool,
  isDisabled: PropTypes.bool
};

export default InputForm;
