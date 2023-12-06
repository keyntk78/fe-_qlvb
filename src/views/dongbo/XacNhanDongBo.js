import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconAlertCircle } from '@tabler/icons';
import { Grid } from '@mui/material';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';
import MuiTypography from '@mui/material/Typography';

const XacNhanDongBo = ({ onSubmit }) => {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: 'center' }}>
      <Grid item container xs={12} mt={3} mb={2} justifyContent={'center'}>
        <IconAlertCircle size={100} color="red" />
      </Grid>
      <MuiTypography variant="h4" gutterBottom m={2}>
        {t(`Xác nhận đồng bộ dữ liệu?`)}
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="center" my={1}>
        <Grid item>
          <YesButton handleClick={onSubmit} />
        </Grid>
        <Grid item>
          <NoButton />
        </Grid>
      </Grid>
    </div>
  );
};
export default XacNhanDongBo;
