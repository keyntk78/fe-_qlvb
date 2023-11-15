import React from 'react';
import { Grid, Button, Tooltip } from '@mui/material';
import AnimateButton from 'components/extended/AnimateButton';
import { useTranslation } from 'react-i18next';
import { IconCheck } from '@tabler/icons';

const YesButton = ({ handleClick, color }) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <AnimateButton>
          <Tooltip title={t('button.yes')} placement="bottom">
            <Button color={color || 'error'} variant="contained" size="medium" onClick={handleClick} startIcon={<IconCheck />}>
              {t('button.yes')}
            </Button>
          </Tooltip>
        </AnimateButton>
      </Grid>
    </Grid>
  );
};

export default YesButton;
