import { FormControl, Grid, InputLabel, MenuItem, Select, useMediaQuery } from '@mui/material';
import { IconFileExport, IconFileImport } from '@tabler/icons';
import GroupButtons from 'components/button/GroupButton';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import MainCard from 'components/cards/MainCard';
import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const data = [
  {
    table: 'namhoc',
    name: 'Năm học',
    fileImport: 'namhoc_import.xlsx',
    fileExport: 'namhoc_export.xlsx'
  },
  {
    table: 'dantoc',
    name: 'Dân tộc',
    fileImport: 'dantoc_import.xlsx',
    fileExport: 'dantoc_export.xlsx'
  }
];
const XuLyDuLieu = () => {
  const [selectedFileMau, setSelectedFileMau] = useState('');
  const [selectedFileExport, setselectedFileExport] = useState('');
  const isXs = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(data && data.length > 0 ? data[0].table : '');
  const handleDowloadTemplate = async () => {
    console.log(selectedFileMau ? selectedFileMau : data[0].fileImport);
    // window.location.href = selectedFileMau;
  };
  const handleImport = () => {
    // setTitle(t('Import dữ liệu danh mục'));
    // setForm('import');
    // dispatch(setOpenPopup(true));
  };
  const handleExport = () => {
    console.log(selectedFileExport ? selectedFileExport : data[0].fileExport);
  };
  const handleDanhMucChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    const selectedCategoryData = data.find((item) => item.table === value);
    setSelectedFileMau(selectedCategoryData ? selectedCategoryData.fileImport : data[0].fileImport);
    setselectedFileExport(selectedCategoryData ? selectedCategoryData.fileExport : data[0].fileExport);
  };
  console.log(selectedCategory);
  const themTuTep = [
    {
      type: 'importFile',
      handleClick: handleImport
    },
    {
      type: 'dowloadTemplate',
      handleClick: handleDowloadTemplate
    }
  ];
  return (
    <>
      <MainCard title={t('Xử lý dữ liệu')}>
        <Grid container justifyContent="center">
          <Grid item xs={isXs ? 12 : 4} sx={{ ml: 2, mb: 2 }}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('Chọn danh mục')}</InputLabel>
              <Select name="id" label={t('Chọn danh mục')} onChange={handleDanhMucChange} value={selectedCategory}>
                {data && data.length > 0 ? (
                  data.map((dmtn) => (
                    <MenuItem key={dmtn.table} value={dmtn.table}>
                      {dmtn.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No data available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={isXs ? 8 : 2.5} sm={4} md={4} lg={2.1} sx={{ ml: 2, mb: 2 }}>
            <GroupButtons buttonConfigurations={themTuTep} themtep icon={IconFileImport} title={t('button.import')} />
          </Grid>
          <Grid item xs={isXs ? 6 : 2.5} sm={4} md={3} lg={2.5} sx={{ ml: 2, mb: 2 }}>
            <ButtonSuccess title={t('button.export')} onClick={handleExport} icon={IconFileExport} />
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

export default XuLyDuLieu;
