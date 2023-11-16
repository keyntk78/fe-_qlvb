import { Card, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SkeletonTotalCard from 'components/cards/Skeleton/TotalCard';
import { getAllNamthi } from 'services/namthiService';
import { GetThongKeTongQuatByTruong } from 'services/thongkeService';
import { IconCertificate, IconCertificateOff, IconUserCheck, IconUserExclamation, IconUsers } from '@tabler/icons';
import { useDispatch, useSelector } from 'react-redux';
import { donviSelector, reloadNotificationSelector } from 'store/selectors';
import { setLoading, setReloadNotification } from 'store/actions';
import { useNavigate } from 'react-router';
import config from 'config';

const ThongKeTruong = () => {
  const isMd = useMediaQuery('(min-width:600px) and (max-width:1000px)');
  const { t } = useTranslation();
  const donvi = useSelector(donviSelector);
  const reload = useSelector(reloadNotificationSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [namHoc, setNamHoc] = useState([]);
  const [selectedNamHoc, setSelectedNamHoc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [thongKeTongQuat, setThongKeTongQuat] = useState({
    tongHocSinh: 0,
    hocSinhDaDuyet: 0,
    hocSinhChoDuyet: 0,
    tongBang: 0,
    bangDaNhan: 0,
    bangChuaNhan: 0
  });

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

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchDataDL = async () => {
      setTimeout(async () => {
        try {
          const namhoc = await getAllNamthi();
          setNamHoc(namhoc.data);
          if (namhoc && namhoc.data.length > 0) {
            const matchingYear = namhoc.data.find((year) => year.ten === currentYear.toString());
            if (matchingYear) {
              setSelectedNamHoc(matchingYear.id);
            } else {
              setSelectedNamHoc(namhoc.data[0].id);
            }
          }
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      }, 1500);
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!firstLoad) {
        dispatch(setLoading(true));
      }
      const params = new URLSearchParams();
      params.append('idNamThi', selectedNamHoc);
      params.append('idTruong', donvi.id);
      setTimeout(
        async () => {
          try {
            const response = await GetThongKeTongQuatByTruong(params);
            const data = response.data;
            setThongKeTongQuat((old) => ({
              ...old,
              tongHocSinh: data && data.TongSoHocSinh ? data.TongSoHocSinh.TongHocSinh : 0,
              hocSinhDaDuyet: data && data.SoHocSinhDaDuyet ? data.SoHocSinhDaDuyet.TongHocSinh : 0,
              hocSinhChoDuyet: data && data.SoHocSinhChoDuyet ? data.SoHocSinhChoDuyet.TongHocSinh : 0,
              tongBang: data && data.SoHocSinhNhanBang ? data.SoHocSinhNhanBang.TongHocSinh : 0,
              bangDaNhan: data && data.SoHocSinhDaNhanBang ? data.SoHocSinhDaNhanBang.TongHocSinh : 0,
              bangChuaNhan: data && data.SoHocSinhChuaNhanBang ? data.SoHocSinhChuaNhanBang.TongHocSinh : 0
            }));
            setIsLoading(false);
            dispatch(setLoading(false));
            setFirstLoad(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        },
        firstLoad ? 2000 : 0
      );
    };
    if (selectedNamHoc && donvi) {
      fetchData();
      dispatch(setReloadNotification(false));
    }
  }, [selectedNamHoc, donvi, reload]);

  const handleNamHocChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedNamHoc(selectedValue);
  };

  const handleClick = (nav) => {
    navigate(nav);
  };

  let data;

  if (isMd) {
    data = [
      {
        title: t('Tổng số học sinh'),
        color: '#2196F3',
        icon: IconUsers,
        count: thongKeTongQuat.tongHocSinh,
        nav: config.defaultPath + '/hocsinhtotnghiep'
      },
      {
        title: t('Tổng số bằng'),
        color: '#1565C0',
        icon: IconUsers,
        count: thongKeTongQuat.tongBang,
        nav: config.defaultPath + '/capphatbang'
      },
      {
        title: t('hocsinhdaduyet'),
        color: '#00C853',
        icon: IconUserCheck,
        count: thongKeTongQuat.hocSinhDaDuyet,
        nav: config.defaultPath + '/hocsinhtotnghiep'
      },
      {
        title: t('Số bằng đã nhận'),
        color: '#008000',
        icon: IconCertificate,
        count: thongKeTongQuat.bangDaNhan,
        nav: config.defaultPath + '/capphatbang'
      },
      {
        title: t('hocsinhchoduyet'),
        color: '#F79009',
        icon: IconUserExclamation,
        count: thongKeTongQuat.hocSinhChoDuyet,
        nav: config.defaultPath + '/hocsinhtotnghiep'
      },
      {
        title: t('Số bằng chưa nhận'),
        color: '#D84315',
        icon: IconCertificateOff,
        count: thongKeTongQuat.bangChuaNhan,
        nav: config.defaultPath + '/capphatbang'
      }
    ];
  } else {
    data = [
      {
        title: t('Tổng số học sinh'),
        color: '#2196F3',
        icon: IconUsers,
        count: thongKeTongQuat.tongHocSinh,
        nav: config.defaultPath + '/hocsinhtotnghiep'
      },
      {
        title: t('hocsinhdaduyet'),
        color: '#00C853',
        icon: IconUserCheck,
        count: thongKeTongQuat.hocSinhDaDuyet,
        nav: config.defaultPath + '/hocsinhtotnghiep'
      },
      {
        title: t('hocsinhchoduyet'),
        color: '#F79009',
        icon: IconUserExclamation,
        count: thongKeTongQuat.hocSinhChoDuyet,
        nav: config.defaultPath + '/hocsinhtotnghiep'
      },
      {
        title: t('Tổng số bằng'),
        color: '#1565C0',
        icon: IconUsers,
        count: thongKeTongQuat.tongBang,
        nav: config.defaultPath + '/capphatbang'
      },
      {
        title: t('Số bằng đã nhận'),
        color: '#008000',
        icon: IconCertificate,
        count: thongKeTongQuat.bangDaNhan,
        nav: config.defaultPath + '/capphatbang'
      },
      {
        title: t('Số bằng chưa nhận'),
        color: '#D84315',
        icon: IconCertificateOff,
        count: thongKeTongQuat.bangChuaNhan,
        nav: config.defaultPath + '/capphatbang'
      }
    ];
  }

  return (
    <>
      {isLoading ? (
        <Grid item xs={12}>
          <SkeletonTotalCard type={false} />
        </Grid>
      ) : (
        <Card sx={{ pb: 2 }}>
          <Grid container spacing={1} my={1} ml={2}>
            <Grid item>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>{t('namhoc')}</InputLabel>
                <Select
                  value={selectedNamHoc ? selectedNamHoc : ''}
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
          </Grid>
          <Grid container justifyContent={'center'}>
            <Grid item xs={11.4} container spacing={1}>
              {data.map((item, index) => (
                <Grid item xs={12} sm={6} md={isMd ? 6 : 4} lg={4} key={index}>
                  <Paper variant="outlined" sx={styles.paper}>
                    <Typography
                      variant="h4"
                      onClick={() => handleClick(item.nav)}
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
    </>
  );
};

export default ThongKeTruong;
