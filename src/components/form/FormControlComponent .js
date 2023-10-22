import styled from '@emotion/styled';
import { FormLabel, Grid } from '@mui/material';
import React from 'react';

const FormControlComponent = ({ children, label, xsLabel, xsForm, justifyContent, isRequire }) => {
  const StyledFormLabel = styled(FormLabel)(() => ({
    color: 'black', // Default color

    '& .required': {
      color: 'red', // Color for the asterisk (*)
    },
  }));

  return (
    <Grid item xs={12} container>
      <Grid item xs={xsLabel} container mt={1} justifyContent={justifyContent}>
        <StyledFormLabel>
          {label}
          {isRequire ? <span className="required"> (*)</span> : null}
        </StyledFormLabel>
      </Grid>
      <Grid item xs={xsForm}>
        {children}
      </Grid>
    </Grid>
  );
};

export default FormControlComponent;

