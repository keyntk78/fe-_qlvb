import { Grid, Typography } from '@mui/material';
import MainCard from 'components/cards/MainCard';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
import SkeletonTotalPieChart from 'components/cards/Skeleton/TotalPieCard';
import { GetSoLuongHocSinhTheoXepLoai } from 'services/thongkeService';
import { useSelector } from 'react-redux';
import { selectedNamthiSelector, userLoginSelector } from 'store/selectors';

const ThongKeSoLuongXepLoai = () => {
  const [chartHeight, setChartHeight] = useState(300);
  const { t } = useTranslation();
  const [xepLoaiTotNghiep, setXLTN] = useState('');
  const [isLoading, setLoading] = useState(true);
  const namhoc = useSelector(selectedNamthiSelector);
  const [firstLoad, setFirstLoad] = useState(true);
  const user = useSelector(userLoginSelector);

  useEffect(() => {
    setChartHeight(300);
  }, []);

  useEffect(() => {
    const fetchDataDL = async () => {
      const params = new URLSearchParams();
      params.append('nguoiThucHien', user ? user.username : '');
      params.append('idNamThi', namhoc);
      setTimeout(
        async () => {
          try {
            const response = await GetSoLuongHocSinhTheoXepLoai(params);
            setXLTN(response.data);
            setLoading(false);
            setFirstLoad(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        },
        firstLoad ? 2500 : 0
      );
    };
    if (namhoc) {
      fetchDataDL();
    }
  }, [namhoc]);

  const xepLoaiTotNghiep_fm = [
    { name: 'Trung bình', y: xepLoaiTotNghiep && xepLoaiTotNghiep.XepLoaiTrungBinh ? xepLoaiTotNghiep.XepLoaiTrungBinh : 0 },
    { name: 'Khá', y: xepLoaiTotNghiep && xepLoaiTotNghiep.XepLoaiKha ? xepLoaiTotNghiep.XepLoaiKha : 0 },
    { name: 'Giỏi', y: xepLoaiTotNghiep && xepLoaiTotNghiep.XepLoaiGioi ? xepLoaiTotNghiep.XepLoaiGioi : 0 }
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
    labels: xepLoaiTotNghiep_fm.map((item) => item.name)
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
                <Grid item xs={4}>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">{t('Tổng số học sinh')}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">{xepLoaiTotNghiep ? xepLoaiTotNghiep.TongHocSinh : 0}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Chart options={options} series={xepLoaiTotNghiep_fm.map((item) => item.y)} type="pie" width="100%" height={chartHeight} />
            </Grid>
            <Grid item xs={12} textAlign={'center'}>
              <Typography variant="subtitle2">{t('bieudoxeploai')}</Typography>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

export default ThongKeSoLuongXepLoai;
