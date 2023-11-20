import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import MainCard from 'components/cards/MainCard';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
import SkeletonTotalPieChart from 'components/cards/Skeleton/TotalPieCard';
import { useSelector } from 'react-redux';
import { GetThongKeHocSinhPhatBang } from 'services/thongkeService';
import { listDanhMucSelector } from 'store/selectors';
import { GetTruongHasPermision } from 'services/danhmuctotnghiepService';

const ThongKeSoBangDaPhatChuaPhat = () => {
  const [chartHeight, setChartHeight] = useState(300);
  const { t } = useTranslation();
  const [data, setData] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const listDanhMuc = useSelector(listDanhMucSelector);
  const [donvi, setDonVi] = useState([]);
  const [selectedDonVi, setSelectedDonVi] = useState('');
  const [selectedDanhMuc, setSelectedDanhMuc] = useState('');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setChartHeight(328);
  }, []);

  useEffect(() => {
    if (listDanhMuc && listDanhMuc.length > 0) {
      const matchingYear = listDanhMuc.find((year) => year.namThi === currentYear.toString());
      if (matchingYear) {
        setSelectedDanhMuc(matchingYear.id);
      } else {
        setSelectedDanhMuc(listDanhMuc[0].id);
      }
    }
  }, [listDanhMuc, currentYear]);

  useEffect(() => {
    const fetchDataDL = async () => {
      setTimeout(async () => {
        try {
          const params = new URLSearchParams();
          params.append('pageSize', -1);
          const donvi = await GetTruongHasPermision(selectedDanhMuc, params);
          if (donvi && donvi.data && donvi.data.truongs && donvi.data.truongs.length > 0) {
            setDonVi(donvi.data.truongs);
            setSelectedDonVi(donvi.data.truongs[0].idTruong);
          } else {
            setDonVi([]);
          }
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      }, 500);
    };
    if (selectedDanhMuc) {
      fetchDataDL();
    }
  }, [selectedDanhMuc]);

  useEffect(() => {
    const fetchDataDL = async () => {
      const params = new URLSearchParams();
      params.append('idDanhMucTotNghiep', selectedDanhMuc);
      params.append('idTruong', selectedDonVi);
      setTimeout(
        async () => {
          try {
            const response = await GetThongKeHocSinhPhatBang(params);
            console.log(response.data);
            setData(response.data.data);
            setFirstLoad(false);
            setLoading(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        },
        firstLoad ? 1500 : 0
      );
    };
    if (selectedDanhMuc && selectedDonVi) {
      fetchDataDL();
    }
  }, [selectedDanhMuc, selectedDonVi]);

  const handleDanhMucChange = (event) => {
    const selectValue = event.target.value;
    setSelectedDanhMuc(selectValue);
  };

  const handleDonViChange = (event) => {
    const selectValue = event.target.value;
    setSelectedDonVi(selectValue);
  };

  const sobangdaphat_fm = [
    { name: 'Đã phát', y: data && data.tongBangDaPhat ? data.tongBangDaPhat : 0 },
    { name: 'Chưa phát', y: data && data.tongBangChuaPhat ? data.tongBangChuaPhat : 0 }
  ];

  const options = {
    chart: {
      type: 'pie',
      height: chartHeight,
      toolbar: {
        show: true,
        tools: {
          export: true,
          download: true
        }
      }
    },
    legend: {
      position: 'bottom'
    },
    labels: sobangdaphat_fm.map((item) => item.name)
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalPieChart type={'main'} />
      ) : (
        <MainCard>
          <Grid container>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={3}>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">{t('Tổng số lượng bằng')}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">{data ? data.tongSoLuongBang : 0}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item mt={1} xs={9}>
                  <Grid container spacing={1} justifyContent="flex-end">
                    <Grid item xs={8}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>{t('Danh mục tốt nghiệp')}</InputLabel>
                        <Select
                          value={selectedDanhMuc ? selectedDanhMuc : ''}
                          onChange={handleDanhMucChange}
                          label={t('Danh mục tốt nghiệp')}
                        >
                          {listDanhMuc && listDanhMuc.length > 0 ? (
                            listDanhMuc.map((data) => (
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
                    <Grid item xs={8}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>{t('Đơn vị trường')}</InputLabel>
                        <Select value={selectedDonVi || ''} onChange={handleDonViChange} label={t('Đơn vị trường')}>
                          {donvi && donvi.length > 0 ? (
                            donvi.map((data) => (
                              <MenuItem key={data.idTruong} value={data.idTruong}>
                                {data.tenTruong}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value="nodata">{t('noRowsLabel')}</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Chart options={options} series={sobangdaphat_fm.map((item) => item.y)} type="pie" width="100%" height={chartHeight} />
            </Grid>
            <Grid item xs={12} textAlign={'center'}>
              <Typography variant="subtitle2">{t('bieudobangdaphat')}</Typography>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

export default ThongKeSoBangDaPhatChuaPhat;
