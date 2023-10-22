import React, { useEffect, useState } from 'react';
import FormControlComponent from './FormControlComponent ';
import { useTranslation } from 'react-i18next';
import { Grid, useMediaQuery } from '@mui/material';

const ColorNamePicker = ({ name, formik, valueDefault }) => {
  const isXs = useMediaQuery('(max-width:800px)');
  const [selectedColor, setSelectedColor] = useState('');
  const { t } = useTranslation();
  useEffect(() => {
    if (!valueDefault) {
      setSelectedColor('#000000');
    } else {
      setSelectedColor(valueDefault);

      formik.setFieldValue(name, valueDefault);
    }
  }, [valueDefault, formik.values[name]]);
  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
    formik.setFieldValue(name, event.target.value);
    // You can do additional actions here when the color is changed
  };

  return (
    <div>
      <FormControlComponent xsLabel={isXs ? 0 : 4} xsForm={isXs ? 12 : 8} isRequire label={t('config.field.mauchu')}>
        <Grid container xs={12}>
          <Grid item xs={5}>
            <input style={{ marginTop: '5px' }} type="color" name={name} value={selectedColor} onChange={handleColorChange} />
          </Grid>
          <Grid item xs={7}>
            <p style={{ marginBottom: '5px' }}>{selectedColor}</p>
          </Grid>
        </Grid>
      </FormControlComponent>

      {/* Display the selected color */}
    </div>
  );
};

export default ColorNamePicker;
