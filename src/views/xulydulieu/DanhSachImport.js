import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSubSubPopup, setReloadData } from 'store/actions';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import React from 'react';
//import { convertISODateToFormattedDate } from 'utils/formatDate';
import { Grid, Paper, Typography } from '@mui/material';
import { IconCheck, IconFileExport, IconX } from '@tabler/icons';
//import * as XLSX from 'xlsx';
import BackToTop from 'components/scroll/BackToTop';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
// import { ThongKeDanhSachVanBangTmp, getDanhSachVanBangTmp } from 'services/xacminhvanbangService';
// import { useTheme } from '@emotion/react';
import CustomButton from 'components/button/CustomButton';
import Popup from 'components/controls/popup';
import DuaVaoBangChinh from './DuaVaoBangChinh';
import XoaKhoiBangTam from './XoaKhoiBangTam';
import { openSubPopupSelector, openSubSubPopupSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import { useTranslatedColumns } from './ColumnNamHoc';
import { useEffect } from 'react';
import { getDanhSachDanhMucTmp } from 'services/xulydulieuService';
import config from 'config';
import { convertISODateToFormattedDate } from 'utils/formatDate';
const DanhSachImport = ({ selectedValue, selectedName }) => {
  console.log(selectedValue);
  const language = i18n.language;
  const { t } = useTranslation();
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const { columns_DanToc, columns_HeDaoTao, columns_HinhThucDaoTao, columns_KhoaThi, columns_MonHoc, columns_NamThi, columns_DonVi } =
    useTranslatedColumns();
  const navigate = useNavigate();
  const reloadData = useSelector(reloadDataSelector);
  const [dataImport, setDataImport] = useState([]);
  const user = useSelector(userLoginSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const openSubSubPopup = useSelector(openSubSubPopupSelector);
  const openSubPopup = useSelector(openSubPopupSelector);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10
  });
  const styles = {
    paper: {
      borderRadius: '10px',
      width: '90%',
      marginBottom: '10px'
    },
    countContainer: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    countIcon: {
      color: '#fff',
      width: '18px',
      height: '18px'
    }
  };
  const columns =
    selectedValue === 'monthi'
      ? columns_MonHoc
      : selectedValue === 'dantoc'
      ? columns_DanToc
      : selectedValue === 'hedaotao'
      ? columns_HeDaoTao
      : selectedValue === 'hinhthucdaotao'
      ? columns_HinhThucDaoTao
      : selectedValue === 'khoathi'
      ? columns_KhoaThi
      : selectedValue === 'namhoc'
      ? columns_NamThi
      : selectedValue === 'donvi'
      ? columns_DonVi
      : '';

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('key', selectedValue);
      params.append('NguoiThucHien', user.username);
      const response = await getDanhSachDanhMucTmp(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        console.log(data);
        if (data) {
          setDataImport(data);
          console.log(data);
          let dataWithIds = [];
          if (selectedValue === 'khoathi') {
            dataWithIds =
              data &&
              data.list.map((row, index) => ({
                id: pageState.startIndex * pageState.pageSize + index + 1,
                ngay_fm: convertISODateToFormattedDate(row.ngay),
                ...row
              }));
          } else {
            dataWithIds =
              data &&
              data.list.map((row, index) => ({
                id: pageState.startIndex * pageState.pageSize + index + 1,
                ...row
              }));
          }
          // Lưu trữ dữ liệu gốc vào state
          dispatch(setReloadData(false));
          setPageState((old) => ({
            ...old,
            isLoading: false,
            data: dataWithIds,
            total: data.totalRow || 0
          }));
        } else {
          setIsAccess(false);
        }
      }
    };
    if (openSubPopup) {
      fetchData();
    }
  }, [pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, openSubPopup]);

  const openConfirm = () => {
    setTitle(t('Xác nhận'));
    setForm('addlist');
    dispatch(setOpenSubSubPopup(true));
  };
  const openDelete = () => {
    setTitle(t('Hủy '));
    setForm('delete');
    dispatch(setOpenSubSubPopup(true));
  };
  return (
    <>
      <Grid container justifyContent={'center'} mt={2}>
        <Grid item xs={11.4} container spacing={1}>
          <Grid item sm={3} xs={12}>
            <Paper variant="outlined" sx={{ ...styles.paper, background: '#6C757D' }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  color: '#6C737F',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  margin: '-15px 0px'
                }}
              >
                <h4 style={{ fontSize: '15px', color: 'white', textAlign: 'center' }}>Tổng số dòng</h4>
              </Typography>
              <Typography variant="h1" component="div" sx={{ textAlign: 'center', fontSize: '30px', color: 'white' }}>
                {dataImport ? dataImport.total : 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item sm={3} xs={12}>
            <Paper variant="outlined" sx={{ ...styles.paper, background: '#28a745' }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  color: '#6C737F',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  margin: '-15px 0px'
                }}
              >
                <h4 style={{ fontSize: '15px', color: 'white', textAlign: 'center' }}>Số dòng hợp lệ</h4>
              </Typography>
              <Typography variant="h1" component="div" sx={{ textAlign: 'center', fontSize: '30px', color: 'white' }}>
                {dataImport ? dataImport.countSuccess : 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item sm={3} xs={12}>
            <Paper variant="outlined" sx={{ ...styles.paper, background: '#fcb103' }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  color: '#6C737F',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  margin: '-15px 0px'
                }}
              >
                <h4 style={{ fontSize: '15px', color: 'white', textAlign: 'center' }}>Số dòng đã tồn tại</h4>
              </Typography>
              <Typography variant="h1" component="div" sx={{ textAlign: 'center', fontSize: '30px', color: 'white' }}>
                {dataImport ? dataImport.countwarring : 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item sm={3} xs={12}>
            <Paper variant="outlined" sx={{ ...styles.paper, background: '#dc3545' }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  color: '#6C737F',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  margin: '-15px 0px'
                }}
              >
                <h4 style={{ fontSize: '15px', color: 'white', textAlign: 'center' }}>Số dòng không hợp lệ</h4>
              </Typography>
              <Typography variant="h1" component="div" sx={{ textAlign: 'center', fontSize: '30px', color: 'white' }}>
                {dataImport ? dataImport.countError : 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <MainCard
        title={t(`Danh sách đã import`)}
        secondary={
          <Grid item>
            <a href={dataImport ? config.urlImages + dataImport.pathFile : ''} download>
              <ButtonSuccess title={t('button.export')} icon={IconFileExport} />
            </a>
          </Grid>
        }
      >
        <DataGrid
          autoHeight
          columns={columns}
          //rows={rows}
          rows={pageState.data}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          pagination
          page={pageState.startIndex}
          pageSize={pageState.pageSize}
          paginationMode="server"
          onPageChange={(newPage) => {
            setPageState((old) => ({ ...old, startIndex: newPage }));
          }}
          onPageSizeChange={(newPageSize) => {
            setPageState((old) => ({ ...old, pageSize: newPageSize }));
          }}
          onSortModelChange={(newSortModel) => {
            const field = newSortModel[0]?.field;
            const sort = newSortModel[0]?.sort;
            setPageState((old) => ({ ...old, order: field, orderDir: sort }));
          }}
          localeText={language === 'vi' ? localeText : null}
          disableSelectionOnClick={true}
        />
      </MainCard>{' '}
      <div style={{ textAlign: 'center' }}>
        <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
          {dataImport && dataImport.countError === 0 && (
            <Grid item>
              <CustomButton icon={IconCheck} label="Import" variant="contained" color="info" handleClick={openConfirm} />
            </Grid>
          )}
          <Grid item>
            <CustomButton icon={IconX} label="Hủy" variant="contained" color="error" handleClick={openDelete} />
          </Grid>
        </Grid>
      </div>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openSubSubPopup}
          type="subsubpopup"
          maxWidth={'sm'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'addlist' ? (
            <DuaVaoBangChinh selectedValue={selectedValue} selectedName={selectedName} />
          ) : form === 'delete' ? (
            <XoaKhoiBangTam selectedValue={selectedValue} />
          ) : (
            ''
          )}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default DanhSachImport;
