import { Grid, TextField } from '@mui/material';
import { IconAlertCircle } from '@tabler/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MuiTypography from '@mui/material/Typography';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';

const DeleteForm = ({ lable, handleClick, content, type, soluong, lyDo }) => {
  const { t } = useTranslation();
  const [deletionReason, setDeletionReason] = useState('');
  return (
    <Grid container sx={{ textAlign: 'center' }}>
      <Grid item container xs={12} mt={3} mb={2} justifyContent={'center'}>
        <IconAlertCircle size={100} color="red" />
      </Grid>
      <Grid item container xs={12} justifyContent={'center'}>
        <MuiTypography variant="h4" gutterBottom>
          {`${t('form.delete.warning1')} ${lable} [${content}]?`}
        </MuiTypography>
      </Grid>
      <Grid item container xs={12} mt={1} justifyContent={'center'}>
        <MuiTypography variant="h5" gutterBottom>
          {soluong ? `${t('hocsinh.total')} ${soluong}` : `${t('form.delete.warning2')}`}
        </MuiTypography>
      </Grid>
      {lyDo ? (
        <Grid item container xs={12} mt={1} justifyContent={'center'}>
          <TextField
            label={t('phoivanbang.field.lydo')} // Replace with your translation key
            variant="outlined"
            fullWidth
            required
            value={deletionReason}
            onChange={(e) => setDeletionReason(e.target.value)}
          />
        </Grid>
      ) : (
        ''
      )}
      <Grid item container spacing={1} direction="row" justifyContent="center" my={2}>
        <Grid item>
          <YesButton handleClick={handleClick} />
        </Grid>
        <Grid item>
          <NoButton type={type} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DeleteForm;
