import React from 'react';
import { Grid, Button, Tooltip } from '@mui/material';
import AnimateButton from 'components/extended/AnimateButton';
import { useTranslation } from 'react-i18next';
import { IconFileExport } from '@tabler/icons';

const ImportButton = ({ handleClick }) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <AnimateButton>
          <Tooltip title={t('Xuất')} placement="bottom">
            <Button color="success" type="submit" variant="contained" size="medium" onClick={handleClick}>
              <IconFileExport /> {t('Xuất')}
            </Button>
          </Tooltip>
        </AnimateButton>
      </Grid>
    </Grid>
  );
};

export default ImportButton;
