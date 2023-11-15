import { Button, Grid } from '@mui/material';
import { IconAlertCircle, IconCheck } from '@tabler/icons';
import React from 'react';
import MuiTypography from '@mui/material/Typography';
import NoButton from 'components/button/NoButton';

const NotificationForm = ({ message, type, error, submessage, url }) => {
  return (
    <Grid container sx={{ textAlign: 'center' }}>
      <Grid item container xs={12} mt={3} mb={2} justifyContent={'center'}>
        {error ? <IconAlertCircle size={100} color="error" /> : <IconCheck size={100} color="success" />}
      </Grid>
      <Grid item container xs={12} justifyContent={'center'}>
        <MuiTypography variant="h4" gutterBottom>
          {message || ''}
        </MuiTypography>
      </Grid>
      <Grid item container xs={12} mt={1} justifyContent={'center'}>
        <MuiTypography variant="h5" gutterBottom>
          {submessage || ''}
        </MuiTypography>
      </Grid>
      <Grid item container xs={12} mt={1} justifyContent={'center'}>
        <a href={url} download>
          <Button variant="contained" color="primary">
            Tải File
          </Button>
        </a>
      </Grid>
      <Grid item container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <NoButton type={type} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NotificationForm;
