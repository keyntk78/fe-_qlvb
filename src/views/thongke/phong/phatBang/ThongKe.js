import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'components/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'components/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { getAllNamthi } from 'services/namthiService';
import { useTranslation } from 'react-i18next';
import { ThongKePhatBang } from 'services/thongkeService';
import { IconFileExport } from '@tabler/icons';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { createSearchParams } from 'react-router-dom';
import { setLoading } from 'store/actions';
import ExportExcel from './ExportExcel';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const ThongKe = ({ isLoading }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [namHoc, setNamHoc] = useState([]);
  const [selectNamHoc, setSelectNamHoc] = useState('');
  const [selectNamhoc, setSelectNamhoc] = useState('');
  const [data, setData] = useState([]);
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

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
      const namhoc = await getAllNamthi();
      setNamHoc(namhoc.data);
      if (namhoc && namhoc.data.length > 0) {
        setSelectNamHoc(namhoc.data[0].id);
        setSelectNamhoc(namhoc.data[0].ten);
      }
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    const fetchDataDL = async () => {
      const params = createSearchParams();
      params.append('idNamThi', selectNamHoc);
      const response = await ThongKePhatBang(params);
      setData(response.data);
    };
    if (selectNamHoc) {
      fetchDataDL();
    }
  }, [selectNamHoc]);

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
        categories: data && data.thongKe && data.thongKe.length > 0 ? data.thongKe.map((item) => item.ten) : []
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
        name: 'Số lượng bằng chưa phát',
        data: data && data.thongKe && data.thongKe.length > 0 ? data.thongKe.map((item) => parseInt(item.tongBangChuaPhat, 10)) : ''
      },
      {
        name: 'Số lượng bằng đã phát',
        data: data && data.thongKe && data.thongKe.length > 0 ? data.thongKe.map((item) => parseInt(item.tongBangDaPhat, 10)) : ''
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

  const handleNamHocChange = (event) => {
    const selectedValue = event.target.value;
    setSelectNamHoc(selectedValue);
    const selectedNamHocItem = namHoc.find((item) => item.id === selectedValue);

    if (selectedNamHocItem) {
      const ten = selectedNamHocItem.ten;
      setSelectNamhoc(ten);
    }
  };

  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    await ExportExcel(selectNamhoc, data.thongKe, data.totalRow);
    dispatch(setLoading(false));
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard
          title={t('Thống kê phát bằng')}
          secondary={
            <Grid item>
              <ButtonSuccess title={t('button.export.excel')} onClick={handleExport} icon={IconFileExport} />
            </Grid>
          }
        >
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">{t('Tổng số lượng bằng')}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">{data ? data.totalRow : ''}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={2} md={3} sm={3} xs={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>{t('namhoc')}</InputLabel>
                    <Select
                      size="small"
                      name="id"
                      value={selectNamHoc ? selectNamHoc : ''}
                      onChange={handleNamHocChange}
                      label={t('namhoc')}
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
            <Grid item xs={12}>
              <Chart {...chartData} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

ThongKe.propTypes = {
  isLoading: PropTypes.bool
};

export default ThongKe;
