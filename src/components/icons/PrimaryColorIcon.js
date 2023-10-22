import PropTypes from 'prop-types';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3' // Replace with your desired primary color
    }
  }
});

const PrimaryColorIcon = ({ icon: Icon, size }) => {
  return (
    <ThemeProvider theme={theme}>
      <Icon size={size} style={{ color: theme.palette.primary.main }} />
    </ThemeProvider>
  );
};

PrimaryColorIcon.propTypes = {
  icon: PropTypes.any.isRequired,
  size: PropTypes.number
};

export default PrimaryColorIcon;
