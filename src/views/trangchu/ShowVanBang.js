import React from 'react';
import MainCard from 'components/cards/MainCard';
import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedPhoigocSelector } from 'store/selectors';
import { useState } from 'react';
import { GetConfigPhoi, getPhoiDangSuDung } from 'services/phoigocService';
import ExitButton from 'components/button/ExitButton';
import XuLyDuLieuInThu from 'views/capbangbangoc/XuLyDuLieuInThu';
import { selectedPhoigoc } from 'store/actions';
import { convertISODateToFormattedDate } from 'utils/formatDate';

const ShowVanBang = ({ duLieuHocSinh }) => {
  const phoigoc = useSelector(selectedPhoigocSelector);
  const [duLieuConFig, setDuLieuConFig] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchDataDLHS = async () => {
      const response_cf = await GetConfigPhoi(duLieuHocSinh.idPhoiGoc);
      setDuLieuConFig(response_cf.data);
      const phoidata = await getPhoiDangSuDung(duLieuHocSinh.idTruong);
      dispatch(selectedPhoigoc(phoidata.data));
    };
    fetchDataDLHS();
  }, [phoigoc.id]);
  const DataInBang = {
    HOTEN: duLieuHocSinh.hoTen,
    NOISINH: duLieuHocSinh.noiSinh, // Assuming you want the second part after the " - "
    NGAYTHANGNAMSINH: convertISODateToFormattedDate(duLieuHocSinh.ngaySinh),
    GIOITINH: duLieuHocSinh.gioiTinh ? 'Nam' : 'Nữ',
    DANTOC: duLieuHocSinh.danToc,
    HOCSINHTRUONG: duLieuHocSinh.soGoc.tenTruong,
    NAMTOTNGHIEP: duLieuHocSinh.namThi,
    XEPLOAITOTNGHIEP: duLieuHocSinh.xepLoai,
    HINHTHUCDAOTAO: duLieuHocSinh.tenHinhThucDaoTao,
    GOC_SOHIEUVANBANG: duLieuHocSinh.soHieuVanBang,
    GOC_SOVAOSOCAP: duLieuHocSinh.soVaoSoCapBang,
    NAMCAP: new Date(duLieuHocSinh.ngayTao).getFullYear(),
    NGAYCAP: new Date(duLieuHocSinh.ngayTao).getDate(),
    THANGCAP: new Date(duLieuHocSinh.ngayTao).getMonth() + 1,
    TRUONGPHONGDGDT: duLieuHocSinh.soGoc.nguoiKyBang,
    NOICAP: duLieuHocSinh.soGoc.diaPhuongCapBang
  };
  const cauHinhViTri = {};

  for (const item of duLieuConFig) {
    const maTruongDuLieu = item.maTruongDuLieu;
    cauHinhViTri[maTruongDuLieu] = {
      top: item.viTriTren,
      left: item.viTriTrai,
      fontWeight: item.dinhDangKieuChu,
      fontSize: item.coChu,
      fontFamily: item.kieuChu,
      color: item.mauChu
    };
  }

  return (
    <>
      <MainCard sx={{ backgroundColor: '#4d3b3b1f' }}>
        <div>
          <XuLyDuLieuInThu studentDataList={DataInBang} positionConfig={cauHinhViTri} />
        </div>
      </MainCard>
      <Grid container justifyContent="flex-end" mt={1}>
        <Grid>
          {' '}
          <ExitButton />
        </Grid>
      </Grid>
    </>
  );
};

export default ShowVanBang;
