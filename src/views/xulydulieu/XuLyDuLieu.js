import { FormControl, Grid, InputLabel, MenuItem, Select, useMediaQuery } from '@mui/material';
import { IconFileExport, IconFileImport } from '@tabler/icons';
import GroupButtons from 'components/button/GroupButton';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import MainCard from 'components/cards/MainCard';
import Popup from 'components/controls/popup';
import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup } from 'store/actions';
import { openPopupSelector } from 'store/selectors';
import Import from './Import';
import { ExportData } from './HandleExportExcel';
import { useEffect } from 'react';
import { GetCauHinhImportDanhMuc } from 'services/xulydulieuService';

const XuLyDuLieu = () => {
  const isXs = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [data, setData] = useState([]);
  const [selectedFileMau, setSelectedFileMau] = useState('');
  const [selectedName, seSelectedName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const openPopup = useSelector(openPopupSelector);
  const dispatch = useDispatch();
  const handleDowloadTemplate = async () => {
    console.log(selectedFileMau ? selectedFileMau : data[0].fileImport);
    // window.location.href = selectedFileMau;
  };
  // handleExport_DanToc,
  //handleExport_NamHoc, handleExport_DanToc, handleExport_KhoaThi, handleExport_HeDaoTao, handleExport_HinhThucDaoTao, handleExport_MonThi;
  const { handleExport_NamHoc, handleExport_MonThi } = ExportData();
  const handleImport = () => {
    setTitle(t('Import dữ liệu danh mục'));
    setForm('import');
    dispatch(setOpenPopup(true));
  };
  const handleExport = (e) => {
    selectedCategory == 'namhoc' ? handleExport_NamHoc(e) : selectedCategory == 'dantoc' ? handleExport_MonThi(e) : '';
  };
  const handleDanhMucChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    const selectedCategoryData = data.find((item) => item.table === value);
    setSelectedFileMau(selectedCategoryData ? selectedCategoryData.fileImport : data[0].fileImport);
    seSelectedName(selectedCategoryData ? selectedCategoryData.name : data[0].name);
  };

  // Láy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetCauHinhImportDanhMuc();
      if (response.data.length > 0) {
        seSelectedName(response.data[0].name);
        setSelectedCategory(response.data[0].table);
        setData(response.data);
      }
    };
    fetchData();
  }, []);

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
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={isXs ? 12 : 3} sx={{ ml: 2, mb: 2 }}>
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
      {form !== '' && (
        <Popup title={title} form={form} openPopup={openPopup} maxWidth={'sm'} bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}>
          {form === 'import' ? <Import selectedName={selectedName} selectedValue={selectedCategory} /> : ''}
        </Popup>
      )}
    </>
  );
};

export default XuLyDuLieu;
