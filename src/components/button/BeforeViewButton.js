import React from 'react';
import { Grid, Button, Tooltip } from '@mui/material';
import AnimateButton from 'components/extended/AnimateButton';
import { useTranslation } from 'react-i18next';
import { IconEye } from '@tabler/icons';

const BeforeViewButton = ({ handleClick }) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <AnimateButton>
          <Tooltip title={t('Xem phôi')} placement="bottom">
            <Button color="secondary" variant="outlined" size="medium" onClick={handleClick} startIcon={<IconEye />}>
              {t('Xem phôi')}
            </Button>
          </Tooltip>
        </AnimateButton>
      </Grid>
    </Grid>
  );
};

export default BeforeViewButton;
