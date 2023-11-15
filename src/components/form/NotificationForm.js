import { Grid } from '@mui/material';
import { IconAlertCircle, IconCheck, IconDownload } from '@tabler/icons';
import React from 'react';
import MuiTypography from '@mui/material/Typography';
import ResetButton from 'components/button/ExitButton';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';

const NotificationForm = ({ message, type, error, submessage, url }) => {
  return (
    <Grid container sx={{ textAlign: 'center' }}>
      <Grid item container xs={12} mt={3} mb={2} justifyContent={'center'}>
        {error ? <IconAlertCircle size={100} color="red" /> : <IconCheck size={100} color="green" />}
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
      <Grid item container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <a href={url} download>
            <ButtonSuccess title="Tải xuống" icon={IconDownload} />
          </a>
        </Grid>
        <Grid item>
          <ResetButton type={type} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NotificationForm;
