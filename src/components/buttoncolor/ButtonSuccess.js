import React from 'react';
import AnimateButton from 'components/extended/AnimateButton';
import { Button, Tooltip } from '@mui/material';
// import { useTheme } from '@mui/material/styles';

const ButtonSuccess = ({ title, onClick, disabled, icon: StartIcon, fullWidth, sx }) => {
  //   const theme = useTheme();
  return (
    <>
      <AnimateButton>
        {disabled ? (
          <Button
            fullWidth={fullWidth}
            sx={{
              ...sx,
              bgcolor: '#00B835',
              color: 'white',
              '&:hover': {
                bgcolor: '#00942A' // Đặt màu chữ khi hover vào nút
              }
            }}
            onClick={onClick}
            variant="contained"
            startIcon={StartIcon && <StartIcon />}
            disabled={disabled}
          >
            {title}
          </Button>
        ) : (
          <Tooltip title={title} placement="bottom">
            <Button
              fullWidth={fullWidth}
              sx={{
                ...sx,
                bgcolor: '#00B835',
                color: 'white',
                '&:hover': {
                  bgcolor: '#00942A' // Đặt màu chữ khi hover vào nút
                }
              }}
              onClick={onClick}
              variant="contained"
              startIcon={StartIcon && <StartIcon />}
              disabled={disabled}
            >
              {title}
            </Button>
          </Tooltip>
        )}
      </AnimateButton>
    </>
  );
};

export default ButtonSuccess;
