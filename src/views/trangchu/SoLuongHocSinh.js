import React from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import { Grid, Typography } from '@mui/material';
import MainCard from 'components/cards/MainCard';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import SkeletonTotalGrowthBarChart from 'components/cards/Skeleton/TotalGrowthBarChart';
import { GetSoLuongHocSinhQuaTungNam } from 'services/thongkeService';
import { useState } from 'react';
import { selectedHedaotaoSelector } from 'store/selectors';

const ThongKeSoLuongNguoiHoc = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [soluonghocsinh, setSLHS] = useState('');
  const [isLoading, setLoading] = useState(true);
  const customization = useSelector((state) => state.customization);
  const hedaotao = useSelector(selectedHedaotaoSelector);
  const [firstLoad, setFirstLoad] = useState(true);

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
    const fetchDataDL = async () => {
      const params = new URLSearchParams();
      params.append('maHeDaoTao', hedaotao);
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
    if (hedaotao) {
      fetchDataDL();
    }
  }, [hedaotao]);

  const chartData = {
    height: 400,
    type: 'bar',
    options: {
      chart: {
        id: 'bar-chart',
        stacked: true,
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
          columnWidth: '50%'
        }
      },
      xaxis: {
        type: 'category',
        categories:
          soluonghocsinh && soluonghocsinh.thongKe && soluonghocsinh.thongKe.length > 0
            ? soluonghocsinh.thongKe.map((item) => item.NamThi)
            : []
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
        type: 'solid'
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        show: true
      }
    },
    series: [
      {
        name: 'Số lượng học sinh',
        data: ((soluonghocsinh && soluonghocsinh.thongKe) || []).map((item) => parseInt(item.TongHocSinh, 10) || 0)
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
                      <Typography variant="h3">{soluonghocsinh ? soluonghocsinh.totalRow : 0}</Typography>
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
