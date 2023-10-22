import React from 'react';
import { Grid } from '@mui/material';
import SaveButton from './SaveButton';
import ExitButton from './ExitButton';

const FormGroupButton = ({ type }) => {
  return (
    <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
      <Grid item>
        <SaveButton />
      </Grid>
      <Grid item>
        <ExitButton type={type} />
      </Grid>
    </Grid>
  );
};

export default FormGroupButton;
