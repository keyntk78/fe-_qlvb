import React from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import MainCard from 'components/cards/MainCard';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import SkeletonTotalGrowthBarChart from 'components/cards/Skeleton/TotalGrowthBarChart';
import { GetThongKeHocSinhTheoXepLoai } from 'services/thongkeService';
import { useState } from 'react';
import { listDanhMucSelector } from 'store/selectors';
import { GetTruongHasPermision } from 'services/danhmuctotnghiepService';

const ThongKeSoLuongNguoiHoc = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [data, setData] = useState('');
  const [isLoading, setLoading] = useState(true);
  const customization = useSelector((state) => state.customization);
  const [firstLoad, setFirstLoad] = useState(true);
  const listDanhMuc = useSelector(listDanhMucSelector);
  const [donvi, setDonVi] = useState([]);
  const [selectedDonVi, setSelectedDonVi] = useState('');
  const [selectedDanhMuc, setSelectedDanhMuc] = useState('');
  const currentYear = new Date().getFullYear();

  const { navType } = customization;
  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

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
            const response = await GetThongKeHocSinhTheoXepLoai(params);
            setData(response.data);
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
    if (selectedDanhMuc) {
      fetchDataDL();
    }
  }, [selectedDanhMuc, selectedDonVi]);

  const handleDanhMucChange = (event) => {
    const selectValue = event.target.value;
    setSelectedDanhMuc(selectValue);
  };

  const handleDonViChange = (event) => {
    const selectValue = event.target.value;
    const donVi = selectValue === 'all' ? '' : selectValue;
    setSelectedDonVi(donVi);
  };

  const chartData = {
    height: 500,
    type: 'bar',
    options: {
      chart: {
        id: 'bar-chart',
        stacked: false,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: selectedDonVi ? '30%' : '80%',
          endingShape: 'rounded'
        }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        type: 'category',
        categories: data && data.daTa && data.daTa.length > 0 ? data.daTa.map((item) => item.tenTruong) : []
      },
      legend: {
        show: true,
        fontSize: '14px',
        fontFamily: `'Roboto', sans-serif`,
        position: 'bottom',
        offsetX: 20,
        labels: {
          useSeriesColors: false
        },
        markers: {
          width: 16,
          height: 16,
          radius: 5
        },
        itemMargin: {
          horizontal: 15,
          vertical: 8
        }
      },
      fill: {
        opacity: 1
      },
      dataLabels: {
        enabled: true
      },
      grid: {
        show: true
      }
    },
    series: [
      {
        name: 'Giỏi',
        data: ((data && data.daTa) || []).map((item) => parseInt(item.xepLoaiGioi, 10) || 0)
      },
      {
        name: 'Khá',
        data: ((data && data.daTa) || []).map((item) => parseInt(item.xepLoaiKha, 10) || 0)
      },
      {
        name: 'Trung bình',
        data: ((data && data.daTa) || []).map((item) => parseInt(item.xepLoaiTrungBinh, 10) || 0)
      }
    ]
  };

  useEffect(() => {
    const newChartData = {
      ...chartData.options,
      colors: [primary200, primaryDark, secondaryMain, secondaryLight],
      xaxis: {
        labels: {
          style: {
            colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      grid: {
        borderColor: grey200
      },
      tooltip: {
        theme: 'light'
      },
      legend: {
        labels: {
          colors: grey500
        }
      }
    };

    // do not load chart when loading
    if (!isLoading) {
      ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
    }
  }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">{t('Tổng số học sinh')}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">{data ? data.totalRow : 0}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
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
                    <Grid item>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>{t('Đơn vị trường')}</InputLabel>
                        <Select
                          value={selectedDonVi ? selectedDonVi : 'all'}
                          onChange={handleDonViChange}
                          label={t('Đơn vị trường')}
                          style={{ minWidth: '150px' }}
                        >
                          <MenuItem value="all">Tất cả</MenuItem>
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
              <Chart {...chartData} />
            </Grid>
            <Grid item xs={12} textAlign={'center'}>
              <Typography variant="subtitle2">{t('bieudohocsinh')}</Typography>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

export default ThongKeSoLuongNguoiHoc;
