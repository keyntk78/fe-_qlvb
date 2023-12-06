import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DonVi from 'views/donvitruong/Donvitruong';
import Danhmuctotnghiep from 'views/danhmuctotnghiep/Danhmuctotnghiep';
import SoGocCu from './SoGocCu';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  };
}

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', borderTopLeftRadius: 3, borderTopRightRadius: 3 }}>
        <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="full width tabs example">
          <Tab label="Sổ gốc cũ" {...a11yProps(0)} />
          <Tab label="Danh mục tốt nghiệp" {...a11yProps(1)} />
          <Tab label="Đơn vị trường" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <SoGocCu />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <Danhmuctotnghiep />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <DonVi />
      </TabPanel>
    </Box>
  );
}
