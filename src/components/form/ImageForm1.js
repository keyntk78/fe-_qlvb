import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Box, Tooltip, tooltipClasses } from '@mui/material';
import DefaultImgCCCD from 'assets/images/nguoinhan/CCCDDefault.jpg';
import DefaultImgTinTuc from 'assets/images/tintuc/tintuc_default.jpg';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';

const ImageForm1 = ({ formik, name, nameFile, isImagePreview, urlImage, width, height, tintuc }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [fileChanged, setFileChanged] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue(nameFile, file);
      formik.setFieldValue(name, file.name);
      setImagePreview(URL.createObjectURL(file));
      setFileChanged(true);
    }
  };

  useEffect(() => {
    if (isImagePreview) {
      setImagePreview(urlImage);
      setFileChanged(false);
    }
  }, [isImagePreview]);

  const CustomWidthTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)({
    [`& .${tooltipClasses.tooltip}`]: {
      position: 'absolute',
      bottom: '-2px',
      left: '-152px',
      textAlign: 'center',
      minWidth: 300,
      maxWidth: 500,
      zIndex: 9,
      background: 'rgba(192, 192, 192, 0.5)',
      backdropFilter: 'blur(4px)'
    }
  });

  const CustomAvatar = styled(Avatar)({
    position: 'relative',
    zIndex: 2
  });

  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label style={{ cursor: 'pointer' }}>
          {imagePreview ? (
            <CustomWidthTooltip title="Chọn ảnh">
              <CustomAvatar
                variant={'rect'}
                src={imagePreview}
                alt={name}
                sx={{
                  width: `${width}px`,
                  height: `${height}px`,
                  borderRadius: 0
                }}
                onClick={handleImageClick}
              />
            </CustomWidthTooltip>
          ) : (
            <CustomWidthTooltip title="Chọn ảnh">
              <CustomAvatar
                variant={'rect'}
                src={tintuc ? DefaultImgTinTuc : DefaultImgCCCD}
                alt="Default CCCD"
                sx={{
                  width: `${width}px`,
                  height: `${height}px`,
                  borderRadius: 0
                }}
                onClick={handleImageClick}
              />
            </CustomWidthTooltip>
          )}
        </label>
        <input
          accept="image/*"
          id="image-input"
          type="file"
          ref={fileInputRef}
          key={fileChanged ? 'file-changed' : 'file-unchanged'}
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />
      </Box>
    </div>
  );
};

ImageForm1.propTypes = {
  formik: PropTypes.object.isRequired,
  name: PropTypes.string,
  nameFile: PropTypes.string.isRequired,
  isImagePreview: PropTypes.bool,
  urlImage: PropTypes.string
};

export default ImageForm1;
