import React from 'react';
import { Grid, Button, Tooltip } from '@mui/material';
import AnimateButton from 'components/extended/AnimateButton';
import { useTranslation } from 'react-i18next';
import { IconDeviceFloppy } from '@tabler/icons';

const SaveButton = () => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <AnimateButton>
          <Tooltip title={t('button.save')} placement="bottom">
            <Button type='submit' color="info" variant="contained" size="medium">
              <IconDeviceFloppy /> {t('button.save')}
            </Button>
          </Tooltip>
        </AnimateButton>
      </Grid>
    </Grid>
  );
};

export default SaveButton;
