import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Sogoc from 'views/sogoc/Sogoc';
import Sobansao from 'views/sobansao/Sobansao';

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

function Socapbang() {
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
        variant="standard"
        aria-label="standard  tabs example"
      >
        <Tab label={t('socapbang.title.sogoc')} {...a11yProps(0)} />
        <Tab label={t('socapbang.title.sobansao')} {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <Sogoc />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <Sobansao />
      </TabPanel>
    </Box>
  );
}
export default Socapbang;
