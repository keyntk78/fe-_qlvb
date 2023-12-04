import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconRefresh } from '@tabler/icons';
import { Grid } from '@mui/material';
import YesButton from 'components/button/YesButton';
import NoButton from 'components/button/NoButton';
import MuiTypography from '@mui/material/Typography';

const XacNhanDongBo = ({ onSubmit }) => {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: 'center' }}>
      <IconRefresh size={100} color="#2196F3" />
      <MuiTypography variant="h4" gutterBottom m={2}>
        {t(`Bạn có muốn đồng bộ không?`)}
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="center" my={1}>
        <Grid item>
          <YesButton handleClick={onSubmit} />
        </Grid>
        <Grid item>
          <NoButton type="subpopup" />
        </Grid>
      </Grid>
    </div>
  );
};
export default XacNhanDongBo;
