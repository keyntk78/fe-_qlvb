import React from 'react';

// material-ui
import { styled } from '@mui/material/styles';

const FooterWrapper = styled('footer')(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.text.primary,
  textAlign: 'center'
}));

const Footer = () => {
  return (
    <FooterWrapper sx={{ mr: '2%', ml: '2%', zIndex: 999 }}>
      <footer style={{ display: 'flex', justifyContent: 'space-between', height: '30px' }}>
        <span style={{ marginLeft: '20px', marginTop: '5px', color: '#1565c0' }}>&copy; VNPT Cert</span>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: '5px', marginRight: '20px', textDecoration: 'none', color: '#1565c0' }}
        >
          &copy; congthongtin.vn
        </a>
      </footer>
    </FooterWrapper>
  );
};

export default Footer;
