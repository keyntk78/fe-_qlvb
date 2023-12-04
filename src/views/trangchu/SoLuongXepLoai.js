import { Grid, Typography } from '@mui/material';
import MainCard from 'components/cards/MainCard';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { GetThongKeHocSinh3DanhMucGanNhat } from 'services/thongkeService';
import { userLoginSelector } from 'store/selectors';
import SkeletonTotalGrowthBarChart from 'components/cards/Skeleton/TotalGrowthBarChart';

const ThongKeSoLuongXepLoai = () => {
  const [chartHeight, setChartHeight] = useState(300);
  const { t } = useTranslation();
  const theme = useTheme();
  const user = useSelector(userLoginSelector);
  const [isLoading, setLoading] = useState(true);
  const customization = useSelector((state) => state.customization);
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
  const [pageState, setPageState] = useState({
    isLoading: false,
    tenDanhMuc: [],
    soLuong: [],
    labelDanhMuc: []
  });

  useEffect(() => {
    setChartHeight(350);
  }, []);

  useEffect(() => {
    const fetchDataDL = async () => {
      setTimeout(
        async () => {
          try {
            const response = await GetThongKeHocSinh3DanhMucGanNhat(user.username);
            const dataResponse = response.data.data;
            const tenDanhMucArray = Object.values(dataResponse).map((item) => item.tenDanhMucTotNghiep);
            const soLuongHocSinhArray = Object.values(dataResponse).map((item) => item.soLuongHocSinh);
            const dataWithdanhmuctn = dataResponse.map((row, index) => ({
              idindex: index + 1,
              labelDanhMuc: 'DM-' + row.maHinhThucDaoTao + '-' + row.namHoc,
              ...row
            }));
            const laeldanhMucArray = Object.values(dataWithdanhmuctn).map((item) => item.labelDanhMuc);
            setFirstLoad(false);
            setLoading(false);
            setPageState((old) => ({
              ...old,
              isLoading: false,
              tenDanhMuc: tenDanhMucArray,
              soLuong: soLuongHocSinhArray,
              labelDanhMuc: laeldanhMucArray
            }));
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        },
        firstLoad ? 2000 : 0
      );
    };
    fetchDataDL();
  }, [user.username]);

  const categories = pageState.labelDanhMuc ? pageState.labelDanhMuc : [''];
  const data = pageState.soLuong ? pageState.soLuong : [0];
  const sum = data ? data.reduce((acc, currentValue) => acc + currentValue, 0) : 0;
  const options = {
    series: [
      {
        name: 'Số lượng',
        data: data
      }
    ],
    chart: {
      height: chartHeight,
      type: 'line',
      id: 'line-chart',
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: false
      }
    },
    stroke: {
      width: 5,
      curve: 'smooth'
    },
    xaxis: {
      type: 'text',
      categories: categories,
      tickAmount: 10
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['#FDD835'],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100]
      }
    },
    tooltip: {
      // Tùy chỉnh hiển thị thông tin khi hover
      custom: ({ dataPointIndex }) => {
        const tenDanhMuc = pageState.tenDanhMuc[dataPointIndex];
        const soLuongHocSinh = pageState.soLuong[dataPointIndex];

        return `<div class="apexcharts-tooltip-custom">
        <div  style="padding: 8px ; background-color: lightgray">
        ${tenDanhMuc}
        </div>
        <div  style="padding: 8px">
        Số lượng : ${soLuongHocSinh}
        </div>
        </div>`;
      }
    },
    yaxis: {
      min: 0,
      max: Math.max(...data) + 10
    }
  };

  useEffect(() => {
    const newChartData = {
      ...options.options,
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
      ApexCharts.exec(`line-chart`, 'updateOptions', newChartData);
    }
  }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard hideInstruct>
          <Grid container>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={4}>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">{t('Tổng số học sinh tốt nghiệp')}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">{sum ? sum : 0}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <ReactApexChart options={options} series={options.series} type="line" height={chartHeight} />
            </Grid>
            <Grid item xs={12} textAlign={'center'}>
              <Typography variant="subtitle2">{t('bieudosoluongtheo3danhmuc')}</Typography>
            </Grid>
          </Grid>
        </MainCard>
      )}
      ;
    </>
  );
};

export default ThongKeSoLuongXepLoai;
