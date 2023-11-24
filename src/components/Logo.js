// material-ui
// import { useTheme } from '@mui/material/styles';
import logo from 'assets/images/icons/VNPTLogo.png';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { donviSelector } from 'store/selectors';
import config from 'config';
import { useState } from 'react';

const Logo = () => {
  // const theme = useTheme();
  const donvi = useSelector(donviSelector);
  const [urlImage, setUrlImage] = useState('');

  useEffect(() => {
    if (donvi) {
      setUrlImage(donvi.cauHinh && donvi.cauHinh.logoDonvi ? config.urlImages + donvi.cauHinh.logoDonvi : logo);
    }
  }, [donvi]);

  return <img src={urlImage} alt="logo" height="55" />;
};

export default Logo;
