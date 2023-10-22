import React from 'react';
import { Container, Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
    >
      <>
        <Grid container alignItems={'center'} justifyContent={'center'} textAlign={'center'}>
          <Grid item xs={12}>
            <Typography variant="h1" fontWeight="bold" fontSize={230} className="animated-text">
              404
            </Typography>
          </Grid>
          <Grid container item xs={12} alignItems={'center'} justifyContent={'center'}>
            <Typography variant="h1" color="error">
              Oops!
            </Typography>
            <Typography variant="h2" ml={1} mt={'3px'}>
              Không tìm thấy trang
            </Typography>
          </Grid>
          <Grid item xs={12} mt={2}>
            <Typography variant="h4">Trang bạn đang tìm kiếm không tồn tại!</Typography>
          </Grid>
          <Grid item xs={12} mt={3}>
            <Button component={Link} to="/" variant="contained" color="primary">
              Quay lại trang chủ
            </Button>
          </Grid>
        </Grid>
      </>
    </Container>
  );
};

export default NotFoundPage;

// Thêm CSS cho hiệu ứng chuyển động
const styles = `
.animated-text {
  animation: bounceIn 1s ease-in-out;
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
  }
  70% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
`;

// Sử dụng CSS thông qua thẻ style
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
