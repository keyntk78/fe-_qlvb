import React from 'react';
import { Grid, TextField, styled } from '@mui/material';
import FormControlComponent from './FormControlComponent ';
import PropTypes from 'prop-types';

const CustomTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    backgroundColor: 'white'
  },
  '& .MuiInputBase-input.Mui-disabled': {
    backgroundColor: '#ededed',
    color: 'success',
  },
  '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ededed',
  }
});

const InputForm1 = ({
  formik,
  name,
  label,
  placeholder,
  type,
  xs,
  isDisabled,
  value,
  isMulltiline,
  rows,
  isRequired,
  maxRows,
  minRows
}) => {
  return (
    <Grid item xs={xs}>
      <FormControlComponent xsLabel={0} xsForm={12} label={label} isRequire={isRequired}>
        <CustomTextField
          fullWidth
          id={name}
          name={name}
          size="small"
          value={value ? value : formik.values[name] || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          variant="outlined"
          placeholder={placeholder}
          error={formik.touched[name] && Boolean(formik.errors[name])}
          helperText={formik.touched[name] && formik.errors[name] ? formik.errors[name] : ''}
          type={type || 'text'}
          disabled={isDisabled}
          multiline={isMulltiline}
          minRows={minRows}
          maxRows={maxRows}
          rows={rows}
        />
      </FormControlComponent>
    </Grid>
  );
};

InputForm1.propTypes = {
  formik: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  isDisabled: PropTypes.bool
};

export default InputForm1;
