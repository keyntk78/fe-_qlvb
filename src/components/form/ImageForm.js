import React, { useState, useEffect, useRef } from 'react';
import { Avatar, FormControl, Button, Box } from '@mui/material';
import DefaultImg from '../../assets/images/users/default.png';
import DefaultImgphoi from '../../assets/images/phoi/bang-tot-nghiep-thcs.jpg';
import DefaultImgtruong from '../../assets/images/phoi/logotruong.png';
import PropTypes from 'prop-types';

const ImageForm = ({ formik, name, nameFile, isImagePreview, urlImage, width, height, noAvata, noInsert, donviTruong }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [fileChanged, setFileChanged] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue(nameFile, file);
      formik.setFieldValue(name, file.name);
      setImagePreview(URL.createObjectURL(file));
      setFileChanged(true);
    }
  };

  const handleImageClick = () => {
    if (!noInsert) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (isImagePreview) {
      setImagePreview(urlImage);
      setFileChanged(false);
    }
  }, [isImagePreview, urlImage]);

  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label style={{ cursor: 'pointer' }}>
          {imagePreview ? (
            <Avatar
              variant={noAvata ? 'rect' : ''}
              src={imagePreview}
              alt={name}
              sx={{
                width: `${width}px`,
                height: `${height}px`,
                borderRadius: noAvata ? 0 : '' // Loại bỏ hiệu ứng bo tròn
              }}
              onClick={handleImageClick}
            />
          ) : (
            <Avatar
              variant={noAvata ? 'rect' : ''}
              src={noAvata ? DefaultImgphoi : donviTruong ? DefaultImgtruong : DefaultImg}
              alt="Default Avatar"
              sx={{
                width: `${width}px`,
                height: `${height}px`,
                borderRadius: noAvata ? 0 : '' // Loại bỏ hiệu ứng bo tròn
              }}
              onClick={handleImageClick}
            />
          )}
        </label>
        {!noInsert && (
          <FormControl>
            <Button
              variant="contained"
              component="label"
              htmlFor={nameFile}
              style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
            >
              Chọn ảnh
              <input
                id={nameFile}
                ref={fileInputRef}
                key={fileChanged ? 'file-changed' : 'file-unchanged'}
                name={nameFile}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>
          </FormControl>
        )}
      </Box>
    </div>
  );
};

ImageForm.propTypes = {
  formik: PropTypes.object.isRequired,
  name: PropTypes.string,
  nameFile: PropTypes.string.isRequired,
  isImagePreview: PropTypes.bool,
  urlImage: PropTypes.string,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  noAvata: PropTypes.bool,
  noInsert: PropTypes.bool
};

export default ImageForm;
