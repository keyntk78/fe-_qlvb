import { Card, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SkeletonTotalCard from 'components/cards/Skeleton/TotalCard';
import { getAllNamthi } from 'services/namthiService';
import { GetThongKeTongQuatByPhongGD } from 'services/thongkeService';
import { IconAlbum, IconBuildingCommunity, IconFileDescription, IconUserExclamation } from '@tabler/icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectedNamthi, setFirstLoad, setOpenSubSubPopup } from 'store/actions';
import { useNavigate } from 'react-router';
import { firstLoadSelector, listDanhMucSelector, openSubSubPopupSelector, userLoginSelector } from 'store/selectors';
import config from 'config';
import ThongkeDonViGuiDuyet from './ThongKeDonViGuiDuyet';
import Popup from 'components/controls/popup';

const ThongKePhong = () => {
  const isMd = useMediaQuery('(max-width:1220px)');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [namHoc, setNamHoc] = useState([]);
  const [selectNamHoc, setSelectNamHoc] = useState('');
  const listDanhMuc = useSelector(listDanhMucSelector);
  const [selectDanhMuc, setSelectDanhMuc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const currentYear = new Date().getFullYear();
  const openSubSubPopup = useSelector(openSubSubPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [data, setData] = useState([]);
  const firstLoad = useSelector(firstLoadSelector);
  const [thongKeTongQuat, setThongKeTongQuat] = useState({
    phoi: 0,
    donViTong: 0,
    donViDaGui: 0,
    donCapBanSao: 0,
    hocSinhChoDuyet: 0
  });
  const user = useSelector(userLoginSelector);
  const styles = {
    paper: {
      background: 'white',
      opacity: 0.8,
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
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

  useEffect(() => {
    const fetchDataDL = async () => {
      setTimeout(
        async () => {
          try {
            const namhoc = await getAllNamthi();
            setNamHoc(namhoc.data);
            if (namhoc?.data?.length > 0) {
              const matchingYear = namhoc.data.find((year) => year.ten === currentYear.toString());
              if (matchingYear) {
                setSelectNamHoc(matchingYear.id);
              } else {
                setSelectNamHoc(namhoc.data[0].id);
              }
            }
          } catch (error) {
            console.error(error);
            setIsLoading(false);
          }
        },
        firstLoad ? 1500 : 0
      );
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    const namhoc = namHoc.find((year) => year.id === selectNamHoc);
    if (listDanhMuc?.length > 0 && namhoc) {
      const matchingYear = listDanhMuc.find((year) => year.namThi === namhoc.ten);
      if (matchingYear) {
        const dataDM = listDanhMuc.filter((year) => year.namThi === matchingYear.namThi);
        setData(dataDM);
        setSelectDanhMuc(dataDM[0].id);
      } else {
        setData([]);
        setSelectDanhMuc('');
      }
    }
  }, [listDanhMuc, selectNamHoc]);

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams();
      if (selectDanhMuc) {
        params.append('idDanhMucTotnghiep', selectDanhMuc);
      } else {
        params.append('idDanhMucTotnghiep', '');
      }
      params.append('nguoiThucHien', user ? user.username : '');

      setTimeout(
        async () => {
          try {
            const response = await GetThongKeTongQuatByPhongGD(params);
            const data = response.data;
            setThongKeTongQuat((old) => ({
              ...old,
              phoi: data && data.SoLuongPhoiDaIn ? data.SoLuongPhoiDaIn.Tong : 0,
              donViTong: data && data.SoLuongDonViDaGui ? data.SoLuongDonViDaGui.Tong : 0,
              donViDaGui: data && data.SoLuongDonViDaGui ? data.SoLuongDonViDaGui.DaGui : 0,
              donCapBanSao: data && data.SoLuongDonYeuCauCapBanSao ? data.SoLuongDonYeuCauCapBanSao.Tong : 0,
              hocSinhChoDuyet: data && data.SoLuongHocSinhChuaDuyet ? data.SoLuongHocSinhChuaDuyet.SoLuongChuaDuyet : 0
            }));
            setIsLoading(false);
            dispatch(setFirstLoad(false));
          } catch (error) {
            console.error(error);
            setIsLoading(false);
          }
        },
        firstLoad ? 2000 : 0
      );
    };

    fetchData();
  }, [selectDanhMuc]);

  useEffect(() => {
    dispatch(selectedNamthi(selectNamHoc));
  }, [selectNamHoc]);

  const handleNamHocChange = (event) => {
    const selectValue = event.target.value;
    setSelectNamHoc(selectValue);
  };

  const handleDanhMucChange = (event) => {
    const selectValue = event.target.value;
    const danhmuc = selectValue === 'nodata' ? '' : selectValue;
    setSelectDanhMuc(danhmuc);
  };

  const handleClick = (nav) => {
    navigate(nav);
  };

  const handleDonViClick = () => {
    setTitle(t('Đơn vị gửi duyệt'));
    setForm('show');
    dispatch(setOpenSubSubPopup(true));
  };

  return (
    <>
      {isLoading ? (
        <Grid item xs={12}>
          <SkeletonTotalCard type={true} />
        </Grid>
      ) : (
        <Card sx={{ pb: 2 }}>
          <Grid container spacing={1} my={1} ml={2}>
            <Grid item>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>{t('namhoc')}</InputLabel>
                <Select
                  value={selectNamHoc ? selectNamHoc : ''}
                  onChange={handleNamHocChange}
                  label={t('namhoc')}
                  style={{ width: '120px' }}
                >
                  {namHoc && namHoc.length > 0 ? (
                    namHoc.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.ten}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="nodata">{t('noRowsLabel')}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2.5}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>{t('Danh mục tốt nghiệp')}</InputLabel>
                <Select value={selectDanhMuc || 'nodata'} onChange={handleDanhMucChange} label={t('Danh mục tốt nghiệp')}>
                  {data && data.length > 0 ? (
                    data.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.tieuDe}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="nodata">{t('noRowsLabel')}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container justifyContent={'center'}>
            <Grid item xs={11.4} container spacing={1}>
              {[
                {
                  title: t('tongphoiin'),
                  color: '#00C853',
                  icon: IconAlbum,
                  count: thongKeTongQuat.phoi,
                  nav: config.defaultPath + '/phoigoc'
                },
                {
                  title: t('tongtruong'),
                  color: '#1E88E5',
                  icon: IconBuildingCommunity,
                  count: `${thongKeTongQuat.donViDaGui}/${thongKeTongQuat.donViTong}`,
                  nav: config.defaultPath + '/quanlyhocsinh',
                  onClick: true
                },
                {
                  title: t('donyeucau'),
                  color: '#F79009',
                  icon: IconFileDescription,
                  count: thongKeTongQuat.donCapBanSao,
                  nav: config.defaultPath + '/donyeucau'
                },
                {
                  title: t('hocsinhchoduyet'),
                  color: '#6366F1',
                  icon: IconUserExclamation,
                  count: thongKeTongQuat.hocSinhChoDuyet,
                  nav: config.defaultPath + '/quanlyhocsinh'
                }
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={6} lg={isMd ? 6 : 3} key={index}>
                  <Paper variant="outlined" sx={styles.paper}>
                    <Typography
                      variant="h4"
                      onClick={() => (item.onClick ? handleDonViClick() : handleClick(item.nav))}
                      component="div"
                      sx={{
                        color: '#6C737F',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <h4 style={{ fontSize: '17px' }}>{item.title}</h4>
                      <div style={{ ...styles.countContainer, background: item.color }}>
                        <item.icon style={styles.countIcon} />
                      </div>
                    </Typography>
                    <Typography variant="h1" component="div" sx={{ textAlign: 'center', fontSize: '60px', color: 'black' }}>
                      {item.count}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Card>
      )}
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openSubSubPopup}
          type="subsubpopup"
          maxWidth={'md'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'show' ? <ThongkeDonViGuiDuyet danhMuc={selectDanhMuc} /> : ''}
        </Popup>
      )}
    </>
  );
};

export default ThongKePhong;
