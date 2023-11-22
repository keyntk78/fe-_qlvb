import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSubSubPopup } from 'store/actions';
//import { useNavigate } from 'react-router-dom';
//mport { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
//import { createSearchParams } from 'utils/createSearchParams';
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
import DuaVaoBangChinh from 'views/ImportDanhSachVanBang/DuaVaoBangChinh';
import XoaKhoiBangTam from 'views/ImportDanhSachVanBang/XoaKhoiBangTam';
import { openSubSubPopupSelector } from 'store/selectors';
import { useTranslatedColumns } from './ColumnNamHoc';
const DanhSachImport = ({ selectedValue }) => {
  console.log(selectedValue);
  const language = i18n.language;
  const { t } = useTranslation();
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const { columns_namHoc } = useTranslatedColumns();
  //   const navigate = useNavigate();
  // const [isAccess, setIsAccess] = useState(true);
  //   const reloadData = useSelector(reloadDataSelector);
  //   const [search, setSearch] = useState(false);
  //   const donvitruong = useSelector(selectedDonvitruongSelector);
  //   const dmtn = useSelector(selectedDanhmuctotnghiepSelector);
  //   const user = useSelector(userLoginSelector);
  //   const [dataTK, setdataTK] = useState([]);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const openSubSubPopup = useSelector(openSubSubPopupSelector);
  //   const openSubPopup = useSelector(openSubPopupSelector);
  //   const theme = useTheme();
  //   const [pageState, setPageState] = useState({
  //     isLoading: false,
  //     data: [],
  //     total: 0,
  //     order: 1,
  //     orderDir: 'ASC',
  //     startIndex: 0,
  //     pageSize: 10,
  //     cccd: '',
  //     hoTen: '',
  //     noiSinh: '',
  //     danToc: ''
  //   });
  const styles = {
    paper: {
      //opacity: 0.8,
      borderRadius: '10px',
      width: '90%',
      marginBottom: '10px'
      //boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
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
  const columns = selectedValue === 'namhoc' ? columns_namHoc : '';
  const rows = [
    { id: 1, idx: 1, hoTen: 'Nguyen Van A', cccd: '123456789', gioiTinh_fm: 'Nam', ngaySinh_fm: '01/01/1990', soHieuVanBang: 'SH001' },
    { id: 2, idx: 2, hoTen: 'Tran Thi B', cccd: '987654321', gioiTinh_fm: 'Nữ', ngaySinh_fm: '15/05/1995', soHieuVanBang: 'SH002' }
    // Thêm các hàng khác tương tự nếu cần
  ];

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       setPageState((old) => ({ ...old, isLoading: true }));
  //       const params = await createSearchParams(pageState);
  //       params.append('cccd', pageState.cccd);
  //       params.append('hoTen', pageState.hoTen);
  //       params.append('noiSinh', pageState.noiSinh);
  //       params.append('danToc', pageState.danToc);
  //       params.append('idDanhMucTotNghiep', dmtn);
  //       params.append('idTruong', donvitruong);
  //       params.append('NguoiThucHien', user.username);
  //       const response = await getDanhSachVanBangTmp(params);
  //       const response_Thongke = await ThongKeDanhSachVanBangTmp(donvitruong, user.username, dmtn);
  //       setdataTK(response_Thongke.data);
  //       const check = handleResponseStatus(response, navigate);
  //       if (check) {
  //         const data = await response.data;
  //         const dataWithIds =
  //           data &&
  //           data.hocSinhs.map((row, index) => ({
  //             idx: pageState.startIndex * pageState.pageSize + index + 1,
  //             soHieuVanBang: row.soHieuVanBang ? row.soHieuVanBang : 'Chưa cấp',
  //             soVaoSoCapBang: row.soVaoSoCapBang || 'Chưa cấp',
  //             gioiTinh_fm: row.gioiTinh ? t('gender.male') : t('gender.female'),
  //             ngaySinh_fm: convertISODateToFormattedDate(row.ngaySinh),
  //             ...row
  //           }));
  //         // Lưu trữ dữ liệu gốc vào state
  //         dispatch(setReloadData(false));
  //         setPageState((old) => ({
  //           ...old,
  //           isLoading: false,
  //           data: dataWithIds,
  //           total: data.totalRow || 0
  //         }));
  //       } else {
  //         setIsAccess(false);
  //       }
  //     };
  //     fetchData();
  //     setSearch(false);
  //   }, [
  //     pageState.search,
  //     pageState.order,
  //     pageState.orderDir,
  //     pageState.startIndex,
  //     pageState.pageSize,
  //     reloadData,
  //     search,
  //     openSubPopup == true
  //   ]);

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
          <Grid item sm={4} xs={12}>
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
                {0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item sm={4} xs={12}>
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
                {0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item sm={4} xs={12}>
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
                0
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <MainCard
        title={t('Danh sách văn bằng import')}
        secondary={
          <Grid item>
            <ButtonSuccess title={t('button.export')} icon={IconFileExport} />
          </Grid>
        }
      >
        <DataGrid
          autoHeight
          columns={columns}
          rows={rows}
          //rows={pageState.data}
          //rowCount={pageState.total}
          //loading={pageState.isLoading}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          pagination
          //page={pageState.startIndex}
          //pageSize={pageState.pageSize}
          paginationMode="server"
          //   onPageChange={(newPage) => {
          //     setPageState((old) => ({ ...old, startIndex: newPage }));
          //   }}
          //   onPageSizeChange={(newPageSize) => {
          //     setPageState((old) => ({ ...old, pageSize: newPageSize }));
          //   }}
          //   onSortModelChange={(newSortModel) => {
          //     const field = newSortModel[0]?.field;
          //     const sort = newSortModel[0]?.sort;
          //     setPageState((old) => ({ ...old, order: field, orderDir: sort }));
          //   }}
          //   onFilterModelChange={(newSearchModel) => {
          //     const value = newSearchModel.items[0]?.value;
          //     setPageState((old) => ({ ...old, search: value }));
          //   }}
          localeText={language === 'vi' ? localeText : null}
          disableSelectionOnClick={true}
        />
      </MainCard>{' '}
      <div style={{ textAlign: 'center' }}>
        <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
          {/* {dataTK && dataTK.errorRow == 0 && ( */}
          <Grid item>
            <CustomButton icon={IconCheck} label="Import" variant="contained" color="info" handleClick={openConfirm} />
          </Grid>
          {/* )} */}
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
          {form === 'addlist' ? <DuaVaoBangChinh /> : form === 'delete' ? <XoaKhoiBangTam /> : ''}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default DanhSachImport;
