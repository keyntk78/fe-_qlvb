import React, { useRef } from 'react';
import { FormControl, Button, Box, Input, Grid, FormHelperText } from '@mui/material';
import { IconFilePlus } from '@tabler/icons';
import { useState } from 'react';
import { useEffect } from 'react';
import { openPopupSelector } from 'store/selectors';
import { useSelector } from 'react-redux';

const Importfile = ({ formik, name, nameFile, lable }) => {
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const openPopup = useSelector(openPopupSelector);
  const handleOnchangfile = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue(nameFile, file);
      formik.setFieldValue(name, file.name);
      setSelectedFileName(file.name);
      event.target.value = null;
    }
  };
  useEffect(() => {
    if (openPopup) {
      setSelectedFileName(null);
    }
  }, [openPopup]);
  return (
    <Grid item container xs={12} spacing={1}>
      <Grid item xs={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FormControl>
            <Input
              id={nameFile}
              ref={fileInputRef}
              name={name}
              type="file"
              accept=".xlsx, .xls,.docx,.jpg,.png"
              style={{ display: 'none' }}
              onChange={handleOnchangfile}
              onBlur={formik.handleBlur}
            />
            <label htmlFor={nameFile}>
              <Button variant="outlined" component="span" color="success" startIcon={<IconFilePlus />}>
                {lable}
              </Button>
            </label>
          </FormControl>
        </Box>
      </Grid>
      <Grid item xs={8}>
        {selectedFileName && <span>{selectedFileName}</span>}
      </Grid>
      <Grid item xs={12}>
        {formik.errors[name] && formik.touched[name] && (
          <>
            <FormControl>
              <FormHelperText style={{ color: '#F44336' }}>{formik.errors[name]}</FormHelperText>
            </FormControl>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default Importfile;
