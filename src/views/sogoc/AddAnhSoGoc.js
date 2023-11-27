import React from 'react';
import { Button, FormControlLabel, FormGroup, Grid, Input, Radio, RadioGroup, useMediaQuery } from '@mui/material';
import { useFormik } from 'formik';
import { showAlert, setReloadData, setOpenSubPopup } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { openSubPopupSelector, userLoginSelector } from 'store/selectors';
import { useEffect } from 'react';
import FormGroupButton from 'components/button/FormGroupButton';
import { convertJsonToFormData } from 'utils/convertJsonToFormData';
import ImageForm from 'components/form/ImageForm';
import { upLoadAnhSoGoc } from 'services/sogocService';
import { useState } from 'react';
import { IconFilePlus } from '@tabler/icons';

const AddAnhSoGoc = ({ pageState }) => {
  const isXs = useMediaQuery('(max-width:600px)');
  const user = useSelector(userLoginSelector);
  const dispatch = useDispatch();
  const openSubPopup = useSelector(openSubPopupSelector);
  const [selectedOption, setSelectedOption] = useState('image');
  const [selectedFileName, setSelectedFileName] = useState('');

  const formik = useFormik({
    initialValues: {
      IdTruong: pageState.donVi,
      IdTruongCu: pageState.doniOld || '',
      IdDanhMucTotNghiep: pageState.DMTN,
      Url: '',
      NguoiThucHien: user.username,
      File: ''
    },
    onSubmit: async (values) => {
      try {
        const formData = await convertJsonToFormData(values);
        const addedPhoigoc = await upLoadAnhSoGoc(formData);
        if (addedPhoigoc.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', addedPhoigoc.message.toString()));
        } else {
          dispatch(setOpenSubPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', addedPhoigoc.message.toString()));
        }
      } catch (error) {
        console.error('error' + error);
        dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
      }
    }
  });

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleOnchangfile = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue('File', file);
    formik.setFieldValue('Url', file.name);
    setSelectedFileName(file.name);
    e.target.value = null;
  };

  useEffect(() => {
    if (openSubPopup) {
      formik.resetForm();
    }
  }, [openSubPopup]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1} my={isXs ? 0 : 2}>
        <Grid
          item
          xs={12}
          mt={isXs ? 1 : 0}
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FormGroup>
            <RadioGroup row aria-label="upload-option" name="uploadOption" value={selectedOption} onChange={handleOptionChange}>
              <FormControlLabel value="image" control={<Radio />} label="Đính kèm ảnh" />
              <FormControlLabel value="file" control={<Radio />} label="Đính kèm tệp" />
            </RadioGroup>
          </FormGroup>
          {selectedOption === 'image' ? (
            <ImageForm
              formik={formik}
              name="Url"
              nameFile="File"
              width={isXs ? '300' : '450'}
              height={isXs ? '190' : '290'}
              noAvata
              isImagePreview={openSubPopup}
            />
          ) : (
            <>
              <Grid item container mt={'10px'} alignItems="center">
                <Grid item xs={3}>
                  <Input type="file" accept=".xlsx, .xls" style={{ display: 'none' }} id="fileInput" onChange={handleOnchangfile} />
                  <label htmlFor="fileInput">
                    <Button variant="outlined" component="span" color="success" startIcon={<IconFilePlus />}>
                      Chọn tệp
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={9} textAlign={isXs ? 'left' : ''}>
                  {selectedFileName && <span>{selectedFileName}</span>}
                </Grid>
              </Grid>
            </>
            // <div>
            //   <label htmlFor="file">Choose File:</label>
            //   <input
            //     type="file"
            //     id="file"
            //     name="file"
            //     onChange={(event) => {
            //       formik.setFieldValue('file', event.currentTarget.files[0]);
            //     }}
            //   />
            // </div>
          )}
        </Grid>
      </Grid>
      <FormGroupButton type="subpopup" />
    </form>
  );
};

export default AddAnhSoGoc;
