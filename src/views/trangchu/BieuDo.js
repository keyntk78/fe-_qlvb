import React from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import MainCard from 'components/cards/MainCard';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import SkeletonTotalGrowthBarChart from 'components/cards/Skeleton/TotalGrowthBarChart';
import { GetSoLuongHocSinhQuaTungNam } from 'services/thongkeService';
import { useState } from 'react';
import { userLoginSelector } from 'store/selectors';
import { getAllNamthi } from 'services/namthiService';

const ThongKeSoLuong = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [soluonghocsinh, setSLHS] = useState('');
  const [isLoading, setLoading] = useState(true);
  const customization = useSelector((state) => state.customization);
  const [firstLoad, setFirstLoad] = useState(true);
  const [namHoc, setNamHoc] = useState([]);
  const [selectNamHoc1, setSelectNamHoc1] = useState('');
  const [selectNamHoc2, setSelectNamHoc2] = useState('');
  const user = useSelector(userLoginSelector);
  const currentYear = new Date().getFullYear();

  const { navType } = customization;
  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];
  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.main;
  const successMain = theme.palette.success.main;
  const warningMain = theme.palette.warning.dark;

  const data = [
    {
      nam: 'THCS Trần Đại Nghĩa',
      gioi: 90,
      kha: 158,
      trungbinh: 43
    },
    {
      nam: 'THCS Trần Đại Nghĩa',
      gioi: 56,
      kha: 172,
      trungbinh: 50
    },
    {
      nam: 'THCS Trần Đại Nghĩa',
      gioi: 93,
      kha: 132,
      trungbinh: 67
    },
    {
      nam: 'THCS Trần Đại Nghĩa',
      gioi: 84,
      kha: 156,
      trungbinh: 46
    },
    {
      nam: '2025',
      gioi: 134,
      kha: 92,
      trungbinh: 35
    },
    {
      nam: '2021',
      gioi: 90,
      kha: 158,
      trungbinh: 43
    },
    {
      nam: '2022',
      gioi: 56,
      kha: 172,
      trungbinh: 50
    },
    {
      nam: '2023',
      gioi: 93,
      kha: 132,
      trungbinh: 67
    },
    {
      nam: '2024',
      gioi: 84,
      kha: 156,
      trungbinh: 46
    },
    {
      nam: '2025',
      gioi: 134,
      kha: 92,
      trungbinh: 35
    },
    {
      nam: '2025',
      gioi: 134,
      kha: 92,
      trungbinh: 35
    }
  ];

  useEffect(() => {
    const fetchDataDL = async () => {
      setTimeout(async () => {
        try {
          const namhoc = await getAllNamthi();
          setNamHoc(namhoc.data);
          if (namhoc && namhoc.data.length > 0) {
            const matchingYear = namhoc.data.find((year) => year.ten === currentYear.toString());
            if (matchingYear) {
              setSelectNamHoc2(matchingYear.id);
              let yearDifference = 4;
              let foundMatch = false;
              while (yearDifference >= 0 && !foundMatch) {
                const potentialYear = currentYear - yearDifference;
                const matchingPotentialYear = namhoc.data.find((year) => year.ten === potentialYear.toString());
                if (matchingPotentialYear) {
                  setSelectNamHoc1(matchingPotentialYear.id);
                  foundMatch = true;
                }
                yearDifference--;
              }
            } else {
              setSelectNamHoc2(namhoc.data[0].id);
              setSelectNamHoc1(namhoc.data[0].id);
            }
          }
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      }, 500);
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    const fetchDataDL = async () => {
      const params = new URLSearchParams();
      params.append('nguoiThucHien', user ? user.username : '');
      setTimeout(
        async () => {
          try {
            const response = await GetSoLuongHocSinhQuaTungNam(params);
            setSLHS(response.data);
            setFirstLoad(false);
            setLoading(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        },
        firstLoad ? 2500 : 0
      );
    };
    fetchDataDL();
  }, []);

  const handleNamHoc1Change = (event) => {
    const selectValue = event.target.value;
    setSelectNamHoc1(selectValue);
  };

  const handleNamHoc2Change = (event) => {
    const selectValue = event.target.value;
    setSelectNamHoc2(selectValue);
  };

  const chartData = {
    height: 400,
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
          columnWidth: '80%',
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
        categories:
          // soluonghocsinh && soluonghocsinh.thongKe && soluonghocsinh.thongKe.length > 0
          //   ? soluonghocsinh.thongKe.map((item) => item.NamThi)
          //   : []
          data && data.length > 0 ? data.map((item) => item.nam) : []
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
    // series: [
    //   {
    //     name: 'Số lượng học sinh',
    //     data: ((soluonghocsinh && soluonghocsinh.thongKe) || []).map((item) => parseInt(item.TongHocSinh, 10) || 0)
    //   }
    // ]
    series: [
      {
        name: 'Giỏi',
        data: (data || []).map((item) => parseInt(item.gioi, 10) || 0)
      },
      {
        name: 'Khá',
        data: (data || []).map((item) => parseInt(item.kha, 10) || 0)
      },
      {
        name: 'Trung bình',
        data: (data || []).map((item) => parseInt(item.trungbinh, 10) || 0)
      }
    ]
  };

  useEffect(() => {
    const newChartData = {
      ...chartData.options,
      colors: [successMain, primaryDark, warningMain],
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
  }, [navType, primary200, primaryDark, primary, darkLight, grey200, isLoading, grey500]);

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
                      <Typography variant="h3">{soluonghocsinh ? soluonghocsinh.totalRow : 0}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>{t('Từ năm')}</InputLabel>
                        <Select
                          value={selectNamHoc1 ? selectNamHoc1 : ''}
                          onChange={handleNamHoc1Change}
                          label={t('Từ năm')}
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
                    <Grid item>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>{t('Đến năm')}</InputLabel>
                        <Select
                          value={selectNamHoc2 ? selectNamHoc2 : ''}
                          onChange={handleNamHoc2Change}
                          label={t('Đến năm')}
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

export default ThongKeSoLuong;
