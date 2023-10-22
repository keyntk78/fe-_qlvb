import React from 'react';
import AnimateButton from 'components/extended/AnimateButton';
import { Button } from '@mui/material';
// import { useTheme } from '@mui/material/styles';

const ButtonSecondary = ({ title, onClick, disabled, icon: StartIcon, fullWidth, href, download, target, rel, sx }) => {
  //   const theme = useTheme();
  return (
    <>
      <AnimateButton>
        <Button
          href={href}
          fullWidth={fullWidth}
          download={download}
          target={target}
          rel={rel}
          sx={{
            ...sx,
            bgcolor: '#378771',
            color: 'white',
            '&:hover': {
              bgcolor: '#2A6353' // Đặt màu chữ khi hover vào nút
            }
          }}
          onClick={onClick}
          variant="contained"
          startIcon={StartIcon && <StartIcon />}
          disabled={disabled}
        >
          {title}
        </Button>
      </AnimateButton>
    </>
  );
};

export default ButtonSecondary;
