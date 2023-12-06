import { Button, Card, Grid, TextField, useMediaQuery } from '@mui/material';
import { IconCertificate, IconEdit, IconSearch, IconZoomIn, IconFileExport } from '@tabler/icons';
import React from 'react';
import ThongKeSoBangDaPhatChuaPhat from './SoBangDaPhatChuaPhat';
import ThongKeSoLuongXepLoai from './SoLuongXepLoai';
import MainCard from 'components/cards/MainCard';
import { useState } from 'react';
import { useEffect } from 'react';
import { GetTraCuuHocSinhTotNghiep } from 'services/thongkeService';
import { donviSelector, openPopupSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import useLocalText from 'utils/localText';
import { DataGrid } from '@mui/x-data-grid';
import { listDanhMuc, selectedHocsinh, setCapBangBanSao, setOpenPopup, setReloadData } from 'store/actions';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import i18n from 'i18n';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import BackToTop from 'components/scroll/BackToTop';
import ThongKePhong from './ThongKePhong';
import ThongKeTruong from './ThongKeTruong';
import Popup from 'components/controls/popup';
import ActionButtons from 'components/button/ActionButtons';
import '../../index.css';
import ChinhSuaVBCC from 'views/chinhsuavbcc/ChinhSuaVBCC';
import Thuhoihuybo from 'views/thuhoihuybo/Thuhoihuybo';
import ShowVanBang from './ShowVanBang';
import InBanSao from './InBanSao';
import XacNhanIn from './XacNhanIn';
import config from 'config';
import ThongKeSoLuongNguoiHoc from './SoLuongHocSinh';
import { getAllDanhmucTN } from 'services/sharedService';
import Detail from 'views/hocsinh/Detail';
import { format } from 'date-fns';
import { GetCauHinhByIdDonVi } from 'services/sharedService';
import { generateDocument } from '../capbangbansao/ExportWord';
import { getSearchDonYeuCauDaDuyet } from 'services/capbangbansaoService';
import { formatDate } from 'utils/formatDate';
import { setLoading } from 'store/actions';

// import { Component } from 'react';

// class Demo extends Component {
//   constructor(props) {
//     super(props);
//     // Don't do this!
//     this.state = { color: 'green' };
//   }

//   UNSAFE_componentWillMount() {
//     console.log('componentWillMount da chay');
//   }

//   componentDidMount() {
//     console.log('componentDidMount da chay');
//   }

//   render() {
//     console.log('Ham render da duoc chay');
//     return (
//       <div>
//         <button onClick={() => this.setState({ color: 'aaaaa' })}>Submit</button>
//         <p>{this.state.color}</p>
//       </div>
//     );
//   }
// }

const TrangChu = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const language = i18n.language;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const reloadData = useSelector(reloadDataSelector);
  const donvi = useSelector(donviSelector);
  const [search, setSearch] = useState(false);
  const openPopup = useSelector(openPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const user = useSelector(userLoginSelector);
  const [hsSoGoc, setHsSoGoc] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [dataExport, setDataExport] = useState([]);
  const [dataConfig, setDataConfig] = useState([]);

  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10,
    cccd: '',
    hoTen: ''
  });

  const handleShowVanBang = (hocsinh) => {
    setTitle(t('Thông tin văn bằng'));
    setForm('showvanbang');
    setHsSoGoc(hocsinh);
    dispatch(setOpenPopup(true));
  };

  const handleDetail = (hocsinh) => {
    setTitle(t('hocsinh.title.info'));
    setForm('detail');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };

  const handleChinhSuaVBCC = (hocsinh) => {
    setTitle(t('Chỉnh sửa văn bằng chứng chỉ'));
    setForm('chinhsuavbcc');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };

  const handleThuHoiHuyBo = (hocsinh) => {
    setTitle(t('Thu hồi hủy bỏ văn bằng chứng chỉ'));
    setForm('thuhoi');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };

  const handlePreview = (donyeucau) => {
    setTitle(t('In Bản sao '));
    setForm('inbang');
    dispatch(setCapBangBanSao(donyeucau));
    dispatch(setOpenPopup(true));
  };
  const handleXacNhanIn = (donyeucau) => {
    setTitle(t('Xác Nhận In'));
    setForm('xacnhanin');
    dispatch(setCapBangBanSao(donyeucau));
    dispatch(setOpenPopup(true));
  };

  const capbangsao = [
    {
      type: 'capbansao',
      handleClick: handlePreview
    },
    {
      type: 'xacnhanin',
      handleClick: handleXacNhanIn
    }
  ];

  const chinhsuavb = [
    {
      type: 'chinhsuavbcc',
      handleClick: handleChinhSuaVBCC
    },
    {
      type: 'thuhoi',
      handleClick: handleThuHoiHuyBo
    }
  ];

  const columns = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false,
      cellClassName: 'top-aligned-cell'
    },
    {
      field: 'hoTen',
      headerName: t('hocsinh.field.fullname'),
      flex: 2,
      minWidth: 180
    },
    {
      field: 'cccd',
      headerName: t('hocsinh.field.cccd'),
      flex: 1.3,
      minWidth: 100
    },
    {
      field: 'gioiTinh_fm',
      headerName: t('hocsinh.field.gender'),
      flex: 1,
      minWidth: 70
    },
    {
      field: 'ngaySinh_fm',
      headerName: t('hocsinh.field.bdate'),
      flex: 1.3,
      minWidth: 95
    },
    {
      field: 'ketQua_fm',
      headerName: t('Kết quả'),
      flex: 1.2,
      minWidth: 100
    },
    {
      field: 'soHieuVanBang',
      headerName: t('hocsinh.field.soHieu'),
      flex: 1.5,
      minWidth: 110
    },
    {
      field: 'soVaoSoCapBang',
      headerName: t('hocsinh.field.soCapBang'),
      flex: 1.7,
      minWidth: 130
    },
    {
      field: 'trangThai_fm',
      headerName: t('Trạng thái'),
      flex: 1.5,
      minWidth: 110
    },
    {
      field: 'actions',
      headerName: t('action'),
      width: 135,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Grid container>
            {params.row.ketQua === 'x' ? (
              <>
                <Grid item>
                  <ActionButtons type="showvanbang" handleClick={handleShowVanBang} params={params.row} />
                </Grid>
                {params.row.donYeuCauCapBanSao != null ? (
                  <Grid item ml={1}>
                    <CombinedActionButtons
                      params={params.row}
                      buttonConfigurations={capbangsao}
                      icon={IconCertificate}
                      title={'Cấp bằng bản sao'}
                      color="success"
                    />
                  </Grid>
                ) : (
                  ''
                )}
                <Grid item ml={1}>
                  <CombinedActionButtons
                    params={params.row}
                    buttonConfigurations={chinhsuavb}
                    icon={IconEdit}
                    title={t('button.title.chinhsua.huybo')}
                    color="orange"
                  />
                </Grid>
              </>
            ) : (
              <>
                <ActionButtons type="detail" handleGetbyId={handleDetail} params={params.row} />
              </>
            )}
          </Grid>
        </>
      )
    }
  ];

  useEffect(() => {
    const fetchDataDL = async () => {
      const response = await getAllDanhmucTN(user?.username || '');
      dispatch(listDanhMuc(response.data));
    };

    if (user) {
      const fetchData = async () => {
        const params = new URLSearchParams();
        params.append('Order', 1);
        params.append('OrderDir', 'ASC');
        params.append('StartIndex', '0');
        params.append('PageSize', 1000);
        params.append('NgayDuyet', format(new Date(), 'yyyy-MM-dd'));
        params.append('NguoiThucHien', user?.username || '');
        params.append('TrangThai', pageState.trangThai || '');
        const response = await getSearchDonYeuCauDaDuyet(params);
        const response1 = await GetCauHinhByIdDonVi(user.username || '');
        setDataExport(response.data.donYeuCaus);
        setDataConfig(response1.data);
      };
      if (donvi.laPhong) {
        fetchDataDL();
      }

      if (!firstLoad) {
        fetchData();
      } else {
        setFirstLoad(false);
      }
      if (donvi != 0) {
        fetchDataDL();
      }
    }
  }, [donvi, user]);

  const handleExportWord = async (e) => {
    e.preventDefault();
    setLoading(true);
    generateDocument(SoBanSao_word, SoBanSao_cf, true);
    setLoading(false);
  };

  const SoBanSao_word =
    dataExport &&
    dataExport.map((data, index) => ({
      idx: index + 1,
      hoTen_fm: data.hocSinh.hoTen,
      ngaySinh_fm: convertISODateToFormattedDate(data.hocSinh.ngaySinh),
      noiSinh_fm: data.hocSinh.noiSinh,
      gioiTinh_fm: data.hocSinh.gioiTinh ? 'Nam' : 'Nữ',
      danToc_fm: data.hocSinh.danToc,
      xepLoai_fm: data.hocSinh.xepLoai,
      soHieuVanBang_fm: data.hocSinh.soHieuVanBang,
      soVaoSoBanSao_fm: data.soVaoSoBanSao
    }));

  const SoBanSao_cf = {
    uyBanNhanDan: (dataConfig.tenUyBanNhanDan && dataConfig.tenUyBanNhanDan.toUpperCase()) || '',
    coQuanCapBang: (dataConfig.tenCoQuanCapBang && dataConfig.tenCoQuanCapBang.toUpperCase()) || '',
    diaPhuong: dataConfig.tenDiaPhuongCapBang || '',
    ngayCap: formatDate(format(new Date(), 'yyyy-MM-dd')),
    nguoiKy: dataConfig.hoTenNguoiKySoGoc || '',
    nam: new Date(format(new Date(), 'yyyy-MM-dd')).getFullYear(),
    ngay: new Date(format(new Date(), 'yyyy-MM-dd')).getDate(),
    thang: new Date(format(new Date(), 'yyyy-MM-dd')).getMonth() + 1
  };

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('cccd', pageState.cccd);
      params.append('hoTen', pageState.hoTen);
      params.append('nguoiThucHien', user ? user.username : '');
      const response = await GetTraCuuHocSinhTotNghiep(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        if (response.data && response.data.hocSinhs.length > 0) {
          const trangThaiMapping = {
            1: t('Chưa duyệt'),
            2: t('Đã duyệt'),
            3: t('Đã vào sổ gốc'),
            4: t('Đã cấp bằng'),
            5: t('Đã in bằng'),
            6: t('Đã phát bằng')
          };
          const dataWithIds = data.hocSinhs.map((row, index) => ({
            idx: pageState.startIndex * pageState.pageSize + index + 1,
            soHieuVanBang: row.soHieuVanBang || 'Chưa cấp',
            soVaoSoCapBang: row.soVaoSoCapBang || 'Chưa cấp',
            gioiTinh_fm: row.gioiTinh ? t('gender.male') : t('gender.female'),
            trangThai_fm: trangThaiMapping[row.trangThai] || 'Không xác định',
            ngaySinh_fm: convertISODateToFormattedDate(row.ngaySinh),
            ketQua_fm: row.ketQua == 'x' ? t('Đạt') : t('Không đạt'),
            ...row
          }));
          dispatch(setReloadData(false));
          setPageState((old) => ({
            ...old,
            isLoading: false,
            data: dataWithIds,
            total: data.totalRow || 0
          }));
        } else {
          setPageState((old) => ({
            ...old,
            isLoading: false,
            data: [],
            total: 0
          }));
        }
      } else {
        setIsAccess(false);
      }
    };
    if (search || reloadData) {
      if (pageState.cccd || pageState.hoTen) {
        fetchData();
      } else {
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: [],
          total: 0
        }));
      }
      setSearch(false);
    }
  }, [reloadData, search]);

  const handleSearch = () => {
    setSearch(true);
  };

  const handleTraCuuNangCao = () => {
    navigate(config.defaultPath + '/tracuuvanbang');
  };

  return (
    <>
      {/* <Demo></Demo> */}
      {donvi === 0 ? (
        <div className="wrapper">
          <svg>
            <text x="50%" y="50%" dy=".35em" textAnchor="middle">
              Chào mừng bạn đến với quản trị hế thống
            </text>
          </svg>
        </div>
      ) : (
        <>
          {donvi.laPhong && (
            <Grid mb={2}>
              <MainCard
                hideInstruct
                title={t('Tra cứu nhanh')}
                secondary={
                  <Grid item>
                    <Button
                      onClick={handleExportWord}
                      color="info"
                      variant="contained"
                      startIcon={<IconFileExport />}
                      disabled={dataExport && dataExport.length == 0}
                    >
                      {t('Xuất sổ bản sao')}
                    </Button>
                  </Grid>
                }
              >
                <Grid item container spacing={1} mb={2} justifyContent={'center'} alignItems={'center'}>
                  <Grid item lg={2} md={3} sm={3} xs={isXs ? 4 : 2}>
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label={t('hocsinh.field.cccd')}
                      variant="outlined"
                      size="small"
                      onChange={(e) => setPageState((old) => ({ ...old, cccd: e.target.value }))}
                      value={pageState.cccd}
                    />
                  </Grid>
                  <Grid item lg={4} md={6} sm={6} xs={isXs ? 8 : 4}>
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label={t('hocsinh.field.fullname')}
                      variant="outlined"
                      size="small"
                      onChange={(e) => setPageState((old) => ({ ...old, hoTen: e.target.value }))}
                      value={pageState.hoTen}
                    />
                  </Grid>
                  <Grid item width={183}>
                    <Button variant="contained" fullWidth onClick={handleSearch} color="info" startIcon={<IconSearch />}>
                      {t('Tra cứu nhanh')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" fullWidth onClick={handleTraCuuNangCao} color="info" startIcon={<IconZoomIn />}>
                      {t('Tra cứu nâng cao')}
                    </Button>
                  </Grid>
                </Grid>
                <DataGrid
                  autoHeight
                  columns={columns}
                  rows={pageState.data}
                  loading={pageState.isLoading}
                  rowHeight={60}
                  onSortModelChange={(newSortModel) => {
                    const field = newSortModel[0]?.field;
                    const sort = newSortModel[0]?.sort;
                    setPageState((old) => ({ ...old, order: field, orderDir: sort }));
                  }}
                  onFilterModelChange={(newSearchModel) => {
                    const value = newSearchModel.items[0]?.value;
                    setPageState((old) => ({ ...old, search: value }));
                  }}
                  localeText={language === 'vi' ? localeText : null}
                  disableSelectionOnClick={true}
                  hideFooterPagination={true}
                  hideFooter={true} // Ẩn phần footer
                />
              </MainCard>
            </Grid>
          )}
          {donvi.laPhong ? <ThongKePhong /> : <ThongKeTruong />}
          {donvi.laPhong ? (
            <>
              <Card sx={{ mt: 2 }}>
                <Grid container item xs={12} justifyContent={'center'}>
                  <Grid item xs={12}>
                    <ThongKeSoLuongNguoiHoc />
                    {/* <ThongKeSoLuong /> */}
                  </Grid>
                </Grid>
              </Card>
              <Grid item xs={12} mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={6} md={6} sm={12}>
                    <ThongKeSoLuongXepLoai />
                  </Grid>
                  <Grid item xs={12} lg={6} md={6} sm={12}>
                    <ThongKeSoBangDaPhatChuaPhat />
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : (
            ''
          )}
          {form !== '' && (
            <Popup title={title} form={form} openPopup={openPopup} maxWidth={form == 'xacnhanin' ? 'sm' : 'md'} bgcolor={'#2196F3'}>
              {form === 'showvanbang' ? (
                <ShowVanBang duLieuHocSinh={hsSoGoc} />
              ) : form === 'inbang' ? (
                <InBanSao />
              ) : form === 'xacnhanin' ? (
                <XacNhanIn />
              ) : form == 'chinhsuavbcc' ? (
                <ChinhSuaVBCC />
              ) : form == 'thuhoi' ? (
                <Thuhoihuybo />
              ) : form == 'detail' ? (
                <Detail />
              ) : (
                ''
              )}
            </Popup>
          )}
          <BackToTop />
        </>
      )}
    </>
  );
};

export default TrangChu;
