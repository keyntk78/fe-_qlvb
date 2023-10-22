import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Phoigoc from 'views/phoigoc/Phoigoc';
import Phoibansao from 'views/phoibansao/Phoibansao';
import PhoiDahuy from 'views/phoidahuy/Phoidahuy';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from 'components/cards/Tabpanel';
import { useTranslation } from 'react-i18next';
// import Hinhthucdaotao from 'views/hinhthucdaotao/Index';

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  };
}

function Quanlyphoi() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="inherit"
        variant="standard "
        aria-label="standard  tabs example"
      >
        <Tab label={t('phoivanbang.title.bangoc')} {...a11yProps(0)} />
        <Tab label={t('phoivanbang.title.bansao')} {...a11yProps(1)} />
        <Tab label={t('phoivanbang.title.huy')} {...a11yProps(2)} />
      </Tabs>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <Phoigoc />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <Phoibansao />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <PhoiDahuy />
      </TabPanel>
    </Box>
  );
}
export default Quanlyphoi;
